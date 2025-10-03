"use client"

import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockAnalytics, mockPlatformPerformance } from "@/lib/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { ChevronDown, Download, Calendar, BarChart3, Eye, Heart, FileText } from "lucide-react"
import * as LucideIcons from "lucide-react"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days")

  const dateRangeOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "This Month",
    "Last Month",
    "This Year",
    "All Time",
  ]

  const handleExportReport = () => {
    console.log("[v0] Exporting report for:", dateRange)
    alert(`Exporting analytics report for ${dateRange}`)
  }

  const platformData = [
    { name: "Jan 14", views: 19500 },
    { name: "Jan 21", views: 17800 },
    { name: "Jan 28", views: 16200 },
    { name: "Feb 4", views: 14500 },
    { name: "Feb 11", views: 13800 },
    { name: "Feb 18", views: 11200 },
    { name: "Feb 25", views: 9800 },
    { name: "Mar 4", views: 8500 },
    { name: "Mar 11", views: 7200 },
    { name: "Mar 18", views: 6100 },
    { name: "Mar 25", views: 5200 },
    { name: "Apr 1", views: 4300 },
    { name: "Apr 8", views: 3800 },
    { name: "Apr 15", views: 3200 },
    { name: "Apr 22", views: 2800 },
  ]

  const engagementData = [
    { name: "Likes", value: 7061, color: "#f43f5e" },
    { name: "Comments", value: 1167, color: "#10b981" },
    { name: "Shares", value: 2320, color: "#3b82f6" },
  ]

  const totalEngagement = engagementData.reduce((sum, item) => sum + item.value, 0)

  const topPosts = [
    {
      id: 1,
      content: "Behind the scenes look at our office culture 📸 We're hiring! #WorkCulture #Jobs",
      platform: "Twitter/X",
      views: 91155,
      likes: 7061,
      comments: 1167,
      engagement: 12.1,
    },
    {
      id: 2,
      content: "New product launch announcement! 🚀 Check out what we've been working on #ProductLaunch",
      platform: "LinkedIn",
      views: 78432,
      likes: 5234,
      comments: 892,
      engagement: 10.8,
    },
    {
      id: 3,
      content: "Customer success story: How we helped @company achieve 300% growth 📈 #CaseStudy",
      platform: "Instagram",
      views: 65789,
      likes: 4521,
      comments: 678,
      engagement: 9.7,
    },
  ]

  const renderMetricIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    if (Icon) {
      return <Icon className="w-6 h-6" />
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Analytics
              </h1>
            </div>
            <p className="text-muted-foreground ml-15">Comprehensive performance insights across all platforms</p>
          </div>
          <div className="flex gap-3">
            <Button
              size="sm"
              className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
              onClick={handleExportReport}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  className="shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {dateRangeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setDateRange(option)}
                    className={dateRange === option ? "bg-indigo-50 text-indigo-700 font-medium" : ""}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {mockAnalytics.map((metric, index) => (
            <Card
              key={index}
              className={`p-4 text-white bg-gradient-to-br ${
                metric.color === "bg-blue-500"
                  ? "from-blue-500 to-blue-700"
                  : metric.color === "bg-pink-500"
                    ? "from-pink-500 to-pink-700"
                    : metric.color === "bg-green-500"
                      ? "from-green-500 to-green-700"
                      : "from-purple-500 to-purple-700"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span>{renderMetricIcon(metric.icon)}</span>
                <span className={`text-xs px-2 py-0.5 rounded ${metric.change > 0 ? "bg-white/20" : "bg-black/20"}`}>
                  {metric.change > 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
                </span>
              </div>
              <div className="text-xs opacity-90">{metric.label}</div>
              <div className="text-2xl font-bold mt-0.5">
                {metric.label === "Engagement Rate" ? `${metric.value}%` : metric.value.toLocaleString()}
              </div>
              <div className="text-xs opacity-75 mt-1">vs last period</div>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Platform Performance
                </h3>
                <p className="text-sm text-muted-foreground">
                  Views and engagement by platform. Compare performance across all connected platforms.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="bg-indigo-600 text-white flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  Views
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  Engagement
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  Posts
                </Button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={platformData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="views" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Highest Views</div>
                <div className="font-semibold text-indigo-600">Rumble</div>
                <div className="text-xs text-muted-foreground">18,341 views</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Best Engagement</div>
                <div className="font-semibold text-indigo-600">Instagram</div>
                <div className="text-xs text-muted-foreground">19.3% rate</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Most Posts</div>
                <div className="font-semibold text-indigo-600">Rumble</div>
                <div className="text-xs text-muted-foreground">1 posts</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-1">Total Platforms</div>
                <div className="font-semibold text-indigo-600">15</div>
                <div className="text-xs text-muted-foreground">Connected & active</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-2">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                      <path d="M22 12A10 10 0 0 0 12 2v10z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-lg">Engagement Mix</h3>
                </div>
                <p className="text-sm text-muted-foreground">Distribution of user interactions</p>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                {totalEngagement.toLocaleString()} Total
              </Badge>
            </div>

            <div className="relative">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={engagementData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {engagementData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{totalEngagement.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mt-6 pt-6 border-t">
              {engagementData.map((item, index) => (
                <div key={index} className="group hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full ring-2 ring-white shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{item.value.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">
                        ({((item.value / totalEngagement) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 ml-7">
                    <div
                      className="h-1.5 rounded-full transition-all duration-300 group-hover:opacity-80"
                      style={{
                        backgroundColor: item.color,
                        width: `${(item.value / totalEngagement) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t bg-indigo-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. per post</span>
                <span className="font-semibold text-indigo-700">{Math.round(totalEngagement / 12)} interactions</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow border-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8.5 12.5l-5.5-2.5 5.5-2.5 2.5-5.5 2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5z" />
                  <path d="M18 14.5l-2.5-1 2.5-1 1-2.5 1 2.5 2.5 1-2.5 1-1 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">Engagement Details</h3>
                <p className="text-sm text-muted-foreground">Detailed breakdown of user interactions</p>
              </div>
            </div>

            <div className="space-y-5 mt-6">
              <div className="group hover:bg-gradient-to-r hover:from-pink-50 hover:to-transparent p-3 rounded-lg transition-all border-2 border-transparent hover:border-indigo-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Likes</span>
                      <span className="text-lg font-bold text-pink-600">7,061</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-400 to-pink-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: "66.9%" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">66.9% of total engagement</span>
                      <Badge variant="outline" className="text-xs bg-pink-50 text-pink-700 border-pink-200">
                        Highest
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-transparent p-3 rounded-lg transition-all border-2 border-transparent hover:border-indigo-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Comments</span>
                      <span className="text-lg font-bold text-green-600">1,167</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: "11.1%" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">11.1% of total engagement</span>
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Quality
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent p-3 rounded-lg transition-all border-2 border-transparent hover:border-indigo-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="17 1 21 5 17 9" />
                      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                      <polyline points="7 23 3 19 7 15" />
                      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Shares</span>
                      <span className="text-lg font-bold text-blue-600">2,320</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: "22.0%" }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">22.0% of total engagement</span>
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Viral
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t bg-gradient-to-r from-indigo-50 to-purple-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Total Engagement</div>
                  <div className="text-2xl font-bold text-indigo-700">10,548</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Avg. per post</div>
                  <div className="text-2xl font-bold text-purple-700">{Math.round(totalEngagement / 12)}</div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow border-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Platform Leaderboard</h3>
                  <p className="text-sm text-muted-foreground">Ranked by total views</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shadow-sm hover:shadow-md transition-shadow bg-transparent"
              >
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {mockPlatformPerformance.map((platform, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-4 p-3 rounded-lg hover:bg-gradient-to-r hover:from-indigo-50 hover:to-transparent transition-all"
                >
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shadow-md ${
                      index === 0
                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                        : index === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                          : index === 2
                            ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                            : "bg-gradient-to-br from-indigo-100 to-indigo-200 text-indigo-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-base">{platform.platform}</span>
                      <span className="text-base font-bold text-indigo-600">{platform.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                        {platform.posts} posts
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>
                        {platform.engagement}% engagement
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500 group-hover:from-indigo-600 group-hover:to-purple-700"
                        style={{ width: `${(platform.views / 20000) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow border-2 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.5 12.5l-5.5-2.5 5.5-2.5 2.5-5.5 2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5z" />
                <path d="M18 14.5l-2.5-1 2.5-1 1-2.5 1 2.5 2.5 1-2.5 1-1 2.5z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Top Performing Posts</h3>
              <p className="text-sm text-muted-foreground">Your best content this month</p>
            </div>
          </div>

          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div
                key={post.id}
                className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all border-2 border-transparent hover:border-indigo-200"
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                      : index === 1
                        ? "bg-gradient-to-br from-indigo-400 to-indigo-600"
                        : "bg-gradient-to-br from-purple-400 to-purple-600"
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm mb-3 leading-relaxed">{post.content}</p>
                  <div className="flex items-center gap-6 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground group-hover:text-indigo-600 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="font-semibold">{post.views.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground group-hover:text-pink-600 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      <span className="font-semibold">{post.likes.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground group-hover:text-green-600 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="font-semibold">{post.comments.toLocaleString()}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="12" y1="20" x2="12" y2="10" />
                        <line x1="18" y1="20" x2="18" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="16" />
                      </svg>
                      <span className="font-semibold">{post.engagement}%</span>
                    </span>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-indigo-200"
                >
                  {post.platform}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow border-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-lg">Quick Insights</h3>
              <p className="text-sm text-muted-foreground">Key patterns and recommendations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group p-5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl hover:shadow-lg transition-all border-2 border-blue-200 hover:border-blue-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white mb-3 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <div className="text-sm text-blue-700 font-medium mb-1">Best Performing Day</div>
              <div className="text-2xl font-bold text-blue-900 mb-1">Monday</div>
              <div className="text-xs text-blue-600">+25% above average engagement</div>
            </div>

            <div className="group p-5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl hover:shadow-lg transition-all border-2 border-purple-200 hover:border-purple-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white mb-3 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="text-sm text-purple-700 font-medium mb-1">Peak Engagement Time</div>
              <div className="text-2xl font-bold text-purple-900 mb-1">2:00 PM - 4:00 PM</div>
              <div className="text-xs text-purple-600">Most active period for your audience</div>
            </div>

            <div className="group p-5 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl hover:shadow-lg transition-all border-2 border-pink-200 hover:border-pink-300">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white mb-3 shadow-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                  <line x1="7" y1="7" x2="7.01" y2="7" />
                </svg>
              </div>
              <div className="text-sm text-pink-700 font-medium mb-1">Top Hashtag</div>
              <div className="text-2xl font-bold text-pink-900 mb-1">#ProductLaunch</div>
              <div className="text-xs text-pink-600">Used in 2 high-performing posts</div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
