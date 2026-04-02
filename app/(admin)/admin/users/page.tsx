import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { formatDate, ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@prisma/client'
import { UserPlus } from 'lucide-react'

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'asc' } }),
    auth(),
  ])

  const canManage = session?.user?.role === 'SUPERADMIN' || session?.user?.role === 'ADMIN'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Пользователи</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{users.length} сотрудников</p>
        </div>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-admin-border bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Сотрудник</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Роль</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Добавлен</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="text-admin-text font-medium">{user.name}</p>
                    <p className="text-admin-text-muted text-xs">{user.email}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-full font-medium">
                    {ROLE_LABELS[user.role as UserRole] ?? user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-admin-text-muted text-xs hidden md:table-cell">
                  {formatDate(user.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${user.isActive ? 'text-green-700' : 'text-stone-400'}`}>
                    {user.isActive ? '● Активен' : '○ Заблокирован'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-xl p-4">
        Для добавления новых пользователей или изменения их ролей обратитесь к разработчику или используйте Prisma Studio.
      </div>
    </div>
  )
}
