import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, ForeignKey, JSON
from core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    actor_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    actor_role = Column(String(64), nullable=False)
    action = Column(String(100), nullable=False, index=True) # DEFICIENCY_RAISED, RULE_EVALUATED, STATUS_TRANSITION
    entity_name = Column(String(64), nullable=False, index=True) # applications, deficiencies, scheme_versions
    entity_id = Column(String(64), nullable=False, index=True)
    before_state = Column(JSON, nullable=True)
    after_state = Column(JSON, nullable=True)
    reason_code = Column(Text, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
