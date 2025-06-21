"use client"

import { useState, useEffect } from "react"
import type { Event } from "@/lib/models/Event"
import { getEvents, deleteEvent, logoutAction } from "@/lib/actions"
import EventForm from "./EventForm"

export default function EventDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterAndSortEvents()
  }, [events, searchTerm, filterStatus])

  async function loadEvents() {
    setLoading(true)
    try {
      const eventsData = await getEvents()
      setEvents(eventsData)
    } catch (error) {
      console.error("Error loading events:", error)
    }
    setLoading(false)
  }

  function filterAndSortEvents() {
    const filtered = events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())

      const eventDate = new Date(event.date + "T" + event.time)
      const now = new Date()

      if (filterStatus === "upcoming") {
        return matchesSearch && eventDate > now
      } else if (filterStatus === "past") {
        return matchesSearch && eventDate < now
      }

      return matchesSearch
    })

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date + "T" + a.time)
      const dateB = new Date(b.date + "T" + b.time)
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredEvents(filtered)
  }

  function getEventStatus(event: Event): "upcoming" | "today" | "past" {
    const eventDate = new Date(event.date + "T" + event.time)
    const now = new Date()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDay = new Date(event.date)
    eventDay.setHours(0, 0, 0, 0)

    if (eventDay.getTime() === today.getTime()) {
      return "today"
    } else if (eventDate > now) {
      return "upcoming"
    } else {
      return "past"
    }
  }

  function getStatusBadge(status: "upcoming" | "today" | "past") {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: "500",
      border: "1px solid",
    }

    switch (status) {
      case "today":
        return (
          <span style={{ ...baseStyle, background: "#dcfce7", color: "#166534", borderColor: "#bbf7d0" }}>Today</span>
        )
      case "upcoming":
        return (
          <span style={{ ...baseStyle, background: "#dbeafe", color: "#1e40af", borderColor: "#bfdbfe" }}>
            Upcoming
          </span>
        )
      case "past":
        return (
          <span style={{ ...baseStyle, background: "#f3f4f6", color: "#374151", borderColor: "#d1d5db" }}>Past</span>
        )
    }
  }

  function getPriorityBadge(priority: "low" | "medium" | "high") {
    const baseStyle = {
      display: "inline-flex",
      alignItems: "center",
      padding: "0.125rem 0.5rem",
      borderRadius: "0.25rem",
      fontSize: "0.75rem",
      fontWeight: "500",
    }

    switch (priority) {
      case "high":
        return <span style={{ ...baseStyle, background: "#fee2e2", color: "#b91c1c" }}>High</span>
      case "medium":
        return <span style={{ ...baseStyle, background: "#fef9c3", color: "#a16207" }}>Medium</span>
      case "low":
        return <span style={{ ...baseStyle, background: "#dcfce7", color: "#166534" }}>Low</span>
    }
  }

  function getEventStats() {
    const now = new Date()
    const upcoming = events.filter((e) => new Date(e.date + "T" + e.time) > now).length
    const today = events.filter((e) => {
      const eventDay = new Date(e.date)
      const todayDay = new Date()
      eventDay.setHours(0, 0, 0, 0)
      todayDay.setHours(0, 0, 0, 0)
      return eventDay.getTime() === todayDay.getTime()
    }).length
    const past = events.filter((e) => new Date(e.date + "T" + e.time) < now).length

    return { total: events.length, upcoming, today, past }
  }

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id)
        setMessage("Event deleted successfully!")
        setTimeout(() => setMessage(""), 3000)
        loadEvents()
      } catch (error) {
        setMessage("Error deleting event")
        setTimeout(() => setMessage(""), 3000)
      }
    }
  }

  function handleEdit(event: Event) {
    setEditingEvent(event)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditingEvent(null)
    loadEvents()
  }

  async function handleLogout() {
    await logoutAction()
  }

  const stats = getEventStats()

  if (showForm) {
    return (
      <EventForm
        event={editingEvent}
        onClose={handleFormClose}
        onSuccess={() => {
          setMessage(editingEvent ? "Event updated successfully!" : "Event created successfully!")
          setTimeout(() => setMessage(""), 3000)
        }}
      />
    )
  }

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
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "1.5rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>Event Manager</h1>
            <p style={{ color: "#6b7280", margin: "0.25rem 0 0 0" }}>Manage your community events</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                fontWeight: "500",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = "#1d4ed8")}
              onMouseOut={(e) => (e.currentTarget.style.background = "#2563eb")}
            >
              <span style={{ fontSize: "1.125rem" }}>+</span>
              Add Event
            </button>
            <button
              onClick={handleLogout}
              style={{
                background: "transparent",
                color: "#6b7280",
                border: "1px solid #d1d5db",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "border-color 0.2s, color 0.2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#4b5563"
                e.currentTarget.style.color = "#1f2937"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "#d1d5db"
                e.currentTarget.style.color = "#6b7280"
              }}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 1rem" }}>
        {message && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span>✅</span>
            {message}
          </div>
        )}

        {/* Statistics Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>Total Events</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1f2937", margin: 0 }}>{stats.total}</p>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "#dbeafe",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                📅
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#059669", margin: "0 0 0.5rem 0" }}>Today</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#059669", margin: 0 }}>{stats.today}</p>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "#dcfce7",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                🕐
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#7c3aed", margin: "0 0 0.5rem 0" }}>Upcoming</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#7c3aed", margin: 0 }}>{stats.upcoming}</p>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "#ede9fe",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                📈
              </div>
            </div>
          </div>

          <div
            style={{
              background: "white",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280", margin: "0 0 0.5rem 0" }}>Past Events</p>
                <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#6b7280", margin: 0 }}>{stats.past}</p>
              </div>
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: "#f3f4f6",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                }}
              >
                📊
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div
          style={{
            background: "white",
            padding: "1.5rem",
            borderRadius: "0.75rem",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            marginBottom: "2rem",
            border: "1px solid #e5e7eb",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                <span
                  style={{
                    position: "absolute",
                    left: "0.75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "1rem",
                    color: "#9ca3af",
                  }}
                >
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search events by title, description, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.75rem 0.75rem 2.5rem",
                    border: "1px solid #d1d5db",
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
                    e.target.style.borderColor = "#d1d5db"
                    e.target.style.boxShadow = "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.5rem",
                    fontSize: "1rem",
                    background: "white",
                    minWidth: "120px",
                    transition: "all 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#3b82f6"
                    e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db"
                    e.target.style.boxShadow = "none"
                  }}
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1f2937", margin: "0 0 0.5rem 0" }}>
            {filterStatus === "all" ? "All Events" : filterStatus === "upcoming" ? "Upcoming Events" : "Past Events"}
          </h2>
          <p style={{ color: "#6b7280", margin: 0 }}>
            Showing {filteredEvents.length} of {events.length} events
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div
            style={{
              background: "white",
              padding: "4rem",
              borderRadius: "0.75rem",
              textAlign: "center",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "inline-block",
                width: "2.5rem",
                height: "2.5rem",
                border: "3px solid #e5e7eb",
                borderTop: "3px solid #3b82f6",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></div>
            <p style={{ marginTop: "1rem", color: "#6b7280", fontSize: "1.125rem" }}>Loading events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "4rem",
              borderRadius: "0.75rem",
              textAlign: "center",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>📅</div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", color: "#1f2937", marginBottom: "0.5rem" }}>
              {events.length === 0 ? "No events yet" : "No events found"}
            </h3>
            <p style={{ color: "#6b7280", marginBottom: "2rem", fontSize: "1.125rem" }}>
              {events.length === 0 ? "Get started by creating your first event" : "Try adjusting your search criteria"}
            </p>
            {events.length === 0 && (
              <button
                onClick={() => setShowForm(true)}
                style={{
                  background: "#3b82f6",
                  color: "white",
                  border: "none",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  fontSize: "1rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#3b82f6")}
              >
                <span>+</span>
                Create Event
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredEvents.map((event) => {
              const status = getEventStatus(event)
              return (
                <div
                  key={event.id}
                  style={{
                    background: "white",
                    borderRadius: "0.75rem",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)"
                    e.currentTarget.style.boxShadow = "0 8px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                  }}
                >
                  <div
                    style={{
                      background: "#f8fafc",
                      padding: "1.5rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <h3
                        style={{
                          fontSize: "1.25rem",
                          fontWeight: "600",
                          color: "#1e40af",
                          margin: 0,
                          flex: 1,
                          lineHeight: "1.4",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {event.title}
                      </h3>
                      <div style={{ marginLeft: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {getStatusBadge(status)}
                        {getPriorityBadge(event.priority)}
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "1.5rem" }}>
                    <p
                      style={{
                        color: "#4b5563",
                        marginBottom: "1.5rem",
                        lineHeight: "1.6",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {event.description}
                    </p>

                    <div
                      style={{
                        marginBottom: "1.5rem",
                        fontSize: "0.875rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#2563eb",
                          fontWeight: "500",
                        }}
                      >
                        <span style={{ marginRight: "0.75rem", fontSize: "1rem" }}>📅</span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#2563eb",
                          fontWeight: "500",
                        }}
                      >
                        <span style={{ marginRight: "0.75rem", fontSize: "1rem" }}>🕐</span>
                        {new Date(`2000-01-01T${event.time}`).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#2563eb",
                          fontWeight: "500",
                        }}
                      >
                        <span style={{ marginRight: "0.75rem", fontSize: "1rem" }}>📍</span>
                        {event.location}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          color: "#6b7280",
                          fontWeight: "500",
                        }}
                      >
                        <span style={{ marginRight: "0.75rem", fontSize: "1rem" }}>🏷️</span>
                        {event.category}
                      </div>
                      {event.maxAttendees && (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            color: "#6b7280",
                            fontWeight: "500",
                          }}
                        >
                          <span style={{ marginRight: "0.75rem", fontSize: "1rem" }}>👥</span>
                          Max {event.maxAttendees} attendees
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        onClick={() => handleEdit(event)}
                        style={{
                          flex: 1,
                          padding: "0.75rem",
                          background: "transparent",
                          color: "#2563eb",
                          border: "1px solid #2563eb",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#eff6ff"
                          e.currentTarget.style.color = "#1e40af"
                          e.currentTarget.style.borderColor = "#1e40af"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "transparent"
                          e.currentTarget.style.color = "#2563eb"
                          e.currentTarget.style.borderColor = "#2563eb"
                        }}
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        style={{
                          flex: 1,
                          padding: "0.75rem",
                          background: "transparent",
                          color: "#dc2626",
                          border: "1px solid #dc2626",
                          borderRadius: "0.5rem",
                          cursor: "pointer",
                          fontSize: "0.875rem",
                          fontWeight: "500",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                          transition: "background-color 0.2s, color 0.2s, border-color 0.2s",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = "#fef2f2"
                          e.currentTarget.style.color = "#b91c1c"
                          e.currentTarget.style.borderColor = "#b91c1c"
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = "transparent"
                          e.currentTarget.style.color = "#dc2626"
                          e.currentTarget.style.borderColor = "#dc2626"
                        }}
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
