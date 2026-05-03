import { createServiceClient } from '@/lib/supabase-service'
import StatsManager from '@/app/admin/_components/stats-manager'
import type { Stat, SubMotion, Topic } from '@/lib/types'

export const metadata = { title: 'Stats — Admin' }

export default async function AdminStatsPage() {
  const db = createServiceClient()
  const [{ data: stats }, { data: subMotions }] = await Promise.all([
    db
      .from('stats')
      .select('*, sub_motions(title, topics(name))')
      .order('created_at', { ascending: false }),
    db.from('sub_motions').select('*, topics(name)').order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Stats</h1>
      <StatsManager
        stats={(stats ?? []) as (Stat & { sub_motions: { title: string; topics: { name: string } } })[]}
        subMotions={(subMotions ?? []) as (SubMotion & { topics: { name: string } })[]}
      />
    </div>
  )
}
