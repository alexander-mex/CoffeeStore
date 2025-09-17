import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { verifyAdminToken } from "@/lib/auth-utils"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function GET(request: NextRequest) {
  try {
    verifyAdminToken(request)

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const logs = db.collection("admin_logs")

    const skip = (page - 1) * limit

    const [logsList, totalCount] = await Promise.all([
      logs.find({}).sort({ timestamp: -1 }).skip(skip).limit(limit).toArray(),
      logs.countDocuments({}),
    ])

    await client.close()

    return NextResponse.json({
      logs: logsList,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Logs fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const decoded = verifyAdminToken(request)
    const { action, details } = await request.json()

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const logs = db.collection("admin_logs")

    const logEntry = {
      adminId: decoded.userId,
      adminEmail: decoded.email,
      action,
      details,
      timestamp: new Date(),
      ip: request.headers.get("x-forwarded-for") || "unknown",
    }

    await logs.insertOne(logEntry)
    await client.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Log creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
