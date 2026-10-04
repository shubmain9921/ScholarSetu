import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from jose import jwt
from core.config import settings
from core.database import get_db
from models.user import User, ApplicantProfile
from schemas.auth import SendOTPRequest, SendOTPResponse, VerifyOTPRequest, TokenResponse, UserProfileResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory OTP cache for prototyping/demo
OTP_STORE = {"9876543210": "123456", "9998887776": "123456", "9811223344": "123456"}

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

@router.post("/send-otp", response_model=SendOTPResponse)
def send_otp(req: SendOTPRequest, db: Session = Depends(get_db)):
    # Prototype OTP logic: fixed 123456 for testing convenience
    OTP_STORE[req.mobile] = "123456"
    return SendOTPResponse(
        status="SUCCESS",
        message="OTP sent to mobile number ending in " + req.mobile[-4:],
        txn_id=f"tx_{uuid.uuid4().hex[:8]}"
    )

@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(req: VerifyOTPRequest, db: Session = Depends(get_db)):
    expected_otp = OTP_STORE.get(req.mobile, "123456")
    if req.otp != expected_otp and req.otp != "123456":
        raise HTTPException(status_code=400, detail="Invalid OTP entered")

    # Find or auto-provision applicant for rapid demo onboarding
    user = db.query(User).filter(User.mobile == req.mobile).first()
    if not user:
        user = User(
            id=str(uuid.uuid4()),
            role="APPLICANT",
            full_name="Rahul Kumar",
            mobile=req.mobile,
            email=f"user_{req.mobile[-4:]}@example.gov.in",
            password_hash="mock_bcrypt_hash",
            is_active=True
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    token = create_access_token({"sub": user.id, "role": user.role, "mobile": user.mobile})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user_id=user.id,
        role=user.role,
        full_name=user.full_name
    )

@router.get("/demo-users")
def get_demo_users(db: Session = Depends(get_db)):
    """Convenience endpoint for SIH jury/evaluator switching roles in 1 click."""
    users = db.query(User).all()
    return [
        {
            "id": u.id,
            "full_name": u.full_name,
            "role": u.role,
            "mobile": u.mobile,
            "email": u.email
        }
        for u in users
    ]
