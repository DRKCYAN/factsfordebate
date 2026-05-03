import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase-service'

export const metadata = { title: 'Dashboard — Admin' }

async function getCounts() {
  const db = createServiceClient()
  const [topics, subMotions, allStats, publishedStats] = await Promise.all([
    db.from('topics').select('*', { count: 'exact', head: true }),
    db.from('sub_motions').select('*', { count: 'exact', head: true }),
    db.from('stats').select('*', { count: 'exact', head: true }),
    db.from('stats').select('*', { count: 'exact', head: true }).eq('published', true),
  ])
  return {
    topics: topics.count ?? 0,
    subMotions: subMotions.count ?? 0,
    totalStats: allStats.count ?? 0,
    publishedStats: publishedStats.count ?? 0,
  }
}

export default async function DashboardPage() {
  const counts = await getCounts()
  const draftStats = counts.totalStats - counts.publishedStats

  const cards = [
    { label: 'Topics', value: counts.topics, href: '/admin/topics' },
    { label: 'Sub-Motions', value: counts.subMotions, href: '/admin/sub-motions' },
    { label: 'Stats (total)', value: counts.totalStats, href: '/admin/stats' },
    { label: 'Published', value: counts.publishedStats, href: '/admin/stats' },
    { label: 'Drafts', value: draftStats, href: '/admin/stats' },
  ]

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-400"
          >
            <div className="text-2xl font-bold text-gray-900">{card.value}</div>
            <div className="mt-1 text-sm text-gray-500">{card.label}</div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-gray-700">Quick links</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { href: '/admin/topics', label: '+ Add topic' },
            { href: '/admin/sub-motions', label: '+ Add sub-motion' },
            { href: '/admin/stats', label: '+ Add stat' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
