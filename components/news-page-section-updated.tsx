"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsItem {
  id: string
  _id?: string
  title: { uk: string; en: string }
  excerpt: { uk: string; en: string }
  content: { uk: string; en: string }
  image: string
  author: string
  publishedAt: string
  category: string
  featured: boolean
}

export function NewsPageSection() {
  const { language } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/news')
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error('Error fetching news:', error)
      setError('Failed to load news')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "uk" ? "uk-UA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryLabel = (category: string) => {
    const labels = {
      products: { uk: "Продукти", en: "Products" },
      awards: { uk: "Нагороди", en: "Awards" },
      events: { uk: "Події", en: "Events" },
      company: { uk: "Компанія", en: "Company" },
    }
    return labels[category as keyof typeof labels]?.[language] || category
  }

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
            <p className="mt-4 text-coffee-600">{language === "uk" ? "Завантаження новин..." : "Loading news..."}</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={fetchNews} className="mt-4">
              {language === "uk" ? "Спробувати знову" : "Try Again"}
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (news.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
              {language === "uk" ? "Новини BlackCoffee" : "BlackCoffee News"}
            </h1>
            <p className="text-lg text-coffee-600">
              {language === "uk" ? "Новин поки що немає" : "No news yet"}
            </p>
          </div>
        </div>
      </section>
    )
  }

  const featuredNews = news.find((item) => item.featured)
  const regularNews = news.filter((item) => !item.featured)

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Новини BlackCoffee" : "BlackCoffee News"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Будьте в курсі останніх новин, подій та оновлень від нашої команди"
              : "Stay updated with the latest news, events and updates from our team"}
          </p>
        </div>

        {/* Featured News */}
        {featuredNews && (
          <div className="mb-12">
            <Card className="overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <Image
                    src={featuredNews.image || "/placeholder.svg"}
                    alt={featuredNews.title[language]}
                    width={600}
                    height={400}
                    className="w-full h-64 md:h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-coffee-600 hover:bg-coffee-700">
                      {language === "uk" ? "Головна новина" : "Featured"}
                    </Badge>
                    <Badge variant="outline">{getCategoryLabel(featuredNews.category)}</Badge>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-coffee-800 mb-4 font-serif">
                    {featuredNews.title[language]}
                  </h2>
                  <p className="text-coffee-600 mb-6 leading-relaxed">{featuredNews.excerpt[language]}</p>
                  <div className="flex items-center gap-4 text-sm text-coffee-500 mb-6">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{featuredNews.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(featuredNews.publishedAt)}</span>
                    </div>
                  </div>
                  <Link href={`/news/${featuredNews.id || featuredNews._id}`}>
                    <Button className="bg-coffee-600 hover:bg-coffee-700">
                      {language === "uk" ? "Читати повністю" : "Read More"}
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Regular News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regularNews.map((item) => (
            <Card
              key={item.id || item._id}
              className="group hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title[language]}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-white/90">
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-coffee-800 mb-3 line-clamp-2 font-serif">
                    {item.title[language]}
                  </h3>
                  <p className="text-coffee-600 mb-4 line-clamp-3">{item.excerpt[language]}</p>
                  <div className="flex items-center gap-4 text-sm text-coffee-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Link href={`/news/${item.id || item._id}`} className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    {language === "uk" ? "Читати далі" : "Read More"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Load More Button
