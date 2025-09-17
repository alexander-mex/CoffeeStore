/**
 * Скрипт для міграції зображень з GridFS в Cloudinary
 * Завантажує зображення з GridFS, завантажує в Cloudinary, оновлює записи в БД
 */

const { MongoClient, ObjectId } = require('mongodb')
const axios = require('axios')
const FormData = require('form-data')
require('dotenv').config()

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dmiukxpt1'
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET || 'Coffee'
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/blackcoffee"

async function migrateImagePaths() {
  const client = new MongoClient(MONGODB_URI)
  
  try {
    await client.connect()
    const db = client.db("blackcoffee")
    const products = db.collection("products")
    
    console.log('Connected to MongoDB')
    
    // Знаходимо всі продукти з GridFS ObjectId в полі image
    const productsWithGridFSImages = await products.find({
      image: { $regex: /^[a-f0-9]{24}$/i }
    }).toArray()
    
    console.log(`Found ${productsWithGridFSImages.length} products with GridFS images`)
    
    for (const product of productsWithGridFSImages) {
      console.log(`Processing product: ${product.name?.uk || product.name}`)
      const imageId = product.image
      console.log(`GridFS Image ID: ${imageId}`)
      
      // Завантажуємо зображення з GridFS API
      const imageResponse = await axios.get(`http://localhost:3000/api/images/${imageId}`, {
        responseType: 'arraybuffer'
      })
      
      const buffer = Buffer.from(imageResponse.data, 'binary')
      
      // Підготовка форми для Cloudinary
      const form = new FormData()
      form.append('file', buffer, {
        filename: `${imageId}.jpg`,
        contentType: 'image/jpeg'
      })
      form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      form.append('folder', 'coffee-store/products')
      form.append('public_id', imageId)
      
      // Завантаження в Cloudinary
      const cloudinaryResponse = await axios.post(CLOUDINARY_UPLOAD_URL, form, {
        headers: form.getHeaders()
      })
      
      const cloudinaryUrl = cloudinaryResponse.data.secure_url
      console.log(`Uploaded to Cloudinary: ${cloudinaryUrl}`)
      
      // Оновлення запису в БД
      const result = await products.updateOne(
        { _id: product._id },
        { $set: { image: cloudinaryUrl } }
      )
      
      console.log(`Updated ${result.modifiedCount} document(s)`)
      console.log('---')
    }
    
    console.log('Migration completed!')
    
  } catch (error) {
    console.error('Error during migration:', error)
  } finally {
    await client.close()
  }
}

// Запуск міграції
migrateImagePaths()
