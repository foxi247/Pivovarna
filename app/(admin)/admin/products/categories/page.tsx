'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react'
import { slugify } from '@/lib/utils'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  isActive: boolean
  sortOrder: number
  _count: { products: number }
}

const emptyForm = { name: '', slug: '', description: '', isActive: true }

export default function AdminProductCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<typeof emptyForm | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  async function load() {
    try {
      const res = await fetch('/api/admin/products/categories')
      if (res.ok) setCategories(await res.json())
    } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function openNew() {
    setEditId(null)
    setForm({ ...emptyForm })
    setError('')
  }

  function openEdit(cat: Category) {
    setEditId(cat.id)
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? '', isActive: cat.isActive })
    setError('')
  }

  function closeForm() { setForm(null); setEditId(null); setError('') }

  function handleNameChange(name: string) {
    setForm(f => f && ({
      ...f,
      name,
      slug: editId ? f.slug : slugify(name),
    }))
  }

  async function save() {
    if (!form) return
    if (!form.name.trim()) { setError('Название обязательно'); return }

    setSaving(true); setError('')
    try {
      const url = editId ? `/api/admin/products/categories/${editId}` : '/api/admin/products/categories'
      const method = editId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')

      await load()
      closeForm()
      showToast(editId ? 'Категория обновлена' : 'Категория создана')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    try {
      const res = await fetch(`/api/admin/products/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка удаления')
      setCategories(prev => prev.filter(c => c.id !== id))
      setDeleteId(null)
      showToast('Категория удалена')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка')
      setDeleteId(null)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {toast && (
        <div className="fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium bg-green-600 text-white">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Категории продукции</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{categories.length} категорий</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
        >
          <Plus size={16} />
          Добавить категорию
        </button>
      </div>

      {/* Form */}
      {form !== null && (
        <div className="bg-white border border-admin-border rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-admin-text font-semibold">{editId ? 'Редактировать категорию' : 'Новая категория'}</h2>
            <button onClick={closeForm}><X size={18} className="text-admin-text-muted" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Название *</label>
              <input
                value={form.name}
                onChange={e => handleNameChange(e.target.value)}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Светлое пиво"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Slug (URL-адрес)</label>
              <input
                value={form.slug}
                onChange={e => setForm(f => f && ({ ...f, slug: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 font-mono"
                placeholder="svetloe-pivo"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Описание</label>
              <input
                value={form.description}
                onChange={e => setForm(f => f && ({ ...f, description: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Краткое описание категории"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="catActive"
                checked={form.isActive}
                onChange={e => setForm(f => f && ({ ...f, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="catActive" className="text-admin-text text-sm">Активна (отображается на сайте)</label>
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

      {!form && error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {loading ? (
          <p className="text-center py-12 text-admin-text-muted text-sm">Загрузка...</p>
        ) : categories.length === 0 ? (
          <p className="text-center py-12 text-admin-text-muted text-sm">Категорий нет. Создайте первую.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-admin-border bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Название</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Продуктов</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 text-admin-text font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs font-mono hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3 text-admin-text-muted">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${cat.isActive ? 'text-green-700' : 'text-stone-400'}`}>
                      {cat.isActive ? '● Активна' : '○ Скрыта'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(cat)} className="p-1.5 text-admin-text-muted hover:text-blue-600 transition-colors">
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setDeleteId(cat.id)}
                        disabled={(cat._count?.products ?? 0) > 0}
                        className="p-1.5 text-admin-text-muted hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        title={(cat._count?.products ?? 0) > 0 ? 'Нельзя удалить: есть продукты' : 'Удалить'}
                      >
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
            <h3 className="text-admin-text font-semibold mb-2">Удалить категорию?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Это действие нельзя отменить.</p>
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
