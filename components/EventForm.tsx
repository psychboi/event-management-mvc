"use client"

import { useState } from "react"
import type { Event } from "@/lib/models/Event"
import { EVENT_CATEGORIES, EventModel } from "@/lib/models/Event" // Import EventModel for validation
import { EventDatabase } from "@/lib/database" // Import EventDatabase directly

interface EventFormProps {
  event?: Event | null
  onClose: () => void
  onSuccess: () => void
}

export default function EventForm({ event, onClose, onSuccess }: EventFormProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setErrors({})

    try {
      const title = formData.get("title") as string
      const description = formData.get("description") as string
      const date = formData.get("date") as string
      const time = formData.get("time") as string
      const location = formData.get("location") as string
      const category = formData.get("category") as string
      const priority = formData.get("priority") as "low" | "medium" | "high"
      const maxAttendeesStr = formData.get("maxAttendees") as string
      const maxAttendees = maxAttendeesStr ? Number.parseInt(maxAttendeesStr) : undefined

      const eventData = { title, description, date, time, location, category, priority, maxAttendees }

      // Client-side validation using EventModel
      const newErrorsArray = EventModel.validate(eventData)
      if (newErrorsArray.length > 0) {
        const newErrors: Record<string, string> = {}
        newErrorsArray.forEach((err) => {
          if (err.includes("Title")) newErrors.title = err
          else if (err.includes("Description")) newErrors.description = err
          else if (err.includes("Date")) newErrors.date = err
          else if (err.includes("Time")) newErrors.time = err
          else if (err.includes("Location")) newErrors.location = err
          else if (err.includes("Category")) newErrors.category = err
          else if (err.includes("Priority")) newErrors.priority = err
          else if (err.includes("attendees")) newErrors.maxAttendees = err
          else newErrors.general = err // Catch-all for other errors
        })
        setErrors(newErrors)
        setLoading(false)
        return
      }

      if (event) {
        const updatedEvent = EventModel.update(event, eventData)
        EventDatabase.update(event.id, updatedEvent)
      } else {
        const newEvent = EventModel.create(eventData)
        EventDatabase.create(newEvent)
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      setErrors({ general: error.message || "Failed to save event. Please try again." })
    }

    setLoading(false)
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div style={{ minHeight: "100vh", background: "#f9fafb" }}>
      {/* Header */}
      <header
        style={{
          background: "white",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "1.5rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: "#6b7280",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "0.375rem",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#f3f4f6")}
            onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>
              {event ? "Edit Event" : "Create New Event"}
            </h1>
            <p style={{ color: "#6b7280", margin: "0.25rem 0 0 0" }}>
              {event ? "Update event details" : "Add a new event to your calendar"}
            </p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main style={{ maxWidth: "960px", margin: "2rem auto", padding: "0 1rem" }}>
        <div
          style={{
            background: "white",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#eff6ff",
              padding: "1rem 1.5rem",
              borderBottom: "1px solid #dbeafe",
            }}
          >
            <h2 style={{ fontSize: "1.125rem", fontWeight: "600", color: "#1e40af", margin: 0 }}>Event Details</h2>
          </div>

          <div style={{ padding: "1.5rem" }}>
            <form action={handleSubmit} className="space-y-6">
              {errors.general && (
                <div
                  style={{
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    color: "#dc2626",
                    padding: "0.75rem 1rem",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                  }}
                >
                  {errors.general}
                </div>
              )}

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Event Title *
                  </label>
                  <input
                    name="title"
                    type="text"
                    defaultValue={event?.title || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.title ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    placeholder="Enter event title"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.title ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                  {errors.title && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.title}</p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Category *
                  </label>
                  <select
                    name="category"
                    defaultValue={event?.category || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.category ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      background: "white",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.category ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  >
                    <option value="">Select category</option>
                    {EVENT_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.category}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#374151",
                    marginBottom: "0.5rem",
                  }}
                >
                  Description *
                </label>
                <textarea
                  name="description"
                  defaultValue={event?.description || ""}
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    border: `1px solid ${errors.description ? "#ef4444" : "#d1d5db"}`,
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    boxSizing: "border-box",
                    resize: "vertical",
                    transition: "all 0.2s",
                  }}
                  placeholder="Describe your event in detail..."
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.description ? "#ef4444" : "#d1d5db"
                    e.target.style.boxShadow = "none"
                  }}
                />
                {errors.description && (
                  <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.description}</p>
                )}
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "1rem" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Date *
                  </label>
                  <input
                    name="date"
                    type="date"
                    min={today}
                    defaultValue={event?.date || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.date ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.date ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                  {errors.date && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.date}</p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Time *
                  </label>
                  <input
                    name="time"
                    type="time"
                    defaultValue={event?.time || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.time ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.time ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                  {errors.time && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.time}</p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Priority *
                  </label>
                  <select
                    name="priority"
                    defaultValue={event?.priority || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.priority ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      background: "white",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.priority ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {errors.priority && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.priority}</p>
                  )}
                </div>
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Location *
                  </label>
                  <input
                    name="location"
                    type="text"
                    defaultValue={event?.location || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.location ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    placeholder="Enter event location"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.location ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                  {errors.location && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.location}</p>
                  )}
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Max Attendees (Optional)
                  </label>
                  <input
                    name="maxAttendees"
                    type="number"
                    min="1"
                    max="10000"
                    defaultValue={event?.maxAttendees || ""}
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      border: `1px solid ${errors.maxAttendees ? "#ef4444" : "#d1d5db"}`,
                      borderRadius: "0.5rem",
                      fontSize: "1rem",
                      boxSizing: "border-box",
                      transition: "all 0.2s",
                    }}
                    placeholder="Leave empty for unlimited"
                    onFocus={(e) => {
                      e.target.style.borderColor = "#3b82f6"
                      e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.maxAttendees ? "#ef4444" : "#d1d5db"
                      e.target.style.boxShadow = "none"
                    }}
                  />
                  {errors.maxAttendees && (
                    <p style={{ color: "#dc2626", fontSize: "0.75rem", marginTop: "0.25rem" }}>{errors.maxAttendees}</p>
                  )}
                </div>
              </div>

              <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1.5rem",
                    background: loading ? "#9ca3af" : "#2563eb",
                    color: "white",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#1d4ed8"
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!loading) {
                      e.currentTarget.style.background = "#2563eb"
                    }
                  }}
                >
                  {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: "0.75rem 1.5rem",
                    background: "#f3f4f6",
                    color: "#374151",
                    fontWeight: "600",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    cursor: "pointer",
                    transition: "background-color 0.2s, border-color 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "#e5e7eb"
                    e.currentTarget.style.borderColor = "#9ca3af"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = "#f3f4f6"
                    e.currentTarget.style.borderColor = "#d1d5db"
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
