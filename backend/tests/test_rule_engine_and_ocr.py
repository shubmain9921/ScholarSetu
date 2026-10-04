import os
import sys
import pytest

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.rule_engine import RuleEngine
from services.synthetic_document_generator import SyntheticDocumentGenerator
from services.ocr_worker import OCRWorker
from fastapi.testclient import TestClient
from main import app

def test_rule_engine_operators():
    # 1. EQUALS
    passed, conf = RuleEngine.evaluate_operator("EQUALS", "SCHEDULED_TRIBE", "SCHEDULED_TRIBE")
    assert passed is True
    assert conf == 1.0

    # 2. IN
    passed, conf = RuleEngine.evaluate_operator("IN", "PHD_REGULAR", ["PHD_REGULAR", "MPHIL_REGULAR"])
    assert passed is True
    assert conf == 1.0

    # 3. LESS_THAN_OR_EQUAL
    passed, _ = RuleEngine.evaluate_operator("LESS_THAN_OR_EQUAL", 240000, 600000)
    assert passed is True

    failed, _ = RuleEngine.evaluate_operator("LESS_THAN_OR_EQUAL", 750000, 600000)
    assert failed is False

    # 4. FUZZY_MATCH_GTE
    match_high, score_high = RuleEngine.evaluate_operator("FUZZY_MATCH_GTE", "Rahul Kumar", "Rahul Kumar", 0.85)
    assert match_high is True
    assert score_high >= 0.95

    match_low, score_low = RuleEngine.evaluate_operator("FUZZY_MATCH_GTE", "Rahul Kumar", "Amit Singh", 0.85)
    assert match_low is False
    assert score_low < 0.85

def test_rule_catalogue_loading():
    nfst = RuleEngine.load_rule_set("NFST")
    assert nfst["scheme_code"] == "NFST"
    assert len(nfst["rules"]) >= 4

    nos = RuleEngine.load_rule_set("NOS")
    assert nos["scheme_code"] == "NOS"
    assert len(nos["rules"]) >= 4

def test_cohort_simulation_impact():
    res = RuleEngine.simulate_policy_change(
        base_income_ceiling=600000.0,
        proposed_income_ceiling=800000.0
    )
    assert res["total_cohort_evaluated"] == 12480
    assert res["currently_eligible"] > 0
    assert res["simulated_eligible"] > res["currently_eligible"]
    assert res["net_impact"] > 0
    assert res["estimated_budget_impact_cr"] > 0
    assert "Odisha" in res["state_breakdown"]
    assert "Jharkhand" in res["state_breakdown"]

def test_synthetic_document_generation():
    docs = SyntheticDocumentGenerator.generate_all_demo_documents()
    for doc_name, path in docs.items():
        assert os.path.exists(path)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            assert "<svg" in content
            assert "</svg>" in content

def test_ocr_worker_processing():
    sample_content = b"<svg>Mock ST Certificate</svg>"
    result = OCRWorker.process_document(
        content=sample_content,
        filename="st_certificate.svg",
        doc_type="ST_CERTIFICATE",
        applicant_name="Rahul Kumar"
    )
    assert result["document_classification"] == "SCHEDULED_TRIBE_CERTIFICATE"
    assert result["extracted_fields"]["candidate_name"] == "Rahul Kumar"
    assert result["extracted_fields"]["category"] == "SCHEDULED_TRIBE"
    assert result["average_confidence"] >= 0.95
    assert len(result["bounding_boxes"]) >= 2

def test_documents_api_endpoints():
    with TestClient(app) as client:
        # 1. List demo documents
        list_res = client.get("/api/v1/documents/demo-list")
        assert list_res.status_code == 200
        assert "documents" in list_res.json()

        # 2. Generate all demo documents
        gen_res = client.post("/api/v1/documents/generate-all")
        assert gen_res.status_code == 200
        assert gen_res.json()["status"] == "SUCCESS"
