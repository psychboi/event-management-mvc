"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  username: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("auth")
      if (storedAuth) {
        try {
          const parsed = JSON.parse(storedAuth)
          setIsAuthenticated(true)
          setUsername(parsed.username)
        } catch (error) {
          localStorage.removeItem("auth")
        }
      }
    }
  }, [])

  const login = async (inputUsername: string, password: string): Promise<boolean> => {
    const validCredentials = [
      { username: "admin", password: "admin123" },
      { username: "user", password: "user123" },
    ]

    const user = validCredentials.find((cred) => cred.username === inputUsername && cred.password === password)

    if (user) {
      setIsAuthenticated(true)
      setUsername(inputUsername)
      if (typeof window !== "undefined") {
        localStorage.setItem("auth", JSON.stringify({ username: inputUsername }))
      }
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUsername(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth")
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    username,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
