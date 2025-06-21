"use server"

import { redirect } from "next/navigation"
import { EventDatabase } from "./database"
import { EventModel, type CreateEventData, type UpdateEventData } from "./models/Event"
import { authenticate, createSession, requireAuth } from "./auth"
import { cookies } from "next/headers"

export async function login(formData: FormData) {
  const username = formData.get("username") as string
  const password = formData.get("password") as string

  if (!username || !password) {
    return { error: "Username and password are required" }
  }

  const isValid = await authenticate(username, password)

  if (!isValid) {
    return { error: "Invalid username or password" }
  }

  await createSession(username)
  redirect("/")
}

export async function getEvents() {
  await requireAuth()

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  const events = EventDatabase.getAll()

  return events.sort((a, b) => {
    const dateA = new Date(a.date + "T" + a.time)
    const dateB = new Date(b.date + "T" + b.time)
    return dateA.getTime() - dateB.getTime()
  })
}

export async function createEvent(data: CreateEventData) {
  await requireAuth()

  const errors = EventModel.validate(data)
  if (errors.length > 0) {
    throw new Error(errors.join(", "))
  }

  const event = EventModel.create(data)
  EventDatabase.create(event)

  return event
}

export async function updateEvent(id: string, data: UpdateEventData) {
  await requireAuth()

  const errors = EventModel.validate(data)
  if (errors.length > 0) {
    throw new Error(errors.join(", "))
  }

  const existingEvent = EventDatabase.findById(id)
  if (!existingEvent) {
    throw new Error("Event not found")
  }

  const updatedEvent = EventModel.update(existingEvent, data)
  EventDatabase.update(id, updatedEvent)

  return updatedEvent
}

export async function deleteEvent(id: string) {
  await requireAuth()

  const success = EventDatabase.delete(id)
  if (!success) {
    throw new Error("Event not found")
  }

  return { success: true }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("event_manager_session")
  redirect("/login")
}
