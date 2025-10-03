"use client"

import { useState, useEffect } from "react"
import { AppHeader } from "@/components/app-header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { storage } from "@/lib/storage"
import type { Platform } from "@/lib/types"
import { Plug, Link2, X, Check } from "lucide-react"
import * as LucideIcons from "lucide-react"

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])

  useEffect(() => {
    setPlatforms(storage.getPlatforms())
  }, [])

  const connectedCount = platforms.filter((p) => p.connected).length
  const totalCount = platforms.length

  const toggleConnection = (platformId: string) => {
    storage.togglePlatformConnection(platformId)
    setPlatforms(storage.getPlatforms())
  }

  const renderPlatformIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName]
    if (Icon) {
      return <Icon className="w-7 h-7" />
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Plug className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold">Connected Platforms</h1>
          </div>
          <p className="text-muted-foreground">Manage your social media platform connections</p>
        </div>

        <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Connected: {connectedCount} / {totalCount}
              </h2>
              <p className="text-sm opacity-90">
                You have {connectedCount} platforms connected out of {totalCount} available platforms
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{Math.round((connectedCount / totalCount) * 100)}%</div>
              <div className="text-sm opacity-90">Coverage</div>
            </div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 mt-4">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${(connectedCount / totalCount) * 100}%` }}
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={`p-5 transition-all ${
                platform.connected ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-indigo-600">{renderPlatformIcon(platform.icon)}</div>
                  <div>
                    <h3 className="font-semibold">{platform.name}</h3>
                    <p className="text-xs text-muted-foreground">{platform.username}</p>
                  </div>
                </div>
                {platform.connected && (
                  <Badge className="bg-green-500 text-white">
                    <Check className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Character limit:</span>
                  <span className="font-semibold">{platform.characterLimit.toLocaleString()}</span>
                </div>
              </div>

              {platform.connected ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-red-600 border-red-300 hover:bg-red-50 bg-transparent"
                  onClick={() => toggleConnection(platform.id)}
                >
                  <X className="w-4 h-4 mr-1.5" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => toggleConnection(platform.id)}
                >
                  <Link2 className="w-4 h-4 mr-1.5" />
                  Connect
                </Button>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
