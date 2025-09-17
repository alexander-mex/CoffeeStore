import { NextRequest, NextResponse } from "next/server"
import { getImageStream } from "@/lib/mongodb-gridfs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    if (!id) {
      return NextResponse.json({ error: "ID зображення не надано" }, { status: 400 })
    }

    const imageStream = await getImageStream(id)
    
    // Створюємо новий Response з потоком зображення
    const response = new Response(imageStream as any, {
      headers: {
        'Content-Type': 'image/*',
        'Cache-Control': 'public, max-age=31536000',
      },
    })

    return response
  } catch (error) {
    console.error("Помилка отримання зображення:", error)
    return NextResponse.json({ error: "Зображення не знайдено" }, { status: 404 })
  }
}
