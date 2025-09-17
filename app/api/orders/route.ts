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
    const orders = db.collection("orders")

    // Fetch orders for the authenticated user, sorted by createdAt descending
    const userOrders = await orders
      .find({ userId: new ObjectId(decoded.userId) })
      .sort({ createdAt: -1 })
      .toArray()

    await client.close()

    // Transform orders for response
    const transformedOrders = userOrders.map(order => ({
      id: order._id.toString(),
      orderNumber: order.orderNumber || order._id.toString(),
      items: order.items || [],
      total: order.total || 0,
      status: order.status || "pending",
      createdAt: order.createdAt,
      deliveryAddress: order.deliveryAddress || "",
      paymentMethod: order.paymentMethod || "",
    }))

    return NextResponse.json({ orders: transformedOrders })
  } catch (error) {
    console.error("Orders fetch error:", error)
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

    const orderData = await request.json()

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return NextResponse.json({ error: "Order items are required" }, { status: 400 })
    }

    if (!orderData.total) {
      return NextResponse.json({ error: "Order total is required" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    const db = client.db("blackcoffee")
    const orders = db.collection("orders")

    // Generate order number (e.g., ORD-YYYYMMDD-XXXX)
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const randomPart = Math.floor(1000 + Math.random() * 9000)
    const orderNumber = `ORD-${datePart}-${randomPart}`

    const newOrder = {
      userId: new ObjectId(decoded.userId),
      orderNumber,
      items: orderData.items,
      total: orderData.total,
      status: "pending",
      createdAt: new Date(),
      deliveryAddress: orderData.deliveryAddress || "",
      paymentMethod: orderData.paymentMethod || "",
    }

    const result = await orders.insertOne(newOrder)
    await client.close()

    return NextResponse.json({ message: "Order created", orderId: result.insertedId.toString() }, { status: 201 })
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
