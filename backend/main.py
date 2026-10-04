import sys
import os

# Ensure backend directory is in sys.path so imports work regardless of working directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

import uuid
from datetime import datetime, date, timedelta, timezone
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from core.database import engine, Base, SessionLocal
from models import (
    User,
    ApplicantProfile,
    Institute,
    Scheme,
    SchemeVersion,
    SchemeCycle,
    Application,
    ApplicationDocument,
    RuleEvaluation,
    Deficiency,
    AuditLog
)
from api.v1 import api_v1_router

def init_db_and_seed():
    # 1. Create tables
    Base.metadata.create_all(bind=engine)

    # 2. Seed initial demo data if empty
    db = SessionLocal()
    try:
        if db.query(Scheme).count() == 0:
            # Seed NFST & NOS schemes
            nfst = Scheme(
                id=str(uuid.uuid4()),
                code="NFST",
                name="National Fellowship for Higher Education of ST Students",
                short_description="Financial assistance to Scheduled Tribe students for pursuing regular, full-time M.Phil. and Ph.D. degrees in Indian Universities."
            )
            nos = Scheme(
                id=str(uuid.uuid4()),
                code="NOS",
                name="National Overseas Scholarship for ST Candidates",
                short_description="Financial support to meritorious ST students for pursuing Master's and Ph.D. level courses in top-ranked overseas universities."
            )
            db.add_all([nfst, nos])
            db.flush()

            # Scheme versions
            nfst_ver = SchemeVersion(
                id=str(uuid.uuid4()),
                scheme_id=nfst.id,
                version_tag="2026.1",
                status="ACTIVE",
                effective_from=date(2026, 4, 1),
                form_schema={"sections": ["personal", "academic", "research", "bank"]},
                document_schema={"required": ["ST_CERTIFICATE", "INCOME_CERTIFICATE", "ADMISSION_LETTER"]},
                rule_schema={"income_ceiling": 600000, "max_age": 36},
                scoring_schema={"academic": 40, "research": 30, "criteria": 30},
                workflow_sla_hours={"scrutiny": 96, "institute": 120}
            )
            nos_ver = SchemeVersion(
                id=str(uuid.uuid4()),
                scheme_id=nos.id,
                version_tag="2026.1",
                status="ACTIVE",
                effective_from=date(2026, 4, 1),
                form_schema={"sections": ["personal", "foreign_uni", "visa", "bank"]},
                document_schema={"required": ["ST_CERTIFICATE", "INCOME_CERTIFICATE", "OFFER_LETTER", "PASSPORT"]},
                rule_schema={"income_ceiling": 800000, "min_marks": 55, "max_qs_rank": 500},
                scoring_schema={"academic": 50, "university_rank": 50},
                workflow_sla_hours={"scrutiny": 96, "committee": 168}
            )
            db.add_all([nfst_ver, nos_ver])
            db.flush()

            # Cycles
            nfst_cycle = SchemeCycle(
                id=str(uuid.uuid4()),
                scheme_version_id=nfst_ver.id,
                financial_year="2026-2027",
                application_start_date=datetime(2026, 4, 1, tzinfo=timezone.utc),
                application_end_date=datetime(2026, 11, 30, tzinfo=timezone.utc),
                total_slots=750,
                is_active=True
            )
            nos_cycle = SchemeCycle(
                id=str(uuid.uuid4()),
                scheme_version_id=nos_ver.id,
                financial_year="2026-2027",
                application_start_date=datetime(2026, 4, 1, tzinfo=timezone.utc),
                application_end_date=datetime(2026, 10, 31, tzinfo=timezone.utc),
                total_slots=20,
                is_active=True
            )
            db.add_all([nfst_cycle, nos_cycle])

            # Seed Institute Master
            inst = Institute(
                id=str(uuid.uuid4()),
                aishe_code="U-0355",
                name="North Orissa University (Maharaja Sriram Chandra Bhanja Deo Univ)",
                institute_type="State Public University",
                state="Odisha",
                district="Mayurbhanj",
                is_verified=True
            )
            db.add(inst)
            db.flush()

            # Seed Demo Users
            student_user = User(
                id=str(uuid.uuid4()),
                role="APPLICANT",
                full_name="Rahul Kumar",
                mobile="9876543210",
                email="rahul.kumar@tribal.gov.in",
                password_hash="mock_bcrypt",
                is_active=True
            )
            officer_user = User(
                id=str(uuid.uuid4()),
                role="SCRUTINY_OFFICER",
                full_name="Dr. Ananya Sharma",
                mobile="9998887776",
                email="ananya.sharma@tribal.gov.in",
                password_hash="mock_bcrypt",
                is_active=True
            )
            admin_user = User(
                id=str(uuid.uuid4()),
                role="ADMINISTRATOR",
                full_name="Shri R. Meena (Joint Secretary)",
                mobile="9811223344",
                email="r.meena@tribal.nic.in",
                password_hash="mock_bcrypt",
                is_active=True
            )
            db.add_all([student_user, officer_user, admin_user])
            db.flush()

            # Seed Rahul Profile
            rahul_profile = ApplicantProfile(
                id=str(uuid.uuid4()),
                user_id=student_user.id,
                aadhaar_vault_token="tok_aadhaar_8912_vault",
                dob=date(1998, 7, 14),
                gender="Male",
                category="ST",
                sub_caste="Santhal",
                father_or_guardian_name="Gopal Chandra Kumar",
                mother_name="Sunita Kumar",
                annual_family_income=240000.00,
                state_of_domicile="Odisha",
                district_of_domicile="Mayurbhanj",
                permanent_address="Vill: Baripada, Ward 4, Mayurbhanj, Odisha",
                pincode="757001",
                bank_account_hash="b7f6c382901a1829e1902830f8102a9b83019283719827391823719283918293",
                bank_ifsc="SBIN0000021",
                bank_name="State Bank of India",
                consent_dpdp_timestamp=datetime.now(timezone.utc)
            )
            db.add(rahul_profile)
            db.flush()

            # Seed Demo Application for Rahul
            demo_app = Application(
                id=str(uuid.uuid4()),
                application_number="NFST-2026-000124",
                applicant_id=rahul_profile.id,
                scheme_cycle_id=nfst_cycle.id,
                institute_id=inst.id,
                status="UNDER_SCRUTINY",
                current_stage="OFFICER_EXCEPTION_SCRUTINY",
                dynamic_form_data={
                    "full_name": "Rahul Kumar",
                    "research_topic": "Ethnomedicinal Flora of Similipal Biosphere Reserve",
                    "course_type": "PHD_REGULAR",
                    "supervisor_name": "Dr. P. K. Nayak"
                },
                calculated_merit_score=87.00,
                overall_merit_rank=42,
                category_rank=8,
                fast_tracked=False,
                submitted_at=datetime.now(timezone.utc) - timedelta(days=2),
                last_action_at=datetime.now(timezone.utc)
            )
            db.add(demo_app)
            db.flush()

            # Seed Application Documents
            st_doc = ApplicationDocument(
                id=str(uuid.uuid4()),
                application_id=demo_app.id,
                document_type="ST_CERTIFICATE",
                original_filename="Rahul_Kumar_ST_Certificate.pdf",
                storage_path=f"documents/{demo_app.id}/st_cert.pdf",
                file_size_bytes=420000,
                mime_type="application/pdf",
                sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
                source="MANUAL_UPLOAD",
                verification_status="AUTO_VERIFIED"
            )
            inc_doc = ApplicationDocument(
                id=str(uuid.uuid4()),
                application_id=demo_app.id,
                document_type="INCOME_CERTIFICATE",
                original_filename="Income_Certificate_Tehsildar.pdf",
                storage_path=f"documents/{demo_app.id}/income_cert.pdf",
                file_size_bytes=380000,
                mime_type="application/pdf",
                sha256_hash="8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4",
                source="MANUAL_UPLOAD",
                verification_status="AUTO_VERIFIED"
            )
            db.add_all([st_doc, inc_doc])

            # Seed Rule Evaluations
            r1 = RuleEvaluation(
                id=str(uuid.uuid4()),
                application_id=demo_app.id,
                rule_id="NFST-R-001",
                rule_version="2026.1",
                rule_type="ELIGIBILITY",
                result="PASS",
                reason_code="ST_CATEGORY_VERIFIED",
                explanation="Candidate confirmed as Scheduled Tribe (Santhal) from valid certificate.",
                confidence=0.99
            )
            r2 = RuleEvaluation(
                id=str(uuid.uuid4()),
                application_id=demo_app.id,
                rule_id="NFST-R-002",
                rule_version="2026.1",
                rule_type="DOCUMENT",
                result="PASS",
                reason_code="NAME_MATCH_VERIFIED",
                explanation="Extracted certificate name matches application name with 98% fuzzy similarity.",
                confidence=0.98
            )
            r3 = RuleEvaluation(
                id=str(uuid.uuid4()),
                application_id=demo_app.id,
                rule_id="NFST-R-003",
                rule_version="2026.1",
                rule_type="ELIGIBILITY",
                result="PASS",
                reason_code="AGE_WITHIN_LIMIT",
                explanation="Candidate age is 28 years (within 36-year ceiling).",
                confidence=1.00
            )
            r4 = RuleEvaluation(
                id=str(uuid.uuid4()),
                application_id=demo_app.id,
                rule_id="NFST-R-004",
                rule_version="2026.1",
                rule_type="ELIGIBILITY",
                result="PASS",
                reason_code="INCOME_CEILING_PASS",
                explanation="Annual family income of ₹2,40,000 is within ₹6,00,000 limit.",
                confidence=0.96
            )
            db.add_all([r1, r2, r3, r4])

            # Seed 50 Diverse Synthetic Scheduled Tribe Applicants (PRD Section 24)
            first_names = ["Sunita", "Amit", "Pooja", "Birsa", "Mangal", "Sita", "Bikram", "Anjali", "Karan", "Laxmi",
                           "Chandra", "Meena", "Ratan", "Deepak", "Kavita", "Suresh", "Geeta", "Arjun", "Madhu", "Ramesh"]
            last_names = ["Marandi", "Munda", "Oraon", "Gond", "Bhil", "Halba", "Hembram", "Kisku", "Tudu", "Besra",
                          "Soren", "Murmu", "Kandir", "Tete", "Toppo", "Ekka", "Minz", "Kerketta", "Bara", "Dungdung"]
            subcastes_map = {
                "Odisha": ["Santhal", "Ho", "Gond", "Kandha"],
                "Jharkhand": ["Munda", "Oraon", "Santhal", "Ho"],
                "Madhya Pradesh": ["Bhil", "Gond", "Bhilala"],
                "Chhattisgarh": ["Gond", "Halba", "Bhatra"],
                "Rajasthan": ["Mina", "Bhil", "Garasia"]
            }
            states = ["Odisha", "Jharkhand", "Madhya Pradesh", "Chhattisgarh", "Rajasthan"]
            districts_map = {
                "Odisha": "Mayurbhanj",
                "Jharkhand": "Ranchi",
                "Madhya Pradesh": "Jhabua",
                "Chhattisgarh": "Bastar",
                "Rajasthan": "Banswara"
            }
            statuses = ["SHORTLISTED", "UNDER_SCRUTINY", "DEFICIENT", "RESUBMITTED", "RECOMMENDED", "SELECTED", "SUBMITTED", "REJECTED"]
            topics = [
                "Ethnobotanical Documentation of Indigenous Medicinal Plants",
                "Preservation of Santhali Oral Traditions & Folk Epics",
                "Water Resource Management in Chota Nagpur Plateau Tribal Belts",
                "Forest Rights Act (FRA 2006) Implementation in Gondwana Region",
                "Sustainable Agroforestry Models among Bhil Communities",
                "Linguistic Documentation of Endangered Central Dravidian Dialects"
            ]

            # Check if 50 synthetic ST applicants need to be seeded
            if db.query(Application).count() <= 1:
                for idx in range(1, 51):
                    fname = first_names[idx % len(first_names)]
                    lname = last_names[idx % len(last_names)]
                    full_name = f"{fname} {lname}"
                    chosen_state = states[idx % len(states)]
                    subcaste = subcastes_map[chosen_state][idx % len(subcastes_map[chosen_state])]
                    chosen_status = statuses[idx % len(statuses)]
                    income_tier = 180000.00 + ((idx * 13500) % 360000)
                    age_val = 24 + (idx % 12)
                    merit = round(72.0 + ((idx * 2.3) % 25.0), 1)

                    u = User(
                        id=str(uuid.uuid4()),
                        role="APPLICANT",
                        full_name=full_name,
                        mobile=f"98{idx:02d}112233",
                        email=f"{fname.lower()}.{lname.lower()}{idx}@tribal.gov.in",
                        password_hash="mock_bcrypt",
                        is_active=True
                    )
                    db.add(u)
                    db.flush()

                    prof = ApplicantProfile(
                        id=str(uuid.uuid4()),
                        user_id=u.id,
                        aadhaar_vault_token=f"tok_aadhaar_{1000+idx}_vault",
                        dob=date(2026 - age_val, 5, (idx % 28) + 1),
                        gender="Female" if idx % 2 == 0 else "Male",
                        category="ST",
                        sub_caste=subcaste,
                        father_or_guardian_name=f"Shri {lname} Guardian",
                        mother_name=f"Smt. {fname} Devi",
                        annual_family_income=income_tier,
                        state_of_domicile=chosen_state,
                        district_of_domicile=districts_map[chosen_state],
                        permanent_address=f"Village Tola {idx}, {districts_map[chosen_state]}, {chosen_state}",
                        pincode=f"75{idx:04d}",
                        bank_account_hash=f"hash_bank_{idx}_{uuid.uuid4().hex[:16]}",
                        bank_ifsc="SBIN0001234",
                        bank_name="State Bank of India",
                        consent_dpdp_timestamp=datetime.now(timezone.utc)
                    )
                    db.add(prof)
                    db.flush()

                    application_no = f"NFST-2026-{100000 + idx}"
                    synth_app = Application(
                        id=str(uuid.uuid4()),
                        application_number=application_no,
                        applicant_id=prof.id,
                        scheme_cycle_id=nfst_cycle.id,
                        institute_id=inst.id,
                        status=chosen_status,
                        current_stage=chosen_status.lower() + "_stage",
                        dynamic_form_data={
                            "full_name": full_name,
                            "research_topic": topics[idx % len(topics)],
                            "course_type": "PHD_REGULAR",
                            "supervisor_name": f"Dr. Research Guide {idx}"
                        },
                        calculated_merit_score=merit,
                        overall_merit_rank=idx + 1,
                        category_rank=max(1, (idx // 4) + 1),
                        fast_tracked=chosen_status in ["SELECTED", "SHORTLISTED"],
                        submitted_at=datetime.now(timezone.utc) - timedelta(days=(idx % 10) + 1),
                        last_action_at=datetime.now(timezone.utc)
                    )
                    db.add(synth_app)

            db.commit()
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seeds
    init_db_and_seed()
    yield
    # Shutdown logic (if any)

app = FastAPI(
    title="ScholarSetu API",
    description="Intelligent, Configurable, and Auditable ST Scholarship & Fellowship Lifecycle Platform",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "project": "ScholarSetu",
        "description": "Smart Education & Fellowship Lifecycle Platform (MoTA)",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }

@app.get(f"{settings.API_V1_STR}/health")
def health_check():
    return {
        "status": "HEALTHY",
        "timestamp": datetime.now(timezone.utc),
        "database": "CONNECTED",
        "mock_dpi_services": {
            "digilocker": settings.MOCK_DIGILOCKER_ENABLED,
            "pfms": settings.MOCK_PFMS_ENABLED,
            "edistrict": settings.MOCK_EDISTRICT_ENABLED
        }
    }
