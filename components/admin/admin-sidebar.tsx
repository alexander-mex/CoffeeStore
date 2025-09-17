"use client"

import { Button } from "@/components/ui/button"
import { LayoutDashboard, Package, ShoppingCart, Users, FileText, Settings, BarChart3 } from "lucide-react"

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Панель управління",
      icon: LayoutDashboard,
    },
    {
      id: "products",
      label: "Товари",
      icon: Package,
    },
    {
      id: "orders",
      label: "Замовлення",
      icon: ShoppingCart,
    },
    {
      id: "users",
      label: "Користувачі",
      icon: Users,
    },
    {
      id: "news",
      label: "Новини",
      icon: FileText,
    },
    {
      id: "analytics",
      label: "Аналітика",
      icon: BarChart3,
    },
    {
      id: "settings",
      label: "Налаштування",
      icon: Settings,
    },
  ]

  return (
    <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-coffee-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeSection === item.id
                ? "bg-coffee-600 hover:bg-coffee-700 text-white"
                : "text-coffee-700 hover:bg-coffee-50"
            }`}
            onClick={() => onSectionChange(item.id)}
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  )
}
