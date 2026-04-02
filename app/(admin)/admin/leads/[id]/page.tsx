import { notFound } from 'next/navigation'
import { getLeadById } from '@/lib/services/leads.service'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatDate, formatDateRelative, LEAD_TYPE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, Building } from 'lucide-react'
import { LeadActions } from '@/components/admin/crm/LeadActions'

export default async function LeadPage({ params }: { params: { id: string } }) {
  const [lead, session] = await Promise.all([
    getLeadById(params.id),
    auth(),
  ])
  if (!lead) notFound()

  await prisma.lead.update({ where: { id: lead.id }, data: { isRead: true } })

  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
  })

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/leads" className="text-admin-text-muted hover:text-admin-text transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="text-admin-text text-xl font-semibold">Заявка от {lead.name}</h1>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${LEAD_STATUS_COLORS[lead.status]}`}>
          {LEAD_STATUS_LABELS[lead.status]}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Contact card */}
          <div className="bg-white border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text font-semibold mb-4 text-sm uppercase tracking-wider text-admin-text-muted">
              Данные клиента
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-admin-text-muted text-xs mb-1">Имя</p>
                <p className="text-admin-text font-medium">{lead.name}</p>
              </div>
              {lead.company && (
                <div>
                  <p className="text-admin-text-muted text-xs mb-1">Компания</p>
                  <div className="flex items-center gap-1.5">
                    <Building size={14} className="text-stone-400" />
                    <p className="text-admin-text">{lead.company}</p>
                  </div>
                </div>
              )}
              {lead.phone && (
                <div>
                  <p className="text-admin-text-muted text-xs mb-1">Телефон</p>
                  <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                    <Phone size={14} />
                    {lead.phone}
                  </a>
                </div>
              )}
              {lead.email && (
                <div>
                  <p className="text-admin-text-muted text-xs mb-1">Email</p>
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-blue-600 hover:underline">
                    <Mail size={14} />
                    {lead.email}
                  </a>
                </div>
              )}
              <div>
                <p className="text-admin-text-muted text-xs mb-1">Тип заявки</p>
                <p className="text-admin-text">{LEAD_TYPE_LABELS[lead.type]}</p>
              </div>
              <div>
                <p className="text-admin-text-muted text-xs mb-1">Источник</p>
                <p className="text-admin-text text-sm">{lead.source || '—'}</p>
              </div>
              <div>
                <p className="text-admin-text-muted text-xs mb-1">Дата создания</p>
                <p className="text-admin-text text-sm">{formatDate(lead.createdAt, 'd MMMM yyyy, HH:mm')}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="bg-white border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text-muted font-semibold mb-3 text-sm uppercase tracking-wider">
                Сообщение клиента
              </h2>
              <p className="text-admin-text leading-relaxed whitespace-pre-wrap">{lead.message}</p>
            </div>
          )}

          {/* History */}
          {lead.statusHistory.length > 0 && (
            <div className="bg-white border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text-muted font-semibold mb-4 text-sm uppercase tracking-wider">
                История изменений
              </h2>
              <div className="space-y-3">
                {lead.statusHistory.map((h) => (
                  <div key={h.id} className="flex gap-3 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 flex-shrink-0" />
                    <div>
                      <span className="text-admin-text">{h.changedBy.name}</span>
                      <span className="text-admin-text-muted"> изменил статус на </span>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${LEAD_STATUS_COLORS[h.toStatus]}`}>
                        {LEAD_STATUS_LABELS[h.toStatus]}
                      </span>
                      {h.comment && <p className="text-admin-text-muted mt-0.5">{h.comment}</p>}
                      <p className="text-admin-text-muted text-xs mt-0.5">{formatDateRelative(h.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="bg-white border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text-muted font-semibold mb-4 text-sm uppercase tracking-wider">
              Комментарии команды
            </h2>
            {lead.comments.length === 0 ? (
              <p className="text-admin-text-muted text-sm">Комментариев пока нет</p>
            ) : (
              <div className="space-y-4 mb-4">
                {lead.comments.map((c) => (
                  <div key={c.id} className="bg-stone-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-admin-text text-sm font-medium">{c.author.name}</span>
                      <span className="text-admin-text-muted text-xs">{formatDateRelative(c.createdAt)}</span>
                    </div>
                    <p className="text-admin-text text-sm whitespace-pre-wrap">{c.text}</p>
                  </div>
                ))}
              </div>
            )}
            <LeadActions
              leadId={lead.id}
              currentStatus={lead.status}
              currentAssigneeId={lead.assignedToId ?? undefined}
              users={users}
              userId={session?.user?.id ?? ''}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text-muted font-semibold mb-4 text-sm uppercase tracking-wider">
              Управление
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-admin-text-muted text-xs mb-1.5">Статус</p>
                <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${LEAD_STATUS_COLORS[lead.status]}`}>
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </div>
              <div>
                <p className="text-admin-text-muted text-xs mb-1.5">Ответственный</p>
                <p className="text-admin-text text-sm">{lead.assignedTo?.name || 'Не назначен'}</p>
              </div>
              <div>
                <p className="text-admin-text-muted text-xs mb-1.5">Последнее обновление</p>
                <p className="text-admin-text text-sm">{formatDateRelative(lead.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
