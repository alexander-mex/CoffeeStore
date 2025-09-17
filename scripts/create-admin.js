const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

async function createAdmin() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("blackcoffee")
    const users = db.collection("users")

    // Check if admin already exists
    const existingAdmin = await users.findOne({ email: "admin@blackcoffee.ua" })

    if (existingAdmin) {
      console.log("Admin already exists")
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("admin123", 10)

    // Create admin user
    const adminUser = {
      email: "admin@blackcoffee.ua",
      password: hashedPassword,
      name: "Administrator",
      role: "admin",
      createdAt: new Date(),
      lastLogin: null,
      avatar: null,
      phone: "+380123456789",
      address: "Київ, Україна",
    }

    await users.insertOne(adminUser)
    console.log("Admin user created successfully!")
    console.log("Email: admin@blackcoffee.ua")
    console.log("Password: admin123")
  } catch (error) {
    console.error("Error creating admin:", error)
  } finally {
    await client.close()
  }
}

createAdmin()
