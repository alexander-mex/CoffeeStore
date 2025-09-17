import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("blackcoffee")
    const carts = db.collection("carts")

    // Get user's cart from database
    const userCart = await carts.findOne({ userId: new ObjectId(decoded.userId) })

    await client.close()

    if (userCart) {
      return NextResponse.json({ cart: userCart.items || [] })
    } else {
      return NextResponse.json({ cart: [] })
    }
  } catch (error) {
    console.error("Cart fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const cartData = await request.json()

    if (!cartData.items || !Array.isArray(cartData.items)) {
      return NextResponse.json({ error: "Cart items are required" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("blackcoffee")
    const carts = db.collection("carts")

    // Save or update user's cart
    await carts.updateOne(
      { userId: new ObjectId(decoded.userId) },
      {
        $set: {
          items: cartData.items,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          userId: new ObjectId(decoded.userId),
          createdAt: new Date(),
        },
      },
      { upsert: true }
    )

    await client.close()

    return NextResponse.json({ message: "Cart saved successfully" })
  } catch (error) {
    console.error("Cart save error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const updateData = await request.json()
    const { action, itemId, quantity } = updateData

    if (!action || !itemId) {
      return NextResponse.json({ error: "Action and itemId are required" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("blackcoffee")
    const carts = db.collection("carts")

    // Get current cart
    const userCart = await carts.findOne({ userId: new ObjectId(decoded.userId) })
    if (!userCart) {
      await client.close()
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    let updatedItems = userCart.items || []

    if (action === "remove") {
      updatedItems = updatedItems.filter((item: any) => item.id !== itemId)
    } else if (action === "update" && quantity !== undefined) {
      updatedItems = updatedItems.map((item: any) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    } else {
      await client.close()
      return NextResponse.json({ error: "Invalid action or missing quantity" }, { status: 400 })
    }

    // Update cart in database
    await carts.updateOne(
      { userId: new ObjectId(decoded.userId) },
      {
        $set: {
          items: updatedItems,
          updatedAt: new Date(),
        },
      }
    )

    await client.close()

    return NextResponse.json({ message: "Cart updated successfully", cart: updatedItems })
  } catch (error) {
    console.error("Cart update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }
    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("blackcoffee")
    const carts = db.collection("carts")

    // Clear user's cart from database
    await carts.deleteOne({ userId: new ObjectId(decoded.userId) })

    await client.close()

    return NextResponse.json({ message: "Cart cleared successfully" })
  } catch (error) {
    console.error("Cart clear error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
