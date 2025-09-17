import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendEmail, generateEmailTemplate } from "@/lib/email"
import { validatePassword, generateToken } from "@/lib/auth-utils"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_change_in_production"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      return NextResponse.json({ error: passwordValidation.errors.join(", ") }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const users = db.collection("users")

    // Check if user already exists
    const existingUser = await users.findOne({ email })

    if (existingUser) {
      await client.close()
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate verification token
    const verificationToken = generateToken()

    // Create new user
    const newUser = {
      email,
      password: hashedPassword,
      name,
      role: "user",
      createdAt: new Date(),
      lastLogin: new Date(),
      avatar: null,
      phone: null,
      address: null,
      emailVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    }

    const result = await users.insertOne(newUser)

    // Send verification email
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${verificationToken}`
    const emailBody = `
      <p>Привіт ${name}!</p>
      <p>Дякуємо за реєстрацію в CoffeeStore.</p>
      <p>Будь ласка, підтвердіть вашу електронну адресу, перейшовши за посиланням:</p>
      <a href="${verificationUrl}" style="background-color: #6b46c1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Підтвердити email</a>
      <p>Це посилання дійсне протягом 24 годин.</p>
    `
    const emailHtml = generateEmailTemplate("Підтвердження електронної адреси", emailBody)

    try {
      await sendEmail(email, "Підтвердіть вашу електронну адресу", emailHtml)
    } catch (emailError) {
      console.error("Error sending verification email:", emailError)
      // Don't fail registration if email fails, but log it
    }

    await client.close()

    // Return user data (without password) - no token until email verified
    const userData = {
      id: result.insertedId,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
      phone: newUser.phone,
      address: newUser.address,
      createdAt: newUser.createdAt,
      emailVerified: false,
    }

    return NextResponse.json(
      {
        user: userData,
        message: "Реєстрація успішна. Перевірте вашу електронну пошту для підтвердження.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
