import { NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid news ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const news = db.collection("news")

    // Fetch news
    const result = await news.findOne({ _id: new ObjectId(id) })

    await client.close()

    if (!result) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ news: result })
  } catch (error) {
    console.error("News fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid news ID" }, { status: 400 })
    }

    const body = await request.json()
    const { title, excerpt, content, image, author, publishedAt, category, featured } = body

    // Validate required fields
    if (!title?.uk || !title?.en || !excerpt?.uk || !excerpt?.en || !content?.uk || !content?.en) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const news = db.collection("news")

    // Update news
    const result = await news.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          excerpt,
          content,
          image,
          author,
          publishedAt: new Date(publishedAt),
          category,
          featured,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    )

    await client.close()

    if (!result) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ news: result })
  } catch (error) {
    console.error("News update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid news ID" }, { status: 400 })
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const news = db.collection("news")

    // Delete news
    const result = await news.deleteOne({ _id: new ObjectId(id) })

    await client.close()

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "News not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "News deleted successfully" })
  } catch (error) {
    console.error("News delete error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
