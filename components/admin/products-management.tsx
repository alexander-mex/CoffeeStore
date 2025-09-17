"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProductForm } from "./product-form"
import { Plus, Search, Edit, Trash2, Eye, Filter } from "lucide-react"
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
import { resolveImageUrl } from "@/lib/image-url-resolver"

interface Product {
  _id: string
  id?: string
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
  createdAt: string
}

export function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt")

  const getProductName = (product: Product) => {
    return product.name?.uk || product.name?.en || "Unnamed Product"
  }

  const getProductDescription = (product: Product) => {
    return product.description?.uk || product.description?.en || ""
  }

  const getProductCategory = (product: Product) => {
    return product.category?.uk || product.category?.en || ""
  }

  useEffect(() => {
    fetchProducts()
  }, [searchTerm, categoryFilter, sortBy])

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams({
        limit: "50",
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== "all" && { category: categoryFilter }),
        sortBy,
        sortOrder: "desc",
      })

      const response = await fetch(`/api/products?${params}`)
      const data = await response.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (!deleteProduct) return

    try {
      const response = await fetch(`/api/products/${deleteProduct._id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== deleteProduct._id))
        setDeleteProduct(null)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleProductSaved = (savedProduct: any) => {
    if (editingProduct) {
      setProducts(products.map((p) => (p._id === savedProduct._id || p.id === savedProduct.id ? savedProduct : p)))
    } else {
      setProducts([savedProduct, ...products])
    }
    setShowForm(false)
    setEditingProduct(null)
  }

  const categories = [
    { value: "all", label: "Всі категорії" },
    { value: "arabica", label: "Арабіка" },
    { value: "robusta", label: "Робуста" },
    { value: "blend", label: "Купажі" },
    { value: "decaf", label: "Без кофеїну" },
  ]

  const sortOptions = [
    { value: "createdAt", label: "За датою створення" },
    { value: "name", label: "За назвою" },
    { value: "price", label: "За ціною" },
  ]

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coffee-600 mx-auto"></div>
        <p className="mt-4 text-coffee-600">Завантаження товарів...</p>
      </div>
    )
  }

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleProductSaved}
        onCancel={() => {
          setShowForm(false)
          setEditingProduct(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-coffee-800 font-serif">Управління товарами</h1>
          <p className="text-coffee-600 mt-2">Додавайте, редагуйте та видаляйте товари в каталозі</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-coffee-600 hover:bg-coffee-700">
          <Plus className="h-4 w-4 mr-2" />
          Додати товар
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 h-4 w-4" />
              <Input
                placeholder="Пошук товарів..."
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

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <div className="relative">
                <Image
                  src={resolveImageUrl(product.image)}
                  alt={getProductName(product)}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {product.isNew && <Badge className="bg-green-500 hover:bg-green-600 text-xs">Новинка</Badge>}
                  {product.isOnSale && <Badge className="bg-red-500 hover:bg-red-600 text-xs">Акція</Badge>}
                  {!product.inStock && (
                    <Badge variant="secondary" className="text-xs">
                      Немає в наявності
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-coffee-800 mb-2 line-clamp-2">{getProductName(product)}</h3>
                <p className="text-sm text-coffee-600 mb-2 line-clamp-2">{getProductDescription(product)}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-coffee-800">₴{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-coffee-400 line-through">₴{product.originalPrice}</span>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {product.category?.uk || product.category?.en || ""}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Ensure weight and other fields are properly set
                      const normalizedProduct = {
                        ...product,
                        weight: product.weight || "250г",
                        origin: product.origin || "",
                        category: product.category || "arabica",
                        type: product.type || "зерна"
                      }
                      setEditingProduct(normalizedProduct)
                      setShowForm(true)
                    }}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Редагувати
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteProduct(product)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Eye className="h-12 w-12 text-coffee-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-coffee-800 mb-2">Товари не знайдено</h3>
          <p className="text-coffee-600 mb-4">Спробуйте змінити фільтри або додайте новий товар</p>
          <Button onClick={() => setShowForm(true)} className="bg-coffee-600 hover:bg-coffee-700">
            <Plus className="h-4 w-4 mr-2" />
            Додати перший товар
          </Button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Видалити товар?</AlertDialogTitle>
            <AlertDialogDescription>
              Ви впевнені, що хочете видалити товар "{deleteProduct ? getProductName(deleteProduct) : ""}"? Цю дію
              неможливо скасувати.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Скасувати</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-red-600 hover:bg-red-700">
              Видалити
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
