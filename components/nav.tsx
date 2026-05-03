import Link from 'next/link'

export default function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-gray-900 tracking-tight hover:text-gray-600 transition-colors"
        >
          Facts for Debate
        </Link>
        <span className="text-xs text-gray-400 hidden sm:block">
          Neutral · Sourced · Reference
        </span>
      </div>
    </header>
  )
}
