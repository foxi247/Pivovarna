'use client'

import { useEffect, useRef, useState } from 'react'
import { Upload, Copy, Trash2, ImageIcon, Check } from 'lucide-react'
import { formatFileSize, formatDate } from '@/lib/utils'

interface MediaFile {
  id: string
  originalName: string
  url: string
  thumbUrl: string | null
  mimeType: string
  size: number
  width: number | null
  height: number | null
  folder: string | null
  createdAt: string
}

export default function AdminMediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const dropRef = useRef<HTMLDivElement>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    try {
      const res = await fetch('/api/admin/media')
      if (res.ok) setFiles(await res.json())
    } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function upload(file: File) {
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
      fd.append('folder', 'media')

      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      clearInterval(tick)
      setProgress(100)

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')

      await load()
      showToast('Файл загружен')
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Ошибка загрузки')
      showToast('Ошибка загрузки', false)
    } finally {
      setUploading(false)
      setTimeout(() => setProgress(0), 800)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    dropRef.current?.classList.remove('border-stone-500')
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  function copyUrl(file: MediaFile) {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopiedId(file.id)
      setTimeout(() => setCopiedId(null), 2000)
      showToast('URL скопирован')
    })
  }

  async function deleteFile(id: string) {
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setFiles(prev => prev.filter(f => f.id !== id))
        setDeleteId(null)
        showToast('Файл удалён')
      } else {
        const d = await res.json()
        showToast(d.error || 'Ошибка удаления', false)
        setDeleteId(null)
      }
    } catch {
      showToast('Ошибка удаления', false)
      setDeleteId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Медиафайлы</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{files.length} файлов в библиотеке</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors cursor-pointer">
          <Upload size={16} />
          Загрузить
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFiles}
          />
        </label>
      </div>

      {/* Drop zone */}
      <div
        ref={dropRef}
        onClick={() => !uploading && fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); dropRef.current?.classList.add('border-stone-500') }}
        onDragLeave={() => dropRef.current?.classList.remove('border-stone-500')}
        className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-colors cursor-pointer ${
          uploading ? 'pointer-events-none border-stone-200' : 'border-stone-200 hover:border-stone-400'
        }`}
      >
        {uploading ? (
          <div className="space-y-2 max-w-xs mx-auto">
            <Upload size={24} className="text-admin-text-muted mx-auto animate-bounce" />
            <p className="text-admin-text text-sm font-medium">Загрузка...</p>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-stone-900 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-admin-text-muted text-xs">{progress}%</p>
          </div>
        ) : (
          <>
            <Upload size={28} className="text-stone-300 mx-auto mb-3" />
            <p className="text-admin-text text-sm font-medium">Перетащите изображение сюда или нажмите для выбора</p>
            <p className="text-admin-text-muted text-xs mt-1">JPG, PNG, WebP, GIF — до 10 МБ · Сохраняется в Supabase Storage</p>
          </>
        )}
      </div>

      {uploadError && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {uploadError}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="bg-white border border-admin-border rounded-xl py-16 text-center">
          <p className="text-admin-text-muted text-sm">Загрузка...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="bg-white border border-admin-border rounded-xl py-16 text-center">
          <ImageIcon size={40} className="text-admin-text-muted mx-auto mb-3 opacity-30" />
          <p className="text-admin-text-muted text-sm">Файлов пока нет</p>
          <p className="text-admin-text-muted text-xs mt-1">Загрузите первый файл выше</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="group relative bg-white border border-admin-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-stone-50">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.thumbUrl || file.url}
                  alt={file.originalName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-admin-text text-[10px] font-medium truncate" title={file.originalName}>
                  {file.originalName}
                </p>
                <p className="text-admin-text-muted text-[10px]">{formatFileSize(file.size)}</p>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                <button
                  onClick={() => copyUrl(file)}
                  className="w-full py-1.5 bg-white text-stone-900 rounded-md text-[10px] font-medium hover:bg-stone-100 transition-colors flex items-center justify-center gap-1"
                >
                  {copiedId === file.id ? <Check size={10} /> : <Copy size={10} />}
                  {copiedId === file.id ? 'Скопировано' : 'Скопировать URL'}
                </button>
                <button
                  onClick={() => setDeleteId(file.id)}
                  className="w-full py-1.5 bg-red-500 text-white rounded-md text-[10px] font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 size={10} />
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-admin-text font-semibold mb-2">Удалить файл?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Файл будет удалён из медиабиблиотеки. Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteFile(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                Удалить
              </button>
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-admin-border rounded-lg px-4 py-2 text-sm text-admin-text hover:bg-admin-bg transition-colors">
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
