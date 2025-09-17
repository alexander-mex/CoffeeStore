import { v2 as cloudinary } from 'cloudinary'

// Налаштування Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  width: number
  height: number
  format: string
  bytes: number
}

/**
 * Завантажує зображення в Cloudinary
 */
export async function uploadToCloudinary(
  file: File | Buffer,
  folder: string = 'coffee-store/products',
  publicId?: string
): Promise<CloudinaryUploadResult> {
  try {
    const options: any = {
      folder,
      resource_type: 'image',
      quality: 'auto',
      format: 'auto',
    }

    if (publicId) {
      options.public_id = publicId
    }

    let uploadResult

    if (file instanceof File) {
      // Конвертуємо File в Buffer
      const buffer = Buffer.from(await file.arrayBuffer())
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }).end(buffer)
      })
    } else {
      // Buffer
      uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(options, (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }).end(file)
      })
    }

    return uploadResult as CloudinaryUploadResult
  } catch (error) {
    console.error('Помилка завантаження в Cloudinary:', error)
    throw new Error('Не вдалося завантажити зображення в Cloudinary')
  }
}

/**
 * Видаляє зображення з Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Помилка видалення з Cloudinary:', error)
    throw new Error('Не вдалося видалити зображення з Cloudinary')
  }
}

/**
 * Генерує оптимізований URL зображення з Cloudinary
 */
export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: number | 'auto'
    format?: 'auto' | 'jpg' | 'png' | 'webp'
    crop?: 'fill' | 'crop' | 'scale' | 'fit'
  } = {}
): string {
  const { width, height, quality = 'auto', format = 'auto', crop = 'fill' } = options

  let transformation = `f_${format},q_${quality}`

  if (width && height) {
    transformation += `,w_${width},h_${height},c_${crop}`
  } else if (width) {
    transformation += `,w_${width}`
  } else if (height) {
    transformation += `,h_${height}`
  }

  return `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || ''}/image/upload/${transformation}/${publicId}`
}

/**
 * Перевіряє чи є URL Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ''
  return url.includes(`res.cloudinary.com/${cloudName}`)
}

/**
 * Витягує public_id з Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ''
  if (!isCloudinaryUrl(url)) return null

  const match = url.match(new RegExp(`res\.cloudinary\.com/${cloudName}/image/upload(?:/v\\d+)?/(.+)\\.[a-zA-Z]+$`))
  return match ? match[1] : null
}

/**
 * Генерує placeholder URL для Cloudinary
 */
export function getCloudinaryPlaceholder(width: number = 400, height: number = 400): string {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || ''
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},h_${height},c_fill,q_auto,f_auto/coffee-placeholder`
}
