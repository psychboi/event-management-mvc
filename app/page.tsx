import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import EventDashboard from "@/components/EventDashboard"

export default async function HomePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  return <EventDashboard />
}
