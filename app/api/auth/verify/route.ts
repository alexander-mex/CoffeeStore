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

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const users = db.collection("users")

    // Find user by ID
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })

    if (!user) {
      await client.close()
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await client.close()

    // Return user data (without password)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || "user",
      avatar: user.avatar,
      phone: user.phone,
      address: user.address,
      createdAt: user.createdAt,
    }

    return NextResponse.json({ user: userData })
  } catch (error) {
    console.error("Token verification error:", error)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
