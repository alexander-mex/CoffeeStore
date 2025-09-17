/**
 * Unified image URL utility for handling all image sources consistently
 */

export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return "/placeholder.svg"

  // Перевірка чи шлях вже є повним URL
  if (imagePath.startsWith('http')) {
    return imagePath
  }

  // Перевірка чи шлях починається з / (вже є відносним шляхом)
  if (imagePath.startsWith('/')) {
    return imagePath
  }

  // Якщо це ObjectId (24 символи), то це зображення з GridFS
  if (imagePath.match(/^[a-f0-9]{24}$/i)) {
    return `/api/images/${imagePath}`
  }

  // Якщо це просто ID або ім'я файлу без розширення, додати повний шлях
  if (!imagePath.includes('.') && !imagePath.includes('/')) {
    return `/images/products/${imagePath}`
  }

  // Додавання / до початку шляху якщо його немає
  return `/${imagePath}`
}

/**
 * Get placeholder image URL with custom dimensions
 */
export const getPlaceholderUrl = (width: number = 300, height: number = 300, query: string = 'coffee'): string => {
  return `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(query)}`
}

/**
 * Check if image is a GridFS ObjectId
 */
export const isGridFSImage = (imagePath: string): boolean => {
  return !!imagePath?.match(/^[a-f0-9]{24}$/i)
}

/**
 * Handle image error by returning placeholder
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
  const img = event.currentTarget
  img.src = "/placeholder.svg"
  img.onerror = null // Prevent infinite loop
}
