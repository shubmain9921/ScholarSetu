'use client'

import React from 'react'
import { User, FileText, Sliders, UserCheck, Award, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react'

export default function DigitalSetuFlow() {
  const steps = [
    {
      id: 1,
      title: 'Student Identity',
      subtitle: 'Aadhaar e-KYC & ST Domicile',
      icon: User,
      color: 'bg-indigo-700 text-white',
      borderColor: 'border-indigo-600',
      badge: 'Step 1'
    },
    {
      id: 2,
      title: 'Evidence Vault',
      subtitle: 'Vector Documents & SHA-256',
      icon: FileText,
      color: 'bg-blue-600 text-white',
      borderColor: 'border-blue-500',
      badge: 'AI Assists'
    },
    {
      id: 3,
      title: 'Policy Engine',
      subtitle: 'Deterministic JSON AST',
      icon: Sliders,
      color: 'bg-saffron-600 text-white',
      borderColor: 'border-saffron-500',
      badge: 'Rules Evaluate'
    },
    {
      id: 4,
      title: 'Human Officer',
      subtitle: 'Authoritative Scrutiny Decision',
      icon: UserCheck,
      color: 'bg-forest-700 text-white',
      borderColor: 'border-forest-600',
      badge: 'Humans Decide'
    },
    {
      id: 5,
      title: 'Bridge to Opportunity',
      subtitle: 'Direct Benefit Transfer & Award',
      icon: Award,
      color: 'bg-indigo-900 text-white',
      borderColor: 'border-indigo-800',
      badge: 'Success'
    }
  ]

  return (
    <div className="w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border border-slate-800 relative overflow-hidden">
      {/* Decorative Subtle Bridge Graphic Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-saffron-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-3 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center space-x-1.5 bg-saffron-500/10 text-saffron-400 px-3 py-1 rounded-full text-xs font-bold border border-saffron-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Digital Setu Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2">
            The Bridge of Opportunity & Evidence
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl">
            How ScholarSetu transforms slow, paper-heavy scrutiny into an evidence-driven, accountable journey where AI assists and humans govern.
          </p>
        </div>

        <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-[11px] text-slate-300 font-mono">
          Axiom: AI Assists → Evidence Supports → Rules Evaluate → Humans Decide
        </div>
      </div>

      {/* Nodes on Pathway */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
        {steps.map((s, idx) => {
          const Icon = s.icon
          return (
            <div
              key={s.id}
              className="bg-slate-800/90 hover:bg-slate-800 border border-slate-700 p-4 rounded-2xl space-y-3 transition group relative"
            >
              <div className="flex justify-between items-center">
                <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center shadow-md group-hover:scale-105 transition`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {s.badge}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white group-hover:text-saffron-400 transition">
                  {s.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  {s.subtitle}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-20 pointer-events-none text-slate-600">
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
