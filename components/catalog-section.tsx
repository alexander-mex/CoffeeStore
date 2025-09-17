"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter } from "lucide-react"
import Image from "next/image"
import { getImageUrl } from "@/lib/image-utils"

interface Product {
  id: string
  name: { uk: string; en: string } | string
  description: { uk: string; en: string } | string
  price: number
  originalPrice?: number
  image: string
  category: string
  isNew: boolean
  isOnSale: boolean
  inStock: boolean
}

export function CatalogSection() {
  const { language, t } = useLanguage()
  const { addItem } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterAndSortProducts()
  }, [products, searchTerm, selectedCategory, sortBy, language])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProducts = () => {
    if (!Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    const filtered = products.filter((product) => {
      const productName =
        typeof product.name === "string"
          ? product.name
          : product.name?.[language] || product.name?.uk || product.name?.en || ""

      const matchesSearch = productName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "name":
          const nameA = typeof a.name === "string" ? a.name : a.name?.[language] || a.name?.uk || a.name?.en || ""
          const nameB = typeof b.name === "string" ? b.name : b.name?.[language] || b.name?.uk || b.name?.en || ""
          return nameA.localeCompare(nameB)
        default:
          return 0
      }
    })

    setFilteredProducts(filtered)
  }

  const categories = [
    { value: "all", label: { uk: "Всі категорії", en: "All Categories" } },
    { value: "arabica", label: { uk: "Арабіка", en: "Arabica" } },
    { value: "robusta", label: { uk: "Робуста", en: "Robusta" } },
    { value: "blend", label: { uk: "Купажі", en: "Blends" } },
    { value: "decaf", label: { uk: "Без кофеїну", en: "Decaf" } },
  ]

  const sortOptions = [
    { value: "name", label: { uk: "За назвою", en: "By Name" } },
    { value: "price-low", label: { uk: "Ціна: від низької", en: "Price: Low to High" } },
    { value: "price-high", label: { uk: "Ціна: від високої", en: "Price: High to Low" } },
  ]

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
            <p className="mt-4 text-coffee-600">{t("loading")}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-coffee-800 mb-4 font-serif">
            {language === "uk" ? "Каталог кави" : "Coffee Catalog"}
          </h1>
          <p className="text-lg text-coffee-600 max-w-2xl mx-auto">
            {language === "uk"
              ? "Відкрийте для себе наш широкий асортимент високоякісної кави з усього світу"
              : "Discover our wide range of high-quality coffee from around the world"}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
              <Input
                placeholder={language === "uk" ? "Пошук кави..." : "Search coffee..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label[language]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label[language]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
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

            return (
              <Card
                key={product.id}
                className="group hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={getImageUrl(product.image)}
                      alt={getProductName(product)}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.isNew && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          {language === "uk" ? "Новинка" : "New"}
                        </Badge>
                      )}
                      {product.isOnSale && (
                        <Badge className="bg-red-500 hover:bg-red-600">{language === "uk" ? "Акція" : "Sale"}</Badge>
                      )}
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {language === "uk" ? "Немає в наявності" : "Out of Stock"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-coffee-800 mb-2 line-clamp-2">{getProductName(product)}</h3>
                    <p className="text-sm text-coffee-600 mb-3 line-clamp-2">{getProductDescription(product)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-coffee-800">₴{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-coffee-400 line-through">₴{product.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex gap-2 w-full">
                    <Button
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: getProductName(product),
                          price: product.price,
                          image: product.image,
                          type: "beans",
                          weight: "250г",
                        })
                      }
                      disabled={!product.inStock}
                      className="flex-1 bg-coffee-600 hover:bg-coffee-700 text-white"
                    >
                      {product.inStock
                        ? language === "uk"
                          ? "Додати в кошик"
                          : "Add to Cart"
                        : language === "uk"
                          ? "Немає в наявності"
                          : "Out of Stock"}
                    </Button>
                    <Button variant="outline" size="default" asChild className="px-4 bg-transparent">
                      <a href={`/product/${product.id}`}>{language === "uk" ? "Детальніше" : "Details"}</a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-coffee-600 text-lg">
              {language === "uk"
                ? "Товари не знайдено. Спробуйте змінити фільтри."
                : "No products found. Try changing the filters."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}