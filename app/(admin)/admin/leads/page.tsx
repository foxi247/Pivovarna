import { getLeads } from '@/lib/services/leads.service'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatDate, LEAD_TYPE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import type { LeadStatus, LeadType } from '@prisma/client'
import { Search, Filter } from 'lucide-react'

interface PageProps {
  searchParams: {
    status?: string
    type?: string
    search?: string
    page?: string
  }
}

export default async function LeadsPage({ searchParams }: PageProps) {
  const page = parseInt(searchParams.page || '1')
  const { leads, total, pages } = await getLeads({
    status: searchParams.status as LeadStatus | undefined,
    type: searchParams.type as LeadType | undefined,
    search: searchParams.search,
    page,
    limit: 25,
  })

  const users = await prisma.user.findMany({ select: { id: true, name: true } })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Заявки</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">Всего: {total}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-admin-border rounded-xl p-4 mb-4">
        <form className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              name="search"
              defaultValue={searchParams.search}
              placeholder="Поиск по имени, email, телефону..."
              className="w-full pl-9 pr-3 py-2 border border-admin-border rounded-lg text-sm text-admin-text focus:outline-none focus:ring-2 focus:ring-stone-300"
            />
          </div>

          <select
            name="status"
            defaultValue={searchParams.status || ''}
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
            name="type"
            defaultValue={searchParams.type || ''}
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

          {(searchParams.status || searchParams.type || searchParams.search) && (
            <a
              href="/admin/leads"
              className="flex items-center px-4 py-2 border border-admin-border text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition-colors"
            >
              Сбросить
            </a>
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
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-admin-text-muted">
                  Заявки не найдены
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-2 hover:text-blue-600">
                      {!lead.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <span className="font-medium text-admin-text">{lead.name}</span>
                      {lead.company && (
                        <span className="text-admin-text-muted text-xs hidden lg:inline">({lead.company})</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted">
                    {LEAD_TYPE_LABELS[lead.type]}
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted hidden md:table-cell">
                    {lead.phone || lead.email || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEAD_STATUS_COLORS[lead.status]}`}>
                      {LEAD_STATUS_LABELS[lead.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden lg:table-cell">
                    {lead.assignedTo?.name || '—'}
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden md:table-cell">
                    {formatDate(lead.createdAt, 'd MMM yyyy')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-admin-border">
            <p className="text-admin-text-muted text-sm">
              Страница {page} из {pages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <a
                  href={`?page=${page - 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-3 py-1.5 border border-admin-border rounded-md text-sm hover:bg-stone-50 transition-colors"
                >
                  ←
                </a>
              )}
              {page < pages && (
                <a
                  href={`?page=${page + 1}${searchParams.status ? `&status=${searchParams.status}` : ''}`}
                  className="px-3 py-1.5 border border-admin-border rounded-md text-sm hover:bg-stone-50 transition-colors"
                >
                  →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
