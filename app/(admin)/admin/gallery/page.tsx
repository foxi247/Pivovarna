'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Eye, EyeOff, Trash2, X, Upload, ImageIcon } from 'lucide-react'

interface GalleryItem {
  id: string
  imageUrl: string
  thumbUrl: string | null
  title: string | null
  isActive: boolean
  sortOrder: number
  category: { id: string; name: string } | null
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Upload state
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadTitle, setUploadTitle] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    try {
      const res = await fetch('/api/admin/gallery')
      if (res.ok) setItems(await res.json())
    } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openUploadModal() {
    setShowUploadModal(true)
    setPreviewUrl(null)
    setSelectedFile(null)
    setUploadTitle('')
    setUploadError('')
    setUploadProgress(0)
  }

  function closeUploadModal() {
    if (uploading) return
    setShowUploadModal(false)
    setPreviewUrl(null)
    setSelectedFile(null)
    setUploadError('')
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowed.includes(file.type)) {
      setUploadError('Неподдерживаемый формат. Разрешены: JPG, PNG, WEBP, GIF')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Файл слишком большой (максимум 10MB)')
      return
    }

    setUploadError('')
    setSelectedFile(file)

    // Preview
    const reader = new FileReader()
    reader.onload = (ev) => setPreviewUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function uploadFile() {
    if (!selectedFile) { setUploadError('Выберите файл'); return }

    setUploading(true)
    setUploadError('')
    setUploadProgress(10)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      if (uploadTitle.trim()) formData.append('title', uploadTitle.trim())

      // Simulate progress (XHR would give real progress, fetch doesn't)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 15, 85))
      }, 400)

      const res = await fetch('/api/admin/gallery', { method: 'POST', body: formData })
      clearInterval(progressInterval)
      setUploadProgress(100)

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')

      setItems(prev => [data.item, ...prev])
      closeUploadModal()
      showToast('Фото загружено и добавлено в галерею')
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  async function toggleItem(item: GalleryItem) {
    setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: !i.isActive } : i))
    try {
      const res = await fetch(`/api/admin/gallery/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !item.isActive }),
      })
      if (!res.ok) {
        // Rollback
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: item.isActive } : i))
        showToast('Ошибка обновления', false)
      } else {
        showToast(item.isActive ? 'Фото скрыто' : 'Фото показано')
      }
    } catch {
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, isActive: item.isActive } : i))
    }
  }

  async function deleteItem(id: string) {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setItems(prev => prev.filter(i => i.id !== id))
        setDeleteId(null)
        showToast('Фото удалено')
      } else {
        showToast('Ошибка удаления', false)
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
          <h1 className="text-admin-text text-2xl font-semibold">Галерея</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{items.length} фотографий</p>
        </div>
        <button
          onClick={openUploadModal}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
        >
          <Plus size={16} />
          Загрузить фото
        </button>
      </div>

      {loading ? (
        <div className="bg-white border border-admin-border rounded-xl py-20 text-center">
          <p className="text-admin-text-muted text-sm">Загрузка...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white border border-admin-border rounded-xl py-20 text-center">
          <ImageIcon size={40} className="text-admin-text-muted mx-auto mb-3 opacity-40" />
          <p className="text-admin-text-muted">Фотографий пока нет</p>
          <p className="text-admin-text-muted text-sm mt-1">Нажмите «Загрузить фото», чтобы начать</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-stone-100 aspect-square border border-admin-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbUrl || item.imageUrl}
                alt={item.title || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => toggleItem(item)}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors"
                  title={item.isActive ? 'Скрыть' : 'Показать'}
                >
                  {item.isActive ? <EyeOff size={14} className="text-stone-700" /> : <Eye size={14} className="text-stone-700" />}
                </button>
                <button
                  onClick={() => setDeleteId(item.id)}
                  className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                  title="Удалить"
                >
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
              {!item.isActive && (
                <div className="absolute top-2 right-2 bg-stone-700/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Скрыт
                </div>
              )}
              {item.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{item.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-admin-text font-semibold">Загрузить фото</h3>
              <button onClick={closeUploadModal} disabled={uploading}>
                <X size={18} className="text-admin-text-muted" />
              </button>
            </div>

            {/* File drop zone */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors mb-4 ${
                previewUrl ? 'border-stone-300' : 'border-stone-200 hover:border-stone-400'
              } ${uploading ? 'pointer-events-none opacity-60' : ''}`}
            >
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg object-contain" />
              ) : (
                <div className="py-4">
                  <Upload size={32} className="text-admin-text-muted mx-auto mb-2" />
                  <p className="text-admin-text text-sm font-medium">Нажмите для выбора файла</p>
                  <p className="text-admin-text-muted text-xs mt-1">JPG, PNG, WEBP, GIF — до 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {selectedFile && !uploading && (
              <div className="mb-4">
                <label className="block text-admin-text-muted text-xs mb-1">Подпись к фото (необязательно)</label>
                <input
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Введите название..."
                />
              </div>
            )}

            {/* Progress bar */}
            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-admin-text-muted mb-1">
                  <span>Загрузка...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-900 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <p className="text-red-500 text-sm mb-4">{uploadError}</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={uploadFile}
                disabled={!selectedFile || uploading}
                className="flex-1 flex items-center justify-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                <Upload size={14} />
                {uploading ? 'Загрузка...' : 'Загрузить'}
              </button>
              <button
                onClick={closeUploadModal}
                disabled={uploading}
                className="flex-1 border border-admin-border rounded-lg px-4 py-2 text-sm text-admin-text hover:bg-admin-bg transition-colors disabled:opacity-50"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-admin-text font-semibold mb-2">Удалить фото?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Фото будет удалено из галереи. Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteItem(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
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
