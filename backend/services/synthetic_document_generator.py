import os
import sys
import uuid
from typing import Dict, Any

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STATIC_DOCS_DIR = os.path.join(BACKEND_DIR, "static", "demo_documents")

class SyntheticDocumentGenerator:
    """
    Synthetic Government Document & Certificate Generator (PRD Section 76).
    Generates realistic, official-looking Scheduled Tribe certificates,
    income certificates, and admission letters for offline SIH testing and demonstration.
    Generates high-resolution SVG and HTML vector certificates.
    """

    @classmethod
    def ensure_output_dir(cls):
        os.makedirs(STATIC_DOCS_DIR, exist_ok=True)

    @classmethod
    def generate_st_certificate(
        cls,
        candidate_name: str = "Rahul Kumar",
        father_name: str = "Gopal Chandra Kumar",
        sub_caste: str = "Santhal",
        district: str = "Mayurbhanj",
        state: str = "Odisha"
    ) -> str:
        cls.ensure_output_dir()
        cert_no = f"ST/{state[:2].upper()}/2024/{uuid.uuid4().hex[:6].upper()}"

        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <style>
      .title {{ font-family: 'Times New Roman', serif; font-size: 20px; font-weight: bold; fill: #1e293b; text-anchor: middle; }}
      .sub {{ font-family: 'Times New Roman', serif; font-size: 13px; fill: #475569; text-anchor: middle; }}
      .body {{ font-family: 'Times New Roman', serif; font-size: 15px; fill: #0f172a; line-height: 1.8; }}
      .field {{ font-family: 'Courier New', monospace; font-weight: bold; fill: #14532d; }}
      .seal {{ font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; fill: #047857; text-anchor: middle; }}
    </style>
  </defs>

  <!-- Border & Paper -->
  <rect x="15" y="15" width="770" height="1070" fill="#fffdfa" stroke="#047857" stroke-width="4" rx="8" />
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#d1fae5" stroke-width="2" />

  <!-- Government Header -->
  <circle cx="400" cy="85" r="35" fill="#047857" opacity="0.08" />
  <text x="400" y="80" class="sub" font-size="11">GOVERNMENT OF {state.upper()}</text>
  <text x="400" y="102" class="title">REVENUE &amp; DISASTER MANAGEMENT DEPARTMENT</text>
  <text x="400" y="125" class="sub">OFFICE OF THE SUB-DIVISIONAL MAGISTRATE, BARIPADA</text>
  <line x1="150" y1="140" x2="650" y2="140" stroke="#047857" stroke-width="1.5" />

  <!-- Certificate Heading -->
  <rect x="220" y="160" width="360" height="35" fill="#ecfdf5" stroke="#059669" stroke-width="1" rx="4" />
  <text x="400" y="184" class="title" font-size="16" fill="#065f46">COMMUNITY (SCHEDULED TRIBE) CERTIFICATE</text>

  <!-- Certificate Metadata -->
  <text x="60" y="235" font-family="Arial" font-size="12" fill="#64748b">Certificate No: <tspan class="field">{cert_no}</tspan></text>
  <text x="620" y="235" font-family="Arial" font-size="12" fill="#64748b">Date: <tspan font-weight="bold" fill="#0f172a">15-Jun-2024</tspan></text>

  <!-- Main Legal Text -->
  <text x="60" y="300" class="body">This is to certify that Shri / Smt. <tspan class="field" font-size="16">{candidate_name}</tspan>,</text>
  <text x="60" y="340" class="body">Son/Daughter of Shri <tspan class="field">{father_name}</tspan>, residing at Village: <tspan class="field">Baripada</tspan>,</text>
  <text x="60" y="380" class="body">District: <tspan class="field">{district}</tspan> in the State of <tspan class="field">{state}</tspan> belongs to the</text>

  <!-- Caste Highlight Box -->
  <rect x="60" y="415" width="680" height="48" fill="#f0fdf4" stroke="#86efac" stroke-width="1" rx="6" />
  <text x="400" y="446" class="title" font-size="18" fill="#15803d">{sub_caste.upper()} (SCHEDULED TRIBE)</text>

  <text x="60" y="500" class="body">community which is recognized as a Scheduled Tribe under the Constitution</text>
  <text x="60" y="535" class="body">(Scheduled Tribes) Order, 1950 as amended from time to time.</text>

  <text x="60" y="600" class="body">2. Shri <tspan class="field">{candidate_name}</tspan> and his family ordinarily reside in the</text>
  <text x="60" y="635" class="body"><tspan class="field">{district}</tspan> District of the State of <tspan class="field">{state}</tspan>.</text>

  <!-- QR Code Mock Vector -->
  <rect x="60" y="760" width="100" height="100" fill="#0f172a" />
  <rect x="70" y="770" width="30" height="30" fill="#ffffff" />
  <rect x="78" y="778" width="14" height="14" fill="#0f172a" />
  <rect x="120" y="770" width="30" height="30" fill="#ffffff" />
  <rect x="128" y="778" width="14" height="14" fill="#0f172a" />
  <rect x="70" y="820" width="30" height="30" fill="#ffffff" />
  <rect x="78" y="828" width="14" height="14" fill="#0f172a" />
  <rect x="115" y="815" width="35" height="35" fill="#ffffff" />
  <rect x="120" y="820" width="25" height="25" fill="#0f172a" />
  <text x="110" y="880" class="seal">e-Pramaan QR</text>

  <!-- Digital Seal & Authority -->
  <circle cx="650" cy="810" r="48" fill="none" stroke="#047857" stroke-width="2" stroke-dasharray="4 2" />
  <circle cx="650" cy="810" r="42" fill="#f0fdf4" stroke="#047857" stroke-width="1" />
  <text x="650" y="805" class="seal">DIGITALLY SIGNED</text>
  <text x="650" y="820" class="seal">GOVT OF {state.upper()}</text>
  <text x="650" y="880" class="sub" font-weight="bold">Sub-Divisional Magistrate</text>
  <text x="650" y="898" class="sub">Baripada, Mayurbhanj</text>

  <!-- Footer Notice -->
  <line x1="50" y1="1020" x2="750" y2="1020" stroke="#e2e8f0" stroke-width="1" />
  <text x="400" y="1045" class="sub" font-size="10">This digital certificate is legally valid under the Information Technology Act 2000. Verified on National DigiLocker Repository.</text>
</svg>"""

        output_path = os.path.join(STATIC_DOCS_DIR, "st_certificate_valid.svg")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        return output_path

    @classmethod
    def generate_valid_income_certificate(
        cls,
        candidate_name: str = "Rahul Kumar",
        annual_income: int = 240000,
        district: str = "Mayurbhanj"
    ) -> str:
        cls.ensure_output_dir()
        cert_no = f"INC/OD/REV/{uuid.uuid4().hex[:6].upper()}"

        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <style>
      .title {{ font-family: 'Times New Roman', serif; font-size: 20px; font-weight: bold; fill: #1e293b; text-anchor: middle; }}
      .sub {{ font-family: 'Times New Roman', serif; font-size: 13px; fill: #475569; text-anchor: middle; }}
      .body {{ font-family: 'Times New Roman', serif; font-size: 15px; fill: #0f172a; line-height: 1.8; }}
      .field {{ font-family: 'Courier New', monospace; font-weight: bold; fill: #1e3a8a; }}
      .seal {{ font-family: 'Arial', sans-serif; font-size: 10px; font-weight: bold; fill: #1d4ed8; text-anchor: middle; }}
    </style>
  </defs>

  <rect x="15" y="15" width="770" height="1070" fill="#fffdfa" stroke="#1d4ed8" stroke-width="4" rx="8" />
  <rect x="25" y="25" width="750" height="1050" fill="none" stroke="#dbeafe" stroke-width="2" />

  <text x="400" y="80" class="sub" font-size="11">GOVERNMENT OF ODISHA</text>
  <text x="400" y="102" class="title">OFFICE OF THE TAHASILDAR, MAYURBHANJ</text>
  <text x="400" y="125" class="sub">MISCELLANEOUS REVENUE CASE NO. {uuid.uuid4().hex[:8].upper()}</text>
  <line x1="150" y1="140" x2="650" y2="140" stroke="#1d4ed8" stroke-width="1.5" />

  <rect x="260" y="160" width="280" height="35" fill="#eff6ff" stroke="#2563eb" stroke-width="1" rx="4" />
  <text x="400" y="184" class="title" font-size="16" fill="#1e40af">INCOME CERTIFICATE</text>

  <text x="60" y="235" font-family="Arial" font-size="12" fill="#64748b">Certificate Ref: <tspan class="field">{cert_no}</tspan></text>
  <text x="620" y="235" font-family="Arial" font-size="12" fill="#64748b">Date: <tspan font-weight="bold" fill="#0f172a">10-Jan-2026</tspan></text>

  <text x="60" y="300" class="body">This is to certify that upon due revenue enquiry, the total annual family income</text>
  <text x="60" y="340" class="body">from all sources of Shri <tspan class="field" font-size="16">{candidate_name}</tspan>, resident of Baripada, Mayurbhanj,</text>
  <text x="60" y="380" class="body">for the Financial Year 2025–2026 is assessed as:</text>

  <!-- Income Box -->
  <rect x="60" y="415" width="680" height="52" fill="#f0f9ff" stroke="#7dd3fc" stroke-width="1" rx="6" />
  <text x="400" y="448" class="title" font-size="20" fill="#0369a1">INR {annual_income:,}/- (Two Lakh Forty Thousand Only)</text>

  <text x="60" y="515" class="body">This certificate is issued exclusively for the purpose of availing Post-Graduate</text>
  <text x="60" y="550" class="body">and Doctoral Fellowships under the Ministry of Tribal Affairs (MoTA).</text>

  <circle cx="650" cy="810" r="46" fill="#eff6ff" stroke="#1d4ed8" stroke-width="1.5" />
  <text x="650" y="805" class="seal">DIGITALLY VERIFIED</text>
  <text x="650" y="820" class="seal">TEHSILDAR (REV)</text>
  <text x="650" y="880" class="sub" font-weight="bold">Tahasildar, Mayurbhanj</text>

  <line x1="50" y1="1020" x2="750" y2="1020" stroke="#e2e8f0" stroke-width="1" />
  <text x="400" y="1045" class="sub" font-size="10">Digitally authenticated via Odisha Revenue e-District Services.</text>
</svg>"""

        output_path = os.path.join(STATIC_DOCS_DIR, "income_certificate_valid.svg")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        return output_path

    @classmethod
    def generate_flawed_notary_certificate(
        cls,
        candidate_name: str = "Rahul K." # Intentional abbreviation to trigger Scene 4
    ) -> str:
        """Generates the flawed document for Scene 4 & 5 SIH deficiency demonstration."""
        cls.ensure_output_dir()

        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <style>
      .title {{ font-family: 'Arial', sans-serif; font-size: 18px; font-weight: bold; fill: #7f1d1d; text-anchor: middle; }}
      .sub {{ font-family: 'Arial', sans-serif; font-size: 12px; fill: #475569; text-anchor: middle; }}
      .body {{ font-family: 'Courier New', monospace; font-size: 14px; fill: #0f172a; line-height: 1.8; }}
      .field {{ font-weight: bold; fill: #b91c1c; }}
      .stamp {{ font-family: 'Arial', sans-serif; font-size: 11px; font-weight: bold; fill: #dc2626; text-anchor: middle; }}
    </style>
  </defs>

  <rect x="15" y="15" width="770" height="1070" fill="#fffdf5" stroke="#b91c1c" stroke-width="3" rx="4" />

  <text x="400" y="70" class="title">BEFORE THE NOTARY PUBLIC : BARIPADA</text>
  <text x="400" y="92" class="sub">AFFIDAVIT FOR INCOME DECLARATION (NOT REVENUE DEPT)</text>
  <line x1="120" y1="105" x2="680" y2="105" stroke="#b91c1c" stroke-width="1" />

  <text x="60" y="180" class="body">I, <tspan class="field">{candidate_name}</tspan> (Name abbreviated on notary document),</text>
  <text x="60" y="215" class="body">residing at Baripada, do hereby solemnly affirm and state as follows:</text>
  <text x="60" y="260" class="body">1. That my family income is INR 2,40,000 per annum.</text>

  <!-- Unauthorized Stamp Box -->
  <rect x="200" y="340" width="400" height="80" fill="#fef2f2" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 3" rx="4" />
  <text x="400" y="375" class="stamp" font-size="14">UNAUTHORIZED NOTARY STAMP</text>
  <text x="400" y="398" class="stamp" font-size="11">RULE NFST-R-004: REVENUE OFFICER CERTIFICATE MANDATORY</text>

  <circle cx="620" cy="650" r="50" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 3" />
  <text x="620" y="645" class="stamp">NOTARY PUBLIC</text>
  <text x="620" y="660" class="stamp">ADVOCATE</text>

  <line x1="50" y1="1020" x2="750" y2="1020" stroke="#fca5a5" stroke-width="1" />
  <text x="400" y="1045" class="sub" font-size="10" fill="#dc2626">AI FLAGGED: Issuing authority (Notary) does not match State Revenue Master List (Tehsildar / SDO).</text>
</svg>"""

        output_path = os.path.join(STATIC_DOCS_DIR, "income_certificate_flawed.svg")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        return output_path

    @classmethod
    def generate_admission_letter(
        cls,
        candidate_name: str = "Rahul Kumar",
        university_name: str = "North Orissa University (MSCB Univ)",
        department: str = "Department of Tribal Studies & Ethnobotany",
        supervisor: str = "Dr. P. K. Nayak"
    ) -> str:
        cls.ensure_output_dir()

        svg_content = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100">
  <defs>
    <style>
      .title {{ font-family: 'Times New Roman', serif; font-size: 19px; font-weight: bold; fill: #1e293b; text-anchor: middle; }}
      .sub {{ font-family: 'Times New Roman', serif; font-size: 13px; fill: #475569; text-anchor: middle; }}
      .body {{ font-family: 'Times New Roman', serif; font-size: 15px; fill: #0f172a; line-height: 1.8; }}
      .field {{ font-family: 'Courier New', monospace; font-weight: bold; fill: #4338ca; }}
    </style>
  </defs>

  <rect x="15" y="15" width="770" height="1070" fill="#ffffff" stroke="#4338ca" stroke-width="4" rx="8" />

  <text x="400" y="80" class="title">{university_name.upper()}</text>
  <text x="400" y="102" class="sub">{department}</text>
  <text x="400" y="125" class="sub">AISHE CODE: U-0355 • BARIPADA, MAYURBHANJ, ODISHA</text>
  <line x1="100" y1="140" x2="700" y2="140" stroke="#4338ca" stroke-width="1.5" />

  <text x="400" y="190" class="title" font-size="16" fill="#312e81">FULL-TIME REGULAR PH.D. REGISTRATION LETTER</text>

  <text x="60" y="245" class="body">To,</text>
  <text x="60" y="270" class="field" font-size="16">{candidate_name}</text>
  <text x="60" y="295" class="body">Subject: Registration for Ph.D. Degree in {department}</text>

  <text x="60" y="360" class="body">Dear Candidate,</text>
  <text x="60" y="400" class="body">You are hereby informed that you have been admitted as a full-time, regular</text>
  <text x="60" y="435" class="body">research scholar in this University under the guidance of <tspan class="field">{supervisor}</tspan>.</text>

  <rect x="60" y="475" width="680" height="50" fill="#eef2ff" stroke="#a5b4fc" stroke-width="1" rx="6" />
  <text x="400" y="506" class="title" font-size="15" fill="#3730a3">Research Title: Ethnomedicinal Flora of Similipal Biosphere Reserve</text>

  <text x="60" y="580" class="body">Enrollment Date: <tspan class="field">01-Aug-2025</tspan> • Mode: <tspan class="field">REGULAR FULL TIME</tspan></text>

  <text x="600" y="850" class="body" font-weight="bold">Dean of Research</text>
  <text x="600" y="870" class="sub">North Orissa University</text>
</svg>"""

        output_path = os.path.join(STATIC_DOCS_DIR, "admission_letter.svg")
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(svg_content)
        return output_path

    @classmethod
    def generate_all_demo_documents(cls) -> Dict[str, str]:
        """Generates all 4 synthetic demo documents for SIH 2026."""
        return {
            "st_certificate": cls.generate_st_certificate(),
            "income_valid": cls.generate_valid_income_certificate(),
            "income_flawed": cls.generate_flawed_notary_certificate(),
            "admission_letter": cls.generate_admission_letter()
        }

if __name__ == "__main__":
    docs = SyntheticDocumentGenerator.generate_all_demo_documents()
    print("Generated all demo synthetic documents:")
    for k, v in docs.items():
        print(f"  • {k:<18}: {v}")
