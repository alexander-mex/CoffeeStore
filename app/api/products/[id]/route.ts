import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const products = db.collection("products")

    // Find product by ID
    const product = await products.findOne({ _id: new ObjectId(id) })

    await client.close()

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Transform MongoDB document to match frontend interface
    const transformedProduct = {
      _id: product._id.toString(),
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      isNew: product.isNew || false,
      isOnSale: product.isOnSale || false,
      inStock: product.inStock !== false,
      type: product.type,
      weight: product.weight,
      origin: product.origin,
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("Product fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const productData = await request.json()
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const products = db.collection("products")

    const updatedProduct = {
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      image: productData.image,
      category: productData.category,
      type: productData.type,
      weight: productData.weight,
      origin: productData.origin,
      isNew: Boolean(productData.isNew),
      isOnSale: Boolean(productData.isOnSale),
      inStock: Boolean(productData.inStock),
      updatedAt: new Date(),
    }

    const result = await products.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updatedProduct },
      { returnDocument: "after" },
    )

    await client.close()

    if (!result) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const transformedProduct = {
      _id: result._id.toString(),
      id: result._id.toString(),
      name: result.name,
      description: result.description,
      price: result.price,
      originalPrice: result.originalPrice,
      image: result.image,
      category: result.category,
      type: result.type,
      weight: result.weight,
      origin: result.origin,
      isNew: result.isNew || false,
      isOnSale: result.isOnSale || false,
      inStock: result.inStock !== false,
    }

    return NextResponse.json({ product: transformedProduct })
  } catch (error) {
    console.error("Product update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const products = db.collection("products")

    // Delete product
    const result = await products.deleteOne({ _id: new ObjectId(id) })

    await client.close()

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Product deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
