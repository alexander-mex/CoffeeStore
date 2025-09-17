const { MongoClient, ObjectId } = require("mongodb")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

async function createSampleNotifications() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("blackcoffee")
    const notifications = db.collection("notifications")

    // Clear existing notifications
    await notifications.deleteMany({})
    console.log("Cleared existing notifications")

    // Create sample notifications
    const sampleNotifications = [
      {
        title: "Нове замовлення",
        message: "Отримано нове замовлення №12345 на суму ₴450",
        type: "admin",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      },
      {
        title: "Низький запас товару",
        message: "Арабіка Колумбія залишилася в кількості менше 10 кг",
        type: "admin",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      },
      {
        title: "Новий відгук",
        message: "Клієнт залишив відгук про товар 'Еспресо Бленд'",
        type: "admin",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      },
      {
        title: "Система оновлена",
        message: "Адмін-панель успішно оновлено до нової версії",
        type: "admin",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
      },
      {
        title: "Проблема з доставкою",
        message: "Замовлення №12340 має проблеми з доставкою",
        type: "admin",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      },
    ]

    await notifications.insertMany(sampleNotifications)
    console.log(`Created ${sampleNotifications.length} sample notifications`)

    // Count unread notifications
    const unreadCount = await notifications.countDocuments({ read: false, type: "admin" })
    console.log(`Unread notifications: ${unreadCount}`)

  } catch (error) {
    console.error("Error creating sample notifications:", error)
  } finally {
    await client.close()
  }
}

createSampleNotifications()
