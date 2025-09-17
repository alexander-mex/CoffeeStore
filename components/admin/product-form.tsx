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
import { ArrowLeft, Upload, X } from "lucide-react"
import Image from "next/image"
import { resolveImageUrl } from "@/lib/image-url-resolver"

interface Product {
  _id?: string
  name: { uk: string; en: string }
  description: { uk: string; en: string }
  price: number
  originalPrice?: number
  image: string
  category: { uk: string; en: string }
  type: { uk: string; en: string }
  weight: { uk: string; en: string }
  origin: { uk: string; en: string }
  isNew: boolean
  isOnSale: boolean
  inStock: boolean
}

interface ProductFormProps {
  product?: Product | null
  onSave: (product: Product) => void
  onCancel: () => void
}

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState<Product>({
    name: { uk: "", en: "" },
    description: { uk: "", en: "" },
    price: 0,
    originalPrice: undefined,
    image: "",
    category: { uk: "Арабіка", en: "Arabica" },
    type: { uk: "Зерна", en: "Beans" },
    weight: { uk: "250г", en: "250g" },
    origin: { uk: "", en: "" },
    isNew: true,
    isOnSale: false,
    inStock: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [resolvedImageUrl, setResolvedImageUrl] = useState<string>("")

  useEffect(() => {
    if (product) {
      const normalizedProduct = {
        ...product,
        name: typeof product.name === "string" ? { uk: product.name, en: product.name } : product.name,
        description:
          typeof product.description === "string"
            ? { uk: product.description, en: product.description }
            : product.description,
        category:
          typeof product.category === "string"
            ? { uk: product.category, en: getCategoryTranslation(product.category) }
            : product.category,
        type:
          typeof product.type === "string" ? { uk: product.type, en: getTypeTranslation(product.type) } : product.type,
        weight:
          typeof product.weight === "string"
            ? { uk: product.weight, en: getWeightTranslation(product.weight) }
            : product.weight,
        origin: typeof product.origin === "string" ? { uk: product.origin, en: product.origin } : product.origin,
      }
      setFormData(normalizedProduct)
      if (product.image) {
        setImagePreview(product.image)
        // Resolve the image URL for display
        const resolvedUrl = resolveImageUrl(product.image)
        setResolvedImageUrl(resolvedUrl)
      }
    }
  }, [product])

  const getCategoryTranslation = (ukCategory: string): string => {
    const translations: Record<string, string> = {
      Арабіка: "Arabica",
      Робуста: "Robusta",
      Купажі: "Blends",
      "Без кофеїну": "Decaf",
    }
    return translations[ukCategory] || ukCategory
  }

  const getTypeTranslation = (ukType: string): string => {
    const translations: Record<string, string> = {
      Зерна: "Beans",
      Мелена: "Ground",
      Розчинна: "Instant",
    }
    return translations[ukType] || ukType
  }

  const getWeightTranslation = (ukWeight: string): string => {
    const translations: Record<string, string> = {
      "100г": "100g",
      "250г": "250g",
      "500г": "500g",
      "1кг": "1kg",
    }
    return translations[ukWeight] || ukWeight
  }

  const handleInputChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleMultilingualChange = (field: "name" | "description" | "origin", language: "uk" | "en", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [language]: value,
      },
    }))
  }

  const handleSelectChange = (field: "category" | "type" | "weight", ukValue: string, enValue: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: { uk: ukValue, en: enValue },
    }))
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

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageData = formData.image

      if (imageFile) {
        imageData = await convertImageToBase64(imageFile)
      }

      const productData = {
        ...formData,
        image: imageData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      }

      const url = product ? `/api/products/${product._id}` : "/api/products"
      const method = product ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (response.ok) {
        const result = await response.json()
        onSave(result.product)
      } else {
        throw new Error("Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Помилка при збереженні товару")
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { ukValue: "Арабіка", enValue: "Arabica", ukLabel: "Арабіка", enLabel: "Arabica" },
    { ukValue: "Робуста", enValue: "Robusta", ukLabel: "Робуста", enLabel: "Robusta" },
    { ukValue: "Купажі", enValue: "Blends", ukLabel: "Купажі", enLabel: "Blends" },
    { ukValue: "Без кофеїну", enValue: "Decaf", ukLabel: "Без кофеїну", enLabel: "Decaf" },
  ]

  const types = [
    { ukValue: "Зерна", enValue: "Beans", ukLabel: "Зерна", enLabel: "Beans" },
    { ukValue: "Мелена", enValue: "Ground", ukLabel: "Мелена", enLabel: "Ground" },
    { ukValue: "Розчинна", enValue: "Instant", ukLabel: "Розчинна", enLabel: "Instant" },
  ]

  const weights = [
    { ukValue: "100г", enValue: "100g", ukLabel: "100г", enLabel: "100g" },
    { ukValue: "250г", enValue: "250g", ukLabel: "250г", enLabel: "250g" },
    { ukValue: "500г", enValue: "500g", ukLabel: "500г", enLabel: "500g" },
    { ukValue: "1кг", enValue: "1kg", ukLabel: "1кг", enLabel: "1kg" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-coffee-800 font-serif">
            {product ? "Редагувати товар" : "Додати новий товар"}
          </h1>
          <p className="text-coffee-600 mt-2">
            {product ? "Внесіть зміни до існуючого товару" : "Заповніть форму для додавання нового товару"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Основна інформація</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Назва товару *</Label>
                <Tabs defaultValue="uk" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="uk">Українська</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uk">
                    <Input
                      value={formData.name.uk}
                      onChange={(e) => handleMultilingualChange("name", "uk", e.target.value)}
                      placeholder="Наприклад: Арабіка Колумбія Супремо"
                      required
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Input
                      value={formData.name.en}
                      onChange={(e) => handleMultilingualChange("name", "en", e.target.value)}
                      placeholder="Example: Arabica Colombia Supremo"
                      required
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Label>Опис *</Label>
                <Tabs defaultValue="uk" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="uk">Українська</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uk">
                    <Textarea
                      value={formData.description.uk}
                      onChange={(e) => handleMultilingualChange("description", "uk", e.target.value)}
                      placeholder="Детальний опис товару українською..."
                      rows={4}
                      required
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Textarea
                      value={formData.description.en}
                      onChange={(e) => handleMultilingualChange("description", "en", e.target.value)}
                      placeholder="Detailed product description in English..."
                      rows={4}
                      required
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div>
                <Label>Походження *</Label>
                <Tabs defaultValue="uk" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="uk">Українська</TabsTrigger>
                    <TabsTrigger value="en">English</TabsTrigger>
                  </TabsList>
                  <TabsContent value="uk">
                    <Input
                      value={formData.origin.uk}
                      onChange={(e) => handleMultilingualChange("origin", "uk", e.target.value)}
                      placeholder="Наприклад: Колумбія, Уїла"
                      required
                    />
                  </TabsContent>
                  <TabsContent value="en">
                    <Input
                      value={formData.origin.en}
                      onChange={(e) => handleMultilingualChange("origin", "en", e.target.value)}
                      placeholder="Example: Colombia, Huila"
                      required
                    />
                  </TabsContent>
                </Tabs>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Категорія *</Label>
                  <Select
                    value={formData.category.uk}
                    onValueChange={(value) => {
                      const category = categories.find((c) => c.ukValue === value)
                      if (category) {
                        handleSelectChange("category", category.ukValue, category.enValue)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.ukValue} value={category.ukValue}>
                          {category.ukLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="type">Тип *</Label>
                  <Select
                    value={formData.type.uk}
                    onValueChange={(value) => {
                      const type = types.find((t) => t.ukValue === value)
                      if (type) {
                        handleSelectChange("type", type.ukValue, type.enValue)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type.ukValue} value={type.ukValue}>
                          {type.ukLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight">Вага *</Label>
                  <Select
                    value={formData.weight.uk}
                    onValueChange={(value) => {
                      const weight = weights.find((w) => w.ukValue === value)
                      if (weight) {
                        handleSelectChange("weight", weight.ukValue, weight.enValue)
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {weights.map((weight) => (
                        <SelectItem key={weight.ukValue} value={weight.ukValue}>
                          {weight.ukLabel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Ціноутворення</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Ціна (₴) *</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="originalPrice">Стара ціна (₴)</Label>
                  <Input
                    id="originalPrice"
                    type="number"
                    value={formData.originalPrice || ""}
                    onChange={(e) => handleInputChange("originalPrice", e.target.value || undefined)}
                    placeholder="Залиште порожнім, якщо немає знижки"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Зображення товару</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-coffee-300 rounded-lg p-4 text-center">
                {resolvedImageUrl ? (
                  <div className="relative">
                    <Image
                      src={resolvedImageUrl || "/placeholder.svg"}
                      alt="Preview"
                      width={200}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setImagePreview("")
                        setResolvedImageUrl("")
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
                    <p className="text-coffee-600 mb-2">Завантажте зображення товару</p>
                    <p className="text-sm text-coffee-500">PNG, JPG до 5MB</p>
                  </div>
                )}
              </div>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </CardContent>
          </Card>

          {/* Product Status */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Статус товару</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="inStock">В наявності</Label>
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => handleInputChange("inStock", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isNew">Новинка</Label>
                <Switch
                  id="isNew"
                  checked={formData.isNew}
                  onCheckedChange={(checked) => handleInputChange("isNew", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="isOnSale">Акційний товар</Label>
                <Switch
                  id="isOnSale"
                  checked={formData.isOnSale}
                  onCheckedChange={(checked) => handleInputChange("isOnSale", checked)}
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
                      {product ? "Оновлення..." : "Створення..."}
                    </div>
                  ) : (
                    <>{product ? "Оновити товар" : "Створити товар"}</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel} className="w-full bg-transparent">
                  Скасувати
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}