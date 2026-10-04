'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ShieldCheck,
  UserCheck,
  FileSearch,
  Sliders,
  Globe2,
  LayoutDashboard,
  Award,
  HelpCircle,
  FileEdit
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Top Gov Header */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1 px-4 sm:px-8 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-white">GOVERNMENT OF INDIA</span>
          <span>•</span>
          <span>MINISTRY OF TRIBAL AFFAIRS</span>
          <span className="hidden md:inline">• SIH 2026 (SIH26239)</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-white transition">
            <Globe2 className="w-3.5 h-3.5 text-mota-500" />
            <span>English / हिन्दी / ଓଡ଼ିଆ</span>
          </button>
          <span className="bg-mota-800 text-mota-100 px-2 py-0.5 rounded text-[10px] font-mono">
            v1.0.0
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group shrink-0">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-mota-700 to-mota-900 flex items-center justify-center text-white font-bold text-xl shadow-md border border-mota-600 group-hover:scale-105 transition">
            SS
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                Scholar<span className="text-mota-700">Setu</span>
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-300">
                MoTA Portal
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Intelligent ST Fellowship & Scholarship Lifecycle Engine
            </p>
          </div>
        </Link>

        {/* Center Links */}
        <nav className="hidden lg:flex items-center space-x-5 text-xs font-semibold text-slate-700">
          <Link
            href="/"
            className={`hover:text-mota-700 transition ${pathname === '/' ? 'text-mota-800 font-bold' : ''}`}
          >
            Catalog
          </Link>
          <Link
            href="/apply/nfst"
            className={`hover:text-mota-700 transition flex items-center space-x-1 ${
              pathname?.startsWith('/apply') ? 'text-mota-800 font-bold' : ''
            }`}
          >
            <FileEdit className="w-3.5 h-3.5 text-mota-600" />
            <span>Apply (Wizard)</span>
          </Link>
          <Link
            href="/applicant/dashboard"
            className={`hover:text-mota-700 transition flex items-center space-x-1 ${
              pathname?.startsWith('/applicant/dashboard') ? 'text-mota-800 font-bold' : ''
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-mota-600" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/applicant/grievance"
            className={`hover:text-mota-700 transition flex items-center space-x-1 ${
              pathname?.startsWith('/applicant/grievance') ? 'text-mota-800 font-bold' : ''
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Grievances</span>
          </Link>
          <Link
            href="/officer"
            className={`hover:text-mota-700 transition flex items-center space-x-1 ${
              pathname?.startsWith('/officer') ? 'text-mota-800 font-bold' : ''
            }`}
          >
            <FileSearch className="w-3.5 h-3.5 text-amber-600" />
            <span>Scrutiny</span>
          </Link>
          <Link
            href="/committee"
            className={`hover:text-mota-700 transition flex items-center space-x-1 ${
              pathname?.startsWith('/committee') ? 'text-mota-800 font-bold' : ''
            }`}
          >
            <Award className="w-3.5 h-3.5 text-blue-600" />
            <span>Committee</span>
          </Link>
          <Link
            href="/admin/rules"
            className={`hover:text-mota-700 transition flex items-center space-x-1 ${
              pathname?.startsWith('/admin/rules') ? 'text-mota-800 font-bold' : ''
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-tribal-ochre" />
            <span>Rule Studio</span>
          </Link>
        </nav>

        {/* Quick Role Switcher for Jury / Live Demo */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-bold px-1.5 hidden xl:inline">Role:</span>
          <Link
            href="/applicant/dashboard"
            className={`px-2 py-1 rounded-lg font-medium transition ${
              pathname?.startsWith('/applicant') || pathname?.startsWith('/apply')
                ? 'bg-white text-mota-800 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Student Perspective (Rahul Kumar)"
          >
            Student
          </Link>
          <Link
            href="/officer"
            className={`px-2 py-1 rounded-lg font-medium transition ${
              pathname?.startsWith('/officer')
                ? 'bg-white text-mota-800 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Scrutiny Officer Perspective (Dr. Sharma)"
          >
            Officer
          </Link>
          <Link
            href="/committee"
            className={`px-2 py-1 rounded-lg font-medium transition ${
              pathname?.startsWith('/committee')
                ? 'bg-white text-mota-800 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Selection Committee Perspective (Prof. Birhor)"
          >
            Committee
          </Link>
          <Link
            href="/admin/rules"
            className={`px-2 py-1 rounded-lg font-medium transition ${
              pathname?.startsWith('/admin')
                ? 'bg-white text-mota-800 shadow-sm border border-slate-200 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="MoTA Administrator & Rule Configurator"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  )
}
