import { prisma } from '@/lib/db'
import { formatDateRelative } from '@/lib/utils'

export default async function AdminLogsPage() {
  const logs = await prisma.activityLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Журнал действий</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Последние 100 действий пользователей</p>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {logs.length === 0 ? (
          <p className="text-center py-12 text-admin-text-muted text-sm">Действий пока нет</p>
        ) : (
          <div className="divide-y divide-admin-border">
            {logs.map((log) => (
              <div key={log.id} className="px-5 py-3 flex items-start justify-between gap-4">
                <div>
                  <span className="text-admin-text text-sm font-medium">{log.user.name}</span>
                  <span className="text-admin-text-muted text-sm"> — {log.action}</span>
                  {log.entityId && (
                    <span className="text-admin-text-muted text-sm"> · {log.entity} #{log.entityId.slice(0, 8)}</span>
                  )}
                </div>
                <span className="text-admin-text-muted text-xs flex-shrink-0">{formatDateRelative(log.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
