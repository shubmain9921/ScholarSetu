import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Date, Numeric, Text, ForeignKey
from sqlalchemy.orm import relationship
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    role = Column(String(50), nullable=False) # APPLICANT, SCRUTINY_OFFICER, ADMINISTRATOR, etc.
    full_name = Column(String(150), nullable=False)
    mobile = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(255), unique=True, nullable=True, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_mfa_enabled = Column(Boolean, default=False, nullable=False)
    mfa_secret_token = Column(String(255), nullable=True)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    profile = relationship("ApplicantProfile", back_populates="user", uselist=False)

class ApplicantProfile(Base):
    __tablename__ = "applicant_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), unique=True, nullable=False)
    aadhaar_vault_token = Column(String(128), unique=True, nullable=True)
    dob = Column(Date, nullable=False)
    gender = Column(String(20), nullable=False)
    category = Column(String(20), default="ST", nullable=False)
    sub_caste = Column(String(100), nullable=True)
    father_or_guardian_name = Column(String(150), nullable=True)
    mother_name = Column(String(150), nullable=True)
    annual_family_income = Column(Numeric(12, 2), nullable=False)
    is_pwpd = Column(Boolean, default=False, nullable=False)
    pwpd_type = Column(String(100), nullable=True)
    pwpd_percentage = Column(Numeric(5, 2), nullable=True)
    state_of_domicile = Column(String(100), nullable=False, index=True)
    district_of_domicile = Column(String(100), nullable=False, index=True)
    permanent_address = Column(Text, nullable=False)
    pincode = Column(String(10), nullable=False)
    bank_account_hash = Column(String(64), nullable=False, index=True)
    bank_ifsc = Column(String(11), nullable=False)
    bank_name = Column(String(150), nullable=False)
    consent_dpdp_timestamp = Column(DateTime, default=datetime.utcnow, nullable=False)
    consent_version = Column(String(20), default="v2026.1", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="profile")
    applications = relationship("Application", back_populates="applicant")
