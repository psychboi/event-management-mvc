export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  createdAt: string
  updatedAt: string
}

class EventModel {
  private events: Event[] = []

  constructor() {
    this.loadFromStorage()
  }

  private loadFromStorage() {
    if (typeof window !== "undefined") {
      try {
        const storedEvents = localStorage.getItem("events")
        if (storedEvents) {
          this.events = JSON.parse(storedEvents)
        }
      } catch (error) {
        console.error("Error loading events from storage:", error)
        this.events = []
      }
    }
  }

  private saveToStorage() {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("events", JSON.stringify(this.events))
      } catch (error) {
        console.error("Error saving events to storage:", error)
      }
    }
  }

  createEvent(eventData: Omit<Event, "id" | "createdAt" | "updatedAt">): Event {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    this.events.push(newEvent)
    this.saveToStorage()
    return newEvent
  }

  getAllEvents(): Event[] {
    return [...this.events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  getEventById(id: string): Event | undefined {
    return this.events.find((event) => event.id === id)
  }

  updateEvent(id: string, eventData: Partial<Omit<Event, "id" | "createdAt">>): Event | null {
    const eventIndex = this.events.findIndex((event) => event.id === id)
    if (eventIndex === -1) return null

    this.events[eventIndex] = {
      ...this.events[eventIndex],
      ...eventData,
      updatedAt: new Date().toISOString(),
    }

    this.saveToStorage()
    return this.events[eventIndex]
  }

  deleteEvent(id: string): boolean {
    const eventIndex = this.events.findIndex((event) => event.id === id)
    if (eventIndex === -1) return false

    this.events.splice(eventIndex, 1)
    this.saveToStorage()
    return true
  }
}

export const eventModel = new EventModel()
