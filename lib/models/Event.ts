export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  priority: "low" | "medium" | "high"
  maxAttendees?: number
  createdAt: string
  updatedAt: string
}

export interface CreateEventData {
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  priority: "low" | "medium" | "high"
  maxAttendees?: number
}

export interface UpdateEventData {
  title: string
  description: string
  date: string
  time: string
  location: string
  category: string
  priority: "low" | "medium" | "high"
  maxAttendees?: number
}

export const EVENT_CATEGORIES = [
  "Community",
  "Education",
  "Entertainment",
  "Sports",
  "Business",
  "Health & Wellness",
  "Arts & Culture",
  "Technology",
  "Other",
] as const

export class EventModel {
  static validate(data: CreateEventData): string[] {
    const errors: string[] = []

    if (!data.title?.trim()) {
      errors.push("Title is required")
    } else if (data.title.trim().length < 3) {
      errors.push("Title must be at least 3 characters long")
    }

    if (!data.description?.trim()) {
      errors.push("Description is required")
    } else if (data.description.trim().length < 10) {
      errors.push("Description must be at least 10 characters long")
    }

    if (!data.date) {
      errors.push("Date is required")
    }

    if (!data.time) {
      errors.push("Time is required")
    }

    if (!data.location?.trim()) {
      errors.push("Location is required")
    }

    if (!data.category) {
      errors.push("Category is required")
    }

    if (!data.priority || !["low", "medium", "high"].includes(data.priority)) {
      errors.push("Priority is required")
    }

    if (data.maxAttendees !== undefined) {
      if (data.maxAttendees < 1) {
        errors.push("Maximum attendees must be at least 1")
      } else if (data.maxAttendees > 10000) {
        errors.push("Maximum attendees cannot exceed 10,000")
      }
    }

    return errors
  }

  static create(data: CreateEventData): Event {
    const now = new Date().toISOString()
    return {
      id: crypto.randomUUID(),
      ...data,
      createdAt: now,
      updatedAt: now,
    }
  }

  static update(event: Event, data: UpdateEventData): Event {
    return {
      ...event,
      ...data,
      updatedAt: new Date().toISOString(),
    }
  }
}
