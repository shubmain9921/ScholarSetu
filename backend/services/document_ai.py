import hashlib
import uuid
from typing import Dict, Any, Optional, Tuple
from sqlalchemy.orm import Session
from thefuzz import fuzz
from models.application import ApplicationDocument, AnomalyFlag
from models.user import ApplicantProfile

class DocumentIntelligence:
    """
    Document Intelligence Subsystem (PRD Module 6 & 10).
    Responsible for OCR text ingestion, entity extraction, fuzzy comparison, and anomaly detection.
    Follows AI Governance: Zero autonomous consequential rejections.
    """

    @staticmethod
    def compute_sha256(content: bytes) -> str:
        return hashlib.sha256(content).hexdigest()

    @staticmethod
    def fuzzy_match_name(name_1: str, name_2: str) -> Tuple[float, bool]:
        """
        Calculates Token Sort Ratio and Levenshtein similarity.
        Returns: (confidence: 0.0 - 1.0, is_high_confidence: bool)
        """
        if not name_1 or not name_2:
            return 0.0, False
        
        ratio = fuzz.token_sort_ratio(name_1.strip().lower(), name_2.strip().lower()) / 100.0
        return ratio, ratio >= 0.85

    @classmethod
    def detect_anomalies(
        cls,
        app_id: str,
        sha256: str,
        bank_hash: Optional[str],
        db: Session
    ) -> Optional[Dict[str, Any]]:
        """
        Heuristic Anomaly & Duplicate Detection (PRD Module 10).
        Flag != Fraud. All flags are routed to human investigators.
        """
        # 1. Duplicate Document Hash across different applications
        dup_doc = db.query(ApplicationDocument).filter(
            ApplicationDocument.sha256_hash == sha256,
            ApplicationDocument.application_id != app_id
        ).first()

        if dup_doc:
            return {
                "flag_type": "DUPLICATE_DOCUMENT_HASH",
                "severity": "CRITICAL",
                "description": f"Uploaded file is identical (SHA-256: {sha256[:8]}...) to an existing document in Application #{dup_doc.application_id[:8]}.",
                "evidence_payload": {
                    "matched_application_id": dup_doc.application_id,
                    "matched_document_id": dup_doc.id,
                    "sha256": sha256
                }
            }

        # 2. Reused Bank Account across multiple candidates
        if bank_hash:
            dup_bank = db.query(ApplicantProfile).filter(
                ApplicantProfile.bank_account_hash == bank_hash
            ).count()
            if dup_bank > 1:
                return {
                    "flag_type": "REUSED_BANK_ACCOUNT",
                    "severity": "MEDIUM",
                    "description": f"The declared bank account is associated with {dup_bank} separate applicant profiles.",
                    "evidence_payload": {"bank_hash": bank_hash, "profile_count": dup_bank}
                }

        return None

    @classmethod
    def extract_document_entities(
        cls,
        doc_type: str,
        filename: str,
        applicant_name: str = "Rahul Kumar"
    ) -> Dict[str, Any]:
        """
        Extracts structured entities with field-level confidence scores.
        Simulates both high-confidence clean documents and Scene 4 edge cases (abbreviated names / notary stamps).
        """
        clean_type = doc_type.upper()
        lower_name = filename.lower()

        if "ST" in clean_type or "CASTE" in clean_type:
            # High-confidence Scheduled Tribe Certificate
            return {
                "document_classification": "SCHEDULED_TRIBE_CERTIFICATE",
                "extracted_fields": {
                    "candidate_name": applicant_name,
                    "category": "SCHEDULED_TRIBE",
                    "sub_caste": "Santhal",
                    "issuing_authority": "Sub-Divisional Officer, Baripada",
                    "issue_date": "2024-06-15",
                    "certificate_number": f"ST/OD/2024/{uuid.uuid4().hex[:6].upper()}"
                },
                "field_confidences": {
                    "candidate_name": 0.98,
                    "category": 0.99,
                    "issuing_authority": 0.97,
                    "issue_date": 0.95
                },
                "average_confidence": 0.972,
                "is_authority_verified": True
            }

        elif "INCOME" in clean_type:
            # Check if this simulates Scene 4 Mismatch
            is_mismatch = "mismatch" in lower_name or "notary" in lower_name or "flaw" in lower_name

            if is_mismatch:
                return {
                    "document_classification": "INCOME_CERTIFICATE",
                    "extracted_fields": {
                        "candidate_name": "Rahul K.", # Abbreviated
                        "annual_income": 240000,
                        "issuing_authority": "Notary Public Advocate", # Unauthorized
                        "issue_date": "2026-01-12",
                        "certificate_number": f"INC/NOTARY/{uuid.uuid4().hex[:6].upper()}"
                    },
                    "field_confidences": {
                        "candidate_name": 0.74, # Trigger exception review
                        "annual_income": 0.92,
                        "issuing_authority": 0.58, # Trigger deficiency
                        "issue_date": 0.90
                    },
                    "average_confidence": 0.785,
                    "is_authority_verified": False
                }
            else:
                # Scene 6: Corrected Tehsildar Income Certificate
                return {
                    "document_classification": "INCOME_CERTIFICATE",
                    "extracted_fields": {
                        "candidate_name": applicant_name,
                        "annual_income": 240000,
                        "issuing_authority": "Tahasildar, Mayurbhanj",
                        "issue_date": "2026-01-10",
                        "certificate_number": f"INC/REV/{uuid.uuid4().hex[:6].upper()}"
                    },
                    "field_confidences": {
                        "candidate_name": 0.97,
                        "annual_income": 0.96,
                        "issuing_authority": 0.96,
                        "issue_date": 0.94
                    },
                    "average_confidence": 0.958,
                    "is_authority_verified": True
                }

        # Generic Document Fallback
        return {
            "document_classification": clean_type,
            "extracted_fields": {
                "candidate_name": applicant_name,
                "document_reference": uuid.uuid4().hex[:8].upper()
            },
            "field_confidences": {"candidate_name": 0.90},
            "average_confidence": 0.90,
            "is_authority_verified": True
        }
