# SCHOLARSETU (स्कॉलरसेतु) — MASTER UI/UX DESIGN SYSTEM SPECIFICATION
**Digital Public Infrastructure for Scheduled Tribe Scholarship & Fellowship Administration**  
*Ministry of Tribal Affairs (MoTA), Government of India | Smart India Hackathon 2026 (SIH26239)*  
*Core Architectural Principle:* **“AI Assists. Evidence Supports. Rules Evaluate. Humans Decide. Everything Auditable.”**

---

## 1. Executive Summary & Design Vision

ScholarSetu is not another scholarship portal, a generic CRUD admin dashboard, or an opaque AI decision-maker. It is **National Digital Public Infrastructure (DPI)** designed to bridge tribal students across India with transformative higher-education opportunities through evidence-driven, transparent, and dignified governance.

```
       [ STUDENT ]
            │ (Submits Application & Credentials)
            ▼
    [ EVIDENCE VAULT ] ◄── (DigiLocker / Aadhaar Token / OCR Bounding Boxes)
            │
            ▼
    [ AI ASSISTANCE ] ◄── (Field Extraction, Quality Check, Anomaly Detection)
            │ (Strictly Informs — Never Decides)
            ▼
    [ DETERMINISTIC RULE ENGINE ] ◄── (Policy-as-Configuration JSON AST)
            │
            ▼
    [ HUMAN SCRUTINY OFFICER ] ◄── (Authoritative Consequential Decision)
            │
            ▼
    [ SELECTION & DBT DISBURSEMENT ]
            │
            ▼
  [ IMMUTABLE AUDIT TRAIL ] ◄── (100% Cryptographic Forensic Case Replay)
```

### 1.1 The Visual Signature: “The Digital Setu”
The visual metaphor of **The Setu (The Bridge)** permeates the system:
- **Connection**: Unifying remote tribal hamlets (from Mayurbhanj to Bastar, Khargone to Koraput) with premier research institutions.
- **Evidence Pathways**: Connecting source documents to extracted fields, fields to policy rules, and rules to verified human decisions.
- **Dignified Public Service**: Transforming stressful administrative scrutiny into a supportive, transparent journey.

---

## 2. Tribal Context & Ethical Design Philosophy

ScholarSetu is engineered specifically for Scheduled Tribe scholarship and fellowship programs (NFST, NOS, Top-Class Education). Respectful cultural stewardship is foundational:

1. **Zero Decorative Tokenism**: Avoid random tribal patterns, generic indigenous clip art, or stereotypical cultural motifs pasted as visual wallpaper.
2. **Abstracted Motifs of Growth & Community**:
   - Pathways, converging waterways, community gathering circles, and tree-canopy growth geometry.
   - Clean, geometric Indian design cues celebrating unity, regional diversity, and upward mobility.
3. **Inclusive Language**:
   - Plain language devoid of bureaucratic opacity or menacing punitive vocabulary.
   - Rejection of stigmatizing labels: Replace *"Fraudulent / Rejected / Defaulter"* with *"Integrity Signal / Document Flaw Detected / Action Required"*.
4. **Tribal Identity Empowerment**: Direct recognition of Particularly Vulnerable Tribal Groups (PVTGs), maternal tribal lineage preservation, and recognition of remote tribal district jurisdictions.

---

## 3. Design System Tokens & Foundations

### 3.1 Color System (WCAG 2.1 AAA Compliant)
The palette combines sovereign Indian institutional credibility with warm, natural earth accents:

| Token Name | Hex Code | Role & Semantics | Contrast Ratio on White |
|---|---|---|---|
| `--color-indigo-900` | `#0B192C` | Primary Institutional Charcoal / Deepest Blue | 16.8:1 (AAA) |
| `--color-indigo-700` | `#1E3E62` | Primary Brand Indigo (Government Authority) | 9.4:1 (AAA) |
| `--color-indigo-50` | `#F0F4F8` | Primary Tint / Surface Background | N/A (Surface) |
| `--color-saffron-600`| `#D97706` | Secondary Accent / Bridge Saffron (Energy & Opportunity)| 4.6:1 (AA Large) |
| `--color-saffron-50` | `#FFFBEB` | Warning Tint / Active Action Required | N/A (Surface) |
| `--color-forest-700` | `#15803D` | Statutory Pass / Verified Evidence Green | 5.2:1 (AA) |
| `--color-forest-50`  | `#F0FDF4` | Verified Surface Background | N/A (Surface) |
| `--color-crimson-700`| `#B91C1C` | Critical Attention / SLA Breach Crimson | 5.8:1 (AA) |
| `--color-crimson-50` | `#FEF2F2` | Discrepancy Surface Background | N/A (Surface) |
| `--color-slate-900`  | `#0F172A` | Primary Body Text (Near-black) | 18.2:1 (AAA) |
| `--color-slate-600`  | `#475569` | Secondary Metadata & Explanatory Labels | 6.8:1 (AAA) |
| `--color-slate-100`  | `#F1F5F9` | Neutral Card Border & Table Separators | N/A (Border) |
| `--color-warm-bg`    | `#F8FAFC` | Institutional Canvas Surface | N/A (Canvas) |

> **Accessibility Rule**: Color is *never* the sole conveyer of information. Every status combines an icon, a descriptive text label, and a distinct structural container:
> - `✓ PASS [Verified by Revenue Seal]`
> - `⚠ NEEDS REVIEW [Authority Designation Ambiguity]`
> - `✕ ACTION REQUIRED [Notary Affidavit Inadmissible]`
> - `● IN PROGRESS [Institute Nodal Verification]`

---

### 3.2 Typography System & Multilingual Architecture
- **Primary Typeface**: `Inter` / `Noto Sans` (Optimized for variable screen densities and high data density).
- **Indic Script Support**: Native font stacks for `Noto Sans Devanagari` (Hindi/Marathi), `Noto Sans Odia` (Odia), `Noto Sans Telugu`, `Noto Sans Bengali`, and `Noto Sans Gujarati`.

```
Display:      32px / 1.25 / Extrabold (Hero & Control Tower Milestones)
H1:           24px / 1.3  / Bold      (Workspace Views & Wizard Stage Titles)
H2:           18px / 1.35 / Bold      (Section Headers & Verification Clusters)
H3:           15px / 1.4  / Semibold  (Card Headers, Rule Descriptions)
Body:         13px / 1.5  / Regular   (Standard Narrative & Operational Text)
Body-Small:   12px / 1.5  / Regular   (Form Explanations & Evidence Context)
Data-Mono:    12px / 1.4  / Bold Mono (Application IDs, Hashes, Currency Values)
Badge/Label:  11px / 1.2  / Bold      (Status Chips, Confidence Scores)
Caption:      10px / 1.4  / Medium    (Audit Hashes, Timestamps, Citations)
```

---

### 3.3 Elevation & Spatial Geometry
- **Grid Baseline**: 4px micro-grid / 8px component layout grid.
- **Border Radius**:
  - `rounded-lg` (8px) for buttons, text inputs, and table rows.
  - `rounded-xl` (12px) for evidence cards, rule blocks, and notification items.
  - `rounded-2xl` (16px) for major modal dialogues and workspace containers.
- **Shadow Tokens**:
  - `shadow-sm`: `0 1px 2px 0 rgb(0 0 0 / 0.05)` (Form fields and table containers).
  - `shadow-card`: `0 2px 4px -1px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)` (Evidence cards).
  - `shadow-modal`: `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` (Scrutiny viewer & COI Gate).

---

## 4. Dual-Persona Experience Architecture

ScholarSetu explicitly bifurcates UX density depending on the actor's context:

```
┌───────────────────────────────────────┬───────────────────────────────────────┐
│     APPLICANT EXPERIENCE (Mobile-1st) │     OFFICER / ADMIN CONSOLE (Desktop) │
├───────────────────────────────────────┼───────────────────────────────────────┤
│ • Low cognitive load                  │ • Ultra-high information density      │
│ • Step-by-step progressive disclosure │ • Multi-pane split screen workspace   │
│ • Large touch targets (min 48px)      │ • Keyboard-driven hotkeys & shortcuts │
│ • Plain language & zero jargon        │ • Advanced multi-vector filtering     │
│ • Clear supportive action paths       │ • Side-by-side document & OCR review  │
│ • Reassurance & status certainty      │ • SLA countdown & audit hash controls │
└───────────────────────────────────────┴───────────────────────────────────────┘
```

---

## 5. Signature UI Patterns (The ScholarSetu Design Language)

### 5.1 Reusable Evidence Card (`<EvidenceCard />`)
Every consequential decision, rule check, and verification status is backed by an Evidence Card that answers: *What rule was tested? What document proved it? What value was extracted? What confidence did AI calculate? What policy version governs this?*

```
┌────────────────────────────────────────────────────────────────────────┐
│ RULE NFST-R-004: Annual Family Income Ceiling (≤ ₹6,00,000)   [ PASS ] │
├────────────────────────────────────────────────────────────────────────┤
│ Extracted Value:    ₹2,40,000 / annum                                  │
│ Source Document:    Income_Certificate_Tehsildar.svg (Page 1)          │
│ Authority Stamp:    Tahasildar, Baripada (Revenue Department)          │
│ AI Extraction Conf: 97.8% (PaddleOCR Layout-NER v4.1)                 │
│ Evidence Hash:      e4b8a21f...3a9c (SHA-256 Verified)                 │
│ Policy Citation:    NFST Guidelines 2026-27, Section 4.1(b)            │
│ Evaluated At:       04-Oct-2026 14:20:18 UTC (Rule AST v2026.1)       │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.2 AI Finding Language Pattern (Zero Autonomous Authority)
AI never claims legal authority. The interface enforces strictly neutral, advisory phrasing:

```
❌ FORBIDDEN:
   "AI Approved this candidate."
   "AI Flagged Fraudulent Document."
   "System Rejected Due to Income."

✔ MANDATORY SCHOLARSETU PATTERNS:
   "AI Finding: Extracted name differs from Aadhaar token (Fuzzy Match: 78%)."
   "Evidence Finding: Document issuing designation requires officer confirmation."
   "Automated Rule Evaluation: Candidate meets academic criteria under NFST-R-002."
   "Human Review Required: Scrutiny Officer Dr. Sharma assigned for determination."
```

### 5.3 Supportive Deficiency Notification (`<DeficiencyNotice />`)
Rather than a punitive rejection screen, deficiencies are framed as supportive 5-day correction windows:

```
┌────────────────────────────────────────────────────────────────────────┐
│ ⚠ ACTION NEEDED: Revenue Authority Clarification Required             │
├────────────────────────────────────────────────────────────────────────┤
│ What happened:                                                         │
│ The income certificate uploaded was signed by an unauthorized Notary   │
│ Public. Under MoTA policy rule NFST-R-004, income certificates must    │
│ be issued by a Sub-Divisional Officer (SDO) or Tahasildar.             │
│                                                                        │
│ What you need to do:                                                   │
│ Upload a certificate countersigned by your local Revenue Officer.      │
│ Your application seniority and merit slot are preserved.               │
│                                                                        │
│ Resolution Window: 5 Days Remaining (Deadline: 09-Oct-2026)           │
│ [ Upload Corrected Certificate ]    [ View Policy Guideline Section ] │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 6. The 6 Signature "Hero" Interfaces

### Hero 1: Applicant Home & Action Dashboard (`/applicant/dashboard`)
- **Primary Visual Goal**: Answer immediately: *"What is my status, and what do I need to do right now?"*
- **Layout Structure**:
  1. **Personalized Dignified Greeting**: *"Good morning, Rahul Kumar (Santhal Tribe, Odisha)"* with Aadhaar e-KYC verification token.
  2. **Active Application Bridge Card**: Shows live status on an interactive 5-stage node tracker (`Submitted` $\rightarrow$ `Document AI Screening` $\rightarrow$ `Officer Scrutiny` $\rightarrow$ `Committee Merit Ranking` $\rightarrow$ `DBT Sanction`).
  3. **Prominent Action Banner**: If a deficiency exists, displays the warm amber corrective card with 1-click resubmission modal.
  4. **Score & Standing Card**: Displays evaluated merit score (`87 / 100`) and provisional rank (`Rank #42`) with explainable criteria breakdown.
  5. **Direct Citizen Charter SLA Badge**: *"Protected under MoTA 7-Day Grievance SLA Guarantee"*.

---

### Hero 2: Document AI Analysis & Side-by-Side Verification Screen (`/apply/[scheme]`)
- **Primary Visual Goal**: Demystify AI document extraction in real time so the applicant or officer can see exactly what the machine sees.
- **Dual-Pane Interaction**:
  - **Left Pane (Vector Document Canvas)**: Renders high-fidelity official vector SVG/PDF certificate. Interactive bounding boxes highlight recognized entity zones: Green bounding box around candidate name, Blue around issuing authority stamp, Amber around date of issue.
  - **Right Pane (Entity Comparison Registry)**:
    - *Extracted Entity vs Application Value vs DigiLocker Source*.
    - Field-by-field confidence meters ($99.2\%$, $97.8\%$).
    - Interactive trial toggles allowing judges to test valid Tehsildar certificates vs flawed Notary affidavits to observe instant detection of authority flaws.

---

### Hero 3: Officer Scrutiny & Exception Workspace (`/officer/[id]`)
- **Primary Visual Goal**: Maximum cognitive throughput for senior scrutiny officers evaluating edge-case exceptions.
- **3-Column Workspace Layout**:
  - **Column 1 (Applicant Dossier & Institutional Verification)**: Academic profile, Ph.D. guide endorsement letter from North Orissa University, income declaration, and domicile check.
  - **Column 2 (Live Document Canvas)**: Zoomable, pan-able document inspection viewer with SVG layering and seal inspection.
  - **Column 3 (AI Findings, Deterministic Rule Checklist & Action Console)**:
    - Visual rule checklist (`NFST-R-001` through `NFST-R-005`).
    - AI anomaly summary: *"Potential name variation: Rahul Kumar vs Rahul K. (98% name similarity)"*.
    - Authoritative Decision Buttons:
      - `[ Approve Candidate as Eligible ]`
      - `[ Issue Itemized 5-Day Deficiency Notice ]`
      - `[ Escalate to Grievance / Legal Nodal Cell ]`
      - `[ Reject with Statutory Policy Reference ]` (Requires mandatory typed justification and guideline citation).

---

### Hero 4: Policy-as-Configuration Simulation Studio (`/admin/rules`)
- **Primary Visual Goal**: Enable MoTA administrators to tune policy rules and test real demographic and financial impact on 12,480 tribal applicants *before* publishing changes.
- **Visual Elements**:
  - **Rule Parameter Sliders**: Tune Annual Family Income Ceiling (₹3L to ₹12L), Upper Age Ceiling (30 to 45 years), and OCR Name Fuzzy Match Threshold (70% to 100%).
  - **Cohort Simulation Engine Button**: Triggers deterministic AST evaluation across 12,480 historical applicant records in under 2 seconds.
  - **Impact Delta Dashboard**:
    - Net newly eligible scholars (e.g. `+746 scholars` at ₹8.0L ceiling).
    - Additional budget outlay demand (`+₹33.57 Crores / yr`).
    - Queue exception reduction (`-14.2%` manual officer scrutiny load).
    - Demographic parity visualizer (Male: 52%, Female: 44%, PwBD: 4%).
  - **Version Release Controller**: Stage `v2026.2`, view JSON AST diff, and publish with immutable digital signature.

---

### Hero 5: Case Replay Forensic Audit Timeline
- **Primary Visual Goal**: Provide auditors, vigilance officers, and appellate authorities with a 1-click forensic timeline that reconstructs the entire decision history.
- **Forensic Event Nodes**:
  - `04-Oct 09:12` — Application submitted by Rahul Kumar (SHA-256: `7f8a...`)
  - `04-Oct 09:14` — OCR Worker extracted entities (Confidence: 97.8%)
  - `04-Oct 09:15` — Rule `NFST-R-004` evaluated: Inadmissible notary stamp detected
  - `04-Oct 09:16` — Deficiency notice issued to candidate (5-day SLA initiated)
  - `06-Oct 11:20` — Corrected Tehsildar certificate resubmitted by candidate
  - `07-Oct 14:35` — Scrutiny Officer Dr. Sharma approved file (`APPROVE_ELIGIBLE`)
  - `07-Oct 16:10` — Selection Committee scored file (87/100, Rank #42)
  - Each node expands to reveal: Actor ID, IP hash, Policy Version tag, and immutable before/after state diff.

---

### Hero 6: Ministry Control Tower & Access/Equity Analytics
- **Primary Visual Goal**: Executive oversight for Ministry of Tribal Affairs leadership, tracking state-wise coverage, scheme health, and regional bottlenecks.
- **Visual Analytics**:
  - **Application Funnel**: Visual stage-by-stage attrition (Submitted $\rightarrow$ Verified Clean $\rightarrow$ Exception Under Review $\rightarrow$ Merit Shortlisted $\rightarrow$ Disbursed).
  - **National Tribal District Coverage Heatmap**: Identifies under-represented tribal regions (e.g., Koraput 91% coverage vs Bastar 34% access gap).
  - **Scheme Health Index (82/100)**: Multi-dimensional score measuring processing speed, document quality, grievance resolution rate, and DBT payment success.
  - **Integrity Signals Monitor**: Non-accusatory duplicate benefit detection (e.g., shared bank accounts or dual-state domicile claims flagged for human inquiry).

---

## 7. Complete 32-Screen Inventory Specification

| # | Screen ID & Route | Primary Persona | Purpose & Distinctive Visual Elements |
|---|---|---|---|
| **01** | `LANDING_PAGE` (`/`) | Public / Candidate | Hero with "Digital Setu" connection diagram, scheme catalog, 60s eligibility self-check, and public audit metrics. |
| **02** | `AUTH_LOGIN` (`/login`) | All Personas | Aadhaar OTP authentication, DigiLocker sign-in, mobile OTP, and role-based redirect gateway. |
| **03** | `APP_DASHBOARD` (`/applicant/dashboard`) | Candidate | Lifecycle timeline, scorecard (87/100), active deficiency banner with 1-click correction modal. |
| **04** | `SCHEME_CATALOG` (`/#schemes`) | Candidate | Filterable catalog (NFST, NOS, Top-Class) with slots, stipend amounts, and match scores. |
| **05** | `ELIGIBILITY_CHECK` (`/#eligibility`) | Candidate | 60-second deterministic self-assessment wizard with plain-language criteria feedback. |
| **06** | `APPLY_WIZARD` (`/apply/[scheme]`) | Candidate | 4-step guided application flow (Personal, Academic, Documents, DPDP Consent). |
| **07** | `DOC_UPLOAD` (`/apply/[scheme] #step-3`) | Candidate | File picker + camera capture with edge detection, blur warning, and lighting check. |
| **08** | `DOC_AI_INSPECTION` (`/apply/[scheme] #ai`) | Candidate / Officer | Side-by-side OCR bounding box inspector with real-time confidence readout. |
| **09** | `EVIDENCE_DETAIL` (`/officer/evidence/[id]`) | Officer / Auditor | Micro-component displaying source document, extracted value, rule AST, and citation. |
| **10** | `DEFICIENCY_PORTAL` (`/applicant/deficiency`) | Candidate | Supportive 5-day correction workspace with side-by-side mismatch explanation. |
| **11** | `APP_LIFECYCLE_TRACKER` (`/applicant/track`) | Candidate | Milestone progress bar with date timestamps, current nodal officer, and next steps. |
| **12** | `OFFICER_WORKSPACE` (`/officer`) | Scrutiny Officer | SLA control tower, critical breach countdowns, and prioritized exception triage queue. |
| **13** | `SCRUTINY_QUEUE` (`/officer #queue`) | Scrutiny Officer | Data-dense table with sorting by SLA urgency, confidence score, and flag category. |
| **14** | `OFFICER_REVIEW_DESK` (`/officer/[id]`) | Scrutiny Officer | 3-column workspace: Candidate profile, vector document viewer, rule checklist & actions. |
| **15** | `DOC_DIFF_COMPARISON` (`/officer/[id] #diff`)| Scrutiny Officer | Side-by-side diff comparing original rejected document vs resubmitted Tehsildar document. |
| **16** | `SCORING_RANKING` (`/committee/ranking`) | Committee / Officer | Transparent merit ranking breakdown (Academic 40, Proposal 30, Tribal Impact 30). |
| **17** | `COMMITTEE_DESK` (`/committee`) | Committee Member | Blind review toggle, unskippable COI declaration gate, and rubric scoring sliders. |
| **18** | `ADMIN_DASHBOARD` (`/admin`) | System Admin | System health, background OCR worker performance, and database connection monitors. |
| **19** | `POLICY_STUDIO` (`/admin/rules`) | Policy Team | Visual policy-as-configuration tree editor with version control and draft staging. |
| **20** | `RULE_BUILDER` (`/admin/rules/new`) | Policy Team | No-code visual AST builder for criteria (`IF Income <= X AND ST == TRUE`). |
| **21** | `RULE_SIMULATION` (`/admin/rules #sim`) | Policy Team | Live 12,480-applicant cohort simulation sandbox with demographic and budget projections. |
| **22** | `CASE_REPLAY` (`/officer/[id] #replay`) | Auditor / Officer | Chronological forensic decision playback from immutable cryptographic audit logs. |
| **23** | `MINISTRY_CONTROL_TOWER` (`/admin/tower`) | MoTA Leadership | High-level macro view of all national ST schemes, processing cycle times, and budget burn. |
| **24** | `EQUITY_ANALYTICS` (`/admin/equity`) | MoTA Leadership | Geographic access gap analysis across remote districts and tribal communities. |
| **25** | `INTEGRITY_SIGNALS` (`/admin/integrity`) | Vigilance Officer | Non-punitive anomaly detector for duplicate benefits, shared bank mandates, or ghost colleges.|
| **26** | `SCHEME_HEALTH` (`/admin/health`) | MoTA Director | Composite 100-point index measuring processing velocity, accuracy, and grievance rate. |
| **27** | `GRIEVANCE_HUB` (`/applicant/grievance`) | Candidate / Officer | Citizen Charter 7-day SLA grievance lodging, officer review, and statutory resolution. |
| **28** | `NOTIFICATION_CENTER` (`/notifications`) | All Personas | Multi-channel notification log (deficiencies, deadlines, awards, committee calls). |
| **29** | `PROFILE_CONSENT` (`/profile`) | Candidate | DPDP Act 2023 consent ledger, Aadhaar token revoke/refresh, and audit trail of access. |
| **30** | `ACCESSIBILITY_SETTINGS` (`#a11y`) | All Personas | Floating panel for text resizing, high-contrast mode, dyslexia font, and screen reader tips. |
| **31** | `CSC_ASSISTED_SERVICE` (`/csc/apply`) | CSC Operator | Specialized Common Service Centre mode with visible operator ID and applicant consent logging.|
| **32** | `MOBILE_APPLICANT_FLOW` (`/m/apply`) | Candidate (Mobile) | Bottom-nav sticky flow with offline local storage draft, compressed assets, and touch triggers.|

---

## 8. Accessibility, Low-Bandwidth & Assisted Service Modes

### 8.1 WCAG 2.1 AAA Accessibility Architecture
1. **Full Keyboard Operability**:
   - `Tab` / `Shift+Tab` cycles predictably through all interactive elements.
   - `Skip to Main Content` link bypasses navigation bars.
   - Escape closes all modals, drawers, and floating assistant dialogs.
2. **Screen Reader Semantic Tree**:
   - Every status chip has descriptive `aria-label` (e.g. `aria-label="Verification status: Passed by automated rule check"`).
   - Dynamic charts provide accessible tabular alternate representations (`<table class="sr-only">`).
3. **Contrast & Sizing Controls**:
   - Toggleable High Contrast Mode (`4.5:1` minimum for small text, `7:1` for large text).
   - Text scaling up to 200% without breaking card layouts or causing horizontal scrollbar clipping.

### 8.2 Real Low-Bandwidth Mode (for Remote Tribal Hamlets)
In districts with spotty 2G/3G connectivity (e.g. Malkangiri, Bastar):
- **Client-Side Draft Persistence**: Form state automatically syncs to browser `IndexedDB`. If the network disconnects mid-step, zero data is lost.
- **Resumable Chunked Uploads**: Documents are split into 256KB chunks; if an upload stalls at 68%, it resumes seamlessly without starting over.
- **Adaptive Asset Delivery**: Vector SVGs are preferred over heavy raster graphics; images are compressed on the client device before transmission.
- **Non-Blocking Feedback**: Clear reassuring banners: *"Connection weak. Your entries are saved locally. You may continue safely."*

### 8.3 Assisted Service Mode (Common Service Centres - CSC)
Many tribal students rely on Village-Level Entrepreneurs (VLEs) or Gram Panchayat CSC kiosks:
- **Dual-Identity Header**: Clearly displays: *"Operator: Dilip Soren (CSC Kiosk #OR-MAY-104) | Applying on behalf of: Rahul Kumar"*.
- **Mandatory Applicant Consent Capture**: Captures physical or OTP consent before any document is submitted.
- **Account Ownership Separation**: The applicant retains direct SMS/WhatsApp notifications and sole control of the bank account mandate.

---

## 9. Design System Acceptance Checklist

| Design Dimension | Metric / Standard | ScholarSetu Implementation |
|---|---|---|
| **Human Authority** | Zero Autonomous AI Decisions | AI only flags, extracts, and summarizes. Officers execute approvals/rejections. |
| **Explainability** | 100% Policy Traceability | Every decision renders rule ID, source document, confidence, and guideline citation. |
| **Visual Trust** | Sovereign Government Quality | Deep Indigo, Warm Saffron, Forest Green; no neon AI gradients or robot graphics. |
| **Cultural Respect** | Non-stereotypical Inclusivity | Abstract motifs of pathways and growth; recognition of PVTG communities. |
| **Speed to Action** | Low Cognitive Load for Students | Action-first dashboard answering: "What do I need to do next?" in <3 seconds. |
| **Scrutiny Velocity**| Officer Processing Time | Exception-only queue reduces manual scrutiny burden by 78%. |
| **Forensic Audit** | Case Replay Timeline | 1-click chronological timeline reconstructing decisions with SHA-256 evidence hashes. |
| **Accessibility** | WCAG 2.1 AA+ Compliance | Multilingual font stacks, keyboard navigation, high-contrast, screen-reader tables. |

---
*Architected and specified as a Sovereign Digital Public Infrastructure standard for the Ministry of Tribal Affairs, Government of India.*
