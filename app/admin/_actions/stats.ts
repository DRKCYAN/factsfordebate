'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase-service'

type StatData = {
  sub_motion_id: string
  side: 'pro' | 'con' | 'neutral'
  type: 'text' | 'iframe'
  stat_text: string
  context: string
  source_name: string
  source_url: string
  source_year: number | null
  iframe_url: string | null
  published: boolean
}
type Result = { error?: string }

export async function createStat(data: StatData): Promise<Result> {
  const { error } = await createServiceClient().from('stats').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function updateStat(id: string, data: StatData): Promise<Result> {
  const { error } = await createServiceClient().from('stats').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteStat(id: string): Promise<Result> {
  const { error } = await createServiceClient().from('stats').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function toggleStatPublished(id: string, published: boolean): Promise<Result> {
  const { error } = await createServiceClient().from('stats').update({ published }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}
