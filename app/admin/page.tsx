"use client"
import { useAuth } from "@/contexts/auth-context"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { AdminLogin } from "@/components/admin/admin-login"
import { useEffect, useState } from "react"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-50" suppressHydrationWarning>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
          <p className="mt-4 text-coffee-600">Завантаження...</p>
        </div>
      </div>
    )
  }

  if (!user || user.role !== "admin") {
    return <AdminLogin />
  }

  return <AdminDashboard />
}
