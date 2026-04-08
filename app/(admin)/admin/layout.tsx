import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/layout/AdminSidebar'
import { getNewLeadsCount } from '@/lib/services/leads.service'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const newLeadsCount = await getNewLeadsCount().catch(() => 0)
  const userRole = (session.user as { role?: string }).role ?? 'CONTENT_EDITOR'

  return (
    <div className="flex h-screen bg-admin-bg overflow-hidden">
      <AdminSidebar newLeadsCount={newLeadsCount} userRole={userRole} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pt-14 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  )
}
