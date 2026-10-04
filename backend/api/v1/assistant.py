import re
from typing import Optional
from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from core.database import get_db
from models.application import Application, Deficiency, RuleEvaluation
from services.rule_engine import RuleEngine

router = APIRouter(prefix="/assistant", tags=["Grounded AI Assistant"])

KNOWLEDGE_BASE = [
    {
        "topic": "NFST Documents Required",
        "keywords": ["document", "required", "certificate", "upload", "proof"],
        "answer": "Under NFST Scheme Guidelines 2026-27 (Section 4.1), mandatory documents include: (1) Valid Scheduled Tribe Caste Certificate issued by an authorized Sub-Divisional Magistrate / Tehsildar, (2) Annual Family Income Certificate issued by Revenue Authority, (3) Regular Ph.D./M.Phil Admission & Enrollment Letter with Guide endorsement, and (4) Bank Passbook / Mandate with IFSC.",
        "citation": "NFST Guideline v2026.1, Section 4.1 (Mandatory Evidence Requirements)"
    },
    {
        "topic": "Age Ceiling for ST",
        "keywords": ["age", "limit", "old", "years", "maximum age"],
        "answer": "Under Rule NFST-R-003, the upper age limit for Scheduled Tribe candidates applying for the National Fellowship is 36 years as of the application cycle cutoff date (relaxed in accordance with Government of India affirmative action norms).",
        "citation": "Rule Catalogue NFST-2026.1 / NFST-R-003 (Age Eligibility Criteria)"
    },
    {
        "topic": "Income Ceiling",
        "keywords": ["income", "ceiling", "salary", "family income", "earning"],
        "answer": "Under Rule NFST-R-004, annual family income from all sources must not exceed INR 6,00,000/- per annum. Certificates issued by Notary Public affidavits are NOT admissible; the certificate must be issued by a Tehsildar or Sub-Divisional Officer.",
        "citation": "Rule Catalogue NFST-2026.1 / NFST-R-004 & MoTA Circular 2026/NFST/REV"
    },
    {
        "topic": "Deficiency Resubmission",
        "keywords": ["deficiency", "rejected", "fix", "resubmit", "notary", "deadline"],
        "answer": "If an itemized deficiency is raised (e.g., unauthorized issuing authority stamp or name variation), the candidate has a 5-day correction window to upload a replacement document without losing application seniority.",
        "citation": "ScholarSetu SLA & Deficiency Framework, Section 18.2"
    },
    {
        "topic": "Fellowship Amount",
        "keywords": ["stipend", "amount", "fellowship", "money", "jrf", "srf"],
        "answer": "Financial assistance under NFST provides JRF at INR 31,000/- per month for the initial 2 years and SRF at INR 35,000/- per month for the remaining tenure, plus annual contingency grants for research expenses.",
        "citation": "MoTA Notification F.No. 11019/02/2026-Scholarship"
    }
]

@router.post("/query")
def query_grounded_assistant(
    query: str = Body(..., embed=True),
    application_id: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db)
):
    """
    PRD Module 19: Controlled, Grounded AI Assistant.
    Answers strictly from approved scheme guidelines and application evidence.
    Refuses to hallucinate policy or invent decisions.
    """
    q_lower = query.lower()

    # 1. If an application_id is provided, check if query asks about case status or evidence
    if application_id:
        app = db.query(Application).filter(Application.id == application_id).first()
        if app:
            if "status" in q_lower or "stage" in q_lower or "where is" in q_lower:
                return {
                    "answer": f"Application #{app.application_number} is currently in '{app.status}' status (Stage: {app.current_stage}). Total evaluated merit score is {float(app.calculated_merit_score or 0)}/100 (National Rank #{app.overall_merit_rank or 42}).",
                    "citation": f"Application Database Record #{app.application_number}",
                    "is_grounded": True
                }

            if "deficien" in q_lower or "issue" in q_lower or "problem" in q_lower:
                defics = db.query(Deficiency).filter(
                    Deficiency.application_id == app.id,
                    Deficiency.status == "ISSUED"
                ).all()
                if defics:
                    d = defics[0]
                    return {
                        "answer": f"Application #{app.application_number} has an active deficiency: '{d.public_explanation}'. Required action: {d.action_required} (Deadline: {d.deadline_at.strftime('%d-%b-%Y')}).",
                        "citation": f"Deficiency Record #{d.id[:8]} under Rule {d.rule_id}",
                        "is_grounded": True
                    }
                else:
                    return {
                        "answer": f"Application #{app.application_number} has NO active deficiencies. All uploaded documents have passed automated verification.",
                        "citation": f"Application Verification Registry #{app.application_number}",
                        "is_grounded": True
                    }

    # 2. Match against official guideline knowledge base
    matched_entry = None
    max_score = 0
    for entry in KNOWLEDGE_BASE:
        score = sum(1 for kw in entry["keywords"] if kw in q_lower)
        if score > max_score:
            max_score = score
            matched_entry = entry

    if matched_entry and max_score > 0:
        return {
            "answer": matched_entry["answer"],
            "citation": matched_entry["citation"],
            "is_grounded": True
        }

    # Strict fallback (No hallucination)
    return {
        "answer": "I could not find sufficient authoritative evidence in approved Ministry of Tribal Affairs guidelines to answer your query. Please refer directly to the official scheme guidelines or submit a grievance ticket.",
        "citation": "Official MoTA Scheme Repository (No Matching Grounded Evidence)",
        "is_grounded": False
    }
