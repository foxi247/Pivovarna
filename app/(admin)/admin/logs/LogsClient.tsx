'use client'

import { useState, useMemo } from 'react'
import { Search, X } from 'lucide-react'

interface LogEntry {
  id: string
  action: string
  entity: string
  entityId: string | null
  createdAt: string | Date
  user: { id: string; name: string }
}

const ACTION_LABELS: Record<string, string> = {
  UPDATE_NEWS: 'Обновил новость',
  DELETE_NEWS: 'Удалил новость',
  CREATE_NEWS: 'Создал новость',
  UPDATE_PRODUCT: 'Обновил продукт',
  DELETE_PRODUCT: 'Удалил продукт',
  CREATE_PRODUCT: 'Создал продукт',
  UPDATE_SETTINGS: 'Обновил настройки',
  UPDATE_LEAD: 'Обновил заявку',
}

function relativeTime(date: string | Date) {
  const d = new Date(date)
  const now = Date.now()
  const diff = now - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'только что'
  if (mins < 60) return `${mins} мин. назад`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ч. назад`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} дн. назад`
  return d.toLocaleDateString('ru', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function LogsClient({ logs, users }: { logs: LogEntry[]; users: { id: string; name: string }[] }) {
  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    const from = dateFrom ? new Date(dateFrom).getTime() : 0
    const to = dateTo ? new Date(dateTo + 'T23:59:59').getTime() : Infinity

    return logs.filter((log) => {
      const ts = new Date(log.createdAt).getTime()
      if (ts < from || ts > to) return false
      if (userFilter && log.user.id !== userFilter) return false
      if (q && !log.action.toLowerCase().includes(q) && !log.user.name.toLowerCase().includes(q) && !log.entity.toLowerCase().includes(q)) return false
      return true
    })
  }, [logs, search, userFilter, dateFrom, dateTo])

  function clearFilters() {
    setSearch('')
    setUserFilter('')
    setDateFrom('')
    setDateTo('')
  }

  const hasFilters = search || userFilter || dateFrom || dateTo

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Журнал действий</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{filtered.length} из {logs.length} записей</p>
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-admin-text-muted hover:text-admin-text text-sm transition-colors">
            <X size={14} />
            Сбросить фильтры
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-muted" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Поиск по действию..."
            className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          />
        </div>
        <select
          value={userFilter}
          onChange={e => setUserFilter(e.target.value)}
          className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
        >
          <option value="">Все пользователи</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          placeholder="С даты"
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          placeholder="По дату"
        />
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-center py-12 text-admin-text-muted text-sm">
            {hasFilters ? 'Нет записей по заданным фильтрам' : 'Действий пока нет'}
          </p>
        ) : (
          <div className="divide-y divide-admin-border">
            {filtered.map((log) => (
              <div key={log.id} className="px-5 py-3 flex items-start justify-between gap-4 hover:bg-stone-50 transition-colors">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-admin-text text-sm font-medium">{log.user.name}</span>
                    <span className="text-admin-text-muted text-sm">
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </div>
                  {log.entityId && (
                    <span className="text-admin-text-muted text-xs">{log.entity} · {log.entityId.slice(0, 8)}…</span>
                  )}
                </div>
                <span className="text-admin-text-muted text-xs flex-shrink-0 tabular-nums">
                  {relativeTime(log.createdAt)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
