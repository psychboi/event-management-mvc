"use client"

import { AuthProvider, useAuth } from "@/lib/auth"
import LoginView from "@/components/views/LoginView"
import EventController from "@/components/controllers/EventController"

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <LoginView />
  }

  return <EventController />
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
