from typing import Optional
from pydantic import BaseModel, EmailStr

class SendOTPRequest(BaseModel):
    mobile: str
    role: str = "APPLICANT"

class SendOTPResponse(BaseModel):
    status: str
    message: str
    txn_id: str

class VerifyOTPRequest(BaseModel):
    mobile: str
    otp: str
    txn_id: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str
    full_name: str

class UserProfileResponse(BaseModel):
    user_id: str
    full_name: str
    mobile: str
    email: Optional[str] = None
    role: str
    has_profile: bool
