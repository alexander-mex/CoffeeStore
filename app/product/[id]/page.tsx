"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShoppingCart, Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { resolveImageUrl } from "@/lib/image-url-resolver"

interface Product {
  id: string
  name: { uk: string; en: string }
  description: { uk: string; en: string }
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew: boolean
  isOnSale: boolean
  inStock: boolean
  type?: { uk: string; en: string }
  weight?: { uk: string; en: string }
  origin?: { uk: string; en: string }
}

export default function ProductPage() {
  const params = useParams()
  const { language } = useLanguage()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
    }
  }, [params.id])

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" suppressHydrationWarning>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
            <p className="mt-4 text-coffee-600">{language === "uk" ? "Завантаження..." : "Loading..."}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" suppressHydrationWarning>
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-coffee-800 mb-4">
              {language === "uk" ? "Товар не знайдено" : "Product not found"}
            </h1>
            <Link href="/catalog">
              <Button className="bg-coffee-600 hover:bg-coffee-700">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {language === "uk" ? "Повернутися до каталогу" : "Back to Catalog"}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100" suppressHydrationWarning>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/catalog" className="inline-flex items-center text-coffee-600 hover:text-coffee-800 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {language === "uk" ? "Повернутися до каталогу" : "Back to Catalog"}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative">
            <Image
              src={imageError ? "/placeholder.svg" : resolveImageUrl(product.image)}
              alt={product.name[language]}
              width={600}
              height={600}
              className="w-full h-96 lg:h-[500px] object-cover rounded-lg"
              onError={handleImageError}
              priority
              unoptimized
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-green-500 hover:bg-green-600">{language === "uk" ? "Новинка" : "New"}</Badge>
              )}
              {product.isOnSale && (
                <Badge className="bg-red-500 hover:bg-red-600">{language === "uk" ? "Акція" : "Sale"}</Badge>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-coffee-800 mb-2 font-serif">
                {product.name[language]}
              </h1>
              <p className="text-coffee-600 text-lg">{product.description[language]}</p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-coffee-800">₴{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-coffee-400 line-through">₴{product.originalPrice}</span>
              )}
            </div>

            {product.origin && (
              <div className="text-sm text-coffee-600">
                <strong>{language === "uk" ? "Походження:" : "Origin:"}</strong>{" "}
                {product.origin[language]}
              </div>
            )}

            {product.type && (
              <div className="text-sm text-coffee-600">
                <strong>{language === "uk" ? "Тип:" : "Type:"}</strong>{" "}
                {product.type[language]}
              </div>
            )}

            {product.weight && (
              <div className="text-sm text-coffee-600">
                <strong>{language === "uk" ? "Вага:" : "Weight:"}</strong>{" "}
                {product.weight[language]}
              </div>
            )}

            <div className="flex gap-4">
              <Button
              onClick={() => addItem({
                id: product.id,
                name: product.name[language],
                price: product.price,
                image: product.image,
                type: product.type ? (product.type[language] === "Зерна" || product.type[language] === "Beans" ? "beans" : "ground") : "beans",
                weight: product.weight ? product.weight[language] : "250г"
              })}
                disabled={!product.inStock}
                className="flex-1 bg-coffee-600 hover:bg-coffee-700 text-white py-3"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock
                  ? language === "uk"
                    ? "Додати в кошик"
                    : "Add to Cart"
                  : language === "uk"
                    ? "Немає в наявності"
                    : "Out of Stock"}
              </Button>
              <Button variant="outline" className="px-4 bg-transparent">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {!product.inStock && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 font-medium">
                  {language === "uk"
                    ? "Цей товар тимчасово відсутній на складі"
                    : "This product is temporarily out of stock"}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
