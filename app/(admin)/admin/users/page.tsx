'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, ShieldCheck } from 'lucide-react'

const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Суперадмин',
  ADMIN: 'Администратор',
  MANAGER: 'Менеджер',
  CONTENT_EDITOR: 'Редактор',
}

const ROLES = Object.entries(ROLE_LABELS)

interface User {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

const emptyForm = { name: '', email: '', password: '', role: 'CONTENT_EDITOR', isActive: true }

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState<typeof emptyForm | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [canManage, setCanManage] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  async function load() {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
        setCanManage(true)
      } else {
        setCanManage(false)
      }
    } catch { /* */ }
    setLoading(false)
  }

  useEffect(() => {
    load()
    // Check current user role from session via an API call
    fetch('/api/admin/users').then(async r => {
      if (r.ok) {
        setCanManage(true)
        // Detect if we're superadmin by trying to see the users list successfully
      }
    })
    // Detect superadmin from auth
    fetch('/api/auth/session').then(r => r.json()).then(s => {
      if (s?.user?.role === 'SUPERADMIN') setIsSuperAdmin(true)
    }).catch(() => {})
  }, [])

  function openNew() {
    setEditId(null)
    setForm({ ...emptyForm })
    setError('')
  }

  function openEdit(user: User) {
    setEditId(user.id)
    setForm({ name: user.name, email: user.email, password: '', role: user.role, isActive: user.isActive })
    setError('')
  }

  function closeForm() { setForm(null); setEditId(null); setError('') }

  async function save() {
    if (!form) return
    if (!form.name.trim() || !form.email.trim()) { setError('Имя и email обязательны'); return }
    if (!editId && !form.password) { setError('Для нового пользователя необходим пароль'); return }

    setSaving(true); setError('')
    try {
      const body: Record<string, unknown> = { name: form.name, email: form.email, role: form.role, isActive: form.isActive }
      if (form.password) body.password = form.password

      const res = editId
        ? await fetch(`/api/admin/users/${editId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        : await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, password: form.password }) })

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

  async function remove(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    if (res.ok) { setDeleteId(null); await load() }
    else {
      const d = await res.json()
      setError(d.error || 'Ошибка удаления')
      setDeleteId(null)
    }
  }

  const roleColor: Record<string, string> = {
    SUPERADMIN: 'bg-red-100 text-red-700',
    ADMIN: 'bg-purple-100 text-purple-700',
    MANAGER: 'bg-blue-100 text-blue-700',
    CONTENT_EDITOR: 'bg-stone-100 text-stone-600',
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Пользователи</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">Управление доступом к панели</p>
        </div>
        {canManage && (
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Добавить
          </button>
        )}
      </div>

      {error && !form && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      {/* Form */}
      {form !== null && (
        <div className="bg-white border border-admin-border rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-admin-text font-semibold">{editId ? 'Редактировать пользователя' : 'Новый пользователь'}</h2>
            <button onClick={closeForm}><X size={18} className="text-admin-text-muted" /></button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Имя *</label>
              <input value={form.name} onChange={e => setForm(f => f && ({ ...f, name: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Иван Иванов" />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Email *</label>
              <input type="email" value={form.email}
                onChange={e => setForm(f => f && ({ ...f, email: e.target.value }))}
                disabled={!!editId}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 disabled:bg-stone-50 disabled:text-stone-400" />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">
                Пароль {editId && <span className="text-admin-text-muted font-normal">(оставьте пустым, чтобы не менять)</span>}
              </label>
              <input type="password" value={form.password}
                onChange={e => setForm(f => f && ({ ...f, password: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder={editId ? '••••••••' : 'Минимум 8 символов'} />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Роль</label>
              <select value={form.role} onChange={e => setForm(f => f && ({ ...f, role: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300">
                {ROLES.filter(([r]) => r !== 'SUPERADMIN' || isSuperAdmin).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="ua" checked={form.isActive}
                onChange={e => setForm(f => f && ({ ...f, isActive: e.target.checked }))} className="rounded" />
              <label htmlFor="ua" className="text-admin-text text-sm">Активен (может входить)</label>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

          <div className="flex gap-2 mt-4">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
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
        ) : !canManage ? (
          <div className="p-8 text-center">
            <ShieldCheck size={32} className="text-admin-text-muted mx-auto mb-3" />
            <p className="text-admin-text-muted text-sm">Недостаточно прав. Управление пользователями доступно Администраторам и выше.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-admin-border bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Сотрудник</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Роль</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Добавлен</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-admin-text font-medium">{user.name}</p>
                    <p className="text-admin-text-muted text-xs">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleColor[user.role] ?? 'bg-stone-100 text-stone-600'}`}>
                      {ROLE_LABELS[user.role] ?? user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('ru')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${user.isActive ? 'text-green-700' : 'text-stone-400'}`}>
                      {user.isActive ? '● Активен' : '○ Заблокирован'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => openEdit(user)} className="p-1.5 text-admin-text-muted hover:text-admin-text transition-colors">
                        <Pencil size={14} />
                      </button>
                      {isSuperAdmin && (
                        <button onClick={() => setDeleteId(user.id)} className="p-1.5 text-admin-text-muted hover:text-red-500 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
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
            <h3 className="text-admin-text font-semibold mb-2">Удалить пользователя?</h3>
            <p className="text-admin-text-muted text-sm mb-5">Это действие нельзя отменить. Все данные пользователя будут удалены.</p>
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
