from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.subscription import Subscription
from app.models.user import User
from app.schemas.subscription import SubscriptionCreate, SubscriptionRead, SubscriptionUpdate
from app.schemas.user import LoginRequest, TokenRead, UserCreate, UserRead, UserUpdate
from app.config import settings
from app.services.auth import AuthService, get_current_user
from app.services.rate_limit import limiter


router = APIRouter()
auth_router = APIRouter(prefix="/auth", tags=["auth"])
api_router = APIRouter(prefix="/api/v1", tags=["subscriptions"])


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
        name=subscription_in.name.strip(),
        price=subscription_in.price,
        billing_cycle=subscription_in.billing_cycle.strip().lower(),
        next_renewal_date=subscription_in.next_renewal_date,
    )
    db.add(subscription)
    db.commit()
    db.refresh(subscription)
    return subscription


@api_router.get("/subscriptions/{subscription_id}", response_model=SubscriptionRead)
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


@api_router.put("/subscriptions/{subscription_id}", response_model=SubscriptionRead)
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

    subscription.name = subscription_in.name.strip()
    subscription.price = subscription_in.price
    subscription.billing_cycle = subscription_in.billing_cycle.strip().lower()
    subscription.next_renewal_date = subscription_in.next_renewal_date
    db.commit()
    db.refresh(subscription)
    return subscription


@api_router.delete("/subscriptions/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
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
