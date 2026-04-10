'use client'

/**
 * Reusable image upload widget.
 *
 * Usage:
 *   <ImageUpload
 *     value={currentUrl}
 *     onChange={(url) => setValue('imageUrl', url)}
 *     folder="products"
 *   />
 *
 * - Accepts file from device OR manual URL input
 * - Uploads via POST /api/upload
 * - Shows preview
 * - Shows progress bar during upload
 */

import { useRef, useState } from 'react'
import { Upload, X, ImageIcon, Link2 } from 'lucide-react'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  label?: string
  hint?: string
  aspectRatio?: 'square' | 'video' | 'wide'
}

export function ImageUpload({
  value,
  onChange,
  folder = 'uploads',
  label = 'Изображение',
  hint,
  aspectRatio = 'wide',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [mode, setMode] = useState<'upload' | 'url'>('upload')
  const [urlInput, setUrlInput] = useState(value)
  const fileRef = useRef<HTMLInputElement>(null)

  const aspectClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/7]',
  }[aspectRatio]

  async function handleFile(file: File) {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setUploadError('Разрешены: JPG, PNG, WEBP, GIF')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Файл слишком большой (максимум 10 МБ)')
      return
    }

    setUploadError('')
    setUploading(true)
    setProgress(10)

    const tick = setInterval(() => setProgress(p => Math.min(p + 12, 85)), 400)

    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      clearInterval(tick)
      setProgress(100)

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')

      onChange(data.url)
      setUrlInput(data.url)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 800)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function applyUrl() {
    const u = urlInput.trim()
    if (u) onChange(u)
  }

  function clearImage() {
    onChange('')
    setUrlInput('')
    setUploadError('')
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-admin-text text-sm font-medium">{label}</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('upload')}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                mode === 'upload' ? 'bg-stone-900 text-white' : 'text-admin-text-muted hover:text-admin-text'
              }`}
            >
              Загрузить
            </button>
            <button
              type="button"
              onClick={() => setMode('url')}
              className={`text-xs px-2 py-0.5 rounded transition-colors ${
                mode === 'url' ? 'bg-stone-900 text-white' : 'text-admin-text-muted hover:text-admin-text'
              }`}
            >
              URL
            </button>
          </div>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className={`relative ${aspectClass} mb-2 rounded-lg overflow-hidden bg-stone-100 border border-admin-border`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={12} className="text-white" />
          </button>
        </div>
      )}

      {/* Upload mode */}
      {mode === 'upload' && (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          className={`border-2 border-dashed rounded-lg transition-colors text-center cursor-pointer ${
            uploading
              ? 'pointer-events-none border-stone-200 bg-stone-50'
              : 'border-stone-200 hover:border-stone-400 bg-white'
          }`}
        >
          <div className="py-5 px-4">
            {uploading ? (
              <div className="space-y-2">
                <p className="text-admin-text-muted text-sm">Загрузка...</p>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-900 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-admin-text-muted text-xs">{progress}%</p>
              </div>
            ) : (
              <>
                <ImageIcon size={24} className="text-stone-300 mx-auto mb-2" />
                <p className="text-admin-text text-sm">
                  {value ? 'Заменить изображение' : 'Нажмите или перетащите файл'}
                </p>
                <p className="text-admin-text-muted text-xs mt-1">JPG, PNG, WEBP, GIF — до 10 МБ</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}

      {/* URL mode */}
      {mode === 'url' && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onBlur={applyUrl}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), applyUrl())}
              placeholder="https://..."
              className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>
          <button
            type="button"
            onClick={applyUrl}
            className="px-3 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
          >
            OK
          </button>
        </div>
      )}

      {uploadError && (
        <p className="text-red-500 text-xs mt-1.5">{uploadError}</p>
      )}
      {hint && !uploadError && (
        <p className="text-admin-text-muted text-xs mt-1">{hint}</p>
      )}
    </div>
  )
}
