from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from models.scheme import Scheme, SchemeVersion, SchemeCycle
from schemas.scheme import SchemeDetailResponse, EligibilitySelfCheckRequest, EligibilitySelfCheckResponse

router = APIRouter(prefix="/schemes", tags=["Schemes"])

@router.get("", response_model=List[SchemeDetailResponse])
def list_schemes(db: Session = Depends(get_db)):
    schemes = db.query(Scheme).all()
    results = []
    for s in schemes:
        active_ver = db.query(SchemeVersion).filter(
            SchemeVersion.scheme_id == s.id,
            SchemeVersion.status == "ACTIVE"
        ).first()
        
        cycle = None
        if active_ver:
            cycle = db.query(SchemeCycle).filter(
                SchemeCycle.scheme_version_id == active_ver.id,
                SchemeCycle.is_active == True
            ).first()

        results.append(SchemeDetailResponse(
            id=s.id,
            code=s.code,
            name=s.name,
            short_description=s.short_description,
            active_version=active_ver.version_tag if active_ver else "2026.1",
            total_slots=cycle.total_slots if cycle else 750,
            application_deadline=cycle.application_end_date if cycle else None
        ))
    return results

@router.post("/{scheme_code}/self-check", response_model=EligibilitySelfCheckResponse)
def self_check_eligibility(scheme_code: str, req: EligibilitySelfCheckRequest):
    code = scheme_code.upper()
    satisfied = []
    unmet = []

    # Rule checks based on scheme policy guidelines
    if req.is_st_category:
        satisfied.append("R01_ST_CATEGORY_VERIFIED")
    else:
        unmet.append("R01_ST_CATEGORY_REQUIRED: Must belong to Scheduled Tribe (ST) category")

    if code == "NFST":
        # NFST: Max age 36, Income ceiling <= 6.0L, regular MPhil/PhD
        if req.age <= 36:
            satisfied.append("R02_MAX_AGE_36: Within eligible age bracket")
        else:
            unmet.append(f"R02_MAX_AGE_36: Current age ({req.age}) exceeds the 36-year upper limit for NFST")

        if req.annual_family_income <= 600000:
            satisfied.append("R03_INCOME_CEILING_6L: Within prescribed ceiling of ₹6.0 Lakhs")
        else:
            unmet.append(f"R03_INCOME_CEILING_6L: Family income (₹{req.annual_family_income:,.0f}) exceeds ₹6,00,000")

        if req.degree_enrolled in ["PhD", "MPhil", "Integrated_PhD"]:
            satisfied.append("R04_DEGREE_ENROLLMENT: Valid full-time doctoral/research enrollment")
        else:
            unmet.append("R04_DEGREE_ENROLLMENT: Scheme requires enrollment in regular M.Phil or Ph.D.")

    elif code == "NOS":
        # NOS: Income <= 8.0L, Min 55% marks, QS rank <= 500
        if req.annual_family_income <= 800000:
            satisfied.append("NOS_R02_INCOME_CEILING_8L: Within ₹8.0 Lakhs limit")
        else:
            unmet.append(f"NOS_R02_INCOME_CEILING_8L: Income (₹{req.annual_family_income:,.0f}) exceeds ₹8,00,000")

        marks = req.undergraduate_percentage or 60.0
        if marks >= 55.0:
            satisfied.append(f"NOS_R03_MIN_MARKS_55: Qualifying degree score {marks}% satisfies 55% threshold")
        else:
            unmet.append(f"NOS_R03_MIN_MARKS_55: Score {marks}% is below the mandatory 55%")

        qs_rank = req.foreign_university_qs_rank or 250
        if qs_rank <= 500:
            satisfied.append(f"NOS_R04_QS_RANK_500: University QS rank #{qs_rank} is within top 500")
        else:
            unmet.append(f"NOS_R04_QS_RANK_500: University QS rank #{qs_rank} exceeds top 500 limit")

    is_eligible = len(unmet) == 0
    explanation = (
        "Based on your inputs, you appear likely eligible to apply under current approved guidelines."
        if is_eligible else
        f"You may not satisfy {len(unmet)} mandatory requirement(s) under current guidelines."
    )

    return EligibilitySelfCheckResponse(
        is_likely_eligible=is_eligible,
        scheme_code=code,
        satisfied_rules=satisfied,
        unmet_rules=unmet,
        explanation=explanation
    )
