from typing import List, Dict, Any, Optional
from datetime import date, datetime
from pydantic import BaseModel

class SchemeBase(BaseModel):
    code: str
    name: str
    short_description: Optional[str] = None

class SchemeDetailResponse(SchemeBase):
    id: str
    active_version: Optional[str] = None
    open_cycle: Optional[Dict[str, Any]] = None
    total_slots: Optional[int] = 750
    application_deadline: Optional[datetime] = None

class EligibilitySelfCheckRequest(BaseModel):
    scheme_code: str
    is_st_category: bool
    annual_family_income: float
    age: int
    degree_enrolled: str # PhD, MPhil, Overseas_Masters, etc.
    undergraduate_percentage: Optional[float] = None
    foreign_university_qs_rank: Optional[int] = None

class EligibilitySelfCheckResponse(BaseModel):
    is_likely_eligible: bool
    scheme_code: str
    satisfied_rules: List[str]
    unmet_rules: List[str]
    explanation: str
