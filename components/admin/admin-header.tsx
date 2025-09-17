"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell, Settings, LogOut, User } from "lucide-react"

interface AdminHeaderProps {
  activeSection: string
}

interface Notification {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: string
}

export function AdminHeader({ activeSection }: AdminHeaderProps) {
  const { user, logout } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/admin/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("authToken")
      if (!token) return

      const response = await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          notificationId,
          action: "markAsRead"
        }),
      })

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(notification =>
            notification.id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const getSectionTitle = (section: string) => {
    switch (section) {
      case "dashboard":
        return "Панель управління"
      case "products":
        return "Товари"
      case "orders":
        return "Замовлення"
      case "users":
        return "Користувачі"
      case "news":
        return "Новини"
      case "settings":
        return "Налаштування"
      default:
        return "Адмін-панель"
    }
  }

  return (
    <header className="bg-white border-b border-coffee-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-coffee-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-coffee-800 font-serif">BlackCoffee</h1>
              <p className="text-xs text-coffee-600">Адмін-панель</p>
            </div>
          </div>
          <div className="hidden md:block">
            <span className="text-coffee-400">•</span>
            <span className="ml-2 text-coffee-700 font-medium">{getSectionTitle(activeSection)}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Повідомлення</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                    {unreadCount} нових
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.createdAt).toLocaleDateString('uk-UA')}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    Немає повідомлень
                  </div>
                )}
              </div>
              {notifications.length > 0 && (
                <div className="p-2 border-t">
                  <Button variant="ghost" size="sm" className="w-full">
                    Переглянути всі повідомлення
                  </Button>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-coffee-600 text-white">{user?.name?.charAt(0) || "A"}</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-coffee-700">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                Профіль
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="h-4 w-4 mr-2" />
                Налаштування
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Вийти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
