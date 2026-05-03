import type { Stat, StatSide } from '@/lib/types'

interface Props {
  stat: Stat
}

const leftBorder: Record<StatSide, string> = {
  pro: 'border-l-4 border-l-emerald-400',
  con: 'border-l-4 border-l-rose-400',
  neutral: 'border-l-4 border-l-slate-300',
}

export default function StatCard({ stat }: Props) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-5 ${leftBorder[stat.side]}`}
    >
      <p className="text-sm font-medium leading-relaxed text-gray-900">
        {stat.stat_text}
      </p>

      {stat.context && (
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          {stat.context}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <span className="text-xs text-gray-400">
          {stat.source_name}
          {stat.source_year ? `, ${stat.source_year}` : ''}
        </span>
        <a
          href={stat.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-blue-700"
        >
          View Source
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  )
}
