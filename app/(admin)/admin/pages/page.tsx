'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, Globe, EyeOff, Eye, Navigation } from 'lucide-react'

interface CustomPage {
  id: string
  title: string
  slug: string
  content: string
  isPublished: boolean
  showInNav: boolean
  navLabel: string | null
  seoTitle: string | null
  seoDescription: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[а-яёА-ЯЁ]/g, (c) => {
      const map: Record<string, string> = {
        а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',
        н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',
        ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
      }
      return map[c] ?? c
    })
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  isPublished: false,
  showInNav: false,
  navLabel: '',
  seoTitle: '',
  seoDescription: '',
}

type FormState = typeof emptyForm

export default function AdminPagesPage() {
  const [pages, setPages] = useState<CustomPage[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [error, setError] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/admin/custom-pages')
      if (res.ok) setPages(await res.json())
    } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditId(null)
    setForm({ ...emptyForm })
    setError('')
  }

  function openEdit(p: CustomPage) {
    setEditId(p.id)
    setForm({
      title: p.title,
      slug: p.slug,
      content: p.content,
      isPublished: p.isPublished,
      showInNav: p.showInNav,
      navLabel: p.navLabel ?? '',
      seoTitle: p.seoTitle ?? '',
      seoDescription: p.seoDescription ?? '',
    })
    setError('')
  }

  function closeForm() { setForm(null); setEditId(null); setError('') }

  function handleTitleChange(title: string) {
    setForm(f => f && ({ ...f, title, slug: editId ? f.slug : slugify(title) }))
  }

  async function save() {
    if (!form) return
    if (!form.title.trim()) { setError('Заголовок обязателен'); return }
    if (!form.slug.trim()) { setError('Slug обязателен'); return }

    setSaving(true); setError('')
    try {
      const body = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        content: form.content,
        isPublished: form.isPublished,
        showInNav: form.showInNav,
        navLabel: form.navLabel.trim() || null,
        seoTitle: form.seoTitle.trim() || null,
        seoDescription: form.seoDescription.trim() || null,
      }

      const res = editId
        ? await fetch(`/api/admin/custom-pages/${editId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/custom-pages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      await load()
      closeForm()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublish(page: CustomPage) {
    await fetch(`/api/admin/custom-pages/${page.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPublished: !page.isPublished }),
    })
    await load()
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/custom-pages/${id}`, { method: 'DELETE' })
    if (res.ok) { setDeleteId(null); await load() }
    else { const d = await res.json(); setError(d.error || 'Ошибка'); setDeleteId(null) }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Произвольные страницы</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">CMS-страницы с произвольным содержимым</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Новая страница
        </button>
      </div>

      {error && !form && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Form */}
      {form !== null && (
        <div className="bg-white border border-admin-border rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-admin-text font-semibold">{editId ? 'Редактировать страницу' : 'Новая страница'}</h2>
            <button onClick={closeForm}><X size={18} className="text-admin-text-muted" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Заголовок *</label>
              <input
                value={form.title}
                onChange={e => handleTitleChange(e.target.value)}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Название страницы"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Slug (URL) *</label>
              <div className="flex items-center gap-1">
                <span className="text-admin-text-muted text-sm">/</span>
                <input
                  value={form.slug}
                  onChange={e => setForm(f => f && ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') }))}
                  className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  placeholder="url-stranitsy"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-admin-text-muted text-xs mb-1">Содержимое</label>
              <textarea
                rows={8}
                value={form.content}
                onChange={e => setForm(f => f && ({ ...f, content: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-y font-mono"
                placeholder="HTML или текст страницы..."
              />
            </div>

            <div>
              <label className="block text-admin-text-muted text-xs mb-1">SEO заголовок</label>
              <input
                value={form.seoTitle}
                onChange={e => setForm(f => f && ({ ...f, seoTitle: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">SEO описание</label>
              <input
                value={form.seoDescription}
                onChange={e => setForm(f => f && ({ ...f, seoDescription: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
              />
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => f && ({ ...f, isPublished: e.target.checked }))} className="rounded" />
                <span className="text-admin-text text-sm">Опубликовать</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.showInNav} onChange={e => setForm(f => f && ({ ...f, showInNav: e.target.checked }))} className="rounded" />
                <span className="text-admin-text text-sm">Показать в навигации</span>
              </label>
              {form.showInNav && (
                <div className="flex items-center gap-2">
                  <span className="text-admin-text-muted text-sm">Метка:</span>
                  <input
                    value={form.navLabel}
                    onChange={e => setForm(f => f && ({ ...f, navLabel: e.target.value }))}
                    className="border border-admin-border rounded-lg px-2 py-1 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 w-40"
                    placeholder={form.title || 'Ссылка'}
                  />
                </div>
              )}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Check size={16} />
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button onClick={closeForm} className="border border-admin-border rounded-lg px-4 py-2 text-admin-text text-sm hover:bg-admin-bg transition-colors">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-admin-text-muted text-sm">Загрузка...</div>
        ) : pages.length === 0 ? (
          <div className="p-12 text-center">
            <Globe size={32} className="text-admin-text-muted mx-auto mb-3" />
            <p className="text-admin-text-muted text-sm">Нет страниц. Создайте первую.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-admin-border bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Страница</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">URL</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-admin-text font-medium">{page.title}</p>
                    {page.showInNav && (
                      <span className="inline-flex items-center gap-1 text-xs text-blue-600 mt-0.5">
                        <Navigation size={10} />
                        {page.navLabel || page.title}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden md:table-cell">
                    /{page.slug}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => togglePublish(page)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        page.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                      }`}
                    >
                      {page.isPublished ? <Eye size={11} /> : <EyeOff size={11} />}
                      {page.isPublished ? 'Опубликовано' : 'Черновик'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(page)} className="p-1.5 text-admin-text-muted hover:text-admin-text transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(page.id)} className="p-1.5 text-admin-text-muted hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-admin-text font-semibold mb-2">Удалить страницу?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Страница будет удалена безвозвратно.</p>
            <div className="flex gap-3">
              <button onClick={() => remove(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
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
