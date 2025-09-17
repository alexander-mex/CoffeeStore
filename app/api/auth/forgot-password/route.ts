import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { sendEmail, generateEmailTemplate } from "@/lib/email"
import { generateToken } from "@/lib/auth-utils"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
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
      // Don't reveal if email exists or not for security
      return NextResponse.json({ message: "If the email exists, a reset link has been sent" })
    }

    // Generate reset token
    const resetToken = generateToken()

    // Update user with reset token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetToken,
          resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      },
    )

    // Send reset email
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`
    const emailBody = `
      <p>Привіт ${user.name}!</p>
      <p>Ви запросили скидання паролю для вашого акаунту в CoffeeStore.</p>
      <p>Будь ласка, перейдіть за посиланням для скидання паролю:</p>
      <a href="${resetUrl}" style="background-color: #6b46c1; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Скинути пароль</a>
      <p>Це посилання дійсне протягом 1 години.</p>
      <p>Якщо ви не запитували скидання паролю, ігноруйте цей лист.</p>
    `
    const emailHtml = generateEmailTemplate("Скидання паролю", emailBody)

    try {
      await sendEmail(email, "Скидання паролю", emailHtml)
    } catch (emailError) {
      console.error("Error sending reset email:", emailError)
    }

    await client.close()

    return NextResponse.json({ message: "If the email exists, a reset link has been sent" })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
