import LoginForm from "@/components/LoginForm"
import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await getSession()

  if (session) {
    redirect("/")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          width: "100%",
          maxWidth: "400px",
          padding: "2rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#dbeafe",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem auto",
            }}
          >
            <span style={{ fontSize: "2rem" }}>📅</span>
          </div>
          <h1
            style={{
              fontSize: "2rem",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "0.5rem",
            }}
          >
            Event Manager
          </h1>
          <p style={{ color: "#6b7280" }}>Sign in to manage your community events</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
