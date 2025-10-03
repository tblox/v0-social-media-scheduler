export type PostStatus = "draft" | "scheduled" | "published"

export interface Post {
  id: string
  content: string
  status: PostStatus
  scheduledDate?: Date
  publishedDate?: Date
  platforms: string[]
  hashtags: string[]
  likes?: number
  comments?: number
  shares?: number
  views?: number
}

export interface Platform {
  id: string
  name: string
  username: string
  icon: string
  connected: boolean
  characterLimit: number
  color: string
}

export interface AnalyticsMetric {
  label: string
  value: number
  change: number
  icon: string
  color: string
}

export interface PlatformPerformance {
  platform: string
  views: number
  engagement: number
  posts: number
}
