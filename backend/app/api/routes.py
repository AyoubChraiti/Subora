import calendar
from collections import defaultdict
from datetime import date, timedelta
from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import (
    CategoryBreakdownPoint,
    SubscriptionBulkCreate,
    SubscriptionBulkRead,
    MonthlySeriesPoint,
    SubscriptionCreate,
    SubscriptionPatch,
    SubscriptionRead,
    SubscriptionSummaryRead,
    SubscriptionUpdate,
)
from app.schemas.user import LoginRequest, TokenRead, UserCreate, UserRead, UserUpdate
from app.config import settings
from app.services.auth import AuthService, get_current_user
from app.services.rate_limit import limiter


router = APIRouter()
auth_router = APIRouter(prefix="/auth", tags=["auth"])
api_router = APIRouter(prefix="/api/v1", tags=["subscriptions"])


def monthly_estimate(price: Decimal, billing_cycle: str) -> Decimal:
    cycle = (billing_cycle or "monthly").strip().lower()
    if cycle == "yearly":
        return price / Decimal("12")
    if cycle == "quarterly":
        return price / Decimal("3")
    if cycle == "weekly":
        return (price * Decimal("52")) / Decimal("12")
    return price


@router.get("/health", tags=["health"])
@limiter.limit(settings.default_rate_limit)
def health(request: Request, db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@auth_router.post("/register", response_model=UserRead)
@limiter.limit(settings.auth_rate_limit)
def register_user(request: Request, user_in: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user = User(
        email=user_in.email,
        full_name=user_in.full_name.strip(),
        hashed_password=AuthService.hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@auth_router.post("/login", response_model=TokenRead)
@limiter.limit(settings.auth_rate_limit)
def login_user(request: Request, credentials: LoginRequest, db: Session = Depends(get_db)) -> TokenRead:
    user = db.query(User).filter(User.email == credentials.email).first()
    if not user or not AuthService.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = AuthService.create_access_token(str(user.id))
    return TokenRead(access_token=token)


@auth_router.get("/me", response_model=UserRead)
@limiter.limit(settings.default_rate_limit)
def read_me(request: Request, current_user: User = Depends(get_current_user)) -> UserRead:
    return current_user


@auth_router.patch("/me", response_model=UserRead)
@limiter.limit(settings.default_rate_limit)
def update_me(
    request: Request,
    payload: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserRead:
    if payload.full_name is not None:
        current_user.full_name = payload.full_name

    if payload.password is not None:
        current_user.hashed_password = AuthService.hash_password(payload.password)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user


@api_router.get("/subscriptions", response_model=dict[str, list[SubscriptionRead]], tags=["subscriptions"])
@limiter.limit(settings.default_rate_limit)
def list_subscriptions(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, list[SubscriptionRead]]:
    items = (
        db.query(Subscription)
        .filter(Subscription.user_id == current_user.id)
        .order_by(Subscription.next_renewal_date.asc())
        .all()
    )
    return {"items": items}


@api_router.post("/subscriptions", response_model=SubscriptionRead, status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.default_rate_limit)
def create_subscription(
    request: Request,
    subscription_in: SubscriptionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionRead:
    subscription = Subscription(
        user_id=current_user.id,
        name=subscription_in.name,
        price=subscription_in.price,
        billing_cycle=subscription_in.billing_cycle,
        next_renewal_date=subscription_in.next_renewal_date,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


@api_router.post("/subscriptions/bulk", response_model=SubscriptionBulkRead, status_code=status.HTTP_201_CREATED)
@limiter.limit(settings.default_rate_limit)
def create_subscriptions_bulk(
    request: Request,
    payload: SubscriptionBulkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionBulkRead:
    created_items: list[Subscription] = []

    for item in payload.items:
        subscription = Subscription(
            user_id=current_user.id,
            name=item.name,
            price=item.price,
            billing_cycle=item.billing_cycle,
            next_renewal_date=item.next_renewal_date,
        )
        db.add(subscription)
        created_items.append(subscription)

    db.commit()

    for subscription in created_items:
        db.refresh(subscription)

    return SubscriptionBulkRead(items=created_items)


@api_router.get("/subscriptions/{subscription_id:int}", response_model=SubscriptionRead)
@limiter.limit(settings.default_rate_limit)
def get_subscription(
    request: Request,
    subscription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionRead:
    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id, Subscription.user_id == current_user.id)
        .first()
    )
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
    return subscription


@api_router.put("/subscriptions/{subscription_id:int}", response_model=SubscriptionRead)
@limiter.limit(settings.default_rate_limit)
def update_subscription(
    request: Request,
    subscription_id: int,
    subscription_in: SubscriptionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionRead:
    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id, Subscription.user_id == current_user.id)
        .first()
    )
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

    subscription.name = subscription_in.name
    subscription.price = subscription_in.price
    subscription.billing_cycle = subscription_in.billing_cycle
    subscription.next_renewal_date = subscription_in.next_renewal_date
    db.commit()
    db.refresh(subscription)
    return subscription


@api_router.patch("/subscriptions/{subscription_id:int}", response_model=SubscriptionRead)
@limiter.limit(settings.default_rate_limit)
def patch_subscription(
    request: Request,
    subscription_id: int,
    subscription_in: SubscriptionPatch,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionRead:
    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id, Subscription.user_id == current_user.id)
        .first()
    )
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

    payload = subscription_in.model_dump(exclude_unset=True)
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No fields provided")

    for field, value in payload.items():
        setattr(subscription, field, value)

    db.commit()
    db.refresh(subscription)
    return subscription


@api_router.get("/subscriptions/upcoming", response_model=dict[str, list[SubscriptionRead]])
@limiter.limit(settings.default_rate_limit)
def list_upcoming_subscriptions(
    request: Request,
    days: int = 7,
    limit: int = 20,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict[str, list[SubscriptionRead]]:
    if days < 1 or days > 365:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="days must be between 1 and 365")
    if limit < 1 or limit > 200:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="limit must be between 1 and 200")

    start = date.today()
    end = start + timedelta(days=days)

    items = (
        db.query(Subscription)
        .filter(
            Subscription.user_id == current_user.id,
            Subscription.next_renewal_date >= start,
            Subscription.next_renewal_date <= end,
        )
        .order_by(Subscription.next_renewal_date.asc())
        .limit(limit)
        .all()
    )
    return {"items": items}


@api_router.get("/subscriptions/summary", response_model=SubscriptionSummaryRead)
@limiter.limit(settings.default_rate_limit)
def get_subscription_summary(
    request: Request,
    months: int = 6,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SubscriptionSummaryRead:
    if months < 1 or months > 24:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="months must be between 1 and 24")

    items = db.query(Subscription).filter(Subscription.user_id == current_user.id).all()

    monthly_total = sum((monthly_estimate(Decimal(item.price), item.billing_cycle) for item in items), Decimal("0"))
    projected_annual = monthly_total * Decimal("12")

    today = date.today()
    in_30_days = today + timedelta(days=30)
    upcoming_count_30d = sum(1 for item in items if today <= item.next_renewal_date <= in_30_days)

    series = [
        MonthlySeriesPoint(month=calendar.month_abbr[((today.month - 1 + i) % 12) + 1], value=monthly_total.quantize(Decimal("0.01")))
        for i in range(months)
    ]

    grouped: dict[str, Decimal] = defaultdict(lambda: Decimal("0"))
    for item in items:
        key = (item.billing_cycle or "monthly").strip().lower().title()
        grouped[key] += monthly_estimate(Decimal(item.price), item.billing_cycle)

    total_for_percent = sum(grouped.values(), Decimal("0"))
    breakdown: list[CategoryBreakdownPoint] = []
    for category, amount in sorted(grouped.items(), key=lambda pair: pair[1], reverse=True):
        percentage = int((amount / total_for_percent) * 100) if total_for_percent > 0 else 0
        breakdown.append(
            CategoryBreakdownPoint(
                name=category,
                value=percentage,
                amount=amount.quantize(Decimal("0.01")),
            )
        )

    return SubscriptionSummaryRead(
        total_monthly_estimate=monthly_total.quantize(Decimal("0.01")),
        projected_annual=projected_annual.quantize(Decimal("0.01")),
        active_items=len(items),
        upcoming_count_30d=upcoming_count_30d,
        monthly_series=series,
        category_breakdown=breakdown,
    )


@api_router.delete("/subscriptions/{subscription_id:int}", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit(settings.default_rate_limit)
def delete_subscription(
    request: Request,
    subscription_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> Response:
    subscription = (
        db.query(Subscription)
        .filter(Subscription.id == subscription_id, Subscription.user_id == current_user.id)
        .first()
    )
    if not subscription:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

    db.delete(subscription)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
