import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Date, Integer, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from core.database import Base

class Institute(Base):
    __tablename__ = "institutes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    aishe_code = Column(String(30), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    institute_type = Column(String(50), nullable=False) # Central Univ, State Univ, IIT, NIT, Overseas
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    nodal_officer_user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    applications = relationship("Application", back_populates="institute")

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    code = Column(String(30), unique=True, nullable=False, index=True) # NFST, NOS
    name = Column(String(255), nullable=False)
    short_description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    versions = relationship("SchemeVersion", back_populates="scheme", cascade="all, delete-orphan")

class SchemeVersion(Base):
    __tablename__ = "scheme_versions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_id = Column(String(36), ForeignKey("schemes.id"), nullable=False)
    version_tag = Column(String(30), nullable=False) # '2026.1'
    status = Column(String(20), default="DRAFT", nullable=False) # DRAFT, ACTIVE, ARCHIVED
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    form_schema = Column(JSON, nullable=False) # Dynamic form sections and fields
    document_schema = Column(JSON, nullable=False) # Required documents
    rule_schema = Column(JSON, nullable=False) # Executable JSON rules
    scoring_schema = Column(JSON, nullable=False) # Merit rubric & weights
    workflow_sla_hours = Column(JSON, nullable=False) # Stage SLA hours
    approved_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    approved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scheme = relationship("Scheme", back_populates="versions")
    cycles = relationship("SchemeCycle", back_populates="scheme_version")

class SchemeCycle(Base):
    __tablename__ = "scheme_cycles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    scheme_version_id = Column(String(36), ForeignKey("scheme_versions.id"), nullable=False)
    financial_year = Column(String(10), nullable=False) # '2026-2027'
    application_start_date = Column(DateTime, nullable=False)
    application_end_date = Column(DateTime, nullable=False)
    total_slots = Column(Integer, default=750, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    scheme_version = relationship("SchemeVersion", back_populates="cycles")
    applications = relationship("Application", back_populates="cycle")
