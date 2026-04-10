'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { formatDate, LEAD_TYPE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import { Search, Filter, RefreshCw, ExternalLink } from 'lucide-react'

interface Lead {
  id: string
  name: string
  company: string | null
  type: string
  status: string
  phone: string | null
  email: string | null
  isRead: boolean
  createdAt: string
  assignedTo: { name: string } | null
}

interface LeadsResponse {
  leads: Lead[]
  total: number
  pages: number
}

const POLL_INTERVAL = 30_000 // 30 seconds

export default function LeadsPage() {
  const [data, setData] = useState<LeadsResponse>({ leads: [], total: 0, pages: 1 })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [newCount, setNewCount] = useState(0)

  // Filters
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  const fetchLeads = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (status) params.set('status', status)
      if (type) params.set('type', type)
      params.set('page', String(page))
      params.set('limit', '25')

      const res = await fetch(`/api/admin/leads?${params}`)
      if (res.ok) {
        const newData = await res.json()
        setData(prev => {
          // Detect new leads since last fetch
          const prevIds = new Set(prev.leads.map(l => l.id))
          const incoming = newData.leads.filter((l: Lead) => !prevIds.has(l.id) && !l.isRead)
          if (incoming.length > 0 && !loading) setNewCount(c => c + incoming.length)
          return newData
        })
      }
    } catch { /* silent */ }
    setLoading(false)
    setRefreshing(false)
  }, [search, status, type, page, loading])

  // Initial load
  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  // Polling
  useEffect(() => {
    const id = setInterval(() => fetchLeads(), POLL_INTERVAL)
    return () => clearInterval(id)
  }, [fetchLeads])

  function applyFilters(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchLeads(true)
  }

  function resetFilters() {
    setSearch('')
    setStatus('')
    setType('')
    setPage(1)
    setNewCount(0)
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-admin-text text-2xl font-semibold">Заявки</h1>
            <p className="text-admin-text-muted text-sm mt-0.5">Всего: {data.total}</p>
          </div>
          {newCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium px-2.5 py-1 rounded-full animate-pulse">
              +{newCount} новых
            </span>
          )}
        </div>
        <button
          onClick={() => { setNewCount(0); fetchLeads(true) }}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-admin-text-muted hover:text-admin-text text-sm transition-colors"
          title="Обновить"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Обновить
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-admin-border rounded-xl p-4 mb-4">
        <form onSubmit={applyFilters} className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск по имени, email, телефону..."
              className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>

          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          >
            <option value="">Все статусы</option>
            <option value="NEW">Новые</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="WAITING">Ожидает ответа</option>
            <option value="CLOSED">Закрытые</option>
            <option value="REJECTED">Отклонённые</option>
          </select>

          <select
            value={type}
            onChange={e => setType(e.target.value)}
            className="border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
          >
            <option value="">Все типы</option>
            {Object.entries(LEAD_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
          >
            <Filter size={14} />
            Применить
          </button>

          {(status || type || search) && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center px-4 py-2 border border-admin-border text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition-colors"
            >
              Сбросить
            </button>
          )}
        </form>
      </div>

      {/* Table */}
      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-admin-border bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Имя</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Тип</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Контакт</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Ответственный</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Дата</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-admin-text-muted">Загрузка...</td>
              </tr>
            ) : data.leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-admin-text-muted">Заявки не найдены</td>
              </tr>
            ) : (
              data.leads.map((lead) => (
                <tr key={lead.id} className={`hover:bg-stone-50 transition-colors ${!lead.isRead ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {!lead.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-admin-text">{lead.name}</p>
                        {lead.company && (
                          <p className="text-admin-text-muted text-xs">{lead.company}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted">
                    {LEAD_TYPE_LABELS[lead.type] ?? lead.type}
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted hidden md:table-cell">
                    {lead.phone || lead.email || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEAD_STATUS_COLORS[lead.status] ?? 'bg-stone-100 text-stone-600'}`}>
                      {LEAD_STATUS_LABELS[lead.status] ?? lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden lg:table-cell">
                    {lead.assignedTo?.name ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden md:table-cell">
                    {formatDate(lead.createdAt, 'd MMM yyyy')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${lead.id}`}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors whitespace-nowrap"
                    >
                      <ExternalLink size={12} />
                      Открыть
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {data.pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
            <p className="text-admin-text-muted text-sm">
              Страница {page} из {data.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1.5 border border-admin-border rounded-md text-sm hover:bg-stone-50 transition-colors disabled:opacity-40"
              >
                ←
              </button>
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page >= data.pages}
                className="px-3 py-1.5 border border-admin-border rounded-md text-sm hover:bg-stone-50 transition-colors disabled:opacity-40"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-admin-text-muted text-xs mt-3 text-right">
        Автообновление каждые 30 секунд
      </p>
    </div>
  )
}
