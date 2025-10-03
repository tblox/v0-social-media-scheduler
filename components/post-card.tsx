"use client"

import type { Post } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { FileText, Clock, CheckCircle, Calendar, Edit2, Trash2, Eye, Heart, MessageCircle, Send } from "lucide-react"

interface PostCardProps {
  post: Post
  onEdit?: (post: Post) => void
  onDelete?: (id: string) => void
  onPublish?: (id: string) => void
}

export function PostCard({ post, onEdit, onDelete, onPublish }: PostCardProps) {
  const statusConfig = {
    draft: { label: "DRAFT", color: "bg-gray-500", Icon: FileText },
    scheduled: { label: "SCHEDULED", color: "bg-blue-500", Icon: Clock },
    published: { label: "PUBLISHED", color: "bg-green-500", Icon: CheckCircle },
  }

  const config = statusConfig[post.status]
  const StatusIcon = config.Icon

  const formatDate = (date?: Date) => {
    if (!date) return ""
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card
      className={cn(
        "p-4 border-l-4",
        post.status === "scheduled" && "bg-blue-50 border-l-blue-500",
        post.status === "draft" && "bg-gray-50 border-l-gray-500",
        post.status === "published" && "bg-green-50 border-l-green-500",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className={cn(config.color, "text-white text-xs flex items-center gap-1")}>
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </Badge>
          {post.scheduledDate && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.scheduledDate)}
            </span>
          )}
          {post.publishedDate && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(post.publishedDate)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit?.(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => onDelete?.(post.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-sm mb-3 leading-relaxed">{post.content}</p>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {post.platforms.map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
          {post.platforms.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{post.platforms.length - 4} more
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {post.views !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views}
            </span>
          )}
          {post.likes !== undefined && (
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {post.likes}
            </span>
          )}
          {post.comments !== undefined && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments}
            </span>
          )}
        </div>
      </div>

      {post.status === "draft" && (
        <div className="mt-3 pt-3 border-t flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Preview
          </Button>
          <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
            <Edit2 className="w-3 h-3" />
            Edit
          </Button>
          <Button
            size="sm"
            className="text-xs bg-green-600 hover:bg-green-700 text-white ml-auto flex items-center gap-1"
            onClick={() => onPublish?.(post.id)}
          >
            <Send className="w-3 h-3" />
            Publish
          </Button>
        </div>
      )}
    </Card>
  )
}
