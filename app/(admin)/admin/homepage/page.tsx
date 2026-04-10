'use client'

import { useEffect, useState, useRef } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Check, GripVertical, ChevronUp, ChevronDown, Upload } from 'lucide-react'

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  imageUrl: string
  ctaText: string | null
  ctaUrl: string | null
  ctaSecondaryText: string | null
  ctaSecondaryUrl: string | null
  isActive: boolean
  sortOrder: number
}

interface HomeSection {
  id: string
  key: string
  isVisible: boolean
  sortOrder: number
}

const SECTION_LABELS: Record<string, string> = {
  HERO: 'Главный экран (Hero)',
  ABOUT_BRIEF: 'О компании',
  STATS: 'Статистика',
  PRODUCTS: 'Продукция',
  TEAM_PERSON: 'Технолог',
  NEWS: 'Новости',
  GALLERY: 'Галерея',
  PARTNERS: 'Партнёры',
  CONTACTS_CTA: 'Блок с контактами',
}

const emptySlide = {
  title: '',
  subtitle: '',
  description: '',
  imageUrl: '',
  ctaText: '',
  ctaUrl: '',
  ctaSecondaryText: '',
  ctaSecondaryUrl: '',
  isActive: true,
}

export default function AdminHomepagePage() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [sections, setSections] = useState<HomeSection[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)

  // Slide modal
  const [slideForm, setSlideForm] = useState<typeof emptySlide | null>(null)
  const [editSlideId, setEditSlideId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [slideError, setSlideError] = useState('')

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const toastTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  async function uploadSlideImage(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')
      setSlideForm(f => f && ({ ...f, imageUrl: data.url }))
    } catch (e) {
      setSlideError(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok })
    if (toastTimeout.current) clearTimeout(toastTimeout.current)
    toastTimeout.current = setTimeout(() => setToast(null), 3000)
  }

  async function load() {
    try {
      const [slidesRes, sectionsRes] = await Promise.all([
        fetch('/api/admin/hero-slides'),
        fetch('/api/admin/home-sections').catch(() => null),
      ])
      if (slidesRes.ok) setSlides(await slidesRes.json())
      // Sections come from DB via the server initially; we'll just load them if the GET is available
      // For sections we use the server-rendered data via a GET endpoint not yet created,
      // so we load them from the current page data approach
    } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => {
    // Load slides + sections
    Promise.all([
      fetch('/api/admin/hero-slides').then(r => r.ok ? r.json() : []).catch(() => []),
      fetch('/api/admin/home-sections').then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([s, sec]) => {
      setSlides(s)
      setSections(sec)
      setLoading(false)
    })
  }, [])

  // ---------- SLIDES ----------
  function openNewSlide() {
    setEditSlideId(null)
    setSlideForm({ ...emptySlide })
    setSlideError('')
  }

  function openEditSlide(slide: HeroSlide) {
    setEditSlideId(slide.id)
    setSlideForm({
      title: slide.title,
      subtitle: slide.subtitle ?? '',
      description: slide.description ?? '',
      imageUrl: slide.imageUrl,
      ctaText: slide.ctaText ?? '',
      ctaUrl: slide.ctaUrl ?? '',
      ctaSecondaryText: slide.ctaSecondaryText ?? '',
      ctaSecondaryUrl: slide.ctaSecondaryUrl ?? '',
      isActive: slide.isActive,
    })
    setSlideError('')
  }

  function closeSlideForm() {
    setSlideForm(null)
    setEditSlideId(null)
    setSlideError('')
  }

  async function saveSlide() {
    if (!slideForm) return
    if (!slideForm.title.trim()) { setSlideError('Заголовок обязателен'); return }
    if (!slideForm.imageUrl.trim()) { setSlideError('URL изображения обязателен'); return }

    setSaving(true)
    setSlideError('')
    try {
      const url = editSlideId ? `/api/admin/hero-slides/${editSlideId}` : '/api/admin/hero-slides'
      const method = editSlideId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')

      if (editSlideId) {
        setSlides(prev => prev.map(s => s.id === editSlideId ? data.slide : s))
      } else {
        setSlides(prev => [...prev, data.slide])
      }
      closeSlideForm()
      showToast(editSlideId ? 'Слайд обновлён' : 'Слайд добавлен')
    } catch (e) {
      setSlideError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  async function toggleSlide(slide: HeroSlide) {
    try {
      const res = await fetch(`/api/admin/hero-slides/${slide.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !slide.isActive }),
      })
      if (res.ok) {
        setSlides(prev => prev.map(s => s.id === slide.id ? { ...s, isActive: !s.isActive } : s))
        showToast(slide.isActive ? 'Слайд скрыт' : 'Слайд активен')
      }
    } catch { /* */ }
  }

  async function deleteSlide(id: string) {
    try {
      const res = await fetch(`/api/admin/hero-slides/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSlides(prev => prev.filter(s => s.id !== id))
        setDeleteId(null)
        showToast('Слайд удалён')
      }
    } catch { /* */ }
  }

  // ---------- SECTIONS ----------
  async function toggleSection(section: HomeSection) {
    const updated = { ...section, isVisible: !section.isVisible }
    setSections(prev => prev.map(s => s.id === section.id ? updated : s))
    try {
      await fetch('/api/admin/home-sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: section.id, isVisible: updated.isVisible }),
      })
      showToast(updated.isVisible ? 'Секция показана' : 'Секция скрыта')
    } catch { /* */ }
  }

  function moveSectionUp(index: number) {
    if (index === 0) return
    const next = [...sections]
    ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
    const reordered = next.map((s, i) => ({ ...s, sortOrder: i }))
    setSections(reordered)
    saveSectionsOrder(reordered)
  }

  function moveSectionDown(index: number) {
    if (index === sections.length - 1) return
    const next = [...sections]
    ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
    const reordered = next.map((s, i) => ({ ...s, sortOrder: i }))
    setSections(reordered)
    saveSectionsOrder(reordered)
  }

  async function saveSectionsOrder(ordered: HomeSection[]) {
    try {
      await fetch('/api/admin/home-sections', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: ordered }),
      })
      showToast('Порядок сохранён')
    } catch { /* */ }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${toast.ok ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Главная страница</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Hero-слайды и порядок секций</p>
      </div>

      {/* ── Hero slides ── */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-admin-text font-semibold text-lg">Hero-слайды</h2>
          <button
            onClick={openNewSlide}
            className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
          >
            <Plus size={14} />
            Добавить слайд
          </button>
        </div>

        {/* Slide form */}
        {slideForm !== null && (
          <div className="bg-white border border-admin-border rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-admin-text font-semibold">{editSlideId ? 'Редактировать слайд' : 'Новый слайд'}</h3>
              <button onClick={closeSlideForm}><X size={18} className="text-admin-text-muted" /></button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-admin-text-muted text-xs mb-1">Заголовок *</label>
                <input
                  value={slideForm.title}
                  onChange={e => setSlideForm(f => f && ({ ...f, title: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Дербентская пивоварня"
                />
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Подзаголовок</label>
                <input
                  value={slideForm.subtitle}
                  onChange={e => setSlideForm(f => f && ({ ...f, subtitle: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Премиальное пиво"
                />
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Изображение *</label>
                <div className="flex gap-2">
                  <input
                    value={slideForm.imageUrl}
                    onChange={e => setSlideForm(f => f && ({ ...f, imageUrl: e.target.value }))}
                    className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                    placeholder="https://... или загрузить файл →"
                  />
                  <label className={`flex items-center gap-1.5 px-3 py-2 border border-admin-border rounded-lg text-sm text-admin-text-muted hover:bg-stone-50 cursor-pointer transition-colors flex-shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <Upload size={14} />
                    {uploading ? '...' : 'Файл'}
                    <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadSlideImage(f) }} />
                  </label>
                </div>
                {slideForm.imageUrl && (
                  <img src={slideForm.imageUrl} alt="" className="mt-2 h-20 w-full object-cover rounded-lg border border-admin-border" />
                )}
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Описание</label>
                <input
                  value={slideForm.description}
                  onChange={e => setSlideForm(f => f && ({ ...f, description: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Краткое описание..."
                />
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Текст кнопки</label>
                <input
                  value={slideForm.ctaText}
                  onChange={e => setSlideForm(f => f && ({ ...f, ctaText: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="Наша продукция"
                />
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Ссылка кнопки</label>
                <input
                  value={slideForm.ctaUrl}
                  onChange={e => setSlideForm(f => f && ({ ...f, ctaUrl: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="/products"
                />
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Текст второй кнопки</label>
                <input
                  value={slideForm.ctaSecondaryText}
                  onChange={e => setSlideForm(f => f && ({ ...f, ctaSecondaryText: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="О нас"
                />
              </div>
              <div>
                <label className="block text-admin-text-muted text-xs mb-1">Ссылка второй кнопки</label>
                <input
                  value={slideForm.ctaSecondaryUrl}
                  onChange={e => setSlideForm(f => f && ({ ...f, ctaSecondaryUrl: e.target.value }))}
                  className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="/about"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="slideActive"
                  checked={slideForm.isActive}
                  onChange={e => setSlideForm(f => f && ({ ...f, isActive: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="slideActive" className="text-admin-text text-sm">Активен (показывать на сайте)</label>
              </div>
            </div>

            {slideError && <p className="text-red-500 text-sm mt-3">{slideError}</p>}

            <div className="flex gap-2 mt-4">
              <button
                onClick={saveSlide}
                disabled={saving}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                <Check size={16} />
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              <button
                onClick={closeSlideForm}
                className="border border-admin-border rounded-lg px-4 py-2 text-admin-text text-sm hover:bg-admin-bg transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
          {loading ? (
            <p className="text-center py-8 text-admin-text-muted text-sm">Загрузка...</p>
          ) : slides.length === 0 ? (
            <p className="text-center py-8 text-admin-text-muted text-sm">Слайдов нет. Нажмите «Добавить слайд».</p>
          ) : (
            slides.map((slide) => (
              <div key={slide.id} className="flex items-center justify-between px-5 py-4 border-b border-admin-border last:border-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 h-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                    {slide.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-admin-text text-sm font-medium truncate">{slide.title}</p>
                    {slide.subtitle && <p className="text-admin-text-muted text-xs truncate">{slide.subtitle}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs ${slide.isActive ? 'text-green-600' : 'text-stone-400'}`}>
                    {slide.isActive ? '● Активен' : '○ Скрыт'}
                  </span>
                  <button
                    onClick={() => toggleSlide(slide)}
                    title={slide.isActive ? 'Скрыть' : 'Показать'}
                    className="p-1.5 text-admin-text-muted hover:text-admin-text transition-colors"
                  >
                    {slide.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    onClick={() => openEditSlide(slide)}
                    className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors"
                    title="Редактировать"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteId(slide.id)}
                    className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Sections order ── */}
      <div>
        <h2 className="text-admin-text font-semibold text-lg mb-4">Порядок и видимость секций</h2>
        <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
          {sections.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-admin-text-muted text-sm mb-4">Секции не инициализированы. Нажмите кнопку для создания записей.</p>
              <button
                onClick={async () => {
                  const res = await fetch('/api/admin/home-sections/init', { method: 'POST' })
                  if (res.ok) {
                    const data = await res.json()
                    setSections(data.sections)
                    showToast('Секции инициализированы')
                  } else {
                    showToast('Ошибка инициализации', false)
                  }
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
              >
                Инициализировать секции
              </button>
            </div>
          ) : (
            sections.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between px-5 py-3.5 border-b border-admin-border last:border-0">
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-stone-300" />
                  <span className="text-admin-text text-sm">{SECTION_LABELS[section.key] ?? section.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveSectionUp(index)}
                    disabled={index === 0}
                    className="p-1 text-admin-text-muted hover:text-admin-text disabled:opacity-30 transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveSectionDown(index)}
                    disabled={index === sections.length - 1}
                    className="p-1 text-admin-text-muted hover:text-admin-text disabled:opacity-30 transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <button
                    onClick={() => toggleSection(section)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      section.isVisible
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                    }`}
                  >
                    {section.isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {section.isVisible ? 'Видна' : 'Скрыта'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-admin-text font-semibold mb-2">Удалить слайд?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Слайд будет удалён с главной страницы сайта.</p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteSlide(deleteId)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                Удалить
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 border border-admin-border rounded-lg px-4 py-2 text-sm text-admin-text hover:bg-admin-bg transition-colors"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
