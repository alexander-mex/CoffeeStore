import { NextRequest, NextResponse } from "next/server"
import { uploadToCloudinary, deleteFromCloudinary, getCloudinaryUrl } from "@/lib/cloudinary"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: "Файл не надано" }, { status: 400 })
    }

    // Перевірка типу файлу
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: "Файл повинен бути зображенням" }, { status: 400 })
    }

    // Перевірка розміру (10MB для Cloudinary)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Розмір файлу не повинен перевищувати 10MB" }, { status: 400 })
    }

    // Завантаження в Cloudinary
    const uploadResult = await uploadToCloudinary(file)

    // Генеруємо оптимізований URL
    const optimizedUrl = getCloudinaryUrl(uploadResult.public_id, {
      width: 800,
      height: 600,
      quality: 'auto',
      format: 'auto'
    })

    return NextResponse.json({
      success: true,
      url: optimizedUrl,
      publicId: uploadResult.public_id,
      originalUrl: uploadResult.secure_url,
      message: "Зображення успішно завантажено в Cloudinary"
    })
  } catch (error) {
    console.error("Помилка завантаження зображення:", error)
    return NextResponse.json({ error: "Помилка при завантаженні зображення" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const publicId = searchParams.get('publicId')

    if (!publicId) {
      return NextResponse.json({ error: "Public ID зображення не надано" }, { status: 400 })
    }

    await deleteFromCloudinary(publicId)

    return NextResponse.json({
      success: true,
      message: "Зображення успішно видалено з Cloudinary"
    })
  } catch (error) {
    console.error("Помилка видалення зображення:", error)
    return NextResponse.json({ error: "Помилка при видаленні зображення" }, { status: 500 })
  }
}
