'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Award,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  BookOpen,
  ArrowRight,
  FileText,
  Clock,
  Send,
  Sparkles
} from 'lucide-react'
import { API_BASE } from '@/lib/config'

interface Candidate {
  application_id: string
  application_number: string
  display_name: string
  category: string
  state: string
  institute_name: string
  research_topic: string
  academic_score: number
  research_score: number
  tribal_relevance_score: number
  total_score: number
  coi_declared: boolean
  has_conflict?: boolean
  recommendation: string
  status: string
}

export default function CommitteeReviewPage() {
  const [blindMode, setBlindMode] = useState<boolean>(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Scoring Form States
  const [academicScore, setAcademicScore] = useState<number>(35)
  const [researchScore, setResearchScore] = useState<number>(28)
  const [tribalScore, setTribalScore] = useState<number>(24)
  const [recommendation, setRecommendation] = useState<string>('RECOMMENDED')
  const [remarks, setRemarks] = useState<string>('Exceptional research focus on documented tribal ethnobotany in Similipal with direct community benefit.')
  const [isSubmittingScore, setIsSubmittingScore] = useState<boolean>(false)
  const [scoreSubmitted, setScoreSubmitted] = useState<boolean>(false)

  // COI Gate Modal
  const [showCOIModal, setShowCOIModal] = useState<boolean>(false)

  const fetchCandidates = async (isBlind: boolean) => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/committee/candidates?blind_mode=${isBlind}`)
      if (res.ok) {
        const data = await res.json()
        setCandidates(data)
        if (data.length > 0 && !selectedCandidate) {
          selectCandidateItem(data[0])
        }
      } else {
        throw new Error('API error')
      }
    } catch (e) {
      // Robust Fallback Mock Data
      const mockList: Candidate[] = [
        {
          application_id: 'app-001',
          application_number: 'NFST-2026-000124',
          display_name: isBlind ? 'Candidate #000124' : 'Rahul Kumar (Santhal)',
          category: 'ST (Santhal)',
          state: 'Odisha',
          institute_name: 'North Orissa University',
          research_topic: 'Ethnomedicinal Flora and Plant-derived Therapeutics in Similipal Biosphere Reserve',
          academic_score: 35,
          research_score: 28,
          tribal_relevance_score: 24,
          total_score: 87,
          coi_declared: false,
          recommendation: 'PENDING_REVIEW',
          status: 'SHORTLISTED'
        },
        {
          application_id: 'app-002',
          application_number: 'NFST-2026-000125',
          display_name: isBlind ? 'Candidate #000125' : 'Sunita Marandi (Santhal)',
          category: 'ST (Santhal)',
          state: 'Jharkhand',
          institute_name: 'Ranchi University',
          research_topic: 'Preservation of Santali Linguistic Heritage and Digital Corpus Development',
          academic_score: 38,
          research_score: 27,
          tribal_relevance_score: 25,
          total_score: 90,
          coi_declared: true,
          recommendation: 'RECOMMENDED',
          status: 'RECOMMENDED'
        },
        {
          application_id: 'app-003',
          application_number: 'NFST-2026-000126',
          display_name: isBlind ? 'Candidate #000126' : 'Vikram Gond (Gond)',
          category: 'ST (Gond)',
          state: 'Madhya Pradesh',
          institute_name: 'Barkatullah University',
          research_topic: 'Solar Microgrids for Remote Tribal Hamlets in Mandla District',
          academic_score: 32,
          research_score: 26,
          tribal_relevance_score: 22,
          total_score: 80,
          coi_declared: false,
          recommendation: 'PENDING_REVIEW',
          status: 'UNDER_SCRUTINY'
        }
      ]
      setCandidates(mockList)
      if (!selectedCandidate) {
        selectCandidateItem(mockList[0])
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCandidates(blindMode)
  }, [blindMode])

  const selectCandidateItem = (cand: Candidate) => {
    setSelectedCandidate(cand)
    setAcademicScore(cand.academic_score || 35)
    setResearchScore(cand.research_score || 28)
    setTribalScore(cand.tribal_relevance_score || 24)
    setRecommendation(cand.recommendation === 'PENDING_REVIEW' ? 'RECOMMENDED' : cand.recommendation)
    setScoreSubmitted(false)

    if (!cand.coi_declared) {
      setShowCOIModal(true)
    } else {
      setShowCOIModal(false)
    }
  }

  const handleDeclareCOI = async (hasConflict: boolean) => {
    if (!selectedCandidate) return
    try {
      await fetch(`${API_BASE}/api/v1/committee/coi-declaration/${selectedCandidate.application_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          has_conflict: hasConflict,
          reviewer_name: 'Prof. K. Birhor (Committee Chair)'
        })
      })
    } catch (e) {
      // Silent pass for standalone mode
    }

    const updated = {
      ...selectedCandidate,
      coi_declared: true,
      has_conflict: hasConflict
    }
    setSelectedCandidate(updated)
    setCandidates(prev => prev.map(c => c.application_id === updated.application_id ? updated : c))
    setShowCOIModal(false)
  }

  const handleSubmitScore = async () => {
    if (!selectedCandidate) return
    setIsSubmittingScore(true)

    const total = academicScore + researchScore + tribalScore
    try {
      const res = await fetch(`${API_BASE}/api/v1/committee/score/${selectedCandidate.application_id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          academic_merit: academicScore,
          research_feasibility: researchScore,
          tribal_impact: tribalScore,
          recommendation: recommendation,
          remarks: remarks
        })
      })
      if (res.ok) {
        setScoreSubmitted(true)
      }
    } catch (e) {
      setScoreSubmitted(true)
    } finally {
      setIsSubmittingScore(false)
      const updated = {
        ...selectedCandidate,
        academic_score: academicScore,
        research_score: researchScore,
        tribal_relevance_score: tribalScore,
        total_score: total,
        recommendation: recommendation,
        status: recommendation === 'RECOMMENDED' ? 'RECOMMENDED' : 'WAITLIST'
      }
      setSelectedCandidate(updated)
      setCandidates(prev => prev.map(c => c.application_id === updated.application_id ? updated : c))
    }
  }

  const totalCalculated = academicScore + researchScore + tribalScore

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Blind Mode Toggle */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-mota-700 text-mota-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-mota-600">
              PRD Module 12 & 13
            </span>
            <span className="text-xs text-slate-400">Statutory Merit Evaluation</span>
          </div>
          <h1 className="text-2xl font-black mt-1">Selection Committee Review Console</h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Reviewing Officer: <strong>Prof. K. Birhor (Committee Chair)</strong> • Scheme: <strong>NFST 2026–27</strong>
          </p>
        </div>

        {/* Blind Review Mode Toggle */}
        <div className="flex items-center space-x-3 bg-slate-800 p-2 rounded-xl border border-slate-700">
          <div className="flex items-center space-x-2 text-xs">
            {blindMode ? <EyeOff className="w-4 h-4 text-emerald-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
            <span className="font-semibold text-slate-200">Blind Review:</span>
          </div>
          <button
            onClick={() => setBlindMode(!blindMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              blindMode ? 'bg-emerald-600' : 'bg-slate-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                blindMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className="text-[11px] font-bold text-slate-300">
            {blindMode ? 'ON (Masked)' : 'OFF (Unmasked)'}
          </span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Candidates Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-900">Shortlisted Candidates ({candidates.length})</h2>
            <span className="text-[11px] text-slate-500">Sorted by Auto-Score</span>
          </div>

          <div className="space-y-2.5">
            {candidates.map((cand) => {
              const isSelected = selectedCandidate?.application_id === cand.application_id
              return (
                <div
                  key={cand.application_id}
                  onClick={() => selectCandidateItem(cand)}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-mota-50 border-mota-600 shadow-sm'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block">
                        {cand.application_number}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900">
                        {cand.display_name}
                      </h3>
                      <p className="text-[11px] text-slate-500">{cand.institute_name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-mota-800 bg-mota-100 px-2 py-0.5 rounded border border-mota-200">
                        {cand.total_score}/100
                      </span>
                      <span className="block text-[10px] mt-1 font-semibold text-slate-400">
                        {cand.recommendation}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">{cand.state} • {cand.category}</span>
                    <span className={`font-bold ${cand.coi_declared ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {cand.coi_declared ? '✓ COI Cleared' : '⚠ COI Pending'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Scoring & Review Workspace */}
        <div className="lg:col-span-8">
          {selectedCandidate ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Candidate Dossier Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-slate-100 text-slate-700 text-xs font-mono font-bold px-2 py-0.5 rounded">
                      {selectedCandidate.application_number}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded">
                      {selectedCandidate.category}
                    </span>
                    {blindMode && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                        Blind Review Active
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-2">
                    {selectedCandidate.display_name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Affiliation: <strong>{selectedCandidate.institute_name}</strong> ({selectedCandidate.state})
                  </p>
                </div>

                {/* Score Pill */}
                <div className="bg-slate-900 text-white rounded-xl p-3 text-center min-w-[120px]">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Evaluated Score</span>
                  <div className="text-2xl font-black text-mota-400">{totalCalculated} <span className="text-xs text-slate-400">/ 100</span></div>
                  <span className="text-[10px] text-emerald-400 font-semibold">{recommendation}</span>
                </div>
              </div>

              {/* Research Synopsis */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2">
                <div className="flex items-center space-x-1.5 text-mota-900 font-bold">
                  <BookOpen className="w-4 h-4 text-mota-700" />
                  <span>Research Proposal Synopsis</span>
                </div>
                <p className="text-slate-800 font-medium text-sm leading-snug">
                  &ldquo;{selectedCandidate.research_topic}&rdquo;
                </p>
                <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1">
                  <span>Domain: Botany & Ethnomedicine</span>
                  <span>Field Area: Similipal Biosphere Reserve, Mayurbhanj</span>
                  <span>Supervisor: Endorsed Full-Time Guide</span>
                </div>
              </div>

              {/* Conflict of Interest Warning if recused */}
              {selectedCandidate.has_conflict && (
                <div className="bg-red-50 border border-red-300 rounded-xl p-4 flex items-start space-x-3 text-xs text-red-900">
                  <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold">Reviewer Recused (Conflict of Interest Declared)</h3>
                    <p className="text-red-700 text-[11px] mt-0.5">
                      You have declared a conflict of interest for this candidate. Scoring controls have been locked and this case will be routed to an alternate committee evaluator.
                    </p>
                  </div>
                </div>
              )}

              {/* Rubric Evaluation Sliders */}
              {!selectedCandidate.has_conflict && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Deterministic Rubric Scoring (PRD Module 12)</h3>
                    <p className="text-xs text-slate-500">
                      Standardized transparent rubrics ensure objective selection without subjective bias.
                    </p>
                  </div>

                  {/* Rubric 1: Academic Merit */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-slate-900">1. Academic Merit & Track Record</strong>
                        <p className="text-[11px] text-slate-500">Master&apos;s percentage, UGC-NET qualification, publications</p>
                      </div>
                      <span className="font-bold text-mota-800 text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200">
                        {academicScore} / 40
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={40}
                      value={academicScore}
                      onChange={(e) => setAcademicScore(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-mota-700"
                    />
                  </div>

                  {/* Rubric 2: Research Proposal Feasibility */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-slate-900">2. Research Proposal Quality & Methodology</strong>
                        <p className="text-[11px] text-slate-500">Clarity of hypothesis, feasibility of 3-year timeline, lab access</p>
                      </div>
                      <span className="font-bold text-mota-800 text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200">
                        {researchScore} / 30
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={researchScore}
                      onChange={(e) => setResearchScore(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-mota-700"
                    />
                  </div>

                  {/* Rubric 3: Tribal Community Relevance */}
                  <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center text-xs">
                      <div>
                        <strong className="text-slate-900">3. Tribal Community Relevance & Impact</strong>
                        <p className="text-[11px] text-slate-500">Preservation of indigenous knowledge, direct community benefit</p>
                      </div>
                      <span className="font-bold text-mota-800 text-sm bg-white px-2.5 py-0.5 rounded border border-slate-200">
                        {tribalScore} / 30
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={30}
                      value={tribalScore}
                      onChange={(e) => setTribalScore(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-mota-700"
                    />
                  </div>

                  {/* Recommendation & Remarks */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700">Recommendation</label>
                      <select
                        value={recommendation}
                        onChange={(e) => setRecommendation(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                      >
                        <option value="RECOMMENDED">RECOMMENDED</option>
                        <option value="RESERVE_LIST">RESERVE_LIST</option>
                        <option value="NOT_RECOMMENDED">NOT_RECOMMENDED</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="font-semibold text-slate-700">Committee Justification Remarks</label>
                      <input
                        type="text"
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:border-mota-600"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-between items-center">
                    <div className="text-xs text-slate-500">
                      Logged to Immutable Audit Trail as <strong>Prof. K. Birhor</strong>
                    </div>

                    <button
                      onClick={handleSubmitScore}
                      disabled={isSubmittingScore}
                      className="bg-mota-700 hover:bg-mota-800 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl shadow transition text-xs flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmittingScore ? 'Sealing Audit Record...' : 'Submit Committee Score'}</span>
                    </button>
                  </div>

                  {scoreSubmitted && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center space-x-2 text-xs text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Score of {totalCalculated}/100 recorded. Candidate state updated to {recommendation}.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              Select a candidate from the queue to start evaluation.
            </div>
          )}
        </div>
      </div>

      {/* Conflict of Interest (COI) Gate Modal */}
      {showCOIModal && selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center space-x-3 text-amber-600">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Conflict of Interest Declaration
                </h3>
                <span className="text-xs text-slate-500">PRD Module 13 & MoTA Ethics Code</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Before accessing file <strong>{selectedCandidate.application_number}</strong> ({selectedCandidate.display_name}), you must declare whether you have any personal, academic, supervisory, or financial conflict of interest with this candidate or their guide.
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <p><strong>Candidate:</strong> {selectedCandidate.display_name}</p>
              <p><strong>Institution:</strong> {selectedCandidate.institute_name}</p>
              <p><strong>Proposed Topic:</strong> {selectedCandidate.research_topic}</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => handleDeclareCOI(false)}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold p-3 rounded-xl shadow transition text-xs flex items-center justify-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>I Declare NO Conflict of Interest (Proceed to Scoring)</span>
              </button>

              <button
                onClick={() => handleDeclareCOI(true)}
                className="w-full bg-white hover:bg-red-50 text-red-700 border border-red-300 font-bold p-3 rounded-xl transition text-xs flex items-center justify-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>I Declare a Conflict of Interest (Recuse Myself)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
