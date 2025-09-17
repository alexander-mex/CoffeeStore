"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, X, Calendar } from "lucide-react"
import Image from "next/image"

interface NewsItem {
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

interface NewsFormProps {
  news?: NewsItem | null
  onSave: (news: NewsItem) => void
  onCancel: () => void
}

export function NewsForm({ news, onSave, onCancel }: NewsFormProps) {
  const [formData, setFormData] = useState<NewsItem>({
    title: { uk: "", en: "" },
    excerpt: { uk: "", en: "" },
    content: { uk: "", en: "" },
    image: "",
    author: "",
    publishedAt: new Date().toISOString().split("T")[0],
    category: "company",
    featured: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    if (news) {
      setFormData({
        ...news,
        publishedAt: new Date(news.publishedAt).toISOString().split("T")[0],
      })
      setImagePreview(news.image)
    }
  }, [news])

  const handleInputChange = (field: string, value: any, language?: "uk" | "en") => {
    setFormData((prev) => {
      if (language && (field === "title" || field === "excerpt" || field === "content")) {
        return {
          ...prev,
          [field]: {
            ...(prev[field as keyof NewsItem] as Record<string, string>),
            [language]: value,
          },
        }
      }
      return {
        ...prev,
        [field]: value,
      }
    })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      return data.imageId
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = formData.image

      // Upload image if new file selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile)
      }

      const newsData = {
        ...formData,
        image: imageUrl,
        publishedAt: new Date(formData.publishedAt).toISOString(),
      }

      const url = news ? `/api/news/${news._id}` : "/api/news"
      const method = news ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      })

      if (response.ok) {
        const result = await response.json()
        onSave(result.news)
      } else {
        throw new Error("Failed to save news")
      }
    } catch (error) {
      console.error("Error saving news:", error)
      alert("Помилка при збереженні новини")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: "products", label: "Продукти" },
    { value: "events", label: "Події" },
    { value: "awards", label: "Нагороди" },
    { value: "company", label: "Компанія" },
    { value: "ecology", label: "Екологія" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold font-serif mb-4 text-coffee-800">
            {news ? "Редагувати новину" : "Додати нову новину"}
          </h1>
          <p className="text-coffee-600 mt-2">
            {news ? "Внесіть зміни до існуючої новини" : "Заповніть форму для додавання нової новини"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Контент новини</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="uk" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="uk">Українська</TabsTrigger>
                  <TabsTrigger value="en">English</TabsTrigger>
                </TabsList>

                <TabsContent value="uk" className="space-y-4">
                  <div>
                    <Label htmlFor="title-uk">Заголовок *</Label>
                    <Input
                      id="title-uk"
                      value={formData.title.uk}
                      onChange={(e) => handleInputChange("title", e.target.value, "uk")}
                      placeholder="Заголовок новини українською"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt-uk">Короткий опис *</Label>
                    <Textarea
                      id="excerpt-uk"
                      value={formData.excerpt.uk}
                      onChange={(e) => handleInputChange("excerpt", e.target.value, "uk")}
                      placeholder="Короткий опис новини..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content-uk">Повний текст *</Label>
                    <Textarea
                      id="content-uk"
                      value={formData.content.uk}
                      onChange={(e) => handleInputChange("content", e.target.value, "uk")}
                      placeholder="Повний текст новини..."
                      rows={8}
                      required
                    />
                  </div>
                </TabsContent>

                <TabsContent value="en" className="space-y-4">
                  <div>
                    <Label htmlFor="title-en">Title *</Label>
                    <Input
                      id="title-en"
                      value={formData.title.en}
                      onChange={(e) => handleInputChange("title", e.target.value, "en")}
                      placeholder="News title in English"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt-en">Excerpt *</Label>
                    <Textarea
                      id="excerpt-en"
                      value={formData.excerpt.en}
                      onChange={(e) => handleInputChange("excerpt", e.target.value, "en")}
                      placeholder="Short description of the news..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="content-en">Full Content *</Label>
                    <Textarea
                      id="content-en"
                      value={formData.content.en}
                      onChange={(e) => handleInputChange("content", e.target.value, "en")}
                      placeholder="Full news content..."
                      rows={8}
                      required
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Зображення новини</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-coffee-300 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview("")
                        setImageFile(null)
                        handleInputChange("image", "")
                      }}
                      className="absolute top-2 right-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="py-8">
                    <Upload className="h-12 w-12 text-coffee-400 mx-auto mb-4" />
                    <p className="text-coffee-600 mb-2">Завантажте зображення новини</p>
                    <p className="text-sm text-coffee-500">PNG, JPG до 5MB</p>
                  </div>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </CardContent>
          </Card>

          {/* News Details */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Деталі новини</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="author">Автор *</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Ім'я автора"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Категорія *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
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
              </div>

              <div>
                <Label htmlFor="publishedAt">Дата публікації *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
                  <Input
                    id="publishedAt"
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => handleInputChange("publishedAt", e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Головна новина</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange("featured", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Button type="submit" disabled={isLoading} className="w-full bg-coffee-600 hover:bg-coffee-700">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      {news ? "Оновлення..." : "Створення..."}
                    </div>
                  ) : (
                    <>{news ? "Оновити новину" : "Опублікувати новину"}</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="w-full bg-transparent">
                  Скасувати
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
