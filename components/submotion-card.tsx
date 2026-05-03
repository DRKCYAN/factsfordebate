import Link from 'next/link'
import type { SubMotion } from '@/lib/types'

interface Props {
  subMotion: SubMotion
  topicSlug: string
}

export default function SubMotionCard({ subMotion, topicSlug }: Props) {
  return (
    <Link
      href={`/topics/${topicSlug}/${subMotion.slug}`}
      className="group flex items-start justify-between gap-4 rounded-lg border border-gray-200 px-5 py-4 transition-all duration-150 hover:border-gray-400 hover:shadow-sm"
    >
      <div className="min-w-0">
        <h3 className="font-medium leading-snug text-gray-900 transition-colors group-hover:text-blue-700">
          {subMotion.title}
        </h3>
        {subMotion.description && (
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            {subMotion.description}
          </p>
        )}
      </div>
      <span className="mt-0.5 flex-shrink-0 text-lg leading-none text-gray-400 transition-colors group-hover:text-blue-600">
        →
      </span>
    </Link>
  )
}
