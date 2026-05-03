import type { Metadata } from 'next'
import { getTopics } from '@/lib/queries'
import TopicCard from '@/components/topic-card'
import SearchBar from '@/components/search-bar'

export const metadata: Metadata = {
  title: 'Facts for Debate — Neutral Debate Reference',
}

export default async function HomePage() {
  const topics = await getTopics()
  const featured = topics.slice(0, 3)

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Facts for Debate
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-gray-500 sm:text-lg">
          Find sourced statistics for both sides of any argument. Neutral,
          referenced, and organised by topic.
        </p>
        <SearchBar />
      </section>

      {/* Featured / Recently Added */}
      {featured.length > 0 && (
        <section className="mb-14">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Recently Added
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((topic) => (
              <TopicCard key={topic.id} topic={topic} featured />
            ))}
          </div>
        </section>
      )}

      {/* Browse All */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Browse Topics
        </h2>
        {topics.length === 0 ? (
          <p className="text-sm text-gray-400">No topics available yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
