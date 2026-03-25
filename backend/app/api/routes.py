from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db.session import get_db


router = APIRouter()
api_router = APIRouter(prefix="/api/v1", tags=["subscriptions"])


@router.get("/health", tags=["health"])
def health(db: Session = Depends(get_db)) -> dict[str, str]:
    db.execute(text("SELECT 1"))
    return {"status": "ok"}


@api_router.get("/subscriptions", tags=["subscriptions"])
def list_subscriptions() -> dict[str, list]:
    return {"items": []}
