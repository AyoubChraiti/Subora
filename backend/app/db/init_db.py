from sqlalchemy import text

from app.db.base import Base
from app.db.session import engine
from app.models import subscription, user


def ensure_subscription_columns() -> None:
    statements = [
        "ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()",
    ]

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    ensure_subscription_columns()
