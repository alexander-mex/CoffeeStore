/**
 * Client-safe Cloudinary utilities that don't require Node.js modules
 * These functions can be used on both client and server side
 */

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
