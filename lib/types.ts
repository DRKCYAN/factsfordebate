export type Topic = {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export type SubMotion = {
  id: string
  topic_id: string
  title: string
  slug: string
  description: string | null
  created_at: string
}

export type StatSide = 'pro' | 'con' | 'neutral'
export type StatType = 'text' | 'iframe'

export type Stat = {
  id: string
  sub_motion_id: string
  side: StatSide
  type: StatType
  stat_text: string
  context: string | null
  source_name: string
  source_url: string
  source_year: number | null
  iframe_url: string | null
  published: boolean
  created_at: string
}
