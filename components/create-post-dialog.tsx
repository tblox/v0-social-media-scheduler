"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { storage } from "@/lib/storage"
import type { Post } from "@/lib/types"
import {
  Bold,
  Italic,
  Smile,
  Plus,
  Save,
  Clock,
  Send,
  Upload,
  X,
  Bird,
  MessageCircle,
  Facebook,
  Camera,
  Hash,
  Instagram,
  MessageSquare,
  Linkedin,
  FileText,
  Pin,
  HelpCircle,
  Bot,
  Video,
  Ghost,
  Newspaper,
  Music,
  Flag,
  Smartphone,
  Gamepad2,
  Twitter,
  Phone,
  Film,
  Youtube,
  CalendarIcon,
  type LucideIcon,
} from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface CreatePostDialogProps {
  onPostCreated?: () => void
  trigger?: React.ReactNode
}

const COMMON_EMOJIS = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "👍",
  "👎",
  "👏",
  "🙌",
  "👐",
  "🤝",
  "🙏",
  "✨",
  "💫",
  "⭐",
  "🔥",
  "💯",
  "✅",
  "❌",
  "⚡",
  "💪",
  "🎉",
  "🎊",
  "🎈",
  "🎁",
]

const PLATFORM_POST_TYPES: Record<string, string[]> = {
  facebook: ["Post", "Story", "Reel"],
  instagram: ["Post", "Story", "Reel"],
  twitter: ["Post", "Thread"],
  linkedin: ["Post", "Article"],
  tiktok: ["Video"],
}

const ICON_MAP: Record<string, LucideIcon> = {
  Bird,
  MessageCircle,
  Facebook,
  Camera,
  Hash,
  Instagram,
  MessageSquare,
  Linkedin,
  FileText,
  Pin,
  HelpCircle,
  Bot,
  Video,
  Ghost,
  Newspaper,
  Send,
  Music,
  Flag,
  Smartphone,
  Gamepad2,
  Twitter,
  Phone,
  Film,
  Youtube,
}

export function CreatePostDialog({ onPostCreated, trigger }: CreatePostDialogProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [postTypes, setPostTypes] = useState<Record<string, string>>({})
  const [uploadedMedia, setUploadedMedia] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const platforms = storage.getPlatforms().filter((p) => p.connected)

  const insertFormatting = (prefix: string, suffix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    const beforeText = content.substring(0, start)
    const afterText = content.substring(end)

    const newText = `${beforeText}${prefix}${selectedText || "text"}${suffix}${afterText}`
    setContent(newText)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + prefix.length + (selectedText || "text").length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const beforeText = content.substring(0, start)
    const afterText = content.substring(start)

    const newText = `${beforeText}${emoji}${afterText}`
    setContent(newText)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + emoji.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/"),
    )

    setUploadedMedia((prev) => [...prev, ...files])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedMedia((prev) => [...prev, ...files])
    }
  }

  const removeMedia = (index: number) => {
    setUploadedMedia((prev) => prev.filter((_, i) => i !== index))
  }

  const getPlatformCharacterStatus = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId)
    if (!platform) return { count: content.length, limit: 0, percentage: 0, isOverLimit: false }

    const count = content.length
    const limit = platform.characterLimit
    const percentage = (count / limit) * 100
    const isOverLimit = count > limit

    return { count, limit, percentage, isOverLimit }
  }

  const handleSubmit = (status: "draft" | "scheduled" | "published") => {
    const newPost: Post = {
      id: Date.now().toString(),
      content,
      status,
      platforms: selectedPlatforms,
      hashtags: content.match(/#\w+/g) || [],
    }

    if (status === "scheduled" && selectedDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":")
      const scheduledDateTime = new Date(selectedDate)
      scheduledDateTime.setHours(Number.parseInt(hours), Number.parseInt(minutes))
      newPost.scheduledDate = scheduledDateTime
    }

    if (status === "published") {
      newPost.publishedDate = new Date()
    }

    storage.addPost(newPost)
    setOpen(false)
    setContent("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setSelectedPlatforms([])
    setPostTypes({})
    setUploadedMedia([])
    onPostCreated?.()
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) => {
      const newPlatforms = prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId]

      if (!prev.includes(platformId) && PLATFORM_POST_TYPES[platformId]) {
        setPostTypes((prevTypes) => ({
          ...prevTypes,
          [platformId]: PLATFORM_POST_TYPES[platformId][0],
        }))
      }

      return newPlatforms
    })
  }

  const hasOverLimitPlatform = selectedPlatforms.some((platformId) => {
    const status = getPlatformCharacterStatus(platformId)
    return status.isOverLimit
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg">
            <Plus className="w-4 h-4 mr-1.5" />
            New Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Post</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {selectedPlatforms.length > 0 && (
            <div className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-lg border">
              <Label className="text-base font-semibold mb-3 block">Post Type</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {selectedPlatforms.map((platformId) => {
                  const platform = platforms.find((p) => p.id === platformId)
                  const types = PLATFORM_POST_TYPES[platformId] || ["Post"]
                  const IconComponent = platform?.icon ? ICON_MAP[platform.icon] : null

                  return (
                    <div key={platformId} className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span>{platform?.name}</span>
                      </div>
                      <Select
                        value={postTypes[platformId] || types[0]}
                        onValueChange={(value) => setPostTypes((prev) => ({ ...prev, [platformId]: value }))}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {types.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
            <Label htmlFor="content" className="text-base font-semibold mb-2 block">
              Post Content
            </Label>

            <div className="flex items-center gap-2 mb-2 p-2 border rounded-lg bg-background">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("**", "**")}
                className="h-8 w-8 p-0"
                title="Bold"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("*", "*")}
                className="h-8 w-8 p-0"
                title="Italic"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
              <Popover>
                <PopoverTrigger asChild>
                  <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Emoji">
                    <Smile className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-2">
                  <div className="grid grid-cols-10 gap-1">
                    {COMMON_EMOJIS.map((emoji, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="text-xl hover:bg-muted rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <div className="h-4 w-px bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-8 p-0"
                title="Upload Media"
              >
                <Upload className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground ml-auto">Use **bold** and *italic* for formatting</span>
            </div>

            <Textarea
              ref={textareaRef}
              id="content"
              placeholder="What's on your mind? Use #hashtags to categorize your content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-32 resize-none bg-background"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">{content.length} characters</span>
              <span className="text-sm text-muted-foreground">{content.match(/#\w+/g)?.length || 0} hashtags</span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {uploadedMedia.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
                {uploadedMedia.map((file, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={URL.createObjectURL(file) || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{file.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Label className="text-base font-semibold mb-3 block">Select Platforms</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-2 border rounded-lg">
              {platforms.map((platform) => {
                const status = getPlatformCharacterStatus(platform.id)
                const isSelected = selectedPlatforms.includes(platform.id)
                const IconComponent = ICON_MAP[platform.icon]

                return (
                  <div
                    key={platform.id}
                    className="flex items-start space-x-3 p-2 rounded hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={platform.id}
                      checked={isSelected}
                      onCheckedChange={() => togglePlatform(platform.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <label
                        htmlFor={platform.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex items-center gap-2"
                      >
                        {IconComponent && <IconComponent className="w-4 h-4" />}
                        <span>{platform.name}</span>
                      </label>

                      {isSelected && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={status.isOverLimit ? "text-red-600 font-semibold" : "text-muted-foreground"}
                            >
                              {status.count} / {status.limit.toLocaleString()} characters
                            </span>
                            <span
                              className={status.isOverLimit ? "text-red-600 font-semibold" : "text-muted-foreground"}
                            >
                              {status.percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                status.isOverLimit
                                  ? "bg-red-600"
                                  : status.percentage > 90
                                    ? "bg-yellow-500"
                                    : status.percentage > 75
                                      ? "bg-blue-500"
                                      : "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(status.percentage, 100)}%` }}
                            />
                          </div>
                          {status.isOverLimit && (
                            <p className="text-xs text-red-600 font-medium">
                              Content exceeds character limit by {status.count - status.limit} characters
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-sm text-muted-foreground mt-2">{selectedPlatforms.length} platforms selected</p>
            {hasOverLimitPlatform && (
              <p className="text-sm text-red-600 font-medium mt-2 flex items-center gap-1">
                <X className="w-4 h-4" />
                Some platforms exceed character limits. Please shorten your content.
              </p>
            )}
          </div>

          <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
            <Label htmlFor="content" className="text-base font-semibold mb-2 block">
              Schedule Post (Optional)
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date" className="text-sm mb-2 block">
                  Select Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal bg-transparent"
                      id="date"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="time" className="text-sm mb-2 block">
                  Select Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            {selectedDate && selectedTime && (
              <p className="text-sm text-muted-foreground mt-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Post will be scheduled for {format(selectedDate, "PPP")} at {selectedTime}
              </p>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => handleSubmit("draft")}
              disabled={!content || selectedPlatforms.length === 0}
            >
              <Save className="w-4 h-4 mr-1.5" />
              Save as Draft
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-blue-50 dark:bg-blue-950 border-blue-200 hover:border-blue-300"
              onClick={() => handleSubmit("scheduled")}
              disabled={
                !content || selectedPlatforms.length === 0 || !selectedDate || !selectedTime || hasOverLimitPlatform
              }
            >
              <Clock className="w-4 h-4 mr-1.5" />
              Schedule
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              onClick={() => handleSubmit("published")}
              disabled={!content || selectedPlatforms.length === 0 || hasOverLimitPlatform}
            >
              <Send className="w-4 h-4 mr-1.5" />
              Publish Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
