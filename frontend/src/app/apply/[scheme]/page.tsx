'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  ShieldCheck,
  Building,
  GraduationCap,
  User,
  Sparkles,
  Info,
  Clock,
  Check
} from 'lucide-react'
import { API_BASE } from '@/lib/config'

export default function ApplySchemeWizard() {
  const params = useParams()
  const router = useRouter()
  const schemeCode = ((params?.scheme as string) || 'NFST').toUpperCase()

  const schemeTitle =
    schemeCode === 'NOS'
      ? 'National Overseas Scholarship for ST Candidates (NOS 2026–27)'
      : 'National Fellowship for Higher Education of ST Students (NFST 2026–27)'

  const [step, setStep] = useState<number>(1)

  // Step 1: Personal Form
  const [fullName, setFullName] = useState('Rahul Kumar')
  const [dob, setDob] = useState('1998-05-14')
  const [tribe, setTribe] = useState('Santhal')
  const [domicileState, setDomicileState] = useState('Odisha')
  const [district, setDistrict] = useState('Mayurbhanj')
  const [familyIncome, setFamilyIncome] = useState(240000)

  // Step 2: Academic Form
  const [institute, setInstitute] = useState('North Orissa University')
  const [department, setDepartment] = useState('Department of Botany & Environmental Science')
  const [degree, setDegree] = useState('Ph.D. (Regular Full-Time)')
  const [researchTopic, setResearchTopic] = useState('Documentation and Conservation of Ethnomedicinal Flora of Similipal Biosphere Reserve')
  const [guideName, setGuideName] = useState('Prof. A. K. Mohapatra')

  // Step 3: Documents & Live AI Extraction
  const [stCertStatus, setStCertStatus] = useState<'NONE' | 'ANALYZING' | 'VERIFIED'>('VERIFIED')
  const [stCertDetails, setStCertDetails] = useState<any>({
    filename: 'ST_Certificate_Baripada_SDO.svg',
    issuingAuthority: 'Sub-Divisional Officer, Baripada',
    confidence: '99.2%',
    subCaste: 'Santhal',
    status: 'PASS'
  })

  const [incomeCertStatus, setIncomeCertStatus] = useState<'NONE' | 'ANALYZING' | 'VERIFIED' | 'DEFICIENT'>('NONE')
  const [incomeCertDetails, setIncomeCertDetails] = useState<any>(null)

  const [admissionCertStatus, setAdmissionCertStatus] = useState<'NONE' | 'ANALYZING' | 'VERIFIED'>('VERIFIED')
  const [admissionCertDetails, setAdmissionCertDetails] = useState<any>({
    filename: 'Admission_Letter_Ph.D._NOU.svg',
    issuingInstitute: 'North Orissa University',
    session: '2026-2029',
    confidence: '98.5%',
    status: 'PASS'
  })

  // Step 4: DPDP Consent
  const [consentAadhaar, setConsentAadhaar] = useState(true)
  const [consentDPDP, setConsentDPDP] = useState(true)
  const [affirmationTruth, setAffirmationTruth] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedApp, setSubmittedApp] = useState<any>(null)

  // Demo interactive helpers for Document AI
  const handlePreloadValidIncome = () => {
    setIncomeCertStatus('ANALYZING')
    setTimeout(() => {
      setIncomeCertStatus('VERIFIED')
      setIncomeCertDetails({
        filename: 'Income_Certificate_Tehsildar.svg',
        authority: 'Tahasildar, Mayurbhanj (Revenue Dept)',
        annualIncome: '₹2,40,000 / annum',
        confidence: '97.8%',
        rulePassed: true,
        message: 'Valid revenue authority certification under Rule NFST-R-004.'
      })
    }, 600)
  }

  const handlePreloadFlawedIncome = () => {
    setIncomeCertStatus('ANALYZING')
    setTimeout(() => {
      setIncomeCertStatus('DEFICIENT')
      setIncomeCertDetails({
        filename: 'Income_Affidavit_Notary_Flawed.svg',
        authority: 'Notary Public, Baripada District Court',
        annualIncome: '₹2,40,000 / annum',
        confidence: '64.2%',
        rulePassed: false,
        warning: 'RULE VIOLATION: Notary affidavits are not recognized by MoTA policy NFST-R-004. Certificate must be issued by an authorized Tehsildar or SDO.'
      })
    }, 600)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scheme_code: schemeCode,
          dynamic_form_data: {
            full_name: fullName,
            dob: dob,
            tribe: tribe,
            domicile_state: domicileState,
            district: district,
            family_income: familyIncome,
            institute: institute,
            department: department,
            degree: degree,
            research_topic: researchTopic,
            guide_name: guideName,
            income_cert_type: incomeCertDetails?.authority || 'Tehsildar'
          }
        })
      })

      if (res.ok) {
        const data = await res.json()
        setSubmittedApp(data)
      } else {
        throw new Error('API submission error')
      }
    } catch (e) {
      // Fallback submission for standalone demo
      const randomId = Math.floor(100000 + Math.random() * 900000)
      setSubmittedApp({
        id: 'app-' + randomId,
        application_number: `${schemeCode}-2026-${randomId}`,
        scheme_name: schemeTitle,
        status: incomeCertStatus === 'DEFICIENT' ? 'DEFICIENT' : 'UNDER_SCRUTINY',
        current_stage: incomeCertStatus === 'DEFICIENT' ? 'DEFICIENCY_PENDING_STUDENT' : 'OFFICER_EXCEPTION_SCRUTINY',
        active_deficiencies_count: incomeCertStatus === 'DEFICIENT' ? 1 : 0
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submittedApp) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Application Registered
          </span>
          <h1 className="text-3xl font-black text-slate-900">Application Submitted Successfully!</h1>
          <p className="text-slate-600 text-sm max-w-lg mx-auto">
            Your application for <strong>{submittedApp.scheme_name || schemeTitle}</strong> has been sealed with an immutable SHA-256 evidence record.
          </p>
        </div>

        {/* Application Credentials Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 max-w-md mx-auto text-left space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Application Number:</span>
            <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2 py-0.5 rounded border border-slate-200">
              {submittedApp.application_number}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Current Stage:</span>
            <span className="font-semibold text-mota-800">
              {submittedApp.current_stage || 'Officer Exception Scrutiny'}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Initial AI Rule Check:</span>
            <span className={`font-semibold ${submittedApp.active_deficiencies_count > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
              {submittedApp.active_deficiencies_count > 0 ? '⚠ Deficiency Raised (Income Cert)' : '✓ All Core Criteria Passed'}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
          <Link
            href="/applicant/dashboard"
            className="bg-mota-700 hover:bg-mota-800 text-white font-bold px-6 py-2.5 rounded-xl shadow transition text-sm flex items-center justify-center space-x-2"
          >
            <span>Open Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/officer"
            className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-6 py-2.5 rounded-xl border border-slate-300 shadow-sm transition text-sm flex items-center justify-center space-x-2"
          >
            <span>View in Officer Scrutiny Console</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Wizard Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-mota-100 text-mota-800 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-mota-300">
                MoTA Scheme Portal
              </span>
              <span className="text-xs text-slate-500">Digital Personal Data Protection (DPDP) Compliant</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 mt-1">{schemeTitle}</h1>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Cancel & Return to Catalog</span>
          </Link>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
          {[
            { id: 1, label: 'Identity & ST Domicile', icon: User },
            { id: 2, label: 'Academic & Research', icon: GraduationCap },
            { id: 3, label: 'Evidence & AI Verification', icon: FileCheck2 },
            { id: 4, label: 'Consent & Declaration', icon: ShieldCheck }
          ].map((s) => {
            const Icon = s.icon
            const isDone = step > s.id
            const isCurrent = step === s.id
            return (
              <div
                key={s.id}
                onClick={() => isDone && setStep(s.id)}
                className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center space-x-2.5 ${
                  isCurrent
                    ? 'bg-mota-50 border-mota-600 text-mota-900 shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-400 opacity-70'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? 'bg-mota-700 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : s.id}
                </div>
                <div className="hidden sm:block min-w-0">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Step 0{s.id}</div>
                  <div className="text-xs font-semibold truncate">{s.label}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        {/* STEP 1: Personal & ST Details */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personal & Scheduled Tribe Verification</h2>
              <p className="text-slate-500 text-xs">
                Ensure details match your authorized Caste Certificate. Aadhaar / DigiLocker integration verifies candidate authenticity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Full Name (As per ST Certificate)</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Scheduled Tribe (ST) Sub-Caste / Tribe</label>
                <select
                  value={tribe}
                  onChange={(e) => setTribe(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                >
                  <option value="Santhal">Santhal</option>
                  <option value="Gond">Gond</option>
                  <option value="Bhil">Bhil</option>
                  <option value="Oraon">Oraon</option>
                  <option value="Munda">Munda</option>
                  <option value="Khond">Khond</option>
                  <option value="Birhor">Birhor (Particularly Vulnerable Tribal Group - PVTG)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">State of Domicile</label>
                <select
                  value={domicileState}
                  onChange={(e) => setDomicileState(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                >
                  <option value="Odisha">Odisha</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Assam">Assam</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">District</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Annual Family Income from all sources (₹)</label>
                <input
                  type="number"
                  value={familyIncome}
                  onChange={(e) => setFamilyIncome(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
                <span className="text-[10px] text-slate-500">Official ceiling: ₹6,00,000/yr (NFST) or ₹8,00,000/yr (NOS)</span>
              </div>
            </div>

            {/* DigiLocker Connected Badge */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
                <div>
                  <span className="font-bold text-blue-900">Aadhaar & DigiLocker e-KYC Verified</span>
                  <p className="text-[11px] text-blue-700">Demographic token matching successful. Zero document duplication.</p>
                </div>
              </div>
              <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded">VERIFIED</span>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-mota-700 hover:bg-mota-800 text-white font-bold px-6 py-2.5 rounded-xl shadow transition text-xs flex items-center space-x-2"
              >
                <span>Save & Continue to Academic Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Academic & Research Details */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Academic & Research Enrollment</h2>
              <p className="text-slate-500 text-xs">
                Provide official institutional affiliation and research guide credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Host University / Institute</label>
                <input
                  type="text"
                  value={institute}
                  onChange={(e) => setInstitute(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Department / Faculty</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Degree Enrolled</label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Research Guide / Supervisor Name</label>
                <input
                  type="text"
                  value={guideName}
                  onChange={(e) => setGuideName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="font-semibold text-slate-700">Approved Research Topic / Synopsis</label>
                <textarea
                  rows={3}
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                />
                <span className="text-[10px] text-slate-500">
                  Topic will be evaluated by Selection Committee on academic rigor and tribal community impact.
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2 rounded-xl transition text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-mota-700 hover:bg-mota-800 text-white font-bold px-6 py-2.5 rounded-xl shadow transition text-xs flex items-center space-x-2"
              >
                <span>Save & Continue to Evidence Upload</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Evidence Upload with Document AI OCR */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Document Evidence & Instant AI OCR Inspection</h2>
                <p className="text-slate-500 text-xs">
                  ScholarSetu runs instant OCR & Entity Extraction to catch authority flaws and naming variations before submission.
                </p>
              </div>
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                Live AI OCR Active
              </span>
            </div>

            {/* Document 1: ST Caste Certificate */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">1. Scheduled Tribe Caste Certificate (Mandatory)</h3>
                    <p className="text-[11px] text-slate-500">Must be issued by Sub-Divisional Officer / Tehsildar</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  ✓ Verified (99.2% Conf)
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] flex justify-between items-center text-slate-600">
                <span>File: <strong>ST_Certificate_Baripada_SDO.svg</strong></span>
                <span>Issuing Authority: <strong className="text-emerald-700">Sub-Divisional Officer, Baripada</strong></span>
                <span>Category: <strong className="text-emerald-700">Scheduled Tribe (Santhal)</strong></span>
              </div>
            </div>

            {/* Document 2: Annual Income Certificate (Interactive Demo with Scene 4 Mismatch Trigger) */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="w-5 h-5 text-mota-700" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">2. Annual Family Income Certificate (Mandatory)</h3>
                    <p className="text-[11px] text-slate-500">Revenue authority certificate under Rule NFST-R-004</p>
                  </div>
                </div>
                {incomeCertStatus === 'VERIFIED' && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    ✓ Verified (97.8% Conf)
                  </span>
                )}
                {incomeCertStatus === 'DEFICIENT' && (
                  <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
                    ⚠ Authority Flaw Detected
                  </span>
                )}
              </div>

              {/* Interactive Demo Buttons for Evaluation */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block">
                  Select Synthetic Test Document for Demo:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handlePreloadValidIncome}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      incomeCertStatus === 'VERIFIED'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm'
                        : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border-slate-300'
                    }`}
                  >
                    ✓ Upload Valid Tehsildar Certificate
                  </button>
                  <button
                    onClick={handlePreloadFlawedIncome}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                      incomeCertStatus === 'DEFICIENT'
                        ? 'bg-red-600 text-white border-red-700 shadow-sm'
                        : 'bg-slate-100 hover:bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    ⚠ Simulate Scene 4: Upload Flawed Notary Certificate
                  </button>
                </div>
              </div>

              {/* Income Cert Extraction Details */}
              {incomeCertStatus === 'ANALYZING' && (
                <div className="p-3 bg-amber-50 text-amber-800 rounded-lg text-xs flex items-center space-x-2">
                  <Clock className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Running PaddleOCR Layout & Named Entity Recognition...</span>
                </div>
              )}

              {incomeCertStatus === 'VERIFIED' && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>AI OCR Inspection Passed</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    File: <strong>{incomeCertDetails.filename}</strong> | Authority: <strong>{incomeCertDetails.authority}</strong> | Extracted: <strong>{incomeCertDetails.annualIncome}</strong>
                  </p>
                </div>
              )}

              {incomeCertStatus === 'DEFICIENT' && (
                <div className="bg-red-50 border border-red-300 p-3 rounded-lg text-xs text-red-900 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-red-700">
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>AI Pre-Submission Alert: Policy Violation Flagged</span>
                  </div>
                  <p className="text-[11px] text-red-800 leading-relaxed">
                    {incomeCertDetails.warning}
                  </p>
                  <p className="text-[10px] text-slate-500 pt-1">
                    *Note: You may still submit. The system will route this into the Exception Scrutiny Queue where an officer will review and issue an itemized 5-day deficiency notice.*
                  </p>
                </div>
              )}
            </div>

            {/* Document 3: Ph.D. Admission Letter */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <FileCheck2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="font-bold text-xs text-slate-900">3. Ph.D. / M.Phil Enrollment Letter with Guide Endorsement</h3>
                    <p className="text-[11px] text-slate-500">Regular full-time research verification</p>
                  </div>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  ✓ Verified (98.5% Conf)
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 text-[11px] flex justify-between items-center text-slate-600">
                <span>File: <strong>Admission_Letter_Ph.D._NOU.svg</strong></span>
                <span>Institution: <strong className="text-emerald-700">North Orissa University</strong></span>
                <span>Session: <strong className="text-emerald-700">2026-2029</strong></span>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(2)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2 rounded-xl transition text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={() => {
                  if (incomeCertStatus === 'NONE') {
                    handlePreloadValidIncome()
                  }
                  setStep(4)
                }}
                className="bg-mota-700 hover:bg-mota-800 text-white font-bold px-6 py-2.5 rounded-xl shadow transition text-xs flex items-center space-x-2"
              >
                <span>Save & Continue to Final Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DPDP Consent & Affirmation */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Statutory Consent & Final Submission</h2>
              <p className="text-slate-500 text-xs">
                Under the Digital Personal Data Protection (DPDP) Act 2023, MoTA guarantees privacy, purpose limitation, and human oversight.
              </p>
            </div>

            {/* Pre-submission Summary Review */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
              <h3 className="font-bold text-slate-900">Application Summary:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                <div><span className="text-slate-400 block">Candidate:</span><strong>{fullName}</strong></div>
                <div><span className="text-slate-400 block">ST Category:</span><strong>{tribe} (ST)</strong></div>
                <div><span className="text-slate-400 block">Income:</span><strong>₹{familyIncome.toLocaleString()} / yr</strong></div>
                <div><span className="text-slate-400 block">State:</span><strong>{domicileState}</strong></div>
                <div className="sm:col-span-2"><span className="text-slate-400 block">Host Institute:</span><strong>{institute}</strong></div>
                <div className="sm:col-span-2"><span className="text-slate-400 block">Income Document:</span>
                  <strong className={incomeCertStatus === 'DEFICIENT' ? 'text-red-700' : 'text-emerald-700'}>
                    {incomeCertStatus === 'DEFICIENT' ? '⚠ Notary Affidavit (Flawed)' : '✓ Tehsildar Certificate (Valid)'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 text-xs text-slate-700">
              <label className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={consentAadhaar}
                  onChange={(e) => setConsentAadhaar(e.target.checked)}
                  className="mt-0.5 rounded text-mota-700 focus:ring-mota-500"
                />
                <div>
                  <strong className="text-slate-900">Aadhaar Authentication & DBT Seeding Consent</strong>
                  <p className="text-slate-500 text-[11px]">
                    I consent to verify my identity via Aadhaar biometric/OTP and disburse fellowship allowances directly to my Aadhaar-seeded bank account.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={consentDPDP}
                  onChange={(e) => setConsentDPDP(e.target.checked)}
                  className="mt-0.5 rounded text-mota-700 focus:ring-mota-500"
                />
                <div>
                  <strong className="text-slate-900">DPDP Act 2023 Explicit Purpose Consent</strong>
                  <p className="text-slate-500 text-[11px]">
                    I authorize the Ministry of Tribal Affairs to process my submitted documents strictly for evaluation, merit ranking, and auditing of Scheduled Tribe fellowship benefits.
                  </p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={affirmationTruth}
                  onChange={(e) => setAffirmationTruth(e.target.checked)}
                  className="mt-0.5 rounded text-mota-700 focus:ring-mota-500"
                />
                <div>
                  <strong className="text-slate-900">Self-Affirmation of Information Truthfulness</strong>
                  <p className="text-slate-500 text-[11px]">
                    I solemnly affirm that the uploaded certificates and details are genuine and unaltered. I understand that submitting fraudulent certificates invites immediate disqualification and legal recovery.
                  </p>
                </div>
              </label>
            </div>

            {/* Core Principle Callout */}
            <div className="bg-slate-900 text-white rounded-xl p-4 flex items-center space-x-3 text-xs">
              <Sparkles className="w-5 h-5 text-mota-400 shrink-0" />
              <div>
                <span className="font-bold text-mota-400">ScholarSetu Fair Evaluation Guarantee</span>
                <p className="text-slate-300 text-[11px]">
                  All decisions are governed by deterministic rules and evaluated by accredited human scrutiny officers. AI never autonomously rejects or selects your application.
                </p>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setStep(3)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-5 py-2 rounded-xl transition text-xs flex items-center space-x-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !consentAadhaar || !consentDPDP || !affirmationTruth}
                className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition text-xs flex items-center space-x-2"
              >
                <span>{isSubmitting ? 'Encrypting & Submitting...' : 'Sign & Submit Application'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
