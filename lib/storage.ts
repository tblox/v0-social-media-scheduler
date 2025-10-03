import type { Post, Platform } from "./types"
import { mockPosts, mockPlatforms } from "./mock-data"

const POSTS_KEY = "social-scheduler-posts"
const PLATFORMS_KEY = "social-scheduler-platforms"

export const storage = {
  getPosts: (): Post[] => {
    if (typeof window === "undefined") return mockPosts
    const stored = localStorage.getItem(POSTS_KEY)
    return stored
      ? JSON.parse(stored, (key, value) => {
          if (key === "scheduledDate" || key === "publishedDate") {
            return value ? new Date(value) : undefined
          }
          return value
        })
      : mockPosts
  },

  savePosts: (posts: Post[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
    }
  },

  getPlatforms: (): Platform[] => {
    if (typeof window === "undefined") return mockPlatforms
    const stored = localStorage.getItem(PLATFORMS_KEY)
    return stored ? JSON.parse(stored) : mockPlatforms
  },

  savePlatforms: (platforms: Platform[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(PLATFORMS_KEY, JSON.stringify(platforms))
    }
  },

  addPost: (post: Post) => {
    const posts = storage.getPosts()
    posts.unshift(post)
    storage.savePosts(posts)
  },

  updatePost: (id: string, updates: Partial<Post>) => {
    const posts = storage.getPosts()
    const index = posts.findIndex((p) => p.id === id)
    if (index !== -1) {
      posts[index] = { ...posts[index], ...updates }
      storage.savePosts(posts)
    }
  },

  deletePost: (id: string) => {
    const posts = storage.getPosts().filter((p) => p.id !== id)
    storage.savePosts(posts)
  },

  togglePlatformConnection: (platformId: string) => {
    const platforms = storage.getPlatforms()
    const platform = platforms.find((p) => p.id === platformId)
    if (platform) {
      platform.connected = !platform.connected
      storage.savePlatforms(platforms)
    }
  },
}
