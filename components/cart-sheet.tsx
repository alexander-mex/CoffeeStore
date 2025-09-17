"use client"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { Minus, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface CartSheetProps {
  isOpen: boolean
  onClose: () => void
}

export function CartSheet({ isOpen, onClose }: CartSheetProps) {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCart()
  const { t } = useLanguage()
  const { user } = useAuth()
  const router = useRouter()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const totalPrice = getTotalPrice()

  const handleCheckout = async () => {
    if (!user) {
      router.push("/auth")
      return
    }

    setIsCheckingOut(true)
    try {
      // Fetch user profile for delivery address
      const profileResponse = await fetch("/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!profileResponse.ok) {
        throw new Error("Failed to fetch user profile")
      }

      const profileData = await profileResponse.json()
      const deliveryAddress = profileData.user.address || ""

      // Prepare order data
      const orderData = {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        total: totalPrice,
        deliveryAddress,
        paymentMethod: "Картка", // Default payment method
      }

      // Create order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      // Clear cart and redirect to orders page
      clearCart()
      onClose()
      router.push("/orders")
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Помилка при оформленні замовлення. Спробуйте ще раз.")
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{t("cart.title")}</SheetTitle>
            <SheetDescription>{t("cart.empty")}</SheetDescription>
          </SheetHeader>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">{t("cart.empty")}</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{t("cart.title")}</SheetTitle>
          <SheetDescription>{items.length} товарів у кошику</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.type === "beans" ? "Зернова" : "Мелена"} • {item.weight}
                    </p>
                    <p className="font-semibold text-sm">₴{item.price}</p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <Badge variant="secondary" className="min-w-[2rem] justify-center">
                      {item.quantity}
                    </Badge>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold">{t("cart.total")}:</span>
              <span className="font-bold text-lg">₴{totalPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Оформлення..." : t("cart.checkout")}
              </Button>

              <Button variant="outline" className="w-full bg-transparent" onClick={clearCart}>
                Очистити кошик
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
