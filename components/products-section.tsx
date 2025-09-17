"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { useToast } from "@/hooks/use-toast"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getImageUrl, handleImageError } from "@/lib/image-utils"

interface Product {
  _id: string
  id?: string // For backward compatibility
  name: { uk: string; en: string } | string
  description: { uk: string; en: string } | string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew: boolean
  isOnSale: boolean
  inStock: boolean
  type?: { uk: string; en: string } | string
  weight?: { uk: string; en: string } | string
  origin?: { uk: string; en: string } | string
}

export function ProductsSection() {
  const { language, t } = useLanguage()
  const { addItem } = useCart()
  const { toast } = useToast()
  const [isMounted, setIsMounted] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [saleProducts, setSaleProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    fetchProducts()
    const savedFavorites = localStorage.getItem("favorites")
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites))
      } catch (error) {
        console.error("Error parsing favorites:", error)
        setFavorites([])
      }
    }
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      const products = data.products || []

      const mappedProducts = products.map((p: any) => ({
        ...p,
        id: p._id || p.id,
      }))

      // Filter for new and sale products (max 4 each)
      setNewProducts(mappedProducts.filter((p: Product) => p.isNew).slice(0, 4))
      setSaleProducts(mappedProducts.filter((p: Product) => p.isOnSale).slice(0, 4))
    } catch (error) {
      console.error("Error fetching products:", error)
      setNewProducts([])
      setSaleProducts([])
    } finally {
      setLoading(false)
    }
  }

  if (!isMounted) {
    return (
      <section className="py-16 px-4" suppressHydrationWarning>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  const getLocalizedValue = (value: string | { uk: string; en: string } | undefined) => {
    if (!value) return ""
    return typeof value === "string" ? value : value[language] || value.uk || value.en || ""
  }

  const toggleFavorite = (productId: string) => {
    const id = productId
    const newFavorites = favorites.includes(id) ? favorites.filter((favId) => favId !== id) : [...favorites, id]

    setFavorites(newFavorites)
    try {
      localStorage.setItem("favorites", JSON.stringify(newFavorites))
    } catch (error) {
      console.error("Error saving favorites:", error)
    }

    toast({
      title: favorites.includes(id) ? "Видалено з обраного" : "Додано в обране",
      description: favorites.includes(id)
        ? "Товар видалено з вашого списку обраного"
        : "Товар додано до вашого списку обраного",
    })
  }

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) {
      toast({
        title: "Товар відсутній",
        description: "Цей товар наразі відсутній на складі",
        variant: "destructive",
      })
      return
    }

    const productName =
      typeof product.name === "string"
        ? product.name
        : product.name?.[language] || product.name?.uk || product.name?.en || "Unnamed Product"

    const productType = getLocalizedValue(product.type)
    const productWeight = getLocalizedValue(product.weight)

    addItem({
      id: product._id || product.id || "",
      name: productName,
      price: product.price,
      image: product.image,
      type: (productType === "ground" || productType === "мелена" ? "ground" : "beans"),
      weight: productWeight || "250г",
    })

    toast({
      title: "Додано в кошик",
      description: `${productName} додано до вашого кошика`,
    })
  }

  const ProductCard = ({ product }: { product: Product }) => {
    const getProductName = (product: Product) => {
      return typeof product.name === "string"
        ? product.name
        : product.name?.[language] || product.name?.uk || product.name?.en || "Unnamed Product"
    }

    const getProductDescription = (product: Product) => {
      return typeof product.description === "string"
        ? product.description
        : product.description?.[language] || product.description?.uk || product.description?.en || ""
    }

    // Ensure we have a valid ID
    const productId = product.id || product._id

    return (
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <CardHeader className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <Image
              src={getImageUrl(product.image)}
              alt={getProductName(product)}
              width={300}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
              unoptimized
            />

            {/* Badges */}
            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-green-500 hover:bg-green-600">{language === "uk" ? "Новинка" : "New"}</Badge>
              )}
              {product.isOnSale && <Badge variant="destructive">{language === "uk" ? "Акція" : "Sale"}</Badge>}
              {!product.inStock && (
                <Badge variant="secondary">{language === "uk" ? "Немає в наявності" : "Out of Stock"}</Badge>
              )}
            </div>

            {/* Favorite Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
              onClick={() => toggleFavorite(productId)}
            >
              <Heart
                className={`h-4 w-4 ${favorites.includes(productId) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm mb-1 line-clamp-1">{getProductName(product)}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{getProductDescription(product)}</p>

          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg price-new">₴{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm price-old line-through">₴{product.originalPrice}</span>
              )}
            </div>
            {product.weight && (
              <Badge variant="outline" className="text-xs">
                {getLocalizedValue(product.weight)}
              </Badge>
            )}
          </div>

          {product.origin && (
            <p className="text-xs text-muted-foreground">
              {language === "uk" ? "Походження" : "Origin"}: {getLocalizedValue(product.origin)}
            </p>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0 flex gap-2 mt-auto">
          <Button
            className="add-to-cart-button"
            size="sm"
            onClick={() => handleAddToCart(product)}
            disabled={!product.inStock}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            {language === "uk" ? "Додати в кошик" : "Add to Cart"}
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link href={`/product/${productId}`}>{language === "uk" ? "Детальніше" : "Details"}</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  if (loading) {
    return (
      <section className="py-16 px-4" suppressHydrationWarning>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4" suppressHydrationWarning>
      <div className="container mx-auto">
        {/* New Products */}
        {newProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold font-playfair mb-2">
                  {language === "uk" ? "Новинки" : "New Products"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "uk"
                    ? "Відкрийте для себе наші найновіші сорти кави"
                    : "Discover our newest coffee varieties"}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/catalog?filter=new">{language === "uk" ? "Переглянути всі" : "View All"}</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Sale Products */}
        {saleProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold font-playfair mb-2">
                  {language === "uk" ? "Акційні товари" : "Sale Products"}
                </h2>
                <p className="text-muted-foreground">
                  {language === "uk"
                    ? "Спеціальні пропозиції та знижки на улюблені сорти"
                    : "Special offers and discounts on favorite varieties"}
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/catalog?filter=sale">{language === "uk" ? "Переглянути всі" : "View All"}</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* No products message */}
        {newProducts.length === 0 && saleProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              {language === "uk"
                ? "Поки що немає товарів для відображення. Додайте товари через адмін-панель."
                : "No products to display yet. Add products through the admin panel."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
