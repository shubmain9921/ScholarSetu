import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.database import Base

class Grievance(Base):
    __tablename__ = "grievances"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    ticket_number = Column(String(50), unique=True, nullable=False, index=True) # GRV-2026-0042
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    applicant_id = Column(String(36), ForeignKey("applicant_profiles.id"), nullable=False)
    category = Column(String(64), nullable=False) # DOCUMENT_REJECTION, ELIGIBILITY_DISPUTE, PAYMENT_DELAY, TECHNICAL
    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(32), default="SUBMITTED", nullable=False) # SUBMITTED, UNDER_INVESTIGATION, RESOLVED, REJECTED
    priority = Column(String(20), default="MEDIUM", nullable=False) # LOW, MEDIUM, HIGH
    sla_deadline_at = Column(DateTime, nullable=False)
    assigned_officer_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    application = relationship("Application")
    applicant = relationship("ApplicantProfile")
    resolutions = relationship("GrievanceResolution", back_populates="grievance", cascade="all, delete-orphan")

class GrievanceResolution(Base):
    __tablename__ = "grievance_resolutions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    grievance_id = Column(String(36), ForeignKey("grievances.id"), nullable=False)
    resolved_by_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    action_taken = Column(String(64), nullable=False) # EXCEPTION_OVERRIDDEN, DEFICIENCY_EXTENDED, REJECTED_WITH_POLICY
    resolution_remarks = Column(Text, nullable=False)
    policy_reference = Column(String(100), nullable=True) # e.g. "NFST Guideline Section 4.2"
    resolved_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    grievance = relationship("Grievance", back_populates="resolutions")
