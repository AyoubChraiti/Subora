from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict


class SubscriptionBase(BaseModel):
    name: str
    price: Decimal
    billing_cycle: str
    next_renewal_date: date


class SubscriptionCreate(SubscriptionBase):
    user_id: int


class SubscriptionRead(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
