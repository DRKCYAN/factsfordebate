import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Nav from '@/components/nav'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'Facts for Debate',
    template: '%s | Facts for Debate',
  },
  description:
    'A neutral reference platform for debate statistics. Find sourced data and context for both sides of any argument.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-gray-900">
        <Nav />
        <main className="flex-1">{children}</main>
        <footer className="mt-20 border-t border-gray-200">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
            <p className="text-center text-xs text-gray-400">
              Facts for Debate — all statistics are attributed to their original
              published sources. This platform does not take positions.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
