"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { ProductsManagement } from "./products-management"
import { NewsManagement } from "./news-management"
import { Package, Users, ShoppingCart, TrendingUp, DollarSign, Eye, Calendar, Loader2 } from "lucide-react"

interface StatsData {
  totalProducts: number
  totalNews: number
  totalUsers: number
  newProducts: number
  saleProducts: number
  recentNews: number
  totalOrders: number
  totalRevenue: number
  recentOrders: Array<{
    id: string
    customer: string
    product: string
    amount: string
    status: string
    date: string
  }>
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("dashboard")
  const [statsData, setStatsData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeSection === "dashboard") {
      fetchStats()
    }
  }, [activeSection])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("authToken")
      if (!token) {
        setError("Не авторизовано")
        return
      }

      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Не вдалося завантажити статистику")
      }

      const data = await response.json()
      setStatsData(data.stats)
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Помилка завантаження статистики")
    } finally {
      setLoading(false)
    }
  }

  const stats = statsData ? [
    {
      title: "Загальний дохід",
      value: `₴${statsData.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Замовлення",
      value: statsData.totalOrders.toString(),
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Товари",
      value: statsData.totalProducts.toString(),
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Клієнти",
      value: statsData.totalUsers.toString(),
      icon: Users,
      color: "text-orange-600",
    },
  ] : []

  const recentOrders = statsData?.recentOrders || []

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Виконано</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Обробляється</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Очікує</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="min-h-screen bg-coffee-50">
      <AdminHeader activeSection={activeSection} />

      <div className="flex">
        <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

        <main className="flex-1 p-6 ml-64">
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-coffee-800 font-serif">Вітаємо, {user?.name}!</h1>
                <p className="text-coffee-600 mt-2">Ось огляд вашого магазину на сьогодні</p>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-coffee-600" />
                  <span className="ml-2 text-coffee-600">Завантаження статистики...</span>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <p className="text-red-600 mb-4">{error}</p>
                      <Button onClick={fetchStats} variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                        Спробувати знову
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Grid */}
              {!loading && !error && statsData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="bg-white/80 backdrop-blur-sm">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-coffee-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-coffee-800">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-full bg-coffee-100`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Recent Orders */}
              {!loading && !error && statsData && recentOrders.length > 0 && (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold text-coffee-800">Останні замовлення</CardTitle>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Переглянути всі
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-coffee-200">
                            <th className="text-left py-3 px-4 font-medium text-coffee-700">ID</th>
                            <th className="text-left py-3 px-4 font-medium text-coffee-700">Клієнт</th>
                            <th className="text-left py-3 px-4 font-medium text-coffee-700">Товар</th>
                            <th className="text-left py-3 px-4 font-medium text-coffee-700">Сума</th>
                            <th className="text-left py-3 px-4 font-medium text-coffee-700">Статус</th>
                            <th className="text-left py-3 px-4 font-medium text-coffee-700">Дата</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-coffee-100 hover:bg-coffee-50/50">
                              <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                              <td className="py-3 px-4">{order.customer}</td>
                              <td className="py-3 px-4">{order.product}</td>
                              <td className="py-3 px-4 font-semibold">{order.amount}</td>
                              <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                              <td className="py-3 px-4 text-coffee-600 flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {order.date}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* No Orders Message */}
              {!loading && !error && statsData && recentOrders.length === 0 && (
                <Card className="bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <p className="text-coffee-600">Немає замовлень для відображення</p>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-coffee-800">Швидкі дії</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      onClick={() => setActiveSection("products")}
                      className="bg-coffee-600 hover:bg-coffee-700 h-12"
                    >
                      <Package className="h-5 w-5 mr-2" />
                      Додати товар
                    </Button>
                    <Button onClick={() => setActiveSection("news")} variant="outline" className="h-12">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Створити новину
                    </Button>
                    <Button onClick={() => setActiveSection("orders")} variant="outline" className="h-12">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Переглянути замовлення
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeSection === "products" && <ProductsManagement />}

          {activeSection === "news" && <NewsManagement />}

          {activeSection !== "dashboard" && activeSection !== "products" && activeSection !== "news" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-coffee-800 mb-4">
                {activeSection === "orders" && "Управління замовленнями"}
                {activeSection === "users" && "Управління користувачами"}
                {activeSection === "settings" && "Налаштування"}
              </h2>
              <p className="text-coffee-600">Цей розділ буде реалізований в наступних етапах</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
