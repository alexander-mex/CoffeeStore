"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { NewsForm } from "./news-form"
import { Plus, Search, Edit, Trash2, Eye, Filter, Calendar, User } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from "next/image"

interface NewsItem {
  _id: string
  title: { uk: string; en: string }
  excerpt: { uk: string; en: string }
  content: { uk: string; en: string }
  image: string
  author: string
  publishedAt: string
  category: string
  featured: boolean
  readTime: number
}

export function NewsManagement() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null)
  const [deleteNews, setDeleteNews] = useState<NewsItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("publishedAt")

  useEffect(() => {
    fetchNews()
  }, [searchTerm, categoryFilter, sortBy])

  const fetchNews = async () => {
    try {
      const params = new URLSearchParams({
        limit: "50",
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        sortBy,
        sortOrder: "desc",
      })

      const response = await fetch(`/api/news?${params}`)
      const data = await response.json()
      setNews(data.news || [])
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNews = async () => {
    if (!deleteNews) return

    try {
      const response = await fetch(`/api/news/${deleteNews._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNews(news.filter((n) => n._id !== deleteNews._id))
        setDeleteNews(null)
      }
    } catch (error) {
      console.error("Error deleting news:", error)
    }
  }

  const handleNewsSaved = (savedNews: NewsItem) => {
    if (editingNews) {
      setNews(news.map((n) => (n._id === savedNews._id ? savedNews : n)))
    } else {
      setNews([savedNews, ...news])
    }
    setShowForm(false)
    setEditingNews(null)
  }

  const categories = [
    { value: "all", label: "Всі категорії" },
    { value: "products", label: "Продукти" },
    { value: "events", label: "Події" },
    { value: "awards", label: "Нагороди" },
    { value: "company", label: "Компанія" },
    { value: "ecology", label: "Екологія" },
  ]

  const sortOptions = [
    { value: "publishedAt", label: "За датою публікації" },
    { value: "createdAt", label: "За датою створення" },
    { value: "title.uk", label: "За назвою" },
  ]

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
        <p className="mt-4 text-coffee-600">Завантаження новин...</p>
      </div>
    )
  }

  if (showForm) {
    return (
      <NewsForm
        news={editingNews}
        onSave={handleNewsSaved}
        onCancel={() => {
          setShowForm(false)
          setEditingNews(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800 font-serif">Управління новинами</h1>
          <p className="text-coffee-600 mt-2">Створюйте, редагуйте та видаляйте новини сайту</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-coffee-600 hover:bg-coffee-700">
          <Plus className="h-4 w-4 mr-2" />
          Додати новину
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
              <Input
                placeholder="Пошук новин..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* News List */}
      <div className="space-y-4">
        {news.map((item) => (
          <Card key={item._id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex gap-6">
                <div className="relative w-32 h-24 flex-shrink-0">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title.uk}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{item.category}</Badge>
                      {item.featured && <Badge className="bg-coffee-600 hover:bg-coffee-700">Головна</Badge>}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingNews(item)
                          setShowForm(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Редагувати
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteNews(item)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-coffee-800 mb-2 font-serif">{item.title.uk}</h3>
                  <p className="text-coffee-600 mb-3 line-clamp-2">{item.excerpt.uk}</p>
                  <div className="flex items-center gap-4 text-sm text-coffee-500">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{item.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(item.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{item.readTime} хв читання</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {news.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-coffee-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-coffee-800 mb-2">Новини не знайдено</h3>
          <p className="text-coffee-600 mb-4">Спробуйте змінити фільтри або додайте нову новину</p>
          <Button onClick={() => setShowForm(true)} className="bg-coffee-600 hover:bg-coffee-700">
            <Plus className="h-4 w-4 mr-2" />
            Додати першу новину
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNews} onOpenChange={() => setDeleteNews(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити новину?</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити новину "{deleteNews?.title.uk}"? Цю дію неможливо скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteNews} className="bg-red-600 hover:bg-red-700">
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
