"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  type: "beans" | "ground"
  weight: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { user } = useAuth()

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  // Sync cart with database when user logs in or out
  useEffect(() => {
    if (user) {
      // Load cart from database if user is logged in
      const loadCartFromDB = async () => {
        try {
          const response = await fetch("/api/cart", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          })
          if (response.ok) {
            const data = await response.json()
            if (data.cart && data.cart.length > 0) {
              setItems(data.cart)
            }
          }
        } catch (error) {
          console.error("Error loading cart from DB:", error)
        }
      }
      loadCartFromDB()
    } else {
      // Clear cart when user logs out
      setItems([])
    }
  }, [user])

  // Save cart to database when items change and user is logged in
  useEffect(() => {
    if (user && items.length > 0) {
      const saveCartToDB = async () => {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
            body: JSON.stringify({ items }),
          })
        } catch (error) {
          console.error("Error saving cart to DB:", error)
        }
      }
      saveCartToDB()
    }
  }, [items, user])

  const addItem = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id)

      if (existingItem) {
        return prevItems.map((item) => (item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item))
      }

      return [...prevItems, { ...newItem, quantity: 1 }]
    })
  }

  const removeItem = async (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          action: "remove",
          itemId: id,
        }),
      })
      if (!response.ok) {
        console.error("Failed to remove item from cart in backend")
      }
    } catch (error) {
      console.error("Error removing item from cart:", error)
    }
  }

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id)
      return
    }

    setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)))

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          action: "update",
          itemId: id,
          quantity,
        }),
      })
      if (!response.ok) {
        console.error("Failed to update item quantity in backend")
      }
    } catch (error) {
      console.error("Error updating item quantity:", error)
    }
  }

  const clearCart = async () => {
    setItems([])
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      if (!response.ok) {
        console.error("Failed to clear cart in backend")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    }
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
