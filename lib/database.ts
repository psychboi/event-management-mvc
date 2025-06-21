import type { Event } from "./models/Event"

const STORAGE_KEY = "event_management_events"

export class EventDatabase {
  static getAll(): Event[] {
    if (typeof window === "undefined") {
      // For server-side rendering or build process, return empty or initial data
      return this.getDemoEvents()
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const demoEvents = this.getDemoEvents()
        this.save(demoEvents)
        return demoEvents
      }
      return JSON.parse(stored)
    } catch (error) {
      console.error("Error reading events from storage:", error)
      // Fallback to demo events if localStorage fails
      return this.getDemoEvents()
    }
  }

  static save(events: Event[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (error) {
      console.error("Error saving events to storage:", error)
    }
  }

  static getDemoEvents(): Event[] {
    return []
  }

  static findById(id: string): Event | null {
    const events = this.getAll()
    return events.find((event) => event.id === id) || null
  }

  static create(event: Event): Event {
    const events = this.getAll()
    events.push(event)
    this.save(events)
    return event
  }

  static update(id: string, updatedEvent: Event): Event | null {
    const events = this.getAll()
    const index = events.findIndex((event) => event.id === id)

    if (index === -1) return null

    events[index] = updatedEvent
    this.save(events)
    return updatedEvent
  }

  static delete(id: string): boolean {
    const events = this.getAll()
    const index = events.findIndex((event) => event.id === id)

    if (index === -1) return false

    events.splice(index, 1)
    this.save(events)
    return true
  }
}
