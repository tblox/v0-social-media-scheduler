"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { PostCard } from "@/components/post-card"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreatePostDialog } from "@/components/create-post-dialog"
import { storage } from "@/lib/storage"
import type { Post, PostStatus } from "@/lib/types"
import Link from "next/link"
import {
  FileText,
  CheckCircle2,
  Clock,
  Edit3,
  Calendar,
  BarChart3,
  Zap,
  Link2,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react"

const parseDate = (date: Date | string | undefined): Date | null => {
  if (!date) return null
  return date instanceof Date ? date : new Date(date)
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [filter, setFilter] = useState<"all" | PostStatus>("all")

  useEffect(() => {
    setPosts(storage.getPosts())

    const handlePostsUpdated = () => {
      setPosts(storage.getPosts())
    }

    window.addEventListener("postsUpdated", handlePostsUpdated)
    return () => window.removeEventListener("postsUpdated", handlePostsUpdated)
  }, [])

  const refreshPosts = () => {
    setPosts(storage.getPosts())
  }

  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.status === filter)

  const stats = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    draft: posts.filter((p) => p.status === "draft").length,
  }

  const publishedPercentage = stats.total > 0 ? Math.round((stats.published / stats.total) * 100) : 0
  const scheduledPercentage = stats.total > 0 ? Math.round((stats.scheduled / stats.total) * 100) : 0
  const draftPercentage = stats.total > 0 ? Math.round((stats.draft / stats.total) * 100) : 0

  const nextScheduled = posts
    .filter((p) => {
      if (p.status !== "scheduled" || !p.scheduledDate) return false
      const schedDate = parseDate(p.scheduledDate)
      return schedDate && schedDate > new Date()
    })
    .sort((a, b) => {
      const dateA = parseDate(a.scheduledDate)
      const dateB = parseDate(b.scheduledDate)
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
    })[0]

  const next24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const scheduledNext24h = posts.filter((p) => {
    if (p.status !== "scheduled" || !p.scheduledDate) return false
    const schedDate = parseDate(p.scheduledDate)
    return schedDate && schedDate <= next24Hours && schedDate > new Date()
  }).length

  const lastPublished = posts
    .filter((p) => p.status === "published" && p.publishedDate)
    .sort((a, b) => {
      const dateA = parseDate(a.publishedDate)
      const dateB = parseDate(b.publishedDate)
      return (dateB?.getTime() || 0) - (dateA?.getTime() || 0)
    })[0]

  const timeSincePublish = lastPublished?.publishedDate
    ? Math.floor((Date.now() - (parseDate(lastPublished.publishedDate)?.getTime() || 0)) / (1000 * 60 * 60))
    : null

  const oldestDraft = posts
    .filter((p) => p.status === "draft")
    .sort((a, b) => {
      const dateA = parseDate(a.createdAt)
      const dateB = parseDate(b.createdAt)
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
    })[0]

  const draftAge = oldestDraft
    ? Math.floor((Date.now() - (parseDate(oldestDraft.createdAt)?.getTime() || 0)) / (1000 * 60 * 60 * 24))
    : null

  const upcomingPosts = posts
    .filter((p) => p.status === "scheduled" && p.scheduledDate)
    .sort((a, b) => {
      const dateA = parseDate(a.scheduledDate)
      const dateB = parseDate(b.scheduledDate)
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
    })
    .slice(0, 3)

  const connectedPlatforms = storage.getPlatforms().filter((p) => p.connected).length
  const totalPlatforms = storage.getPlatforms().length

  const totalReach = stats.published * 2847 // Mock average reach per post
  const avgReachPerPost = stats.published > 0 ? Math.round(totalReach / stats.published) : 0
  const reachGrowth = 12 // Mock growth percentage

  const handleDelete = (id: string) => {
    storage.deletePost(id)
    setPosts(storage.getPosts())
  }

  const handlePublish = (id: string) => {
    storage.updatePost(id, { status: "published", publishedDate: new Date() })
    setPosts(storage.getPosts())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">Manage and monitor your social media content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 opacity-90" />
            <div className="relative p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold leading-none mb-1 drop-shadow-md">{stats.total}</div>
                  <div className="text-sm font-semibold">Total Posts</div>
                </div>
              </div>
              <div className="flex gap-3 mt-2 pt-2 border-t border-white/20 text-xs">
                <div className="flex-1">
                  <div className="font-medium mb-0.5">Published</div>
                  <div className="font-bold text-sm">{publishedPercentage}%</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-0.5">Scheduled</div>
                  <div className="font-bold text-sm">{scheduledPercentage}%</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium mb-0.5">Drafts</div>
                  <div className="font-bold text-sm">{draftPercentage}%</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-700 opacity-90" />
            <div className="relative p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold leading-none mb-1 drop-shadow-md">{stats.published}</div>
                  <div className="text-sm font-semibold">Published</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Success Rate</span>
                  <span className="font-bold text-sm">{publishedPercentage}%</span>
                </div>
                {timeSincePublish !== null && (
                  <div className="font-medium">
                    {timeSincePublish === 0
                      ? "Published recently"
                      : timeSincePublish < 24
                        ? `Last: ${timeSincePublish}h ago`
                        : `Last: ${Math.floor(timeSincePublish / 24)}d ago`}
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-700 opacity-90" />
            <div className="relative p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold leading-none mb-1 drop-shadow-md">{stats.scheduled}</div>
                  <div className="text-sm font-semibold">Scheduled</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 text-xs space-y-1">
                {scheduledNext24h > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Next 24h</span>
                    <Badge className="bg-white/20 text-white border-0 text-xs h-4 px-1.5 font-semibold">
                      {scheduledNext24h}
                    </Badge>
                  </div>
                )}
                {nextScheduled?.scheduledDate ? (
                  <div className="font-medium">
                    Next:{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    }).format(parseDate(nextScheduled.scheduledDate) || new Date())}
                  </div>
                ) : (
                  <div className="font-medium">No upcoming posts</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-700 opacity-90" />
            <div className="relative p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold leading-none mb-1 drop-shadow-md">{stats.draft}</div>
                  <div className="text-sm font-semibold">Drafts</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">In Progress</span>
                  <span className="font-bold text-sm">{draftPercentage}%</span>
                </div>
                {draftAge !== null && draftAge > 0 ? (
                  <div className="font-medium">Oldest: {draftAge}d old</div>
                ) : stats.draft > 0 ? (
                  <div className="font-medium">Ready to schedule?</div>
                ) : (
                  <div className="font-medium">All caught up!</div>
                )}
              </div>
            </div>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 opacity-90" />
            <div className="relative p-3 text-white">
              <div className="flex items-center justify-between">
                <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold leading-none mb-1 drop-shadow-md">
                    {totalReach >= 1000 ? `${(totalReach / 1000).toFixed(1)}k` : totalReach}
                  </div>
                  <div className="text-sm font-semibold">Total Reach</div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-white/20 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Avg per Post</span>
                  <span className="font-bold text-sm">
                    {avgReachPerPost >= 1000 ? `${(avgReachPerPost / 1000).toFixed(1)}k` : avgReachPerPost}
                  </span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Growth: +{reachGrowth}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  Content Library
                </h2>
                <div className="flex items-center gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
                  >
                    All Posts
                  </Button>
                  <Button
                    variant={filter === "scheduled" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("scheduled")}
                    className={filter === "scheduled" ? "bg-cyan-600 hover:bg-cyan-700" : ""}
                  >
                    <Clock className="w-4 h-4 mr-1" />
                    Scheduled
                  </Button>
                  <Button
                    variant={filter === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("draft")}
                    className={filter === "draft" ? "bg-pink-600 hover:bg-pink-700" : ""}
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Drafts
                  </Button>
                  <Button
                    variant={filter === "published" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("published")}
                    className={filter === "published" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Published
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-muted-foreground">No posts found</p>
                  </div>
                ) : (
                  filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} onDelete={handleDelete} onPublish={handlePublish} />
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 border-0 shadow-lg">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Upcoming Posts
              </h3>
              <div className="space-y-3">
                {upcomingPosts.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No scheduled posts</p>
                  </div>
                ) : (
                  upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-l-4 border-l-indigo-500 pl-4 py-3 bg-gradient-to-r from-indigo-50 to-transparent rounded-r-lg hover:from-indigo-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Clock className="w-3 h-3" />
                        {post.scheduledDate &&
                          new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }).format(parseDate(post.scheduledDate) || new Date())}
                      </div>
                      <div className="text-sm font-medium line-clamp-2 mb-2">{post.content}</div>
                      <div className="flex gap-1 flex-wrap">
                        {post.platforms.slice(0, 3).map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                        {post.platforms.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{post.platforms.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-lg">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-600" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <CreatePostDialog
                  onPostCreated={refreshPosts}
                  trigger={
                    <Button
                      variant="outline"
                      className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors bg-transparent"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Post
                      <TrendingUp className="w-4 h-4 ml-auto" />
                    </Button>
                  }
                />
                <Link href="/calendar">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors bg-transparent"
                    size="sm"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Calendar
                    <TrendingUp className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors bg-transparent"
                    size="sm"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                    <TrendingUp className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
                <Link href="/platforms">
                  <Button
                    variant="outline"
                    className="w-full justify-start hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 transition-colors bg-transparent"
                    size="sm"
                  >
                    <Link2 className="w-4 h-4 mr-2" />
                    Manage Platforms
                    <TrendingUp className="w-4 h-4 ml-auto" />
                  </Button>
                </Link>
              </div>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-95" />
              <div className="relative p-6 text-white">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Connected Platforms
                </h3>
                <div className="flex items-end gap-3 mb-4">
                  <div className="text-5xl font-bold">{connectedPlatforms}</div>
                  <div className="text-lg opacity-90 mb-2">of {totalPlatforms}</div>
                </div>
                <div className="space-y-3">
                  <div className="w-full bg-white/20 rounded-full h-3 backdrop-blur-sm">
                    <div
                      className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${(connectedPlatforms / totalPlatforms) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-90">Connection Rate</span>
                    <span className="font-semibold">{Math.round((connectedPlatforms / totalPlatforms) * 100)}%</span>
                  </div>
                </div>
                <Link href="/platforms">
                  <Button variant="secondary" size="sm" className="w-full mt-4 font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect More Platforms
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
