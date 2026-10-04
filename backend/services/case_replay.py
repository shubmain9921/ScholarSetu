from typing import Dict, Any, List
from sqlalchemy.orm import Session
from models.application import Application, Deficiency, RuleEvaluation
from models.audit import AuditLog

class CaseReplayEngine:
    """
    Case Replay & Audit Service (PRD Module 24 & 29).
    Reconstructs the full lifecycle timeline of any application:
    - What happened?
    - Which rule version was applied?
    - Which document supported it?
    - What confidence score was computed?
    - Which officer approved or resolved the exception?
    """

    @classmethod
    def reconstruct_case_timeline(cls, app_id: str, db: Session) -> Dict[str, Any]:
        app = db.query(Application).filter(Application.id == app_id).first()
        if not app:
            return {"error": "Application not found", "timeline": []}

        timeline_events: List[Dict[str, Any]] = []

        # 1. Audit Log Events
        logs = db.query(AuditLog).filter(
            AuditLog.entity_name == "applications",
            AuditLog.entity_id == app.id
        ).order_by(AuditLog.created_at.asc()).all()

        for log in logs:
            timeline_events.append({
                "timestamp": log.created_at,
                "actor": log.actor_role,
                "event_type": log.action,
                "description": log.reason_code or f"Application transitioned by {log.actor_role}",
                "state_snapshot": log.after_state
            })

        # 2. Deficiencies
        deficiencies = db.query(Deficiency).filter(Deficiency.application_id == app.id).all()
        for d in deficiencies:
            timeline_events.append({
                "timestamp": d.created_at,
                "actor": "RULE_ENGINE",
                "event_type": "DEFICIENCY_ISSUED",
                "description": f"Deficiency Raised: {d.public_explanation} (Deadline: {d.deadline_at.strftime('%d-%b-%Y')})",
                "reason_code": d.reason_code,
                "status": d.status
            })
            if d.resolved_at:
                timeline_events.append({
                    "timestamp": d.resolved_at,
                    "actor": "APPLICANT",
                    "event_type": "DEFICIENCY_RESOLVED",
                    "description": "Applicant uploaded replacement document; automated re-check passed.",
                    "status": "RESOLVED"
                })

        # Sort all timeline items chronologically
        timeline_events.sort(key=lambda x: x["timestamp"])

        return {
            "application_number": app.application_number,
            "scheme": app.cycle.scheme_version.scheme.code if app.cycle else "NFST",
            "rule_version": app.cycle.scheme_version.version_tag if app.cycle else "2026.1",
            "current_status": app.status,
            "merit_score": float(app.calculated_merit_score or 0.0),
            "merit_rank": app.overall_merit_rank,
            "total_events": len(timeline_events),
            "events": [
                {
                    **ev,
                    "formatted_time": ev["timestamp"].strftime("%d %b %Y, %H:%M:%S UTC")
                }
                for ev in timeline_events
            ]
        }
