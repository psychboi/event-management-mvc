import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const SESSION_COOKIE = "event_manager_session"

const DEMO_USERS = [
  { username: "admin", password: "password" },
  { username: "user", password: "demo123" },
]

export interface Session {
  username: string
  loginTime: string
}

export async function authenticate(username: string, password: string): Promise<boolean> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return DEMO_USERS.some((user) => user.username === username && user.password === password)
}

export async function createSession(username: string): Promise<void> {
  const session: Session = {
    username,
    loginTime: new Date().toISOString(),
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
  })
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE)

    if (!sessionCookie) return null

    return JSON.parse(sessionCookie.value)
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function requireAuth(): Promise<Session> {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return session
}
