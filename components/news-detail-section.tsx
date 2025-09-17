"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

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

interface NewsDetailSectionProps {
  newsId: string
}

export function NewsDetailSection({ newsId }: NewsDetailSectionProps) {
  const { language } = useLanguage()
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNewsItem()
  }, [newsId])

  const fetchNewsItem = async () => {
    try {
      const response = await fetch(`/api/news/${newsId}`)
      if (!response.ok) {
        if (response.status === 404) {
          notFound()
        }
        throw new Error('Failed to fetch news item')
      }
      const data = await response.json()
      setNewsItem(data.news || null)
    } catch (error) {
      console.error("Error fetching news item:", error)
      setError(error instanceof Error ? error.message : 'Failed to load news')
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
            <p className="mt-4 text-coffee-600">{language === "uk" ? "Завантаження..." : "Loading..."}</p>
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
            <h2 className="text-2xl font-bold text-red-600 mb-4">{language === "uk" ? "Помилка" : "Error"}</h2>
            <p className="text-coffee-600">{error}</p>
            <Button variant="outline" className="mt-4" asChild>
              <Link href="/news">{language === "uk" ? "Повернутися до новин" : "Back to News"}</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  if (!newsItem) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-coffee-800 mb-4">{language === "uk" ? "Новину не знайдено" : "News not found"}</h2>
            <Button variant="outline" asChild>
              <Link href="/news">{language === "uk" ? "Повернутися до новин" : "Back to News"}</Link>
            </Button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 bg-coffee-50/30">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild>
            <Link href="/news" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              {language === "uk" ? "Повернутися до новин" : "Back to News"}
            </Link>
          </Button>
        </div>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
                  <Image
                    src={newsItem.image ? `http://localhost:3000/api/images/${newsItem.image}` : "/placeholder.svg"}
                    alt={newsItem.title[language]}
                    width={800}
                    height={450}
                    className="w-full h-64 md:h-96 object-cover"
                  />
            <div className="absolute top-4 left-4">
              <Badge className="bg-coffee-600 text-white">
                {newsItem.category}
              </Badge>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-coffee-800 mb-4 font-serif">
                {newsItem.title[language]}
              </h1>
              
              <div className="flex items-center gap-6 text-sm text-coffee-600">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(newsItem.publishedAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{newsItem.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{newsItem.readTime} {language === "uk" ? "хв читання" : "min read"}</span>
                </div>
              </div>
            </div>

            <div 
              className="prose prose-coffee max-w-none text-coffee-700"
              dangerouslySetInnerHTML={{ 
                __html: newsItem.content[language].replace(/\n/g, '<br />') 
              }}
            />
          </div>
        </article>

        <div className="mt-8">
          <Button asChild>
            <Link href="/news">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === "uk" ? "Повернутися до всіх новин" : "Back to All News"}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
