'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical, X, Check } from 'lucide-react'

interface Employee {
  id: string
  name: string
  position: string
  department: string | null
  photoUrl: string | null
  bio: string | null
  email: string | null
  phone: string | null
  isActive: boolean
  sortOrder: number
}

const empty: Omit<Employee, 'id' | 'sortOrder'> = {
  name: '',
  position: '',
  department: '',
  photoUrl: '',
  bio: '',
  email: '',
  phone: '',
  isActive: true,
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<typeof empty | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  async function load() {
    const res = await fetch('/api/admin/employees')
    const data = await res.json()
    setEmployees(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openNew() {
    setEditId(null)
    setForm({ ...empty })
    setError('')
  }

  function openEdit(emp: Employee) {
    setEditId(emp.id)
    setForm({
      name: emp.name,
      position: emp.position,
      department: emp.department ?? '',
      photoUrl: emp.photoUrl ?? '',
      bio: emp.bio ?? '',
      email: emp.email ?? '',
      phone: emp.phone ?? '',
      isActive: emp.isActive,
    })
    setError('')
  }

  function closeForm() {
    setForm(null)
    setEditId(null)
    setError('')
  }

  async function save() {
    if (!form) return
    if (!form.name.trim() || !form.position.trim()) {
      setError('Имя и должность обязательны')
      return
    }
    setSaving(true)
    setError('')
    try {
      const body = {
        name: form.name.trim(),
        position: form.position.trim(),
        department: form.department?.trim() || null,
        photoUrl: form.photoUrl?.trim() || null,
        bio: form.bio?.trim() || null,
        email: form.email?.trim() || null,
        phone: form.phone?.trim() || null,
        isActive: form.isActive,
      }
      const res = editId
        ? await fetch(`/api/admin/employees/${editId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/employees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error('Ошибка сохранения')
      await load()
      closeForm()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' })
    if (res.ok) { setDeleteId(null); await load() }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Сотрудники</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">Команда пивоварни</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Добавить
        </button>
      </div>

      {/* Form */}
      {form !== null && (
        <div className="bg-white border border-admin-border rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-admin-text font-semibold">{editId ? 'Редактировать' : 'Новый сотрудник'}</h2>
            <button onClick={closeForm} className="text-admin-text-muted hover:text-admin-text">
              <X size={18} />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Имя *</label>
              <input
                value={form.name}
                onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Иван Иванов"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Должность *</label>
              <input
                value={form.position}
                onChange={e => setForm(f => f && ({ ...f, position: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Пивовар"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Отдел</label>
              <input
                value={form.department ?? ''}
                onChange={e => setForm(f => f && ({ ...f, department: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="Производство"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Фото (URL)</label>
              <input
                value={form.photoUrl ?? ''}
                onChange={e => setForm(f => f && ({ ...f, photoUrl: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
                placeholder="/uploads/photo.jpg"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Email</label>
              <input
                type="email"
                value={form.email ?? ''}
                onChange={e => setForm(f => f && ({ ...f, email: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Телефон</label>
              <input
                value={form.phone ?? ''}
                onChange={e => setForm(f => f && ({ ...f, phone: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-admin-text-muted text-xs mb-1">Биография</label>
              <textarea
                value={form.bio ?? ''}
                onChange={e => setForm(f => f && ({ ...f, bio: e.target.value }))}
                rows={3}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 resize-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={form.isActive}
                onChange={e => setForm(f => f && ({ ...f, isActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="isActive" className="text-admin-text text-sm">Активен (отображается на сайте)</label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button
              onClick={save}
              disabled={saving}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
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

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-white border border-admin-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : employees.length === 0 ? (
        <div className="bg-white border border-admin-border rounded-xl p-10 text-center text-admin-text-muted text-sm">
          Нет сотрудников. Нажмите «Добавить» чтобы создать первого.
        </div>
      ) : (
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white border border-admin-border rounded-xl p-4 flex items-center gap-4">
              <GripVertical size={16} className="text-admin-text-muted flex-shrink-0 cursor-grab" />

              {emp.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={emp.photoUrl} alt={emp.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-admin-bg" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 text-amber-700 font-semibold text-sm">
                  {emp.name.charAt(0)}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-admin-text text-sm font-medium truncate">{emp.name}</p>
                <p className="text-admin-text-muted text-xs truncate">{emp.position}{emp.department ? ` · ${emp.department}` : ''}</p>
              </div>

              <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${emp.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {emp.isActive ? 'Активен' : 'Скрыт'}
              </span>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(emp)}
                  className="p-1.5 text-admin-text-muted hover:text-admin-text transition-colors"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setDeleteId(emp.id)}
                  className="p-1.5 text-admin-text-muted hover:text-red-500 transition-colors"
                >
                  <Trash2 size={15} />
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
            <h3 className="text-admin-text font-semibold mb-2">Удалить сотрудника?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Это действие нельзя отменить.</p>
            <div className="flex gap-3">
              <button
                onClick={() => remove(deleteId)}
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
