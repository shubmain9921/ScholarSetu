from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

class CreateApplicationRequest(BaseModel):
    scheme_code: str
    institute_aishe_code: Optional[str] = None
    dynamic_form_data: Dict[str, Any] = {}

class ApplicationSummaryResponse(BaseModel):
    id: str
    application_number: str
    scheme_code: str
    scheme_name: str
    status: str
    current_stage: str
    submitted_at: Optional[datetime] = None
    last_action_at: datetime
    active_deficiencies_count: int = 0
    fast_tracked: bool = False

class DocumentUploadResponse(BaseModel):
    document_id: str
    application_id: str
    document_type: str
    original_filename: str
    sha256_hash: str
    verification_status: str
    simulated_ocr_result: Optional[Dict[str, Any]] = None

class DeficiencyResponse(BaseModel):
    id: str
    application_id: str
    document_id: Optional[str] = None
    reason_code: str
    public_explanation: str
    action_required: str
    deadline_at: datetime
    status: str
