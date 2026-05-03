import { cache } from 'react'
import { createSupabaseClient } from './supabase'
import type { Topic, SubMotion, Stat } from './types'

export const getTopics = cache(async (): Promise<Topic[]> => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
})

export const getTopicBySlug = cache(async (slug: string): Promise<Topic | null> => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
})

export const getSubMotionsByTopic = cache(async (topicId: string): Promise<SubMotion[]> => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('sub_motions')
    .select('*')
    .eq('topic_id', topicId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
})

export const getSubMotionBySlug = cache(async (slug: string): Promise<SubMotion | null> => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('sub_motions')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error) return null
  return data
})

export const getStatsBySubMotion = cache(async (subMotionId: string): Promise<Stat[]> => {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase
    .from('stats')
    .select('*')
    .eq('sub_motion_id', subMotionId)
    .eq('published', true)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
})
