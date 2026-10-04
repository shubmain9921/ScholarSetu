# ScholarSetu (स्कॉलरसेतु)

> **AI-Enabled Scholarship and Fellowship Management System for Scheduled Tribes**  
> *Smart India Hackathon (SIH 2026) — Problem Statement SIH26239*  
> **Ministry of Tribal Affairs (MoTA), Government of India**

---

## 🏛️ Core Principle

> **"AI Assists. Evidence Supports. Rules Evaluate. Humans Decide."**
> 
> ScholarSetu never allows AI to autonomously approve, reject, select, or disburse scholarships. Deterministic rules evaluate official policy; AI assists with evidence extraction and side-by-side verification; accredited human officers make consequential decisions.

---

## 🌟 Key Features

1. **Policy-as-Configuration (Deterministic Rule Engine)**:
   - Versioned JSON rule trees (`NFST-R-001` to `NFST-R-005`, `NOS-R-001` to `NOS-R-004`).
   - Zero hardcoding of policy criteria; changes are instantly auditable.
2. **Interactive Policy Simulation Sandbox**:
   - Live simulation against a realistic **12,480-applicant historical Scheduled Tribe cohort**.
   - Real-time demographic, budgetary, and exception volume impact analysis.
3. **Instant Document AI & Layout OCR**:
   - Offline synthetic vector certificate generation (ST Caste Certificate, Income Certificate, Ph.D. Admission Letter).
   - Entity extraction, bounding boxes, and confidence scoring.
   - Pre-submission alerts for unauthorized notary stamps or naming discrepancies.
4. **Exception-Based Scrutiny Console & Side-by-Side Viewer**:
   - Clean cases are fast-tracked; only flagged exceptions enter the human review queue.
   - Dual-pane layout: vector document on the left, OCR entity comparison & deterministic rule checklist on the right.
   - Immutable audit trail with cryptographic SHA-256 hashes and chronological case replay.
5. **Selection Committee Review & Conflict of Interest (COI) Gate**:
   - Blind review mode masks candidate identities for unbiased academic assessment.
   - Mandatory COI declaration gate before scoring controls unlock.
   - Standardized rubric scoring sliders (Academic 0–40, Research Feasibility 0–30, Tribal Impact 0–30).
6. **Closed-Loop Deficiency Management**:
   - Itemized 5-day correction windows preventing outright rejections for trivial administrative flaws.
7. **Citizen Charter 7-Day SLA Grievance Hub**:
   - Statutory grievance lodging, countdown clocks, and explainable resolutions citing official scheme guidelines.
8. **Grounded AI Policy Assistant**:
   - Floating assistant with zero-hallucination guarantee, providing verified citations directly from MoTA notifications.

---

## 🏗️ Technology Architecture

- **Backend**: Python 3.11+, FastAPI, SQLAlchemy 2.0, Pydantic v2, Universal SQLite/PostgreSQL support, TheFuzz.
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons.
- **Storage & Documents**: SVG-based synthetic certificate generator with offline zero-dependency vector rendering.
- **Security & Privacy**: Digital Personal Data Protection (DPDP) Act 2023 compliance, Aadhaar/DigiLocker tokenized verification.

---

## 🚀 Quickstart Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm

### 1. Clone & Set Up Backend

```bash
# Clone the repository
git clone https://github.com/shubmain9921/ScholarSetu.git
cd ScholarSetu

# Create environment configuration
cp .env.example .env

# Install Python dependencies
pip install -r backend/requirements.txt

# Run database seeding and start the backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
*API documentation available at `http://127.0.0.1:8000/docs`*

### 2. Set Up Frontend

```bash
# In a new terminal window:
cd frontend
npm install
npm run dev
```
*Web portal available at `http://localhost:3000`*

---

## 🧪 Testing

Run the automated backend test suite:
```bash
python -m pytest backend/tests/ -v
```

Run standalone policy simulation on 12,480 applicants:
```bash
python backend/services/rule_engine.py --simulate --income 800000
```

Verify frontend production build:
```bash
cd frontend
npm run build
```

---

## 🗺️ Portal Navigation & Live Demo Runbook

| Screen | Route | Description |
|---|---|---|
| **Public Landing** | `/` | Scheme catalog & 60-second eligibility self-check |
| **Apply Wizard** | `/apply/nfst` | 4-step application flow with live AI OCR inspection |
| **Student Dashboard** | `/applicant/dashboard` | Lifecycle tracker, scorecard & deficiency resubmission |
| **Grievance Hub** | `/applicant/grievance` | Citizen Charter 7-day SLA grievance tracking |
| **Officer Scrutiny** | `/officer` | Exception scrutiny queue & SLA control tower |
| **Side-by-Side Review** | `/officer/app-001` | Dual-pane case verification & case replay |
| **Selection Committee** | `/committee` | Blind review mode, COI gate & rubric evaluation |
| **Admin Rule Studio** | `/admin/rules` | Policy-as-configuration & 12,480-cohort simulation |

---

## 📜 License & Acknowledgements

Developed for the **Ministry of Tribal Affairs (MoTA)** under **Smart India Hackathon 2026** (Problem Statement SIH26239).
