import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const users = db.collection("users")

    // Find user by email
    const user = await users.findOne({ email })

    if (!user) {
      await client.close()
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      await client.close()
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || "user",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    // Update last login
    await users.updateOne({ _id: user._id }, { $set: { lastLogin: new Date() } })

    await client.close()

    // Return user data (without password) and token
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

    return NextResponse.json({
      user: userData,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
