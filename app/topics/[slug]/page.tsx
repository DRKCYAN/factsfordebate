import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTopicBySlug, getSubMotionsByTopic } from '@/lib/queries'
import SubMotionCard from '@/components/submotion-card'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const topic = await getTopicBySlug(slug)
  if (!topic) return {}
  return { title: topic.name }
}

export default async function TopicPage({ params }: Props) {
  const { slug } = await params
  const topic = await getTopicBySlug(slug)
  if (!topic) notFound()

  const subMotions = await getSubMotionsByTopic(topic.id)

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="transition-colors hover:text-gray-700">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-700">{topic.name}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900">
          {topic.name}
        </h1>
        {topic.description && (
          <p className="max-w-2xl text-base leading-relaxed text-gray-500">
            {topic.description}
          </p>
        )}
      </header>

      {/* Sub-motions */}
      <section>
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">
          Debate Motions
        </h2>
        {subMotions.length === 0 ? (
          <p className="text-sm text-gray-400">No motions added yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {subMotions.map((sm) => (
              <SubMotionCard key={sm.id} subMotion={sm} topicSlug={topic.slug} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
