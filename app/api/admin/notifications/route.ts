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

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")

    // Get unread notifications count
    const unreadCount = await db.collection("notifications").countDocuments({
      read: false,
      type: "admin"
    })

    // Get recent notifications
    const notifications = await db.collection("notifications")
      .find({ type: "admin" })
      .sort({ createdAt: -1 })
      .limit(20)
      .toArray()

    await client.close()

    return NextResponse.json({
      unreadCount,
      notifications: notifications.map(notification => ({
        id: notification._id.toString(),
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: notification.read,
        createdAt: notification.createdAt,
        relatedId: notification.relatedId,
        relatedType: notification.relatedType,
      })),
    })
  } catch (error) {
    console.error("Notifications fetch error:", error)
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

    if (decoded.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const { notificationId, action } = await request.json()

    if (!notificationId || !action) {
      return NextResponse.json({ error: "Notification ID and action required" }, { status: 400 })
    }

    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")

    if (action === "markAsRead") {
      await db.collection("notifications").updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: true } }
      )
    } else if (action === "markAsUnread") {
      await db.collection("notifications").updateOne(
        { _id: new ObjectId(notificationId) },
        { $set: { read: false } }
      )
    } else if (action === "delete") {
      await db.collection("notifications").deleteOne({
        _id: new ObjectId(notificationId)
      })
    }

    await client.close()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Notification update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
