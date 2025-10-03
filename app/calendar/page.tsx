"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import type { Post } from "@/lib/types"
import { Calendar, ChevronLeft, ChevronRight, Clock, TrendingUp, FileText, Sparkles } from "lucide-react"
import { CreatePostDialog } from "@/components/create-post-dialog"

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  useEffect(() => {
    setPosts(storage.getPosts())
  }, [])

  const parseDate = (date: Date | string | undefined): Date | null => {
    if (!date) return null
    if (date instanceof Date) return date
    const parsed = new Date(date)
    return isNaN(parsed.getTime()) ? null : parsed
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      const postDate = parseDate(post.scheduledDate || post.publishedDate)
      if (!postDate) return false
      return (
        postDate.getDate() === date.getDate() &&
        postDate.getMonth() === date.getMonth() &&
        postDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" })

  const days = []
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const scheduledPosts = posts.filter((p) => p.status === "scheduled" && p.scheduledDate)
  const upcomingPosts = scheduledPosts
    .sort((a, b) => {
      const dateA = parseDate(a.scheduledDate)
      const dateB = parseDate(b.scheduledDate)
      return (dateA?.getTime() || 0) - (dateB?.getTime() || 0)
    })
    .slice(0, 5)

  const refreshPosts = () => {
    setPosts(storage.getPosts())
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Content Calendar
            </h1>
          </div>
          <p className="text-muted-foreground ml-14">Schedule and manage your content calendar</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{monthName}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={previousMonth}
                    className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentDate(new Date())}
                    className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all"
                  >
                    Today
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={nextMonth}
                    className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-all bg-transparent"
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-3">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-center text-sm font-bold text-gray-600 py-3 bg-gray-50 rounded-lg">
                    {day}
                  </div>
                ))}

                {days.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="aspect-square" />
                  }

                  const date = new Date(year, month, day)
                  const dayPosts = getPostsForDate(date)
                  const isToday =
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear()

                  return (
                    <div
                      key={day}
                      className={`aspect-square border-2 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                        isToday
                          ? "bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-600 shadow-lg scale-105"
                          : "bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md hover:scale-105"
                      }`}
                    >
                      <div className={`text-sm font-bold mb-1 ${isToday ? "text-white" : "text-gray-900"}`}>{day}</div>
                      <div className="space-y-1">
                        {dayPosts.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className={`text-xs px-1.5 py-0.5 rounded-md truncate font-medium ${
                              post.status === "scheduled"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : "bg-green-100 text-green-700 border border-green-200"
                            }`}
                          >
                            {post.content.substring(0, 15)}...
                          </div>
                        ))}
                        {dayPosts.length > 2 && (
                          <div className={`text-xs font-semibold ${isToday ? "text-white" : "text-indigo-600"}`}>
                            +{dayPosts.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                Calendar Statistics
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white mb-1">{scheduledPosts.length}</div>
                  <div className="text-sm text-blue-50 font-medium">Scheduled Posts</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white mb-1">
                    {posts.filter((p) => p.status === "published").length}
                  </div>
                  <div className="text-sm text-green-50 font-medium">Published This Month</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-3xl font-bold text-white mb-1">
                    {posts.filter((p) => p.status === "draft").length}
                  </div>
                  <div className="text-sm text-purple-50 font-medium">Drafts Pending</div>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5 shadow-lg border-0 bg-white/80 backdrop-blur">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Clock className="w-5 h-5 text-indigo-600" />
                Upcoming Posts
              </h3>
              <div className="space-y-3">
                {upcomingPosts.length > 0 ? (
                  upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="border-l-4 border-l-indigo-500 pl-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-r-lg hover:shadow-md transition-shadow"
                    >
                      <div className="text-xs text-indigo-600 font-semibold mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {parseDate(post.scheduledDate) &&
                          new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          }).format(parseDate(post.scheduledDate)!)}
                      </div>
                      <div className="text-sm line-clamp-2 mb-2 text-gray-700">{post.content}</div>
                      <div className="flex gap-1 flex-wrap">
                        {post.platforms.slice(0, 3).map((platform) => (
                          <Badge key={platform} variant="outline" className="text-xs border-indigo-200 text-indigo-700">
                            {platform}
                          </Badge>
                        ))}
                        {post.platforms.length > 3 && (
                          <Badge variant="outline" className="text-xs border-indigo-200 text-indigo-700">
                            +{post.platforms.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No upcoming posts</p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-5 shadow-lg border-0 bg-white/80 backdrop-blur">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                Legend
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 rounded-md bg-blue-100 border-2 border-blue-200" />
                  <span className="text-sm font-medium text-gray-700">Scheduled</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 rounded-md bg-green-100 border-2 border-green-200" />
                  <span className="text-sm font-medium text-gray-700">Published</span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-600" />
                  <span className="text-sm font-medium text-gray-700">Today</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-lg border-0 bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5" />
                <h3 className="font-bold">Quick Schedule</h3>
              </div>
              <p className="text-sm opacity-90 mb-4">Create a new post and schedule it for later</p>
              <CreatePostDialog
                onPostCreated={refreshPosts}
                trigger={
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full font-semibold hover:scale-105 transition-transform"
                  >
                    Schedule Post
                  </Button>
                }
              />
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
