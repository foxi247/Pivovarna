/**
 * Supabase Storage — единственный storage layer проекта.
 *
 * Требует env:
 *   NEXT_PUBLIC_SUPABASE_URL   — https://<project>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  — service_role ключ из Supabase → Settings → API
 *
 * Bucket: "media" (public, без RLS для чтения)
 * Структура: media/{folder}/{uuid}.webp
 *             media/{folder}/thumbs/{uuid}.webp
 */

import sharp from 'sharp'
import { randomUUID } from 'crypto'

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').replace(/\/$/, '')
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
export const STORAGE_BUCKET = 'media'

export interface UploadResult {
  url: string
  thumbUrl: string
  publicId: string   // storage path, e.g. "gallery/uuid.webp"
  width: number
  height: number
  format: string
  size: number
}

// ── helpers ──────────────────────────────────────────────────────────────────

function publicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${path}`
}

async function storageUpload(buffer: Buffer, path: string, contentType: string): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL или SUPABASE_SERVICE_ROLE_KEY не заданы')
  }

  const res = await fetch(
    `${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}/${path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': contentType,
        'x-upsert': 'true',
      },
      body: new Uint8Array(buffer),
    }
  )

  if (!res.ok) {
    const text = await res.text().catch(() => res.status.toString())
    throw new Error(`Storage upload error ${res.status}: ${text}`)
  }
}

// ── public API ────────────────────────────────────────────────────────────────

/**
 * Загружает изображение в Supabase Storage.
 * - Конвертирует в WebP (quality 85)
 * - Генерирует thumbnail 400×300 WebP (quality 80)
 * - Возвращает публичные URL
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string = 'uploads',
): Promise<UploadResult> {
  if (!SUPABASE_URL || !SERVICE_KEY) {
    throw new Error(
      'Supabase Storage не настроен. Добавьте NEXT_PUBLIC_SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY.'
    )
  }

  const image = sharp(buffer)
  const meta = await image.metadata()

  // Оптимизированный оригинал → WebP
  const optimized = await image.clone().webp({ quality: 85 }).toBuffer()

  // Thumbnail 400×300
  const thumb = await sharp(buffer)
    .resize(400, 300, { fit: 'cover', position: 'centre' })
    .webp({ quality: 80 })
    .toBuffer()

  const id = randomUUID()
  const mainPath = `${folder}/${id}.webp`
  const thumbPath = `${folder}/thumbs/${id}.webp`

  // Параллельная загрузка
  await Promise.all([
    storageUpload(optimized, mainPath, 'image/webp'),
    storageUpload(thumb, thumbPath, 'image/webp'),
  ])

  return {
    url: publicUrl(mainPath),
    thumbUrl: publicUrl(thumbPath),
    publicId: mainPath,
    width: meta.width ?? 0,
    height: meta.height ?? 0,
    format: 'webp',
    size: optimized.length,
  }
}

/**
 * Удаляет изображение и его thumbnail из Supabase Storage.
 * publicId — storage path, например "gallery/uuid.webp"
 */
export async function deleteImage(publicId: string): Promise<void> {
  if (!SUPABASE_URL || !SERVICE_KEY) return

  // Вычисляем путь к thumbnail: folder/thumbs/file.webp
  const parts = publicId.split('/')
  const filename = parts.pop()!
  const thumbPath = [...parts, 'thumbs', filename].join('/')

  await fetch(`${SUPABASE_URL}/storage/v1/object/${STORAGE_BUCKET}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prefixes: [publicId, thumbPath] }),
  }).catch(() => {})
}

/**
 * Возвращает URL с трансформацией Supabase (если Image Transformation включён).
 * Если трансформация недоступна — возвращает оригинальный URL без изменений.
 */
export function getOptimizedUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number } = {}
): string {
  if (!url.includes(SUPABASE_URL) || !url.includes('/storage/v1/object/public/')) return url
  const { width, height, quality = 80 } = options
  const params = new URLSearchParams()
  if (width) params.set('width', String(width))
  if (height) params.set('height', String(height))
  params.set('quality', String(quality))
  if (width && height) params.set('resize', 'cover')
  return `${url}?${params}`
}
