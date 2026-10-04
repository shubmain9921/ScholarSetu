'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  History,
  FileText,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ZoomIn,
  RotateCcw
} from 'lucide-react'

export default function CaseReviewPage() {
  const params = useParams()
  const router = useRouter()
  const appId = params?.id as string

  const [caseData, setCaseData] = useState<any>(null)
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0)
  const [showCaseReplay, setShowCaseReplay] = useState<boolean>(false)
  const [replayData, setReplayData] = useState<any>(null)
  const [isActing, setIsActing] = useState<boolean>(false)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  const fetchCase = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/officer/case/${appId}`)
      if (res.ok) {
        const data = await res.json()
        setCaseData(data)
      } else {
        throw new Error('Fallback')
      }
    } catch (err) {
      // Fallback preview
      setCaseData({
        application_id: appId,
        application_number: 'NFST-2026-000124',
        status: 'UNDER_SCRUTINY',
        merit_score: 87.0,
        applicant: {
          name: 'Rahul Kumar',
          category: 'ST',
          state: 'Odisha',
          income: 240000,
          course: 'Ph.D. in Tribal Ethnobotany (Regular)'
        },
        ai_case_summary: {
          summary_text: 'Applicant Rahul Kumar has 2 uploaded documents. ST category verified with 99% confidence. Name fuzzy similarity is 98%. All rule checks satisfy NFST 2026.1 policy guidelines.',
          model_version: 'PaddleOCR-v4.1.2 + MoTA-AI-v1',
          recommendation_type: 'FAST_TRACK_RECOMMENDED'
        },
        documents: [
          {
            id: 'doc-1',
            document_type: 'ST_CERTIFICATE',
            filename: 'Rahul_Kumar_ST_Certificate.pdf',
            verification_status: 'AUTO_VERIFIED',
            sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
          },
          {
            id: 'doc-2',
            document_type: 'INCOME_CERTIFICATE',
            filename: 'Income_Certificate_Tehsildar.pdf',
            verification_status: 'AUTO_VERIFIED',
            sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
          }
        ],
        rules: [
          {
            rule_id: 'NFST-R-001',
            result: 'PASS',
            reason_code: 'ST_CATEGORY_VERIFIED',
            explanation: 'Candidate confirmed as Scheduled Tribe (Santhal) from valid certificate.',
            confidence: 0.99
          },
          {
            rule_id: 'NFST-R-002',
            result: 'PASS',
            reason_code: 'NAME_MATCH_VERIFIED',
            explanation: 'Extracted certificate name matches application name with 98% fuzzy similarity.',
            confidence: 0.98
          },
          {
            rule_id: 'NFST-R-003',
            result: 'PASS',
            reason_code: 'AGE_WITHIN_LIMIT',
            explanation: 'Candidate age is 28 years (within 36-year ceiling).',
            confidence: 1.00
          },
          {
            rule_id: 'NFST-R-004',
            result: 'PASS',
            reason_code: 'INCOME_CEILING_PASS',
            explanation: 'Annual family income of ₹2,40,000 is within ₹6,00,000 limit.',
            confidence: 0.96
          }
        ]
      })
    }
  }

  const fetchReplay = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/officer/case-replay/${appId}`)
      const data = await res.json()
      setReplayData(data)
    } catch (err) {
      setReplayData({
        application_number: 'NFST-2026-000124',
        rule_version: '2026.1',
        total_events: 3,
        events: [
          {
            formatted_time: '02 Oct 2026, 10:14:00 UTC',
            actor: 'APPLICANT',
            event_type: 'APPLICATION_SUBMITTED',
            description: 'Application submitted by Rahul Kumar with 2 uploaded documents.'
          },
          {
            formatted_time: '02 Oct 2026, 10:14:03 UTC',
            actor: 'SYSTEM_WORKER',
            event_type: 'AUTO_SCREENING_COMPLETED',
            description: 'Rule checks evaluated. Name match: 98%. Routed to Scrutiny Officer for final confirmation.'
          }
        ]
      })
    }
    setShowCaseReplay(true)
  }

  const handleAction = async (action: string) => {
    setIsActing(true)
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/officer/action/${appId}?action=${action}`, {
        method: 'POST'
      })
      const data = await res.json()
      setActionMessage(`Action '${action}' successfully executed. State updated to ${data.status}.`)
      setTimeout(() => {
        router.push('/officer')
      }, 1500)
    } catch (err) {
      setActionMessage(`Simulated action '${action}' recorded. Transitioning to next queue item.`)
      setTimeout(() => {
        router.push('/officer')
      }, 1500)
    } finally {
      setIsActing(false)
    }
  }

  useEffect(() => {
    fetchCase()
  }, [appId])

  const activeDoc = caseData?.documents?.[selectedDocIndex] || caseData?.documents?.[0]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/officer"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black text-slate-900">
                Application #{caseData?.application_number || 'NFST-2026-000124'}
              </h1>
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-0.5 rounded border border-amber-300">
                {caseData?.status || 'UNDER_SCRUTINY'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Candidate: <strong>{caseData?.applicant?.name}</strong> • ST (Santhal) • {caseData?.applicant?.state}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={fetchReplay}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-lg border border-slate-300 transition"
          >
            <History className="w-3.5 h-3.5 text-mota-700" />
            <span>Case Replay Trail</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 text-center animate-fade-in">
          {actionMessage}
        </div>
      )}

      {/* Side-by-Side Review Grid (PRD Section 20) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel (50% Width): High-Speed Document Viewer */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl p-5 text-white flex flex-col space-y-4 shadow-lg border border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div className="flex space-x-2">
              {caseData?.documents?.map((doc: any, idx: number) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocIndex(idx)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                    selectedDocIndex === idx
                      ? 'bg-mota-700 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>{doc.document_type.replace('_', ' ')}</span>
                </button>
              ))}
            </div>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400">
              SHA: {activeDoc?.sha256?.substring(0, 10)}...
            </span>
          </div>

          {/* Document Simulated Canvas */}
          <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 flex-1 min-h-[420px] flex flex-col justify-between font-serif">
            <div className="text-center space-y-2 border-b border-slate-800 pb-4">
              <span className="text-[10px] uppercase font-sans tracking-widest text-slate-400">
                GOVERNMENT OF ODISHA • REVENUE DEPARTMENT
              </span>
              <h3 className="text-base font-bold text-amber-200">
                {activeDoc?.document_type === 'ST_CERTIFICATE'
                  ? 'CERTIFICATE OF SCHEDULED TRIBE'
                  : 'ANNUAL INCOME CERTIFICATE'}
              </h3>
              <p className="text-[11px] text-slate-400 font-sans">
                Issued under the Constitution (Scheduled Tribes) Order, 1950
              </p>
            </div>

            {/* Document Highlighted Content */}
            <div className="space-y-4 text-xs text-slate-300 leading-relaxed my-4">
              <p>
                This is to certify that{' '}
                <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50 font-bold font-mono">
                  {caseData?.applicant?.name}
                </span>
                , son of Shri Gopal Chandra Kumar, residing at Village: Baripada, District: Mayurbhanj in the State of Odisha belongs to the{' '}
                <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50 font-bold font-mono">
                  Santhal (Scheduled Tribe)
                </span>{' '}
                community.
              </p>
              <p>
                Family Annual Income assessed for Financial Year 2025-26:{' '}
                <span className="bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/50 font-bold font-mono">
                  ₹2,40,000/- (Rupees Two Lakh Forty Thousand Only)
                </span>
                .
              </p>
            </div>

            {/* Official Stamp & Sign */}
            <div className="flex justify-between items-end border-t border-slate-800 pt-4 font-sans text-[11px]">
              <div>
                <span className="text-slate-500 block">Date of Issue</span>
                <strong className="text-slate-300">10-Jan-2026</strong>
              </div>
              <div className="text-right">
                <span className="inline-block border border-dashed border-emerald-500/50 px-2 py-1 rounded bg-emerald-950/30 text-emerald-400 font-bold text-[10px]">
                  ✓ DIGITAL SIGNATURE VERIFIED
                </span>
                <p className="text-slate-400 text-[10px] mt-1">Tahasildar, Mayurbhanj (Revenue)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel (50% Width): AI Case Summary, Comparison & Action Bar */}
        <div className="lg:col-span-6 space-y-4">
          {/* AI Case Summary Card (PRD Module 25) */}
          <div className="bg-gradient-to-r from-emerald-50 to-white border border-emerald-200 rounded-2xl p-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>AI Case Summary & Evidence Synthesis</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                PaddleOCR-v4.1.2
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-normal">
              {caseData?.ai_case_summary?.summary_text}
            </p>
            <div className="flex items-center space-x-2 pt-1 text-[11px] font-bold text-emerald-900">
              <span>Recommendation:</span>
              <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                ✓ ELIGIBLE FOR FAST-TRACK APPROVAL
              </span>
            </div>
          </div>

          {/* Side-by-Side Data Comparison */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Cross-Verification Evidence Match
            </h3>

            <div className="space-y-2 text-xs">
              {/* Field 1: Candidate Name */}
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Applicant Form Input</span>
                  <strong className="text-slate-800 text-sm">{caseData?.applicant?.name}</strong>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    98% Match
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Extracted from ST Cert</span>
                  <strong className="text-slate-800 text-sm">{caseData?.applicant?.name}</strong>
                </div>
              </div>

              {/* Field 2: Caste Category */}
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Declared Category</span>
                  <strong className="text-slate-800 text-sm">Scheduled Tribe (ST)</strong>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    100% Match
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Extracted Classification</span>
                  <strong className="text-slate-800 text-sm">ST (Santhal)</strong>
                </div>
              </div>

              {/* Field 3: Annual Income */}
              <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">Declared Income</span>
                  <strong className="text-slate-800 text-sm">₹2,40,000 / yr</strong>
                </div>
                <div className="text-center">
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    &lt; ₹6.0L Ceiling
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">Income Certificate</span>
                  <strong className="text-slate-800 text-sm">₹2,40,000 / yr</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Rule Evaluation Checklist */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Policy Rule Evaluation Checklist (NFST-2026.1)
            </h3>
            <div className="space-y-1.5 text-xs">
              {caseData?.rules?.map((rule: any) => (
                <div
                  key={rule.rule_id}
                  className="flex items-start space-x-2 p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <strong className="text-slate-800">{rule.rule_id}</strong>
                      <span className="font-mono text-[10px] text-slate-400">
                        Conf: {(rule.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">{rule.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Action Bar (PRD Section 20) */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              onClick={() => handleAction('APPROVE_ELIGIBLE')}
              disabled={isActing}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow flex items-center justify-center space-x-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve Case</span>
            </button>

            <button
              onClick={() => handleAction('RAISE_DEFICIENCY')}
              disabled={isActing}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow flex items-center justify-center space-x-1.5"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Raise Deficiency</span>
            </button>

            <button
              onClick={() => handleAction('REJECT_INELIGIBLE')}
              disabled={isActing}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition shadow flex items-center justify-center space-x-1.5"
            >
              <XCircle className="w-4 h-4" />
              <span>Reject Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Case Replay Audit Modal */}
      {showCaseReplay && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl border border-slate-200 animate-scale-in max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-mota-700" />
                <h2 className="text-lg font-black text-slate-900">
                  Case Replay Audit Trail
                </h2>
              </div>
              <button
                onClick={() => setShowCaseReplay(false)}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between font-mono">
                <span>App: #{replayData?.application_number}</span>
                <span>Rule Version: {replayData?.rule_version}</span>
                <span>Events: {replayData?.total_events}</span>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 space-y-6 pl-4 text-xs">
                {replayData?.events?.map((ev: any, idx: number) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[23px] top-0 w-3 h-3 rounded-full bg-mota-700 ring-4 ring-white" />
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-900">{ev.event_type}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{ev.formatted_time}</span>
                      </div>
                      <span className="inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                        Actor: {ev.actor}
                      </span>
                      <p className="text-slate-600">{ev.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-200 pt-3 flex justify-end">
              <button
                onClick={() => setShowCaseReplay(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
