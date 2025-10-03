"use client"

import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Inbox,
  Search,
  Star,
  Archive,
  Reply,
  MoreVertical,
  CheckCircle2,
  Clock,
  TrendingUp,
  MessageSquare,
  Send,
  X,
} from "lucide-react"
import { useState } from "react"

export default function InboxPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [replyText, setReplyText] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      platform: "Twitter/X",
      platformColor: "bg-black",
      user: "@johndoe",
      avatar: "JD",
      message: "Love your latest post! When is the next product launch?",
      time: "2 hours ago",
      unread: true,
      starred: false,
      sentiment: "positive",
    },
    {
      id: 2,
      platform: "Instagram",
      platformColor: "bg-gradient-to-br from-purple-500 to-pink-500",
      user: "@sarahsmith",
      avatar: "SS",
      message: "Can you share more details about your office culture?",
      time: "5 hours ago",
      unread: true,
      starred: true,
      sentiment: "neutral",
    },
    {
      id: 3,
      platform: "Facebook",
      platformColor: "bg-blue-600",
      user: "Mike Johnson",
      avatar: "MJ",
      message: "Interested in the job openings. How can I apply?",
      time: "1 day ago",
      unread: false,
      starred: false,
      sentiment: "positive",
    },
    {
      id: 4,
      platform: "LinkedIn",
      platformColor: "bg-blue-700",
      user: "Emily Chen",
      avatar: "EC",
      message: "Great insights on your recent article about remote work trends!",
      time: "2 days ago",
      unread: false,
      starred: true,
      sentiment: "positive",
    },
  ])

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return msg.unread
    if (filter === "starred") return msg.starred
    if (filter === "archived") return false
    return true
  })

  const unreadCount = messages.filter((m) => m.unread).length

  const handleReply = (messageId: number) => {
    setReplyingTo(messageId)
    setReplyText("")
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
    setReplyText("")
  }

  const handleSendReply = (messageId: number) => {
    console.log(`Sending reply to message ${messageId}:`, replyText)
    setReplyingTo(null)
    setReplyText("")
  }

  const toggleStar = (messageId: number) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, starred: !msg.starred } : msg)))
  }

  const archiveMessage = (messageId: number) => {
    console.log(`Archiving message ${messageId}`)
    alert(`Message ${messageId} archived successfully`)
  }

  const markAsRead = (messageId: number) => {
    setMessages(messages.map((msg) => (msg.id === messageId ? { ...msg, unread: false } : msg)))
  }

  const showMoreOptions = (messageId: number) => {
    console.log(`Showing more options for message ${messageId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
              <Inbox className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Inbox</h1>
            {unreadCount > 0 && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0">{unreadCount} new</Badge>
            )}
          </div>
          <p className="text-muted-foreground">Manage messages and interactions from all platforms</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "bg-gradient-to-r from-indigo-500 to-purple-600" : ""}
                  >
                    All
                  </Button>
                  <Button
                    variant={filter === "unread" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("unread")}
                    className={filter === "unread" ? "bg-gradient-to-r from-blue-500 to-cyan-600" : ""}
                  >
                    Unread
                  </Button>
                  <Button
                    variant={filter === "starred" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter("starred")}
                    className={filter === "starred" ? "bg-gradient-to-r from-amber-500 to-orange-600" : ""}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="divide-y shadow-sm">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 hover:bg-gray-50 transition-colors ${msg.unread ? "bg-blue-50/50" : ""}`}
                >
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div
                      className={`w-10 h-10 rounded-full ${msg.platformColor} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}
                    >
                      {msg.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{msg.user}</span>
                          <Badge variant="outline" className="text-xs">
                            {msg.platform}
                          </Badge>
                          {msg.unread && <Badge className="bg-blue-500 text-white text-xs border-0">New</Badge>}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{msg.time}</span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => toggleStar(msg.id)}>
                            {msg.starred ? (
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            ) : (
                              <Star className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-gray-700 mb-3">{msg.message}</p>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs bg-transparent"
                          onClick={() => handleReply(msg.id)}
                        >
                          <Reply className="w-3 h-3 mr-1" />
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => archiveMessage(msg.id)}
                        >
                          <Archive className="w-3 h-3 mr-1" />
                          Archive
                        </Button>
                        {msg.unread && (
                          <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => markAsRead(msg.id)}>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Mark Read
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 ml-auto"
                          onClick={() => showMoreOptions(msg.id)}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === msg.id && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">Reply to {msg.user}</span>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={handleCancelReply}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Type your reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="mb-2 min-h-[80px] resize-none"
                            autoFocus
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{replyText.length} characters</span>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={handleCancelReply}>
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleSendReply(msg.id)}
                                disabled={!replyText.trim()}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Send Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-5 shadow-sm bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5" />
                <h3 className="font-semibold">Inbox Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded">
                      <Inbox className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Unread</span>
                  </div>
                  <span className="font-bold text-xl">{unreadCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Total Messages</span>
                  </div>
                  <span className="font-bold text-xl">{messages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white/20 rounded">
                      <Star className="w-4 h-4" />
                    </div>
                    <span className="text-sm">Starred</span>
                  </div>
                  <span className="font-bold text-xl">{messages.filter((m) => m.starred).length}</span>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold">Response Stats</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-semibold text-green-600">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: "95%" }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-muted-foreground">Avg Response Time</span>
                    <span className="font-semibold">2.5h</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Clock className="w-3 h-3" />
                    <span>15% faster than last week</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-5 shadow-sm">
              <h3 className="font-semibold mb-3">Platform Breakdown</h3>
              <div className="space-y-2">
                {["Twitter/X", "Instagram", "Facebook", "LinkedIn"].map((platform, idx) => {
                  const count = messages.filter((m) => m.platform === platform).length
                  const percentage = (count / messages.length) * 100
                  return (
                    <div key={platform}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{platform}</span>
                        <span className="text-xs text-muted-foreground">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${
                            idx === 0
                              ? "bg-black"
                              : idx === 1
                                ? "bg-gradient-to-br from-purple-500 to-pink-500"
                                : idx === 2
                                  ? "bg-blue-600"
                                  : "bg-blue-700"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
