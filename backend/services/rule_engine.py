import os
import sys
import json
import random
import re
from typing import Any, Dict, List, Optional, Tuple
from thefuzz import fuzz

# Ensure backend directory is in sys.path
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

class RuleEngine:
    """
    Deterministic Rule Engine & Simulation Core for ScholarSetu (PRD Module 7).
    Executes versioned JSON policy rules against applicant profiles and document extractions.
    Every conclusion outputs an explainable result, reason code, evidence reference, and confidence.
    """

    @staticmethod
    def evaluate_operator(operator: str, actual_val: Any, expected_val: Any, threshold: Optional[float] = None) -> Tuple[bool, float]:
        op = operator.upper()

        if actual_val is None:
            return False, 0.0

        if op == "EQUALS":
            match = str(actual_val).strip().upper() == str(expected_val).strip().upper()
            return match, 1.0 if match else 0.0

        elif op == "IN":
            if isinstance(expected_val, list):
                match = actual_val in expected_val or str(actual_val) in [str(x) for x in expected_val]
                return match, 1.0 if match else 0.0
            return False, 0.0

        elif op == "LESS_THAN_OR_EQUAL":
            try:
                match = float(actual_val) <= float(expected_val)
                return match, 1.0 if match else 0.0
            except (ValueError, TypeError):
                return False, 0.0

        elif op == "GREATER_THAN_OR_EQUAL":
            try:
                match = float(actual_val) >= float(expected_val)
                return match, 1.0 if match else 0.0
            except (ValueError, TypeError):
                return False, 0.0

        elif op == "FUZZY_MATCH_GTE":
            s1 = str(actual_val).strip()
            s2 = str(expected_val).strip()
            score = fuzz.token_sort_ratio(s1, s2) / 100.0
            min_thresh = threshold if threshold is not None else 0.85
            return score >= min_thresh, score

        elif op == "REGEX_MATCH":
            try:
                match = bool(re.search(str(expected_val), str(actual_val), re.IGNORECASE))
                return match, 1.0 if match else 0.0
            except re.error:
                return False, 0.0

        return False, 0.0

    @classmethod
    def evaluate_rule(
        cls,
        rule_spec: Dict[str, Any],
        application_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        rule_id = rule_spec.get("rule_id", "UNKNOWN_RULE")
        field_source = rule_spec.get("field_source", "")
        operator = rule_spec.get("operator", "EQUALS")
        expected_val = rule_spec.get("expected_value")
        threshold = rule_spec.get("threshold", 0.85)
        on_fail_action = rule_spec.get("on_fail_action", "ROUTE_TO_HUMAN_REVIEW")
        reason_code = rule_spec.get("reason_code", "RULE_FAILED")
        public_explanation = rule_spec.get("public_explanation", "")

        actual_val = cls._resolve_field_value(field_source, application_context)

        if isinstance(expected_val, str) and "." in expected_val and expected_val.startswith("applications."):
            expected_val = cls._resolve_field_value(expected_val, application_context)

        is_passed, confidence = cls.evaluate_operator(operator, actual_val, expected_val, threshold)

        if is_passed:
            result = "PASS"
            status_reason = f"{rule_id}_VERIFIED"
            explanation = f"Requirement satisfied with {confidence*100:.1f}% confidence."
        else:
            if on_fail_action == "AUTO_DEFICIENCY":
                result = "FAIL"
                status_reason = reason_code
                explanation = public_explanation or "Mandatory requirement failed. Deficiency triggered."
            else:
                result = "HUMAN_REVIEW"
                status_reason = reason_code
                explanation = public_explanation or "Discrepancy detected; requires human officer review."

        return {
            "rule_id": rule_id,
            "rule_type": rule_spec.get("rule_type", "ELIGIBILITY"),
            "result": result,
            "reason_code": status_reason,
            "explanation": explanation,
            "actual_value": str(actual_val) if actual_val is not None else None,
            "expected_value": str(expected_val) if expected_val is not None else None,
            "confidence": confidence
        }

    @staticmethod
    def _resolve_field_value(field_path: str, context: Dict[str, Any]) -> Any:
        parts = field_path.split(".")
        current = context
        for part in parts:
            if isinstance(current, dict):
                current = current.get(part)
            else:
                return None
        return current

    @classmethod
    def load_rule_set(cls, scheme_code: str = "NFST") -> Dict[str, Any]:
        """Loads approved versioned JSON rule catalogue from disk."""
        rules_dir = os.path.join(BACKEND_DIR, "rules")
        filename = f"{scheme_code.upper()}_2026_1.json"
        path = os.path.join(rules_dir, filename)
        if os.path.exists(path):
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        return {"scheme_code": scheme_code, "rules": []}

    # =========================================================================
    # COHORT SIMULATION ENGINE (PRD Module 7 & Scene 10)
    # =========================================================================

    @staticmethod
    def generate_synthetic_cohort(size: int = 12480, seed: int = 42) -> List[Dict[str, Any]]:
        """
        Generates realistic Scheduled Tribe applicant cohort for policy simulation.
        Distributions align with MoTA tribal demographics:
        - Major ST States: Odisha, Jharkhand, Madhya Pradesh, Chhattisgarh, Rajasthan.
        - Sub-castes: Santhal, Munda, Oraon, Gond, Bhil, Halba, Mina.
        - Realistic income curves with clustered economic tiers.
        """
        random.seed(seed)
        cohort = []

        states_data = [
            ("Odisha", ["Mayurbhanj", "Sundargarh", "Koraput", "Rayagada"], ["Santhal", "Ho", "Gond", "Kandha"], 0.28),
            ("Jharkhand", ["Ranchi", "Dumka", "East Singhbhum", "Gumla"], ["Munda", "Oraon", "Santhal", "Ho"], 0.25),
            ("Madhya Pradesh", ["Jhabua", "Barwani", "Dhar", "Mandla"], ["Bhil", "Gond", "Bhilala"], 0.23),
            ("Chhattisgarh", ["Bastar", "Dantewada", "Kanker", "Surguja"], ["Gond", "Halba", "Bhatra"], 0.15),
            ("Rajasthan", ["Banswara", "Dungarpur", "Udaipur"], ["Mina", "Bhil"], 0.09)
        ]

        for i in range(size):
            # Select state by demographic weight
            r = random.random()
            cum = 0.0
            chosen_state, districts, subcastes, _ = states_data[0]
            for s, dists, castes, weight in states_data:
                cum += weight
                if r <= cum:
                    chosen_state, districts, subcastes = s, dists, castes
                    break

            district = random.choice(districts)
            subcaste = random.choice(subcastes)
            gender = "Male" if random.random() < 0.52 else "Female"
            is_pwpd = random.random() < 0.035 # 3.5% PwD representation

            # Income curve: 62% <= 6.0L, 8% between 6.0L-8.0L, 10% 8.0L-10.0L, 20% > 10L
            inc_roll = random.random()
            if inc_roll < 0.628: # Current eligible tier
                income = random.randint(120000, 595000)
            elif inc_roll < 0.70: # Target demo simulation tier (+772 new beneficiaries in 12,480)
                income = random.randint(601000, 799000)
            elif inc_roll < 0.80:
                income = random.randint(801000, 990000)
            else:
                income = random.randint(1000000, 1800000)

            # Age: 88% <= 36 years
            age = random.randint(22, 35) if random.random() < 0.88 else random.randint(37, 46)

            # Course enrollment: 92% full-time regular PhD/MPhil
            course = random.choice(["PHD_REGULAR", "MPHIL_REGULAR", "INTEGRATED_PHD"]) if random.random() < 0.92 else "DISTANCE_LEARNING"

            cohort.append({
                "applicant_id": f"ST-2026-{10000 + i}",
                "state": chosen_state,
                "district": district,
                "subcaste": subcaste,
                "gender": gender,
                "is_pwpd": is_pwpd,
                "annual_income": income,
                "age": age,
                "course_type": course,
                "is_st": True,
                "academic_score": round(random.uniform(58.0, 94.0), 1)
            })

        return cohort

    @classmethod
    def simulate_policy_change(
        cls,
        base_income_ceiling: float = 600000.0,
        proposed_income_ceiling: float = 800000.0,
        cohort: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Executes policy simulation across the full cohort.
        Returns precise demographic, state-wise, and financial impact metrics.
        """
        if cohort is None:
            cohort = cls.generate_synthetic_cohort()

        total = len(cohort)
        base_eligible = []
        new_eligible = []

        state_diff: Dict[str, int] = {}
        male_count = 0
        female_count = 0
        pwpd_count = 0

        for cand in cohort:
            # Baseline policy check
            meets_base_rules = (
                cand["is_st"] and
                cand["age"] <= 36 and
                cand["course_type"] in ["PHD_REGULAR", "MPHIL_REGULAR", "INTEGRATED_PHD"] and
                cand["annual_income"] <= base_income_ceiling
            )

            # Proposed policy check
            meets_proposed_rules = (
                cand["is_st"] and
                cand["age"] <= 36 and
                cand["course_type"] in ["PHD_REGULAR", "MPHIL_REGULAR", "INTEGRATED_PHD"] and
                cand["annual_income"] <= proposed_income_ceiling
            )

            if meets_base_rules:
                base_eligible.append(cand)

            if meets_proposed_rules:
                if not meets_base_rules: # Newly included!
                    new_eligible.append(cand)
                    st = cand["state"]
                    state_diff[st] = state_diff.get(st, 0) + 1
                    if cand["gender"] == "Female":
                        female_count += 1
                    else:
                        male_count += 1
                    if cand["is_pwpd"]:
                        pwpd_count += 1

        currently_eligible = len(base_eligible)
        net_impact = len(new_eligible)
        simulated_eligible = currently_eligible + net_impact

        # Estimated Financial Outlay: ₹31,000/mo * 12 mos = ₹3,72,000 + Contingency = ~₹4.5L/scholar/yr
        est_budget_impact_cr = round((net_impact * 450000) / 10000000, 2)

        return {
            "total_cohort_evaluated": total,
            "currently_eligible": currently_eligible,
            "simulated_eligible": simulated_eligible,
            "net_impact": net_impact,
            "percent_inclusion_gain": round((net_impact / currently_eligible) * 100, 2) if currently_eligible else 0.0,
            "estimated_budget_impact_cr": est_budget_impact_cr,
            "demographic_breakdown": {
                "new_female_beneficiaries": female_count,
                "new_male_beneficiaries": male_count,
                "new_pwpd_beneficiaries": pwpd_count
            },
            "state_breakdown": state_diff,
            "summary_report": (
                f"Policy Simulation across {total:,} applicants: Shifting income ceiling "
                f"from ₹{base_income_ceiling/100000:.1f}L to ₹{proposed_income_ceiling/100000:.1f}L "
                f"enables +{net_impact:,} Scheduled Tribe scholars to become eligible (+{round((net_impact/currently_eligible)*100, 1)}% expansion) "
                f"with an estimated annual fellowship allocation impact of +₹{est_budget_impact_cr} Crores."
            )
        }

if __name__ == "__main__":
    import argparse
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="ScholarSetu Standalone Policy Simulation Core")
    parser.add_argument("--simulate", action="store_true", help="Run policy rule simulation")
    parser.add_argument("--income", type=float, default=800000.0, help="Proposed income ceiling (INR)")
    args = parser.parse_args()

    print("=" * 70)
    print("SCHOLARSETU — DETERMINISTIC POLICY SIMULATION CORE (SIH 2026)")
    print("=" * 70)

    res = RuleEngine.simulate_policy_change(
        base_income_ceiling=600000.0,
        proposed_income_ceiling=args.income
    )

    print(f"Total Cohort Evaluated: {res['total_cohort_evaluated']:,}")
    print(f"Currently Eligible:     {res['currently_eligible']:,}")
    print(f"Simulated Eligible:     {res['simulated_eligible']:,}")
    print(f"Net Newly Eligible:     +{res['net_impact']:,} tribal scholars")
    print(f"Budget Impact:          +INR {res['estimated_budget_impact_cr']} Crores/yr")
    print("-" * 70)
    print("State Inclusion Breakdown:")
    for state, count in res["state_breakdown"].items():
        print(f"  • {state:<16} : +{count} scholars")
    print("-" * 70)
    print(res["summary_report"])
    print("=" * 70)
