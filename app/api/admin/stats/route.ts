import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
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

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")

    // Get statistics
    const [totalProducts, totalNews, totalUsers, newProducts, saleProducts, recentNews, totalOrders, totalRevenue, recentOrders] = await Promise.all([
      db.collection("products").countDocuments(),
      db.collection("news").countDocuments(),
      db.collection("users").countDocuments(),
      db.collection("products").countDocuments({ isNew: true }),
      db.collection("products").countDocuments({ isOnSale: true }),
      db.collection("news").countDocuments({
        publishedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      }),
      db.collection("orders").countDocuments(),
      db.collection("orders").aggregate([
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ]).toArray().then(res => res[0]?.total || 0),
      db.collection("orders").find().sort({ createdAt: -1 }).limit(5).toArray(),
    ])

    await client.close()

    return NextResponse.json({
      stats: {
        totalProducts,
        totalNews,
        totalUsers,
        newProducts,
        saleProducts,
        recentNews,
        totalOrders,
        totalRevenue,
        recentOrders: recentOrders.map(order => ({
          id: order._id.toString(),
          customer: order.customerName || order.customer || "Невідомий",
          product: order.productName || order.product || "Невідомий",
          amount: `₴${order.amount}`,
          status: order.status,
          date: order.createdAt ? new Date(order.createdAt).toISOString().split('T')[0] : "",
        })),
      },
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
