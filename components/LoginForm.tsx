"use client"

import { useState } from "react"
import { login } from "@/lib/actions"

export default function LoginForm() {
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError("")

    const result = await login(formData)

    if (result?.error) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <form action={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label
            htmlFor="username"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "all 0.2s",
            }}
            placeholder="Enter your username"
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

        <div>
          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: "0.875rem",
              fontWeight: "500",
              color: "#374151",
              marginBottom: "0.5rem",
            }}
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              boxSizing: "border-box",
              transition: "all 0.2s",
            }}
            placeholder="Enter your password"
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

        {error && (
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
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            background: loading ? "#9ca3af" : "#3b82f6",
            color: "white",
            fontWeight: "600",
            padding: "0.75rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#2563eb"
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.background = "#3b82f6"
            }
          }}
        >
          {loading ? (
            <>
              <div
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div
        style={{
          background: "#f9fafb",
          borderRadius: "0.5rem",
          padding: "1rem",
        }}
      >
        <p
          style={{
            fontSize: "0.875rem",
            color: "#6b7280",
            marginBottom: "0.5rem",
            fontWeight: "500",
          }}
        >
          Demo Credentials:
        </p>
        <div style={{ fontSize: "0.875rem", color: "#374151" }}>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Username:</strong> admin
          </p>
          <p style={{ margin: "0.25rem 0" }}>
            <strong>Password:</strong> password
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
