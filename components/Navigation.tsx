"use client"

import { useAuth } from "@/lib/auth"
import { LogOut, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const { username, logout } = useAuth()

  return (
    <nav className="navbar sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">Event Manager</h1>
            <p className="text-xs text-gray-400">MVC Architecture Demo</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-gray-300">Welcome, {username}</span>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
