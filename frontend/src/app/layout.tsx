import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import AIAssistantWidget from '@/components/AIAssistantWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScholarSetu — ST Fellowship & Scholarship Lifecycle Platform',
  description: 'Intelligent, Configurable, and Auditable Platform for Scheduled Tribe Schemes (Ministry of Tribal Affairs)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
        <AIAssistantWidget />
      </body>
    </html>
  )
}
