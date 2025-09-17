"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Eye, EyeOff } from "lucide-react"

export function AdminLogin() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Невірний email або пароль")
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-coffee-50 px-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="w-16 h-16 bg-coffee-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-coffee-800 font-serif">Адмін-панель BlackCoffee</CardTitle>
          <p className="text-coffee-600">Увійдіть для доступу до панелі управління</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-2">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@blackcoffee.ua"
                required
                className="border-coffee-300 focus:border-coffee-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-2">Пароль</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Введіть пароль"
                  required
                  className="border-coffee-300 focus:border-coffee-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-coffee-500 hover:text-coffee-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full bg-coffee-600 hover:bg-coffee-700 text-white">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Вхід...
                </div>
              ) : (
                "Увійти"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-coffee-100 rounded-lg">
            <h3 className="font-semibold text-coffee-800 mb-2">Тестові дані для входу:</h3>
            <p className="text-sm text-coffee-700">
              <strong>Email:</strong> admin@blackcoffee.ua
            </p>
            <p className="text-sm text-coffee-700">
              <strong>Пароль:</strong> admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
