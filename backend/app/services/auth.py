from datetime import datetime, timedelta, timezone

from app.config import settings


class AuthService:
    """JWT-ready service placeholder for future token signing and validation."""

    @staticmethod
    def get_token_expiry(minutes: int | None = None) -> datetime:
        duration = minutes if minutes is not None else settings.access_token_expire_minutes
        return datetime.now(timezone.utc) + timedelta(minutes=duration)
