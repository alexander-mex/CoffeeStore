"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface NewsItem {
  _id: string
  title: { uk: string; en: string }
  excerpt: { uk: string; en: string }
  content: { uk: string; en: string }
  image: string
  publishedAt: string
  readTime: number
  category: string
  author: string
  featured: boolean
}

export function NewsSection() {
  const { language } = useLanguage()
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch("/api/news")
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }
      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error("Error fetching news:", error)
      setNews([])
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

  if (news.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold font-serif mb-4 text-coffee-800">
              {language === "uk" ? "Останні новини" : "Latest News"}
            </h2>
            <p className="text-coffee-600">{language === "uk" ? "Новини скоро з'являться" : "News coming soon"}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-coffee-50/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-serif mb-4 text-coffee-800">
            {language === "uk" ? "Останні новини" : "Latest News"}
          </h2>
          <p className="text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Слідкуйте за останніми новинами BlackCoffee, дізнавайтеся про нові сорти кави та цікаві події"
              : "Follow the latest Blackcoffee news, learn about new coffee varieties and interesting events"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <Card key={item._id} className="group hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <Image
src={item.image ? `http://localhost:3000/api/images/${item.image}` : "/placeholder.svg"}
                    alt={item.title[language]}
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="outline" className="bg-white/90">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-coffee-800 mb-3 line-clamp-2 font-serif">
                    {item.title[language]}
                  </h3>
                  <p className="text-coffee-600 mb-4 line-clamp-3">{item.excerpt[language]}</p>
                  <div className="flex items-center gap-4 text-sm text-coffee-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{item.readTime} {language === "uk" ? "хв" : "min"}</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href={`/news/${item._id}`}>
                      {language === "uk" ? "Читати далі" : "Read More"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
