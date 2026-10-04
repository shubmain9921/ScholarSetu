from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class RuleSimulationRequest(BaseModel):
    scheme_code: str
    proposed_rule_overrides: List[Dict[str, Any]] # e.g. [{"rule_id": "NFST-R-004", "field": "annual_family_income", "operator": "<=", "value": 800000}]

class RuleSimulationResponse(BaseModel):
    scheme_code: str
    total_cohort_evaluated: int
    currently_eligible: int
    simulated_eligible: int
    net_impact: int
    demographic_breakdown: Dict[str, Any]
    state_breakdown: Dict[str, str]
    summary_report: str
