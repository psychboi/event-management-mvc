"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Event } from "@/models/event"
import { Calendar, Clock, MapPin, FileText, Type } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface EventFormViewProps {
  event?: Event
  onSubmit: (eventData: Omit<Event, "id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
  isLoading?: boolean
}

export default function EventFormView({ event, onSubmit, onCancel, isLoading }: EventFormViewProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
      })
    }
  }, [event])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past"
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required"
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card className="glass-effect shadow-2xl fade-in">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold gradient-text mb-6">{event ? "Edit Event" : "Create New Event"}</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Event Title
            </label>
            <div className="relative">
              <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className={`input-field w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                  errors.title ? "border-red-500" : ""
                }`}
                placeholder="Enter event title"
              />
            </div>
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={4}
                className={`input-field w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none resize-none ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Enter event description"
              />
            </div>
            {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className={`input-field w-full pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none ${
                    errors.date ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="time" className="block text-sm font-medium mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className={`input-field w-full pl-10 pr-4 py-3 rounded-lg text-white focus:outline-none ${
                    errors.time ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                className={`input-field w-full pl-10 pr-4 py-3 rounded-lg text-white placeholder-gray-400 focus:outline-none ${
                  errors.location ? "border-red-500" : ""
                }`}
                placeholder="Enter event location"
              />
            </div>
            {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 py-3 rounded-lg font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
            </Button>
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 py-3 rounded-lg font-semibold text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
