import { prisma } from '@/lib/db'
import { LogsClient } from './LogsClient'

export const dynamic = 'force-dynamic'

export default async function AdminLogsPage() {
  const [logs, users] = await Promise.all([
    prisma.activityLog.findMany({
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    }),
    prisma.user.findMany({ select: { id: true, name: true }, orderBy: { name: 'asc' } }),
  ])

  return <LogsClient logs={logs} users={users} />
}
