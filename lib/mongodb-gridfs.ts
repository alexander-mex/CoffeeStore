import { MongoClient, GridFSBucket, ObjectId } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://alexandermex:jY8jfnC7AAdumR5e@cluster0.jghf24s.mongodb.net/"

let client: MongoClient
let bucket: GridFSBucket

async function getGridFSBucket() {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
  }
  
  if (!bucket) {
    const db = client.db("blackcoffee")
    bucket = new GridFSBucket(db, {
      bucketName: "product_images"
    })
  }
  
  return bucket
}

export async function uploadImage(file: File): Promise<string> {
  const bucket = await getGridFSBucket()
  
  const timestamp = Date.now()
  const cleanName = file.name
    .replace(/\s+/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, "")
  const filename = `coffee-${timestamp}-${cleanName}`

  const uploadStream = bucket.openUploadStream(filename, {
    contentType: file.type,
    metadata: {
      originalName: file.name,
      uploadDate: new Date()
    }
  })

  const buffer = Buffer.from(await file.arrayBuffer())
  uploadStream.write(buffer)
  uploadStream.end()

  return new Promise((resolve, reject) => {
    uploadStream.on('finish', () => {
      resolve(uploadStream.id.toString())
    })
    uploadStream.on('error', reject)
  })
}

export async function getImageStream(imageId: string) {
  const bucket = await getGridFSBucket()
  return bucket.openDownloadStream(new ObjectId(imageId))
}

export async function deleteImage(imageId: string) {
  const bucket = await getGridFSBucket()
  await bucket.delete(new ObjectId(imageId))
}

export async function getImageMetadata(imageId: string) {
  if (!client) {
    client = new MongoClient(MONGODB_URI)
    await client.connect()
  }
  const db = client.db("blackcoffee")
  const filesCollection = db.collection('product_images.files')
  return await filesCollection.findOne({ _id: new ObjectId(imageId) })
}

export async function closeConnection() {
  if (client) {
    await client.close()
    client = null as any
    bucket = null as any
  }
}
