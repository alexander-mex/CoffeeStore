import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

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
    const users = db.collection("users")

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
    console.error("Profile fetch error:", error)
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

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const users = db.collection("users")

    // Prepare update object
    const updateFields: any = {}

    if (updateData.name) updateFields.name = updateData.name
    if (updateData.phone) updateFields.phone = updateData.phone
    if (updateData.address) updateFields.address = updateData.address
    if (updateData.avatar) updateFields.avatar = updateData.avatar

    // Handle password update
    if (updateData.newPassword) {
      if (updateData.newPassword.length < 6) {
        await client.close()
        return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
      }

      // Validate current password if provided
      if (updateData.currentPassword) {
        const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
        if (!user) {
          await client.close()
          return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        const isCurrentPasswordValid = await bcrypt.compare(updateData.currentPassword, user.password)
        if (!isCurrentPasswordValid) {
          await client.close()
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
        }
      }

      updateFields.password = await bcrypt.hash(updateData.newPassword, 12)
    }

    // Handle email update
    if (updateData.email) {
      // Check if new email is already taken
      const existingUser = await users.findOne({
        email: updateData.email,
        _id: { $ne: new ObjectId(decoded.userId) },
      })

      if (existingUser) {
        await client.close()
        return NextResponse.json({ error: "Email is already taken" }, { status: 409 })
      }

      updateFields.email = updateData.email
    }

    updateFields.updatedAt = new Date()

    // Update user
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateFields },
      { returnDocument: "after" },
    )

    if (!result) {
      await client.close()
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await client.close()

    // Return updated user data (without password)
    const userData = {
      id: result._id,
      email: result.email,
      name: result.name,
      role: result.role || "user",
      avatar: result.avatar,
      phone: result.phone,
      address: result.address,
      createdAt: result.createdAt,
    }

    return NextResponse.json({
      user: userData,
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
