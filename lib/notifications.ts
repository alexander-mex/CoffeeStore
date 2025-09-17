import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export interface NotificationData {
  title: string
  message: string
  type: "admin" | "user"
  userId?: string // for user-specific notifications
  relatedId?: string // order ID, product ID, etc.
  relatedType?: "order" | "product" | "review" | "payment" | "delivery"
}

/**
 * Create a notification in the database
 */
export async function createNotification(notificationData: NotificationData) {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("blackcoffee")
    const notifications = db.collection("notifications")

    const notification = {
      ...notificationData,
      read: false,
      createdAt: new Date(),
    }

    const result = await notifications.insertOne(notification)
    console.log(`Notification created: ${notification.title}`)

    return result.insertedId
  } catch (error) {
    console.error("Error creating notification:", error)
    throw error
  } finally {
    await client.close()
  }
}

/**
 * Create notification for new order
 */
export async function notifyNewOrder(orderId: string, customerName: string, totalAmount: number) {
  await createNotification({
    title: "Нове замовлення",
    message: `Отримано нове замовлення №${orderId} від ${customerName} на суму ₴${totalAmount}`,
    type: "admin",
    relatedId: orderId,
    relatedType: "order",
  })
}

/**
 * Create notification for order status change
 */
export async function notifyOrderStatusChange(orderId: string, status: string, customerName: string) {
  const statusMessages = {
    processing: "почало оброблятися",
    shipped: "відправлено",
    delivered: "доставлено",
    cancelled: "скасовано",
  }

  const message = statusMessages[status as keyof typeof statusMessages] || "змінено статус"

  await createNotification({
    title: "Зміна статусу замовлення",
    message: `Замовлення №${orderId} від ${customerName} ${message}`,
    type: "admin",
    relatedId: orderId,
    relatedType: "order",
  })
}

/**
 * Create notification for low stock
 */
export async function notifyLowStock(productName: string, currentStock: number) {
  await createNotification({
    title: "Низький запас товару",
    message: `Товар "${productName}" залишився в кількості ${currentStock} шт.`,
    type: "admin",
    relatedType: "product",
  })
}

/**
 * Create notification for new review
 */
export async function notifyNewReview(productName: string, customerName: string, rating: number) {
  await createNotification({
    title: "Новий відгук",
    message: `${customerName} залишив відгук (${rating}⭐) про товар "${productName}"`,
    type: "admin",
    relatedType: "review",
  })
}

/**
 * Create notification for payment received
 */
export async function notifyPaymentReceived(orderId: string, amount: number, customerName: string) {
  await createNotification({
    title: "Оплата отримана",
    message: `Отримано оплату ₴${amount} за замовлення №${orderId} від ${customerName}`,
    type: "admin",
    relatedId: orderId,
    relatedType: "payment",
  })
}

/**
 * Create notification for delivery issue
 */
export async function notifyDeliveryIssue(orderId: string, issue: string) {
  await createNotification({
    title: "Проблема з доставкою",
    message: `Замовлення №${orderId}: ${issue}`,
    type: "admin",
    relatedId: orderId,
    relatedType: "delivery",
  })
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("blackcoffee")
    const notifications = db.collection("notifications")

    await notifications.updateOne(
      { _id: require("mongodb").ObjectId(notificationId) },
      { $set: { read: true } }
    )

    console.log(`Notification ${notificationId} marked as read`)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    throw error
  } finally {
    await client.close()
  }
}

/**
 * Get unread notification count for admin
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    const db = client.db("blackcoffee")
    const notifications = db.collection("notifications")

    return await notifications.countDocuments({ read: false, type: "admin" })
  } catch (error) {
    console.error("Error getting unread notification count:", error)
    return 0
  } finally {
    await client.close()
  }
}
