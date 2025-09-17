"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  avatar?: string
  phone?: string
  address?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User> & { currentPassword?: string; newPassword?: string }) => Promise<boolean>
  deleteAccount: () => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("authToken")
      if (token) {
        // Verify token with backend
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        } else {
          localStorage.removeItem("authToken")
        }
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("authToken")
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("authToken", data.token)
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Login failed:", error)
      return false
    }
  }

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("authToken", data.token)
        setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Registration failed:", error)
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("authToken")
    setUser(null)
    // Cart will be cleared by CartProvider when user logs out
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        console.error("No auth token found")
        return false
      }

      const response = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser.user)
        return true
      }
      return false
    } catch (error) {
      console.error("Profile update failed:", error)
      return false
    }
  }

  const deleteAccount = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) {
        console.error("No auth token found")
        return false
      }

      const response = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        localStorage.removeItem("authToken")
        setUser(null)
        return true
      }
      return false
    } catch (error) {
      console.error("Account deletion failed:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        deleteAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
