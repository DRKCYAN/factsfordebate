'use server'

import { revalidatePath } from 'next/cache'
import { createServiceClient } from '@/lib/supabase-service'

type SubMotionData = { topic_id: string; title: string; slug: string; description: string }
type Result = { error?: string }

export async function createSubMotion(data: SubMotionData): Promise<Result> {
  const { error } = await createServiceClient().from('sub_motions').insert(data)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function updateSubMotion(id: string, data: SubMotionData): Promise<Result> {
  const { error } = await createServiceClient().from('sub_motions').update(data).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}

export async function deleteSubMotion(id: string): Promise<Result> {
  const { error } = await createServiceClient().from('sub_motions').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/', 'layout')
  return {}
}
