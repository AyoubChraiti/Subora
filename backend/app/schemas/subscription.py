from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field, field_validator


VALID_BILLING_CYCLES = {"weekly", "monthly", "quarterly", "yearly"}


class SubscriptionBase(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    price: Decimal = Field(gt=0)
    billing_cycle: str = Field(default="monthly", min_length=1, max_length=20)
    next_renewal_date: date

    @field_validator("billing_cycle")
    @classmethod
    def normalize_billing_cycle(cls, value: str) -> str:
        normalized = value.strip().lower()
        if normalized not in VALID_BILLING_CYCLES:
            raise ValueError("Unsupported billing_cycle")
        return normalized

    @field_validator("name", mode="before")
    @classmethod
    def strip_required_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("Field cannot be empty")
        return cleaned


class SubscriptionCreate(SubscriptionBase):
    pass


class SubscriptionUpdate(SubscriptionBase):
    pass


class SubscriptionPatch(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    price: Decimal | None = Field(default=None, gt=0)
    billing_cycle: str | None = Field(default=None, min_length=1, max_length=20)
    next_renewal_date: date | None = None

    @field_validator("billing_cycle")
    @classmethod
    def normalize_billing_cycle(cls, value: str | None) -> str | None:
        if value is None:
            return None
        normalized = value.strip().lower()
        if normalized not in VALID_BILLING_CYCLES:
            raise ValueError("Unsupported billing_cycle")
        return normalized

    @field_validator("name", mode="before")
    @classmethod
    def strip_required_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class SubscriptionRead(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MonthlySeriesPoint(BaseModel):
    month: str
    value: Decimal


class CategoryBreakdownPoint(BaseModel):
    name: str
    value: int
    amount: Decimal


class SubscriptionSummaryRead(BaseModel):
    total_monthly_estimate: Decimal
    projected_annual: Decimal
    active_items: int
    upcoming_count_30d: int
    monthly_series: list[MonthlySeriesPoint]
    category_breakdown: list[CategoryBreakdownPoint]


class SubscriptionBulkCreate(BaseModel):
    items: list[SubscriptionCreate] = Field(min_length=1, max_length=100)


class SubscriptionBulkRead(BaseModel):
    items: list[SubscriptionRead]
