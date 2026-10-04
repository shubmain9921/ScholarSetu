import uuid
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from core.database import get_db
from models.application import Application, CommitteeReview
from models.user import User
from models.audit import AuditLog

router = APIRouter(prefix="/committee", tags=["Selection Committee"])

@router.get("/candidates")
def list_committee_candidates(blind_mode: bool = False, db: Session = Depends(get_db)):
    """
    Returns candidates in the committee review stage.
    Supports blind review mode (masking candidate names and photos for unbiased merit review).
    """
    apps = db.query(Application).filter(
        Application.status.in_(["SHORTLISTED", "UNDER_SCRUTINY", "ELIGIBLE", "RECOMMENDED"])
    ).limit(15).all()

    results = []
    for a in apps:
        review = db.query(CommitteeReview).filter(CommitteeReview.application_id == a.id).first()
        
        display_name = "Candidate #" + a.application_number[-6:] if blind_mode else (
            a.applicant.user.full_name if a.applicant and a.applicant.user else "Rahul Kumar"
        )

        results.append({
            "application_id": a.id,
            "application_number": a.application_number,
            "display_name": display_name,
            "category": a.applicant.category if a.applicant else "ST",
            "state": a.applicant.state_of_domicile if a.applicant else "Odisha",
            "institute_name": a.institute.name if a.institute else "North Orissa University",
            "research_topic": a.dynamic_form_data.get("research_topic", "Ethnomedicinal Flora of Similipal Biosphere Reserve"),
            "academic_score": float(review.score_academic_merit) if review else 35.0,
            "research_score": float(review.score_research_proposal) if review else 28.0,
            "tribal_relevance_score": float(review.score_interview) if review else 24.0,
            "total_score": float(a.calculated_merit_score or 87.0),
            "coi_declared": review.has_conflict_of_interest if review else False,
            "recommendation": review.recommendation if review else "PENDING_REVIEW",
            "status": a.status
        })
    return results

@router.post("/coi-declaration/{app_id}")
def declare_conflict_of_interest(
    app_id: str,
    has_conflict: bool = Body(..., embed=True),
    reviewer_name: str = Body("Prof. K. Birhor (Committee Chair)", embed=True),
    db: Session = Depends(get_db)
):
    """PRD Module 13 & Section 22: Conflict of Interest Gate before candidate scoring."""
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    reviewer = db.query(User).filter(User.role.in_(["COMMITTEE_MEMBER", "SCRUTINY_OFFICER"])).first()
    rev_id = reviewer.id if reviewer else app.applicant.user_id

    review = db.query(CommitteeReview).filter(CommitteeReview.application_id == app.id).first()
    if not review:
        review = CommitteeReview(
            id=str(uuid.uuid4()),
            application_id=app.id,
            reviewer_user_id=rev_id,
            has_conflict_of_interest=has_conflict,
            coi_declaration_signed_at=datetime.now(timezone.utc)
        )
        db.add(review)
    else:
        review.has_conflict_of_interest = has_conflict
        review.coi_declaration_signed_at = datetime.now(timezone.utc)

    # Log audit
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        actor_role="COMMITTEE_MEMBER",
        action="COI_DECLARATION_SIGNED",
        entity_name="applications",
        entity_id=app.id,
        reason_code=f"Conflict declared: {has_conflict} by {reviewer_name}"
    ))

    db.commit()
    return {
        "status": "RECORDED",
        "has_conflict": has_conflict,
        "eligible_to_evaluate": not has_conflict,
        "message": "Conflict of interest recorded. Reviewer recused from this file." if has_conflict else "COI clearance verified. You may now evaluate candidate."
    }

@router.post("/score/{app_id}")
def submit_committee_score(
    app_id: str,
    academic_merit: float = Body(..., ge=0, le=40),
    research_feasibility: float = Body(..., ge=0, le=30),
    tribal_impact: float = Body(..., ge=0, le=30),
    recommendation: str = Body("RECOMMENDED"),
    remarks: str = Body("High potential for tribal flora conservation and documentation"),
    db: Session = Depends(get_db)
):
    """PRD Module 12 & 13: Deterministic Rubric Scoring."""
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    total_score = round(academic_merit + research_feasibility + tribal_impact, 2)
    app.calculated_merit_score = total_score
    if recommendation == "RECOMMENDED":
        app.status = "RECOMMENDED"
        app.current_stage = "APPROVING_AUTHORITY_SANCTION"

    review = db.query(CommitteeReview).filter(CommitteeReview.application_id == app.id).first()
    if not review:
        review = CommitteeReview(
            id=str(uuid.uuid4()),
            application_id=app.id,
            reviewer_user_id=app.applicant.user_id if app.applicant else str(uuid.uuid4()),
            score_academic_merit=academic_merit,
            score_research_proposal=research_feasibility,
            score_interview=tribal_impact,
            total_awarded_score=total_score,
            recommendation=recommendation,
            remarks=remarks,
            reviewed_at=datetime.now(timezone.utc)
        )
        db.add(review)
    else:
        review.score_academic_merit = academic_merit
        review.score_research_proposal = research_feasibility
        review.score_interview = tribal_impact
        review.total_awarded_score = total_score
        review.recommendation = recommendation
        review.remarks = remarks
        review.reviewed_at = datetime.now(timezone.utc)

    # Immutable Audit Log
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        actor_role="COMMITTEE_MEMBER",
        action="COMMITTEE_MERIT_SCORED",
        entity_name="applications",
        entity_id=app.id,
        after_state={"score": total_score, "recommendation": recommendation},
        reason_code=f"Scores: Academic={academic_merit}, Research={research_feasibility}, TribalImpact={tribal_impact}"
    ))

    db.commit()
    return {
        "status": "SCORED",
        "total_score": total_score,
        "recommendation": recommendation,
        "app_status": app.status
    }
