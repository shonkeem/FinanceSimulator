from pydantic import BaseModel, model_validator
from datetime import date
from enum import Enum

class TimeStep(str, Enum):
    monthly = "monthly"

class FramingInput(BaseModel):
    label: str
    start_date: date
    end_date: date
    time_step: TimeStep

    @model_validator(mode="after")
    def end_after_start(self) -> "FramingInput":
        if self.start_date >= self.end_date:
            raise ValueError("end_date must be after start_date")
        return self
    
    @model_validator(mode="after")
    def is_first_of_month(self) -> "FramingInput":
        if self.start_date.day != 1:
            raise ValueError("start_date must be the first of the month")
        elif self.end_date.day != 1:
            raise ValueError("end_date must be the first of the month")
        return self
    
    @model_validator(mode="after")
    def period_less_than_600(self) -> "FramingInput":
        if 12 * (self.end_date.year - self.start_date.year) + (self.end_date.month - self.start_date.month) > 600:
            raise ValueError("Start and end dates must be within 600 months of each other")
        return self