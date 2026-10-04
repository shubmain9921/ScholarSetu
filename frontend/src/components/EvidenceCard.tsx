'use client'

import React, { useState } from 'react'
import { FileCheck, ShieldCheck, BookOpen, Clock, Hash, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'

export interface EvidenceCardProps {
  ruleId: string
  ruleTitle: string
  result: 'PASS' | 'NEEDS_REVIEW' | 'FAIL' | 'DEFICIENT'
  extractedValue: string
  sourceDocument: string
  authorityStamp?: string
  confidence: number // 0 to 1 or percentage
  sha256Hash: string
  policyCitation: string
  evaluatedAt: string
  explanation?: string
}

export default function EvidenceCard({
  ruleId,
  ruleTitle,
  result,
  extractedValue,
  sourceDocument,
  authorityStamp,
  confidence,
  sha256Hash,
  policyCitation,
  evaluatedAt,
  explanation
}: EvidenceCardProps) {
  const [expanded, setExpanded] = useState(false)

  const isPass = result === 'PASS'
  const isReview = result === 'NEEDS_REVIEW' || result === 'DEFICIENT'

  const formattedConf = confidence > 1 ? `${confidence.toFixed(1)}%` : `${(confidence * 100).toFixed(1)}%`

  return (
    <div className={`rounded-xl border transition-all text-xs overflow-hidden ${
      isPass
        ? 'bg-white border-forest-100 hover:border-forest-600 shadow-sm'
        : isReview
        ? 'bg-saffron-50/40 border-saffron-200 hover:border-saffron-600 shadow-sm'
        : 'bg-red-50/40 border-red-200 hover:border-red-600 shadow-sm'
    }`}>
      {/* Card Header Bar */}
      <div className="p-3.5 flex items-center justify-between border-b border-slate-100 gap-2">
        <div className="flex items-center space-x-2.5 min-w-0">
          <span className="font-mono font-bold text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 shrink-0">
            {ruleId}
          </span>
          <span className="font-semibold text-slate-900 truncate">
            {ruleTitle}
          </span>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide border ${
            isPass
              ? 'bg-forest-50 text-forest-700 border-forest-200'
              : isReview
              ? 'bg-saffron-100 text-saffron-900 border-saffron-300'
              : 'bg-red-100 text-red-800 border-red-300'
          }`}>
            {isPass ? '✓ PASS' : isReview ? '⚠ NEEDS REVIEW' : '✕ ACTION REQUIRED'}
          </span>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-100 transition"
            title="Toggle forensic details"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Primary Value & Source Body */}
      <div className="p-3.5 space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Extracted Evidence Value
            </span>
            <span className="text-sm font-black text-slate-900 font-mono">
              {extractedValue}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              AI Finding Confidence
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-forest-700 font-mono">
                {formattedConf}
              </span>
              <span className="text-[10px] text-slate-400">Layout OCR NER v4.1</span>
            </div>
          </div>
        </div>

        {explanation && (
          <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 leading-relaxed">
            {explanation}
          </p>
        )}

        {/* Expandable Forensic Provenance Layer */}
        {expanded && (
          <div className="pt-2 mt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 animate-in fade-in duration-150">
            <div className="flex items-center space-x-1.5">
              <FileCheck className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
              <span className="text-slate-500">Source:</span>
              <strong className="text-slate-800 font-mono text-[10px]">{sourceDocument}</strong>
            </div>

            {authorityStamp && (
              <div className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                <span className="text-slate-500">Authority Stamp:</span>
                <strong className="text-slate-800">{authorityStamp}</strong>
              </div>
            )}

            <div className="flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
              <span className="text-slate-500">Policy Citation:</span>
              <span className="text-slate-700 font-medium">{policyCitation}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500">Evidence SHA-256:</span>
              <span className="font-mono text-[9px] text-slate-500 bg-slate-100 px-1 py-0.5 rounded">
                {sha256Hash}
              </span>
            </div>

            <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
              <Clock className="w-3 h-3" />
              <span>Evaluated: {evaluatedAt}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
