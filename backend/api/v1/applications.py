import hashlib
import uuid
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from thefuzz import fuzz
from core.database import get_db
from models.user import User, ApplicantProfile
from models.scheme import Scheme, SchemeVersion, SchemeCycle, Institute
from models.application import (
    Application,
    ApplicationDocument,
    DocumentExtraction,
    RuleEvaluation,
    Deficiency,
    AnomalyFlag
)
from models.audit import AuditLog
from schemas.application import (
    CreateApplicationRequest,
    ApplicationSummaryResponse,
    DocumentUploadResponse,
    DeficiencyResponse
)

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationSummaryResponse])
def get_applicant_applications(db: Session = Depends(get_db)):
    apps = db.query(Application).all()
    results = []
    for a in apps:
        scheme_name = "Scheduled Tribe Scheme"
        scheme_code = "NFST"
        if a.cycle and a.cycle.scheme_version and a.cycle.scheme_version.scheme:
            scheme_name = a.cycle.scheme_version.scheme.name
            scheme_code = a.cycle.scheme_version.scheme.code
        
        def_count = db.query(Deficiency).filter(
            Deficiency.application_id == a.id,
            Deficiency.status == "ISSUED"
        ).count()

        results.append(ApplicationSummaryResponse(
            id=a.id,
            application_number=a.application_number,
            scheme_code=scheme_code,
            scheme_name=scheme_name,
            status=a.status,
            current_stage=a.current_stage,
            submitted_at=a.submitted_at,
            last_action_at=a.last_action_at,
            active_deficiencies_count=def_count,
            fast_tracked=a.fast_tracked
        ))
    return results

@router.post("", response_model=ApplicationSummaryResponse)
def create_application(req: CreateApplicationRequest, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.code == req.scheme_code.upper()).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    cycle = db.query(SchemeCycle).join(SchemeVersion).filter(
        SchemeVersion.scheme_id == scheme.id,
        SchemeCycle.is_active == True
    ).first()

    if not cycle:
        raise HTTPException(status_code=400, detail="No active application cycle found for this scheme")

    # Pick demo profile or first applicant
    profile = db.query(ApplicantProfile).first()
    if not profile:
        raise HTTPException(status_code=400, detail="Applicant profile must be created first")

    app_num = f"{scheme.code}-2026-{uuid.uuid4().hex[:6].upper()}"
    new_app = Application(
        id=str(uuid.uuid4()),
        application_number=app_num,
        applicant_id=profile.id,
        scheme_cycle_id=cycle.id,
        status="DRAFT",
        current_stage="DRAFT_IN_PROGRESS",
        dynamic_form_data=req.dynamic_form_data,
        calculated_merit_score=0.00
    )
    db.add(new_app)
    
    # Audit trail
    db.add(AuditLog(
        id=str(uuid.uuid4()),
        actor_id=profile.user_id,
        actor_role="APPLICANT",
        action="APPLICATION_DRAFTED",
        entity_name="applications",
        entity_id=new_app.id,
        after_state={"status": "DRAFT", "app_num": app_num}
    ))

    db.commit()
    db.refresh(new_app)

    return ApplicationSummaryResponse(
        id=new_app.id,
        application_number=new_app.application_number,
        scheme_code=scheme.code,
        scheme_name=scheme.name,
        status=new_app.status,
        current_stage=new_app.current_stage,
        submitted_at=new_app.submitted_at,
        last_action_at=new_app.last_action_at,
        active_deficiencies_count=0,
        fast_tracked=False
    )

@router.get("/{app_id}")
def get_application_details(app_id: str, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    docs = db.query(ApplicationDocument).filter(
        ApplicationDocument.application_id == app.id,
        ApplicationDocument.is_active == True
    ).all()

    rules = db.query(RuleEvaluation).filter(RuleEvaluation.application_id == app.id).all()
    deficiencies = db.query(Deficiency).filter(Deficiency.application_id == app.id).all()
    anomalies = db.query(AnomalyFlag).filter(AnomalyFlag.application_id == app.id).all()

    return {
        "application": {
            "id": app.id,
            "application_number": app.application_number,
            "status": app.status,
            "current_stage": app.current_stage,
            "merit_score": float(app.calculated_merit_score or 0.0),
            "fast_tracked": app.fast_tracked,
            "submitted_at": app.submitted_at,
            "dynamic_form_data": app.dynamic_form_data
        },
        "applicant": {
            "name": app.applicant.user.full_name if app.applicant and app.applicant.user else "Rahul Kumar",
            "category": app.applicant.category if app.applicant else "ST",
            "state": app.applicant.state_of_domicile if app.applicant else "Odisha",
            "income": float(app.applicant.annual_family_income or 0) if app.applicant else 240000.0
        },
        "documents": [
            {
                "id": d.id,
                "document_type": d.document_type,
                "filename": d.original_filename,
                "sha256": d.sha256_hash,
                "status": d.verification_status,
                "uploaded_at": d.uploaded_at
            }
            for d in docs
        ],
        "rule_checks": [
            {
                "rule_id": r.rule_id,
                "result": r.result,
                "reason_code": r.reason_code,
                "explanation": r.explanation,
                "confidence": float(r.confidence or 0.0)
            }
            for r in rules
        ],
        "deficiencies": [
            {
                "id": df.id,
                "reason_code": df.reason_code,
                "public_explanation": df.public_explanation,
                "action_required": df.action_required,
                "deadline_at": df.deadline_at,
                "status": df.status
            }
            for df in deficiencies
        ],
        "anomalies": [
            {
                "flag_type": an.flag_type,
                "severity": an.severity,
                "description": an.description
            }
            for an in anomalies
        ]
    }

@router.post("/{app_id}/upload-document")
async def upload_document(
    app_id: str,
    document_type: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    content = await file.read()
    sha256 = hashlib.sha256(content).hexdigest()

    # Simulate Instant Document Intelligence (PaddleOCR / Layout NER)
    extracted_fields = {}
    confidences = {}
    avg_conf = 0.98
    verif_status = "AUTO_VERIFIED"

    doc_type_clean = document_type.upper()
    if "ST" in doc_type_clean or "CASTE" in doc_type_clean:
        extracted_fields = {
            "candidate_name": "Rahul Kumar",
            "category": "SCHEDULED_TRIBE",
            "sub_caste": "Santhal",
            "issuing_authority": "Sub-Divisional Officer, Baripada",
            "certificate_number": f"ST/OR/{sha256[:8].upper()}"
        }
        confidences = {"candidate_name": 0.98, "category": 0.99, "certificate_number": 0.99}
        avg_conf = 0.986
    elif "INCOME" in doc_type_clean:
        # Check if filename triggers simulated flaw (Scene 4 mismatch demo)
        if "mismatch" in file.filename.lower() or "notary" in file.filename.lower():
            extracted_fields = {
                "candidate_name": "Rahul K.",
                "annual_income": 240000,
                "issuing_authority": "Notary Public (Unrecognized)",
                "issue_date": "2026-01-10"
            }
            confidences = {"candidate_name": 0.74, "issuing_authority": 0.60}
            avg_conf = 0.67
            verif_status = "DEFICIENT"
        else:
            extracted_fields = {
                "candidate_name": "Rahul Kumar",
                "annual_income": 240000,
                "issuing_authority": "Tahasildar, Mayurbhanj",
                "issue_date": "2026-01-10"
            }
            confidences = {"candidate_name": 0.96, "issuing_authority": 0.95}
            avg_conf = 0.955

    new_doc = ApplicationDocument(
        id=str(uuid.uuid4()),
        application_id=app.id,
        document_type=doc_type_clean,
        original_filename=file.filename,
        storage_path=f"documents/{app.id}/{file.filename}",
        file_size_bytes=len(content),
        mime_type=file.content_type or "application/pdf",
        sha256_hash=sha256,
        source="MANUAL_UPLOAD",
        verification_status=verif_status
    )
    db.add(new_doc)
    db.flush()

    # Save extraction
    extraction = DocumentExtraction(
        id=str(uuid.uuid4()),
        document_id=new_doc.id,
        model_version="PaddleOCR-v4.1.2 + MoTA-NER-v1",
        extracted_fields=extracted_fields,
        field_confidences=confidences,
        average_confidence=avg_conf,
        processing_time_ms=280,
        raw_ocr_text=f"Sample extracted text for {doc_type_clean}"
    )
    db.add(extraction)

    # Check if deficiency should be raised (Scene 4 & 5 demo)
    if verif_status == "DEFICIENT":
        deficiency = Deficiency(
            id=str(uuid.uuid4()),
            application_id=app.id,
            document_id=new_doc.id,
            rule_id="NFST-R-004",
            reason_code="INCOME_CERT_AUTHORITY_INVALID",
            public_explanation="The uploaded Income Certificate was issued by an unauthorized Notary Public instead of an authorized Revenue Officer (SDO/Tehsildar).",
            action_required="Please upload a valid Income Certificate countersigned by a Tehsildar or Sub-Divisional Magistrate.",
            deadline_at=datetime.utcnow() + timedelta(days=5),
            status="ISSUED"
        )
        db.add(deficiency)
        app.status = "DEFICIENT"
        app.current_stage = "DEFICIENCY_PENDING_STUDENT"

    db.commit()

    return {
        "document_id": new_doc.id,
        "filename": new_doc.original_filename,
        "verification_status": verif_status,
        "average_confidence": float(avg_conf),
        "extracted_fields": extracted_fields,
        "has_deficiency": verif_status == "DEFICIENT"
    }

@router.post("/{app_id}/submit")
def submit_application(app_id: str, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == app_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Evaluate rules
    active_deficiencies = db.query(Deficiency).filter(
        Deficiency.application_id == app.id,
        Deficiency.status == "ISSUED"
    ).count()

    if active_deficiencies > 0:
        app.status = "DEFICIENT"
        app.current_stage = "DEFICIENCY_PENDING_STUDENT"
    else:
        app.status = "UNDER_SCRUTINY"
        app.current_stage = "OFFICER_EXCEPTION_SCRUTINY"
        app.fast_tracked = True # Flagged clean

    app.submitted_at = datetime.utcnow()
    app.last_action_at = datetime.utcnow()

    # Pre-populate explainable rule evaluations
    db.query(RuleEvaluation).filter(RuleEvaluation.application_id == app.id).delete()

    rule_checks = [
        RuleEvaluation(
            id=str(uuid.uuid4()),
            application_id=app.id,
            rule_id="NFST-R-001",
            rule_version="2026.1",
            rule_type="ELIGIBILITY",
            result="PASS",
            reason_code="ST_CATEGORY_VERIFIED",
            explanation="Candidate confirmed as Scheduled Tribe (Santhal) from valid certificate.",
            confidence=0.99
        ),
        RuleEvaluation(
            id=str(uuid.uuid4()),
            application_id=app.id,
            rule_id="NFST-R-002",
            rule_version="2026.1",
            rule_type="DOCUMENT",
            result="PASS" if active_deficiencies == 0 else "HUMAN_REVIEW",
            reason_code="NAME_MATCH_VERIFIED" if active_deficiencies == 0 else "NAME_FUZZY_CONFIDENCE_LOW",
            explanation="Extracted certificate name matches application name with 98% fuzzy similarity." if active_deficiencies == 0 else "Certificate name differs slightly from application.",
            confidence=0.98 if active_deficiencies == 0 else 0.74
        ),
        RuleEvaluation(
            id=str(uuid.uuid4()),
            application_id=app.id,
            rule_id="NFST-R-003",
            rule_version="2026.1",
            rule_type="ELIGIBILITY",
            result="PASS",
            reason_code="AGE_WITHIN_LIMIT",
            explanation="Age is 28 years (limit is 36 years).",
            confidence=1.00
        ),
        RuleEvaluation(
            id=str(uuid.uuid4()),
            application_id=app.id,
            rule_id="NFST-R-004",
            rule_version="2026.1",
            rule_type="ELIGIBILITY",
            result="PASS" if active_deficiencies == 0 else "HUMAN_REVIEW",
            reason_code="INCOME_CEILING_PASS" if active_deficiencies == 0 else "INCOME_CERT_AUTHORITY_INVALID",
            explanation="Family income (₹2,40,000) is well below the ceiling of ₹6,00,000.",
            confidence=0.96 if active_deficiencies == 0 else 0.67
        )
    ]
    db.add_all(rule_checks)

    # Score calculation demo
    app.calculated_merit_score = 87.00
    app.overall_merit_rank = 42

    db.commit()
    return {"status": app.status, "current_stage": app.current_stage, "merit_score": float(app.calculated_merit_score)}

@router.post("/{app_id}/deficiencies/{def_id}/resolve-demo")
def resolve_deficiency_demo(app_id: str, def_id: str, db: Session = Depends(get_db)):
    """Simulates Scene 6: Rahul resubmitting corrected Tehsildar income certificate."""
    defic = db.query(Deficiency).filter(Deficiency.id == def_id, Deficiency.application_id == app_id).first()
    if not defic:
        raise HTTPException(status_code=404, detail="Deficiency not found")

    defic.status = "RESOLVED"
    defic.resolved_at = datetime.utcnow()

    app = db.query(Application).filter(Application.id == app_id).first()
    if app:
        app.status = "RESUBMITTED"
        app.current_stage = "UNDER_SCRUTINY"
        app.last_action_at = datetime.utcnow()

        # Update rule check to PASS
        rule_r4 = db.query(RuleEvaluation).filter(
            RuleEvaluation.application_id == app.id,
            RuleEvaluation.rule_id == "NFST-R-004"
        ).first()
        if rule_r4:
            rule_r4.result = "PASS"
            rule_r4.reason_code = "INCOME_RESUBMITTED_AND_VERIFIED"
            rule_r4.explanation = "Corrected Tehsildar income certificate verified via automated re-check (98% confidence)."
            rule_r4.confidence = 0.98

    db.commit()
    return {"status": "SUCCESS", "message": "Deficiency resolved and application re-screened to UNDER_SCRUTINY"}
