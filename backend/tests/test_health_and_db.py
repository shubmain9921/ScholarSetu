import pytest
import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app

def test_full_api_suite():
    with TestClient(app) as client:
        # 1. Root & Health
        root_res = client.get("/")
        assert root_res.status_code == 200
        assert root_res.json()["project"] == "ScholarSetu"

        health_res = client.get("/api/v1/health")
        assert health_res.status_code == 200
        assert health_res.json()["status"] == "HEALTHY"

        # 2. Schemes Listing
        schemes_res = client.get("/api/v1/schemes")
        assert schemes_res.status_code == 200
        schemes = schemes_res.json()
        assert len(schemes) >= 2
        codes = [s["code"] for s in schemes]
        assert "NFST" in codes
        assert "NOS" in codes

        # 3. Eligibility Self-Check (NFST Pass)
        check_pass = client.post("/api/v1/schemes/NFST/self-check", json={
            "scheme_code": "NFST",
            "is_st_category": True,
            "annual_family_income": 240000,
            "age": 28,
            "degree_enrolled": "PhD"
        })
        assert check_pass.status_code == 200
        assert check_pass.json()["is_likely_eligible"] is True

        # 4. Eligibility Self-Check (NFST Age Fail)
        check_fail = client.post("/api/v1/schemes/NFST/self-check", json={
            "scheme_code": "NFST",
            "is_st_category": True,
            "annual_family_income": 240000,
            "age": 42, # Exceeds 36
            "degree_enrolled": "PhD"
        })
        assert check_fail.status_code == 200
        assert check_fail.json()["is_likely_eligible"] is False
        assert any("MAX_AGE" in r for r in check_fail.json()["unmet_rules"])

        # 5. Officer Scrutiny Queue
        queue_res = client.get("/api/v1/officer/queue")
        assert queue_res.status_code == 200
        qdata = queue_res.json()
        assert "metrics" in qdata
        assert len(qdata["queue"]) >= 1

        # 6. Admin Rule Simulation
        sim_res = client.post("/api/v1/admin/rules/simulate", json={
            "scheme_code": "NFST",
            "proposed_rule_overrides": [
                {"field": "annual_family_income", "operator": "<=", "value": 800000}
            ]
        })
        assert sim_res.status_code == 200
        sdata = sim_res.json()
        assert sdata["net_impact"] > 0
        assert sdata["simulated_eligible"] > sdata["currently_eligible"]

        # 7. Selection Committee Candidates & Blind Review
        comm_res = client.get("/api/v1/committee/candidates?blind_mode=true")
        assert comm_res.status_code == 200
        cands = comm_res.json()
        assert len(cands) >= 1
        assert "Candidate #" in cands[0]["display_name"]

        # 8. Grounded AI Assistant
        asst_res = client.post("/api/v1/assistant/query", json={"query": "What is the income ceiling for NFST?"})
        assert asst_res.status_code == 200
        asst_data = asst_res.json()
        assert asst_data["is_grounded"] is True
        assert "6,00,000" in asst_data["answer"]
        assert "NFST-R-004" in asst_data["citation"]

        # 9. Grievance Redressal List
        grv_res = client.get("/api/v1/grievances")
        assert grv_res.status_code == 200
        assert isinstance(grv_res.json(), list)
