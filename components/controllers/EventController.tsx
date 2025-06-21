"use client"

import { useState, useEffect } from "react"
import { type Event, eventModel } from "@/models/event"
import EventListView from "@/components/views/EventListView"
import EventFormView from "@/components/views/EventFormView"
import Navigation from "@/components/Navigation"

type ViewMode = "list" | "add" | "edit"

export default function EventController() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentView, setCurrentView] = useState<ViewMode>("list")
  const [editingEvent, setEditingEvent] = useState<Event | undefined>()
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null)

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const loadEvents = () => {
    try {
      const allEvents = eventModel.getAllEvents()
      setEvents(allEvents)
    } catch (error) {
      showNotification("Failed to load events", "error")
    }
  }

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type })
  }

  const handleAddEvent = () => {
    setCurrentView("add")
    setEditingEvent(undefined)
  }

  const handleEditEvent = (event: Event) => {
    setCurrentView("edit")
    setEditingEvent(event)
  }

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return
    }

    try {
      setIsLoading(true)
      const success = eventModel.deleteEvent(id)
      if (success) {
        loadEvents()
        showNotification("Event deleted successfully", "success")
      } else {
        showNotification("Failed to delete event", "error")
      }
    } catch (error) {
      showNotification("Failed to delete event", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitEvent = async (eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) => {
    try {
      setIsLoading(true)

      if (editingEvent) {
        const updatedEvent = eventModel.updateEvent(editingEvent.id, eventData)
        if (updatedEvent) {
          loadEvents()
          showNotification("Event updated successfully", "success")
          setCurrentView("list")
        } else {
          showNotification("Failed to update event", "error")
        }
      } else {
        const newEvent = eventModel.createEvent(eventData)
        if (newEvent) {
          loadEvents()
          showNotification("Event created successfully", "success")
          setCurrentView("list")
        } else {
          showNotification("Failed to create event", "error")
        }
      }
    } catch (error) {
      showNotification("Failed to save event", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setCurrentView("list")
    setEditingEvent(undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <Navigation />

      {notification && (
        <div
          className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg fade-in ${
            notification.type === "success"
              ? "bg-green-500/20 border border-green-500/50 text-green-200"
              : "bg-red-500/20 border border-red-500/50 text-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === "list" && (
          <EventListView
            events={events}
            onEdit={handleEditEvent}
            onDelete={handleDeleteEvent}
            onAdd={handleAddEvent}
            isLoading={isLoading}
          />
        )}

        {(currentView === "add" || currentView === "edit") && (
          <div className="max-w-2xl mx-auto">
            <EventFormView
              event={editingEvent}
              onSubmit={handleSubmitEvent}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>
    </div>
  )
}
