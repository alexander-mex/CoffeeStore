/**
 * Utility to resolve image URLs from different sources
 * Handles GridFS ObjectIds, static paths, and external URLs
 */
import { isCloudinaryUrl as isCloudinaryUrlImported } from './cloudinary-client'

export function resolveImageUrl(imagePath: string): string {
  if (!imagePath) return "/placeholder.svg"

  // Якщо це URL Cloudinary, повертаємо як є
  if (isCloudinaryUrlImported(imagePath)) {
    return imagePath
  }

  // Якщо це вже повний URL (http/https), повертаємо як є
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Якщо це GridFS ObjectId (24 hex символів)
  if (imagePath.match(/^[a-f0-9]{24}$/i)) {
    return `/api/images/${imagePath}`
  }

  // Якщо це застарілий шлях, що починається з /images/
  if (imagePath.startsWith('/images/')) {
    const filename = imagePath.split('/').pop()
    if (filename && filename.match(/^[a-f0-9]{24}$/i)) {
      return `/api/images/${filename}`
    }
    return imagePath
  }

  // Якщо це просто ім'я файлу без шляху, вважаємо GridFS ID
  if (imagePath.match(/^[a-f0-9]{24}$/i)) {
    return `/api/images/${imagePath}`
  }

  // Для інших відносних шляхів
  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`
  }

  return imagePath
}

/**
 * Check if an image path is a GridFS ObjectId
 */
export function isGridFSImage(imagePath: string): boolean {
  return !!imagePath?.match(/^[a-f0-9]{24}$/i)
}

/**
 * Extract GridFS ObjectId from legacy paths
 */
export function extractGridFSId(imagePath: string): string | null {
  if (!imagePath) return null

  // Handle legacy paths like "/images/products/filename"
  if (imagePath.includes('/')) {
    const parts = imagePath.split('/')
    const filename = parts[parts.length - 1]
    if (filename.match(/^[a-f0-9]{24}$/i)) {
      return filename
    }
  }

  // Direct ObjectId
  if (imagePath.match(/^[a-f0-9]{24}$/i)) {
    return imagePath
  }

  return null
}
