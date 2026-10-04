'use client'

import React, { useState, useEffect } from 'react'
import { Eye, Globe2, Wifi, WifiOff, Type, Check, HelpCircle } from 'lucide-react'

export default function AccessibilityToolbar() {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal')
  const [isLowBandwidth, setIsLowBandwidth] = useState<boolean>(false)
  const [currentLang, setCurrentLang] = useState<'en' | 'hi' | 'or'>('en')

  const toggleLowBandwidth = () => {
    const next = !isLowBandwidth
    setIsLowBandwidth(next)
    if (typeof document !== 'undefined') {
      if (next) {
        document.body.classList.add('low-bandwidth')
      } else {
        document.body.classList.remove('low-bandwidth')
      }
    }
  }

  const changeFontSize = (size: 'normal' | 'large' | 'xlarge') => {
    setFontSize(size)
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize =
        size === 'xlarge' ? '18px' : size === 'large' ? '16px' : '14px'
    }
  }

  return (
    <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800 flex flex-wrap justify-between items-center gap-2">
      {/* Sovereign Header Left */}
      <div className="flex items-center space-x-2 text-[11px]">
        <span className="font-bold text-white tracking-wide">भारत सरकार • GOVERNMENT OF INDIA</span>
        <span className="text-slate-600">|</span>
        <span className="font-semibold text-slate-300">MINISTRY OF TRIBAL AFFAIRS (जनजातीय कार्य मंत्रालय)</span>
        <span className="hidden lg:inline text-slate-500">• SIH 2026 (SIH26239)</span>
      </div>

      {/* Accessibility & Language Controls Right */}
      <div className="flex items-center space-x-3 text-[11px]">
        {/* Language Selector */}
        <div className="flex items-center space-x-1.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
          <Globe2 className="w-3.5 h-3.5 text-saffron-500" />
          <button
            onClick={() => setCurrentLang('en')}
            className={`hover:text-white transition font-medium ${currentLang === 'en' ? 'text-white font-bold' : 'text-slate-400'}`}
          >
            English
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => setCurrentLang('hi')}
            className={`hover:text-white transition font-medium ${currentLang === 'hi' ? 'text-white font-bold' : 'text-slate-400'}`}
          >
            हिन्दी
          </button>
          <span className="text-slate-600">/</span>
          <button
            onClick={() => setCurrentLang('or')}
            className={`hover:text-white transition font-medium ${currentLang === 'or' ? 'text-white font-bold' : 'text-slate-400'}`}
          >
            ଓଡ଼ିଆ
          </button>
        </div>

        {/* Text Sizing */}
        <div className="flex items-center space-x-1 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
          <Type className="w-3 h-3 text-slate-400 mr-0.5" />
          <button
            onClick={() => changeFontSize('normal')}
            className={`px-1 rounded hover:text-white ${fontSize === 'normal' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            title="Standard Text Size"
          >
            A
          </button>
          <button
            onClick={() => changeFontSize('large')}
            className={`px-1 rounded hover:text-white ${fontSize === 'large' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'}`}
            title="Large Text (+2px)"
          >
            A+
          </button>
        </div>

        {/* Low-Bandwidth Mode Button */}
        <button
          onClick={toggleLowBandwidth}
          className={`flex items-center space-x-1 px-2 py-0.5 rounded border transition ${
            isLowBandwidth
              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Toggle 2G/3G Low-Bandwidth Mode (disables animations and compresses assets)"
        >
          {isLowBandwidth ? <WifiOff className="w-3 h-3 text-emerald-400" /> : <Wifi className="w-3 h-3 text-slate-400" />}
          <span className="hidden sm:inline">{isLowBandwidth ? '2G Lite: ON' : 'Low-Bandwidth'}</span>
        </button>

        {/* Version Badge */}
        <span className="bg-forest-900/60 text-forest-300 px-2 py-0.5 rounded text-[10px] font-mono border border-forest-800/60">
          v1.0 DPI
        </span>
      </div>
    </div>
  )
}
