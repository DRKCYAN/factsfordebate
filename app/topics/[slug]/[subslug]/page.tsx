import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getTopicBySlug, getSubMotionBySlug, getStatsBySubMotion } from '@/lib/queries'
import StatCard from '@/components/stat-card'
import IframeEmbed from '@/components/iframe-embed'
import type { Stat } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string; subslug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subslug } = await params
  const subMotion = await getSubMotionBySlug(subslug)
  if (!subMotion) return {}
  return { title: subMotion.title }
}

function StatList({ stats }: { stats: Stat[] }) {
  return (
    <div className="flex flex-col gap-4">
      {stats.map((stat) =>
        stat.type === 'iframe' && stat.iframe_url ? (
          <IframeEmbed key={stat.id} stat={stat} />
        ) : (
          <StatCard key={stat.id} stat={stat} />
        )
      )}
    </div>
  )
}

export default async function SubMotionPage({ params }: Props) {
  const { slug, subslug } = await params

  const [topic, subMotion] = await Promise.all([
    getTopicBySlug(slug),
    getSubMotionBySlug(subslug),
  ])

  if (!topic || !subMotion || subMotion.topic_id !== topic.id) notFound()

  const stats = await getStatsBySubMotion(subMotion.id)

  const proStats = stats.filter((s) => s.side === 'pro')
  const conStats = stats.filter((s) => s.side === 'con')
  const neutralStats = stats.filter((s) => s.side === 'neutral')

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-sm text-gray-400">
        <Link href="/" className="transition-colors hover:text-gray-700">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          href={`/topics/${topic.slug}`}
          className="transition-colors hover:text-gray-700"
        >
          {topic.name}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-gray-700">{subMotion.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-10 border-b border-gray-200 pb-8">
        <h1 className="mb-2 text-2xl font-bold leading-snug tracking-tight text-gray-900 sm:text-3xl">
          {subMotion.title}
        </h1>
        {subMotion.description && (
          <p className="max-w-2xl text-base leading-relaxed text-gray-500">
            {subMotion.description}
          </p>
        )}
      </header>

      {/* Pro / Con columns */}
      <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Pro */}
        <section aria-label="Pro statistics">
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
              Pro
            </span>
            <span className="text-sm text-gray-400">
              {proStats.length} {proStats.length === 1 ? 'stat' : 'stats'}
            </span>
          </div>
          {proStats.length === 0 ? (
            <p className="text-sm italic text-gray-400">
              No pro statistics yet.
            </p>
          ) : (
            <StatList stats={proStats} />
          )}
        </section>

        {/* Con */}
        <section aria-label="Con statistics">
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-rose-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-rose-700">
              Con
            </span>
            <span className="text-sm text-gray-400">
              {conStats.length} {conStats.length === 1 ? 'stat' : 'stats'}
            </span>
          </div>
          {conStats.length === 0 ? (
            <p className="text-sm italic text-gray-400">
              No con statistics yet.
            </p>
          ) : (
            <StatList stats={conStats} />
          )}
        </section>
      </div>

      {/* Neutral / Context */}
      {neutralStats.length > 0 && (
        <section aria-label="Neutral and contextual data">
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-600">
              Context &amp; Data
            </span>
            <span className="text-sm text-gray-400">
              {neutralStats.length} {neutralStats.length === 1 ? 'stat' : 'stats'}
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatList stats={neutralStats} />
          </div>
        </section>
      )}
    </div>
  )
}
