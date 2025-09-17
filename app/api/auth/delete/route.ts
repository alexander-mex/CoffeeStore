import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production"

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const users = db.collection("users")
    const orders = db.collection("orders")
    const favorites = db.collection("favorites")

    // Delete user's related data
    await Promise.all([
      orders.deleteMany({ userId: new ObjectId(decoded.userId) }),
      favorites.deleteMany({ userId: new ObjectId(decoded.userId) }),
    ])

    // Delete user account
    const result = await users.deleteOne({ _id: new ObjectId(decoded.userId) })

    await client.close()

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Account deleted successfully",
    })
  } catch (error) {
    console.error("Account deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
