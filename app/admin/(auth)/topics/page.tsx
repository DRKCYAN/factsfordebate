import { createServiceClient } from '@/lib/supabase-service'
import TopicsManager from '@/app/admin/_components/topics-manager'
import type { Topic } from '@/lib/types'

export const metadata = { title: 'Topics — Admin' }

export default async function AdminTopicsPage() {
  const { data } = await createServiceClient()
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-gray-900">Topics</h1>
      <TopicsManager topics={(data ?? []) as Topic[]} />
    </div>
  )
}
