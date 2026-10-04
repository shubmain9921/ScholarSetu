import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Integer, Numeric, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_number = Column(String(64), unique=True, nullable=False, index=True) # NFST-2026-000124
    applicant_id = Column(String(36), ForeignKey("applicant_profiles.id"), nullable=False)
    scheme_cycle_id = Column(String(36), ForeignKey("scheme_cycles.id"), nullable=False)
    institute_id = Column(String(36), ForeignKey("institutes.id"), nullable=True)
    status = Column(String(50), default="DRAFT", nullable=False, index=True) # SUBMITTED, AUTO_SCREENING, etc.
    current_stage = Column(String(64), default="REGISTRATION", nullable=False)
    dynamic_form_data = Column(JSON, default=dict, nullable=False)
    calculated_merit_score = Column(Numeric(6, 2), default=0.00, nullable=False)
    overall_merit_rank = Column(Integer, nullable=True)
    category_rank = Column(Integer, nullable=True)
    fast_tracked = Column(Boolean, default=False, nullable=False)
    submitted_at = Column(DateTime, nullable=True)
    last_action_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    stage_deadline_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    applicant = relationship("ApplicantProfile", back_populates="applications")
    cycle = relationship("SchemeCycle", back_populates="applications")
    institute = relationship("Institute", back_populates="applications")
    documents = relationship("ApplicationDocument", back_populates="application", cascade="all, delete-orphan")
    rule_evaluations = relationship("RuleEvaluation", back_populates="application", cascade="all, delete-orphan")
    deficiencies = relationship("Deficiency", back_populates="application", cascade="all, delete-orphan")
    anomalies = relationship("AnomalyFlag", back_populates="application", cascade="all, delete-orphan")
    committee_reviews = relationship("CommitteeReview", back_populates="application", cascade="all, delete-orphan")
    payments = relationship("PaymentDisbursement", back_populates="application", cascade="all, delete-orphan")

class ApplicationDocument(Base):
    __tablename__ = "application_documents"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    document_type = Column(String(64), nullable=False) # ST_CERTIFICATE, INCOME_CERTIFICATE, etc.
    original_filename = Column(String(255), nullable=False)
    storage_path = Column(String(512), nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    mime_type = Column(String(64), nullable=False)
    sha256_hash = Column(String(64), nullable=False, index=True)
    source = Column(String(32), default="MANUAL_UPLOAD", nullable=False) # MANUAL_UPLOAD, DIGILOCKER
    verification_status = Column(String(32), default="PENDING", nullable=False) # AUTO_VERIFIED, REQUIRES_HUMAN_REVIEW, etc.
    is_active = Column(Boolean, default=True, nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="documents")
    extractions = relationship("DocumentExtraction", back_populates="document", cascade="all, delete-orphan")

class DocumentExtraction(Base):
    __tablename__ = "document_extractions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String(36), ForeignKey("application_documents.id"), nullable=False)
    model_version = Column(String(64), nullable=False) # PaddleOCR-v4.1.2
    extracted_fields = Column(JSON, nullable=False) # {"name": "Rahul Kumar", "category": "ST"}
    field_confidences = Column(JSON, nullable=False) # {"name": 0.98, "category": 0.99}
    average_confidence = Column(Numeric(5, 4), nullable=False)
    processing_time_ms = Column(Integer, nullable=False)
    raw_ocr_text = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    document = relationship("ApplicationDocument", back_populates="extractions")

class AnomalyFlag(Base):
    __tablename__ = "anomaly_flags"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    document_id = Column(String(36), ForeignKey("application_documents.id"), nullable=True)
    flag_type = Column(String(64), nullable=False) # DUPLICATE_DOC_HASH, REUSED_BANK_ACCOUNT, etc.
    severity = Column(String(20), default="MEDIUM", nullable=False) # LOW, MEDIUM, CRITICAL
    description = Column(Text, nullable=False)
    evidence_payload = Column(JSON, default=dict, nullable=False)
    is_resolved = Column(Boolean, default=False, nullable=False)
    resolved_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="anomalies")

class RuleEvaluation(Base):
    __tablename__ = "rule_evaluations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    rule_id = Column(String(64), nullable=False, index=True)
    rule_version = Column(String(32), nullable=False)
    rule_type = Column(String(32), nullable=False) # ELIGIBILITY, DOCUMENT, SCORING
    result = Column(String(20), nullable=False) # PASS, FAIL, HUMAN_REVIEW
    reason_code = Column(String(64), nullable=False)
    explanation = Column(Text, nullable=False)
    evidence_document_id = Column(String(36), ForeignKey("application_documents.id"), nullable=True)
    extracted_value = Column(Text, nullable=True)
    expected_value = Column(Text, nullable=True)
    confidence = Column(Numeric(5, 4), nullable=True)
    evaluated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="rule_evaluations")

class Deficiency(Base):
    __tablename__ = "deficiencies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    document_id = Column(String(36), ForeignKey("application_documents.id"), nullable=True)
    rule_id = Column(String(64), nullable=True)
    reason_code = Column(String(64), nullable=False)
    public_explanation = Column(Text, nullable=False)
    action_required = Column(Text, nullable=False)
    deadline_at = Column(DateTime, nullable=False)
    status = Column(String(20), default="ISSUED", nullable=False) # ISSUED, RESUBMITTED, RESOLVED
    issued_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    resubmitted_document_id = Column(String(36), ForeignKey("application_documents.id"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="deficiencies")

class CommitteeReview(Base):
    __tablename__ = "committee_reviews"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    reviewer_user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    has_conflict_of_interest = Column(Boolean, default=False, nullable=False)
    coi_declaration_signed_at = Column(DateTime, nullable=True)
    score_academic_merit = Column(Numeric(5, 2), default=0.00, nullable=False)
    score_research_proposal = Column(Numeric(5, 2), default=0.00, nullable=False)
    score_interview = Column(Numeric(5, 2), default=0.00, nullable=False)
    total_awarded_score = Column(Numeric(5, 2), default=0.00, nullable=False)
    recommendation = Column(String(32), nullable=True) # RECOMMENDED, NOT_RECOMMENDED, HOLD
    remarks = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)

    application = relationship("Application", back_populates="committee_reviews")

class PaymentDisbursement(Base):
    __tablename__ = "payment_disbursements"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    application_id = Column(String(36), ForeignKey("applications.id"), nullable=False)
    disbursement_cycle = Column(Integer, default=1, nullable=False)
    sanction_order_number = Column(String(100), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    pfms_transaction_id = Column(String(100), nullable=True)
    payment_status = Column(String(30), default="PENDING_SANCTION", nullable=False)
    failure_reason = Column(Text, nullable=True)
    sanctioned_at = Column(DateTime, nullable=True)
    disbursed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    application = relationship("Application", back_populates="payments")
