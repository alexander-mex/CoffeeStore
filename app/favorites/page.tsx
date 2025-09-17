"use client"

import { useLanguage } from "@/contexts/language-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Heart } from "lucide-react"

export default function FavoritesPage() {
  const { language } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <Heart className="mx-auto h-16 w-16 text-coffee-400 mb-4" />
          <h1 className="text-4xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Обрані товари" : "Favorites"}
          </h1>
          <p className="text-coffee-600 text-lg">
            {language === "uk"
              ? "Ваш список обраних товарів поки що порожній"
              : "Your favorites list is currently empty"}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
