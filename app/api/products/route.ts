import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1
    const filter = searchParams.get("filter") // 'new', 'sale', etc.

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const products = db.collection("products")

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { origin: { $regex: search, $options: "i" } },
      ]
    }

    if (filter === "new") {
      query.isNew = true
    } else if (filter === "sale") {
      query.isOnSale = true
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get products with pagination
    const [productList, totalCount] = await Promise.all([
      products
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray(),
      products.countDocuments(query),
    ])

    await client.close()

    // Transform products to include both _id and id for consistency
    const transformedProducts = productList.map(product => ({
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
      createdAt: product.createdAt,
    }))

    return NextResponse.json({
      products: transformedProducts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Products fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "description", "price", "image", "type", "weight", "origin"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const products = db.collection("products")

    // Create new product
    const newProduct = {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date(),
      rating: 0,
      reviews: 0,
      isNew: productData.isNew !== false,
      isOnSale: productData.originalPrice && productData.originalPrice > productData.price,
      inStock: productData.inStock !== false,
    }

    const result = await products.insertOne(newProduct)

    await client.close()

    // Transform the response to include both _id and id
    const transformedProduct = {
      _id: result.insertedId.toString(),
      id: result.insertedId.toString(),
      ...newProduct,
    }

    return NextResponse.json(
      {
        product: transformedProduct,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Product creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
