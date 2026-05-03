'use client'

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center">
        <svg
          className="h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
      </div>
      <input
        type="search"
        placeholder="Search topics and motions…"
        disabled
        aria-label="Search (coming soon)"
        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 pl-11 pr-28 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:cursor-not-allowed"
      />
      <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-400">
          Coming soon
        </span>
      </div>
    </div>
  )
}
