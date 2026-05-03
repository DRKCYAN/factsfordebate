import Link from 'next/link'
import type { Topic } from '@/lib/types'

interface Props {
  topic: Topic
  featured?: boolean
}

export default function TopicCard({ topic, featured = false }: Props) {
  return (
    <Link
      href={`/topics/${topic.slug}`}
      className="group block rounded-lg border border-gray-200 p-5 transition-all duration-150 hover:border-gray-400 hover:shadow-sm"
    >
      <h3
        className={`font-semibold text-gray-900 transition-colors group-hover:text-blue-700 ${
          featured ? 'text-lg' : 'text-base'
        }`}
      >
        {topic.name}
      </h3>
      {topic.description && (
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-500">
          {topic.description}
        </p>
      )}
      <span className="mt-3 inline-block text-xs text-gray-400 transition-colors group-hover:text-blue-600">
        Explore →
      </span>
    </Link>
  )
}
