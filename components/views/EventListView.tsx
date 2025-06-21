"use client"

import type { Event } from "@/models/event"
import { Calendar, Clock, MapPin, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EventListViewProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
  onAdd: () => void
  isLoading?: boolean
}

export default function EventListView({ events, onEdit, onDelete, onAdd, isLoading }: EventListViewProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours), Number.parseInt(minutes))
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const isUpcoming = (dateString: string, timeString: string) => {
    const eventDateTime = new Date(`${dateString}T${timeString}`)
    return eventDateTime > new Date()
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold gradient-text">Your Events</h2>
          <p className="text-gray-400 mt-1">
            {events.length === 0 ? "No events yet" : `${events.length} event${events.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="btn-primary px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card className="glass-effect">
          <CardContent className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Yet</h3>
            <p className="text-gray-400 mb-6">Get started by creating your first event</p>
            <Button onClick={onAdd} className="btn-primary px-8 py-3 rounded-lg font-semibold text-white">
              Create Your First Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="event-card rounded-xl p-6 relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    {isUpcoming(event.date, event.time) ? (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        Upcoming
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full border border-gray-500/30">
                        Past
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(event)}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
                    title="Edit event"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>{formatTime(event.time)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="line-clamp-1">{event.location}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-600 text-xs text-gray-500">
                Created: {new Date(event.createdAt).toLocaleDateString()}
                {event.updatedAt !== event.createdAt && (
                  <span className="ml-2">• Updated: {new Date(event.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
