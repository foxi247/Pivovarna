import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  thumbUrl: string
  publicId: string
  width: number
  height: number
  format: string
  size: number
}

export async function uploadImage(
  buffer: Buffer,
  folder: string = 'uploads',
  filename?: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: `pivovarna/${folder}`,
      public_id: filename,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    }

    cloudinary.uploader
      .upload_stream(uploadOptions, (error, result) => {
        if (error || !result) {
          reject(error || new Error('Ошибка загрузки изображения'))
          return
        }
        resolve({
          url: result.secure_url,
          thumbUrl: cloudinary.url(result.public_id, {
            width: 400,
            height: 300,
            crop: 'fill',
            format: 'webp',
            quality: 80,
          }),
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          size: result.bytes,
        })
      })
      .end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId)
}

export function getOptimizedUrl(url: string, options: { width?: number; height?: number; quality?: number } = {}) {
  const { width, height, quality = 80 } = options
  // Extract public_id from cloudinary URL
  const match = url.match(/\/v\d+\/(.+)\.\w+$/)
  if (!match) return url
  return cloudinary.url(match[1], {
    width,
    height,
    crop: width && height ? 'fill' : 'limit',
    format: 'webp',
    quality,
  })
}
