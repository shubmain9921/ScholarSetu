import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from core.database import get_db
from models.grievance import Grievance, GrievanceResolution
from models.application import Application
from models.user import ApplicantProfile, User
from models.audit import AuditLog

router = APIRouter(prefix="/grievances", tags=["Grievance & Appeal Redressal"])

@router.get("")
def list_grievances(status: Optional[str] = None, db: Session = Depends(get_db)):
    """PRD Module 20: Grievance management list."""
    query = db.query(Grievance)
    if status:
        query = query.filter(Grievance.status == status.upper())
    items = query.order_by(Grievance.created_at.desc()).all()

    return [
        {
            "id": g.id,
            "ticket_number": g.ticket_number,
            "application_number": g.application.application_number if g.application else "NFST-2026-000124",
            "applicant_name": g.applicant.user.full_name if g.applicant and g.applicant.user else "Rahul Kumar",
            "category": g.category,
            "subject": g.subject,
            "description": g.description,
            "status": g.status,
            "priority": g.priority,
            "sla_deadline": g.sla_deadline_at,
            "created_at": g.created_at,
            "resolutions": [
                {
                    "action_taken": r.action_taken,
                    "resolution_remarks": r.resolution_remarks,
                    "policy_reference": r.policy_reference,
                    "resolved_at": r.resolved_at
                }
                for r in g.resolutions
            ]
        }
        for g in items
    ]

@router.post("")
def create_grievance(
    application_id: str = Body(..., embed=True),
    category: str = Body(..., embed=True), # DOCUMENT_REJECTION, ELIGIBILITY_DISPUTE, PAYMENT_DELAY
    subject: str = Body(..., embed=True),
    description: str = Body(..., embed=True),
    db: Session = Depends(get_db)
):
    """PRD Module 20: Student creates application-linked grievance ticket."""
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    ticket_no = f"GRV-2026-{uuid.uuid4().hex[:6].upper()}"
    new_grv = Grievance(
        id=str(uuid.uuid4()),
        ticket_number=ticket_no,
        application_id=app.id,
        applicant_id=app.applicant_id,
        category=category,
        subject=subject,
        description=description,
        status="SUBMITTED",
        priority="HIGH" if "REJECTION" in category or "PAYMENT" in category else "MEDIUM",
        sla_deadline_at=datetime.now(timezone.utc) + timedelta(days=7) # 7-day citizen charter SLA
    )
    db.add(new_grv)

    # Log audit
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        actor_id=app.applicant.user_id if app.applicant else None,
        actor_role="APPLICANT",
        action="GRIEVANCE_LODGED",
        entity_name="grievances",
        entity_id=new_grv.id,
        reason_code=f"Ticket {ticket_no} created for {category}"
    ))

    db.commit()
    db.refresh(new_grv)

    return {
        "status": "SUCCESS",
        "ticket_number": ticket_no,
        "sla_deadline": new_grv.sla_deadline_at,
        "message": "Grievance ticket created. Assigned to MoTA Grievance Nodal Cell under 7-day SLA."
    }

@router.post("/{grievance_id}/resolve")
def resolve_grievance(
    grievance_id: str,
    action_taken: str = Body(..., embed=True), # EXCEPTION_OVERRIDDEN, DEFICIENCY_EXTENDED, REJECTED_WITH_POLICY
    resolution_remarks: str = Body(..., embed=True),
    policy_reference: str = Body("NFST Guideline Section 4.2", embed=True),
    db: Session = Depends(get_db)
):
    """PRD Module 20: Officer resolves grievance with explainable justification."""
    grv = db.query(Grievance).filter(Grievance.id == grievance_id).first()
    if not grv:
        raise HTTPException(status_code=404, detail="Grievance not found")

    grv.status = "RESOLVED"
    grv.updated_at = datetime.now(timezone.utc)

    officer = db.query(User).filter(User.role == "SCRUTINY_OFFICER").first()
    off_id = officer.id if officer else grv.applicant.user_id

    res = GrievanceResolution(
        id=str(uuid.uuid4()),
        grievance_id=grv.id,
        resolved_by_user_id=off_id,
        action_taken=action_taken,
        resolution_remarks=resolution_remarks,
        policy_reference=policy_reference,
        resolved_at=datetime.now(timezone.utc)
    )
    db.add(res)

    # Log audit
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        actor_id=off_id,
        actor_role="GRIEVANCE_OFFICER",
        action="GRIEVANCE_RESOLVED",
        entity_name="grievances",
        entity_id=grv.id,
        reason_code=f"Action: {action_taken}. Ref: {policy_reference}"
    ))

    db.commit()
    return {"status": "RESOLVED", "ticket_number": grv.ticket_number, "action_taken": action_taken}
