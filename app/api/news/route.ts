import { type NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "publishedAt"
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const news = db.collection("news")

    // Build query
    const query: any = {}

    if (category) {
      query.category = category
    }

    if (search) {
      query.$or = [
        { "title.uk": { $regex: search, $options: "i" } },
        { "title.en": { $regex: search, $options: "i" } },
        { "excerpt.uk": { $regex: search, $options: "i" } },
        { "excerpt.en": { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ]
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit

    // Get news with pagination
    const [newsList, totalCount] = await Promise.all([
      news
        .find(query)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .toArray(),
      news.countDocuments(query),
    ])

    await client.close()

    return NextResponse.json({
      news: newsList,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("News fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json()

    // Validate required fields
    const requiredFields = ["title", "excerpt", "content", "image", "category", "author"]
    for (const field of requiredFields) {
      if (!newsData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI)
    await client.connect()

    const db = client.db("blackcoffee")
    const news = db.collection("news")

    // Create new news item
    const newNews = {
      ...newsData,
      publishedAt: newsData.publishedAt || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      readTime: Math.ceil(newsData.content.uk?.split(" ").length / 200) || 3, // Estimate reading time
      featured: newsData.featured || false,
    }

    const result = await news.insertOne(newNews)

    await client.close()

    return NextResponse.json(
      {
        news: { ...newNews, id: result.insertedId },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("News creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
