import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import { validatePassword } from "@/lib/auth-utils"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json()

    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 })
    }

    const { isValid, errors } = validatePassword(newPassword)
    if (!isValid) {
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const users = db.collection("users")

    // Find user by reset token and check expiration
    const user = await users.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    })

    if (!user) {
      await client.close()
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update user password and remove reset token fields
    await users.updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPassword },
        $unset: { resetToken: "", resetTokenExpires: "" },
      },
    )

    await client.close()

    return NextResponse.json({ message: "Password has been reset successfully" })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
