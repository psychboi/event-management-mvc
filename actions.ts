"use server"

import { redirect } from "next/navigation"
import { authenticate, createSession } from "./auth"
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

// Event-related functions are now handled client-side via EventDatabase directly.
// These server actions are no longer needed for event CRUD.

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("event_manager_session")
  redirect("/login")
}
