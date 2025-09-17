"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Package, Calendar, CreditCard, Truck } from "lucide-react"
import Image from "next/image"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  deliveryAddress: string
  paymentMethod: string
}

export default function OrdersPage() {
  const { user, isLoading } = useAuth()
  const { language } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
    // Load orders from API
    async function fetchOrders() {
      if (!user) return
      setLoadingOrders(true)
      try {
        const response = await fetch("/api/orders", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }
        const data = await response.json()
        setOrders(data.orders)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoadingOrders(false)
      }
    }
    fetchOrders()
  }, [user, isLoading, router])

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500"
      case "shipped":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    const statusMap = {
      pending: language === "uk" ? "Очікує" : "Pending",
      processing: language === "uk" ? "Обробляється" : "Processing",
      shipped: language === "uk" ? "Відправлено" : "Shipped",
      delivered: language === "uk" ? "Доставлено" : "Delivered",
      cancelled: language === "uk" ? "Скасовано" : "Cancelled",
    }
    return statusMap[status]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-coffee-50/30">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold font-serif mb-8 text-coffee-800">
            {language === "uk" ? "Історія замовлень" : "Order History"}
          </h1>

          {loadingOrders ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coffee-600"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">{language === "uk" ? "Немає замовлень" : "No Orders"}</h3>
                <p className="text-muted-foreground mb-4">
                  {language === "uk" ? "Ви ще не зробили жодного замовлення" : "You haven't made any orders yet"}
                </p>
                <Button onClick={() => router.push("/catalog")}>
                  {language === "uk" ? "Почати покупки" : "Start Shopping"}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        {language === "uk" ? "Замовлення" : "Order"} #{order.id}
                      </CardTitle>
                      <Badge className={getStatusColor(order.status)}>{getStatusText(order.status)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="h-4 w-4" />
                        {order.paymentMethod}
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="h-4 w-4" />
                        {order.deliveryAddress}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {language === "uk" ? "Кількість" : "Quantity"}: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₴{item.price * item.quantity}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{language === "uk" ? "Загальна сума:" : "Total:"}</span>
                        <span className="font-bold text-lg">₴{order.total}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}