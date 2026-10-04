'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  Clock,
  UploadCloud,
  FileCheck,
  RefreshCw,
  Coins,
  History,
  Building2,
  FileText
} from 'lucide-react'
import { API_BASE } from '@/lib/config'
import EvidenceCard from '@/components/EvidenceCard'

export default function ApplicantDashboard() {
  const [appData, setAppData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isResubmitting, setIsResubmitting] = useState<boolean>(false)
  const [resubmitSuccess, setResubmitSuccess] = useState<boolean>(false)

  const fetchApplication = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/applications`)
      const data = await res.json()
      if (data && data.length > 0) {
        const appRes = await fetch(`${API_BASE}/api/v1/applications/${data[0].id}`)
        const details = await appRes.json()
        setAppData(details)
      } else {
        throw new Error('No apps')
      }
    } catch (err) {
      // Fallback demo state
      setAppData({
        application: {
          id: 'demo-app-1',
          application_number: 'NFST-2026-000124',
          status: 'UNDER_SCRUTINY',
          current_stage: 'OFFICER_EXCEPTION_SCRUTINY',
          merit_score: 87.0
        },
        applicant: {
          name: 'Rahul Kumar',
          category: 'ST (Santhal)',
          state: 'Odisha',
          income: 240000
        },
        deficiencies: [],
        documents: [
          {
            id: 'doc-1',
            document_type: 'ST_CERTIFICATE',
            filename: 'Rahul_Kumar_ST_Certificate.pdf',
            status: 'AUTO_VERIFIED'
          },
          {
            id: 'doc-2',
            document_type: 'INCOME_CERTIFICATE',
            filename: 'Income_Certificate_Tehsildar.pdf',
            status: 'AUTO_VERIFIED'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSimulateDeficiency = () => {
    // Demo tool: toggle deficiency on to demonstrate Scene 4 & 5
    setAppData((prev: any) => ({
      ...prev,
      application: {
        ...prev.application,
        status: 'DEFICIENT',
        current_stage: 'DEFICIENCY_PENDING_STUDENT'
      },
      deficiencies: [
        {
          id: 'def-demo-1',
          reason_code: 'INCOME_CERT_AUTHORITY_INVALID',
          public_explanation: 'Your uploaded income certificate was issued by an unauthorized Notary Public instead of an authorized Revenue Officer (SDO/Tehsildar).',
          action_required: 'Please upload a valid Income Certificate issued by a Tehsildar or Sub-Divisional Magistrate.',
          deadline_at: '2026-10-15T23:59:59Z',
          status: 'ISSUED'
        }
      ]
    }))
  }

  const handleResubmit = async () => {
    setIsResubmitting(true)
    setTimeout(() => {
      setIsResubmitting(false)
      setResubmitSuccess(true)
      // Resolve deficiency and put back to UNDER_SCRUTINY
      setAppData((prev: any) => ({
        ...prev,
        application: {
          ...prev.application,
          status: 'UNDER_SCRUTINY',
          current_stage: 'OFFICER_EXCEPTION_SCRUTINY'
        },
        deficiencies: []
      }))
    }, 1200)
  }

  useEffect(() => {
    fetchApplication()
  }, [])

  const activeDeficiency = appData?.deficiencies?.find((d: any) => d.status === 'ISSUED')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-mota-700 uppercase tracking-wider">
            Applicant Dashboard
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Welcome back, {appData?.applicant?.name || 'Rahul Kumar'}
          </h1>
          <p className="text-slate-500 text-sm">
            National Fellowship for Higher Education of ST Students (NFST 2026–27)
          </p>
        </div>

        {/* Demo trigger button for Scene 4 & 5 */}
        <div className="flex items-center space-x-2">
          {!activeDeficiency ? (
            <button
              onClick={handleSimulateDeficiency}
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-2 rounded-xl transition"
            >
              Simulate Deficiency Demo (Scene 4)
            </button>
          ) : (
            <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-xl border border-rose-300">
              Deficiency Active
            </span>
          )}
        </div>
      </div>

      {resubmitSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-xs font-bold text-emerald-950 flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>
            ✓ Replacement Tehsildar Income Certificate uploaded! Automated AI screening verified with 98% confidence. Case routed to Scrutiny Officer.
          </span>
        </div>
      )}

      {/* Active Deficiency Alert Banner (PRD Module 8 & Scene 5) */}
      {activeDeficiency && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 space-y-4 shadow-sm animate-pulse-subtle">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-amber-950 text-base">
                  Action Required: Itemized Deficiency Detected
                </h3>
                <span className="bg-amber-200/80 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-300">
                  5 Days Remaining
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 font-medium">
                {activeDeficiency.public_explanation}
              </p>
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Required Correction:</span>
                <p>{activeDeficiency.action_required}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleResubmit}
              disabled={isResubmitting}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow transition flex items-center space-x-2"
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isResubmitting ? 'Screening Replacement Document...' : 'Upload Corrected Document'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Application Lifecycle Stepper (PRD Module 15) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          Application Lifecycle Tracker
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center text-xs font-semibold">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow">
              ✓
            </div>
            <span className="text-slate-900 block">1. Submitted</span>
            <span className="text-[10px] text-slate-400">02 Oct 2026</span>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow">
              ✓
            </div>
            <span className="text-slate-900 block">2. AI Screening</span>
            <span className="text-[10px] text-emerald-700 font-bold">98% Match</span>
          </div>

          <div className="space-y-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto shadow ${
              activeDeficiency ? 'bg-amber-500 text-white animate-bounce' : 'bg-emerald-600 text-white'
            }`}>
              {activeDeficiency ? '!' : '✓'}
            </div>
            <span className="text-slate-900 block">3. Scrutiny</span>
            <span className="text-[10px] text-slate-400">
              {activeDeficiency ? 'Deficiency' : 'In Progress'}
            </span>
          </div>

          <div className="space-y-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
              4
            </div>
            <span className="text-slate-600 block">4. Institute</span>
            <span className="text-[10px] text-slate-400">U-0355 Univ</span>
          </div>

          <div className="space-y-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
              5
            </div>
            <span className="text-slate-600 block">5. Selection</span>
            <span className="text-[10px] text-slate-400">Committee</span>
          </div>

          <div className="space-y-2 opacity-60">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center mx-auto">
              6
            </div>
            <span className="text-slate-600 block">6. DBT Sanction</span>
            <span className="text-[10px] text-slate-400">PFMS Gateway</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Scorecard & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transparent Scorecard (PRD Module 12) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Transparent Selection Scorecard
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
              National Rank #42
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Academic Qualification</span>
              <strong className="text-slate-900">35 / 40</strong>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-mota-700 h-full w-[87.5%]" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Research Merit & Tribal Relevance</span>
              <strong className="text-slate-900">28 / 30</strong>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-mota-700 h-full w-[93.3%]" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Institution & Supervisor Criteria</span>
              <strong className="text-slate-900">14 / 20</strong>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-mota-700 h-full w-[70%]" />
            </div>

            <div className="flex justify-between text-xs">
              <span className="text-slate-600">Publications & Prior Work</span>
              <strong className="text-slate-900">10 / 10</strong>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-mota-700 h-full w-[100%]" />
            </div>

            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm font-bold">
              <span>Total Evaluated Merit</span>
              <span className="text-lg font-black text-mota-700">87 / 100</span>
            </div>
          </div>
        </div>

        {/* Uploaded Documents & Cryptographic Hashes */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Document Vault & Evidence
            </span>
            <span className="text-[10px] text-slate-400 font-mono">DPDP Act 2025</span>
          </div>

          <div className="space-y-3">
            {appData?.documents?.map((doc: any) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-mota-700" />
                  <div>
                    <strong className="text-slate-900 block">{doc.filename}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {doc.document_type}
                    </span>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-300">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>

          {/* Mock PFMS DBT Integration Preview */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between text-blue-900 font-bold">
              <span>Sanction Order #MOTA/2026/NFST/088</span>
              <span className="text-emerald-700">PFMS Ready</span>
            </div>
            <p className="text-[11px] text-blue-800/80">
              Direct Benefit Transfer (DBT) to SBI A/c ending in ****8293 verified.
            </p>
          </div>
        </div>
      </div>

      {/* Signature Evidence Provenance Checklist (PRD Section 16 & Design Hero 1) */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Evidence Provenance & Automated Rule Verification
            </span>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Transparent Policy Checklist (NFST-2026.1)
            </h3>
          </div>
          <span className="bg-forest-50 text-forest-700 text-xs font-bold px-3 py-1 rounded-full border border-forest-200">
            ✓ 4 of 4 Core Criteria Met
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EvidenceCard
            ruleId="NFST-R-001"
            ruleTitle="Scheduled Tribe Category Validation"
            result="PASS"
            extractedValue="Scheduled Tribe (Santhal)"
            sourceDocument="ST_Certificate_Baripada_SDO.svg (Page 1)"
            authorityStamp="Sub-Divisional Officer, Baripada"
            confidence={0.992}
            sha256Hash="9b4f73a218d6c8204...918a"
            policyCitation="NFST Scheme Guidelines 2026-27, Section 3.1"
            evaluatedAt="02 Oct 2026, 10:14:02 UTC"
            explanation="Candidate confirmed as Scheduled Tribe from recognized Sub-Divisional revenue authority."
          />

          <EvidenceCard
            ruleId="NFST-R-004"
            ruleTitle="Annual Family Income Ceiling (≤ ₹6,00,000)"
            result={activeDeficiency ? 'DEFICIENT' : 'PASS'}
            extractedValue={activeDeficiency ? '₹2,40,000 (Notary Affidavit)' : '₹2,40,000 / annum'}
            sourceDocument={activeDeficiency ? 'Income_Affidavit_Notary_Flawed.svg' : 'Income_Certificate_Tehsildar.svg'}
            authorityStamp={activeDeficiency ? 'Notary Public, Baripada (Unauthorized)' : 'Tahasildar, Mayurbhanj'}
            confidence={activeDeficiency ? 0.642 : 0.978}
            sha256Hash="e4b8a21f83c029d11...3a9c"
            policyCitation="NFST Guidelines 2026-27, Section 4.1 & Rule NFST-R-004"
            evaluatedAt="02 Oct 2026, 10:14:03 UTC"
            explanation={activeDeficiency ? 'Flagged: Notary affidavits are not admissible under MoTA policy. Revenue authority certificate required.' : 'Income assessed at ₹2,40,000, well below the statutory ceiling of ₹6,00,000.'}
          />

          <EvidenceCard
            ruleId="NFST-R-003"
            ruleTitle="Upper Age Limit for ST Candidates (≤ 36 yrs)"
            result="PASS"
            extractedValue="28 Years (DOB: 14-May-1998)"
            sourceDocument="Aadhaar e-KYC Demographic Token #UID-8293"
            authorityStamp="Unique Identification Authority of India"
            confidence={1.0}
            sha256Hash="aadhaar-hash-tok-829341"
            policyCitation="Rule Catalogue NFST-2026.1 / NFST-R-003"
            evaluatedAt="02 Oct 2026, 10:14:01 UTC"
            explanation="Candidate age (28 yrs) is within affirmative action relaxed ceiling of 36 years."
          />

          <EvidenceCard
            ruleId="NFST-R-005"
            ruleTitle="Regular Full-Time Ph.D. Enrollment"
            result="PASS"
            extractedValue="Ph.D. Enrolled (Botany & Ethnomedicine)"
            sourceDocument="Admission_Letter_Ph.D._NOU.svg (Guide Endorsed)"
            authorityStamp="Registrar, North Orissa University"
            confidence={0.985}
            sha256Hash="nou-phd-adm-91823"
            policyCitation="NFST Guidelines 2026-27, Section 5.2"
            evaluatedAt="02 Oct 2026, 10:14:04 UTC"
            explanation="Regular full-time research registration endorsed by university research guide."
          />
        </div>
      </div>
    </div>
  )
}
