"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CreatePostDialog } from "@/components/create-post-dialog"
import { Rocket, LayoutDashboard, TrendingUp, Calendar, Inbox, Share2 } from "lucide-react"
import { useState } from "react"

export function AppHeader() {
  const pathname = usePathname()
  const [dialogKey, setDialogKey] = useState(0)

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analytics", label: "Analytics", icon: TrendingUp },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/inbox", label: "Inbox", icon: Inbox, badge: 3 },
    { href: "/platforms", label: "Platforms", icon: Share2 },
  ]

  const handlePostCreated = () => {
    setDialogKey((prev) => prev + 1)
    // Trigger a page refresh or state update if needed
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("postsUpdated"))
    }
  }

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-indigo-600" />
              <span className="font-semibold text-lg text-indigo-600">Social Scheduler</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button variant={pathname === item.href ? "secondary" : "ghost"} size="sm" className="relative">
                      <Icon className="w-4 h-4 mr-1.5" />
                      {item.label}
                      {item.badge && (
                        <span className="ml-1.5 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                    </Button>
                  </Link>
                )
              })}
            </nav>
          </div>

          <CreatePostDialog key={dialogKey} onPostCreated={handlePostCreated} />
        </div>
      </div>
    </header>
  )
}
