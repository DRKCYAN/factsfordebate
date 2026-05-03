import { createServiceClient } from '@/lib/supabase-service'
import SubMotionsManager from '@/app/admin/_components/sub-motions-manager'
import type { Topic, SubMotion } from '@/lib/types'

export const metadata = { title: 'Sub-Motions — Admin' }

export default async function AdminSubMotionsPage() {
  const db = createServiceClient()
  const [{ data: topics }, { data: subMotions }] = await Promise.all([
    db.from('topics').select('*').order('name'),
    db.from('sub_motions').select('*, topics(name)').order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Sub-Motions</h1>
      <SubMotionsManager
        topics={(topics ?? []) as Topic[]}
        subMotions={(subMotions ?? []) as (SubMotion & { topics: { name: string } })[]}
      />
    </div>
  )
}
