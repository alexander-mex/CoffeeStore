import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"

const MONGODB_URI = "mongodb+srv://alexandermex:jY8jfnC7AAdumR5e@cluster0.jghf24s.mongodb.net/"

export async function GET(request: NextRequest) {
  try {
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    
    const db = client.db("blackcoffee")
    const products = db.collection("products")
    
    // Get sample products with their image paths
    const sampleProducts = await products.find({}).limit(5).toArray()
    
    await client.close()
    
    return NextResponse.json({
      success: true,
      products: sampleProducts.map(p => ({
        id: p._id.toString(),
        name: p.name,
        image: p.image,
        imageUrl: p.image?.match(/^[a-f0-9]{24}$/i) 
          ? `/api/images/${p.image}` 
          : p.image
      }))
    })
    
  } catch (error) {
    console.error("Error testing images:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
