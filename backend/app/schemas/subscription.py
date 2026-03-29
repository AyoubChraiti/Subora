from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class SubscriptionBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    price: Decimal = Field(gt=0)
    billing_cycle: str = Field(min_length=1, max_length=20)
    next_renewal_date: date


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(SubscriptionBase):
    pass


class SubscriptionRead(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
