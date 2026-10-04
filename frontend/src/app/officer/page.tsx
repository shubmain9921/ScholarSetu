'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileSearch,
  AlertCircle,
  Clock,
  ShieldCheck,
  ChevronRight,
  Filter,
  CheckCircle2,
  RefreshCw,
  Search,
  Sparkles
} from 'lucide-react'
import { API_BASE } from '@/lib/config'

export default function OfficerQueuePage() {
  const [queueData, setQueueData] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState<string>('ALL')

  const fetchQueue = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/v1/officer/queue`)
      const data = await res.json()
      setQueueData(data)
    } catch (err) {
      // Fallback demo queue if backend isn't actively reachable
      setQueueData({
        metrics: {
          critical_sla: 1,
          ai_review_required: 1,
          deficiency_active: 0,
          total_in_queue: 1
        },
        queue: [
          {
            id: 'demo-app-1',
            application_number: 'NFST-2026-000124',
            applicant_name: 'Rahul Kumar',
            scheme_code: 'NFST',
            current_status: 'UNDER_SCRUTINY',
            current_stage: 'OFFICER_EXCEPTION_SCRUTINY',
            priority: 'AI_REVIEW_REQUIRED',
            sla_status: 'WARNING_SLA',
            hours_remaining: 18,
            merit_score: 87.0,
            fast_tracked: false
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueue()
  }, [])

  const filteredQueue = queueData?.queue?.filter((item: any) => {
    if (activeTab === 'ALL') return true
    if (activeTab === 'AI_REVIEW') return item.priority === 'AI_REVIEW_REQUIRED'
    if (activeTab === 'CRITICAL_SLA') return item.sla_status === 'WARNING_SLA'
    if (activeTab === 'DEFICIENCY') return item.priority === 'DEFICIENCY_PENDING'
    return true
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-mota-700 uppercase tracking-wider">
            <FileSearch className="w-4 h-4" />
            <span>MoTA Officer Scrutiny Console</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            Exception-Based Scrutiny Queue
          </h1>
          <p className="text-slate-500 text-sm">
            Reviewing only cases flagged with low extraction confidence, document deficiencies, or policy anomalies.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchQueue}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-semibold transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards (PRD Section 19) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-rose-800">
            <span>Critical SLA (&lt; 24h)</span>
            <Clock className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-900">
            {queueData?.metrics?.critical_sla ?? 1}
          </div>
          <span className="text-[11px] text-rose-700 font-medium">Requires immediate action</span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-amber-800">
            <span>AI Review Required</span>
            <AlertCircle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-900">
            {queueData?.metrics?.ai_review_required ?? 1}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Fuzzy or authority mismatch</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-blue-800">
            <span>Deficiency Pending</span>
            <FileSearch className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-900">
            {queueData?.metrics?.deficiency_active ?? 0}
          </div>
          <span className="text-[11px] text-blue-700 font-medium">Awaiting student correction</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-1">
          <div className="flex justify-between items-center text-xs font-bold text-slate-700">
            <span>Total Active in Queue</span>
            <ShieldCheck className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {queueData?.metrics?.total_in_queue ?? 1}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Filtered from 12,480 cohort</span>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            All Exceptions
          </button>
          <button
            onClick={() => setActiveTab('AI_REVIEW')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'AI_REVIEW' ? 'bg-white text-amber-800 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            AI Review Required
          </button>
          <button
            onClick={() => setActiveTab('CRITICAL_SLA')}
            className={`px-3 py-1.5 rounded-lg transition ${
              activeTab === 'CRITICAL_SLA' ? 'bg-white text-rose-800 shadow-sm' : 'hover:text-slate-900'
            }`}
          >
            Critical SLA
          </button>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredQueue?.length || 0}</strong> pending exception(s)
        </div>
      </div>

      {/* Queue Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Application No.</th>
                <th className="px-6 py-4">Applicant Name</th>
                <th className="px-6 py-4">Scheme</th>
                <th className="px-6 py-4">Exception Reason</th>
                <th className="px-6 py-4">SLA Remaining</th>
                <th className="px-6 py-4">Merit Score</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueue?.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    {item.application_number}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {item.applicant_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded border border-emerald-300">
                      {item.scheme_code}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center space-x-1 text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>{item.priority === 'AI_REVIEW_REQUIRED' ? 'Name Fuzzy / Income Verify' : 'Routine Verification'}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium">
                    <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold border border-rose-200">
                      {item.hours_remaining} hrs left
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {item.merit_score ? `${item.merit_score}/100` : '—'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/officer/${item.id}`}
                      className="inline-flex items-center space-x-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition"
                    >
                      <span>Review Case</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
