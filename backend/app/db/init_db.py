from app.db.base import Base
from app.db.session import engine
from app.models import subscription, user


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
