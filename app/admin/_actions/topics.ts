'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase-service'

type TopicData = { name: string; slug: string; description: string }
type Result = { error?: string }

export async function createTopic(data: TopicData): Promise<Result> {
  const { error } = await createServiceClient().from('topics').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function updateTopic(id: string, data: TopicData): Promise<Result> {
  const { error } = await createServiceClient().from('topics').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteTopic(id: string): Promise<Result> {
  const { error } = await createServiceClient().from('topics').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}
