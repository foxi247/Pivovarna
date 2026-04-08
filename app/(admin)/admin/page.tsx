import { auth } from '@/lib/auth'
import { getLeadsStats } from '@/lib/services/leads.service'
import { getLeads } from '@/lib/services/leads.service'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { formatDateRelative, LEAD_TYPE_LABELS, LEAD_STATUS_LABELS, LEAD_STATUS_COLORS } from '@/lib/utils'
import { Inbox, TrendingUp, CheckCircle, Clock, PlusCircle, ExternalLink } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await auth()

  let stats = { newCount: 0, todayCount: 0, inProgress: 0, closed: 0, total: 0 }
  let recentLeads: Awaited<ReturnType<typeof getLeads>>['leads'] = []
  let productsCount = 0
  let newsCount = 0

  try {
    const [statsRes, leadsRes, pCount, nCount] = await Promise.all([
      getLeadsStats(),
      getLeads({ limit: 5 }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.newsArticle.count({ where: { isPublished: true } }),
    ])
    stats = statsRes
    recentLeads = leadsRes.leads
    productsCount = pCount
    newsCount = nCount
  } catch {
    // БД недоступна — показываем нули
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Доброе утро'
    if (h < 17) return 'Добрый день'
    return 'Добрый вечер'
  }

  return (
    <div className="p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-admin-text text-2xl font-semibold">
          {greeting()}{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="text-admin-text-muted text-sm mt-1">
          Вот что происходит на сайте сегодня
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/leads?status=NEW" className="bg-white border border-admin-border rounded-xl p-5 hover:shadow-admin-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-admin-text-muted text-sm">Новые заявки</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Inbox size={16} className="text-blue-600" />
            </div>
          </div>
          <p className="text-admin-text text-3xl font-bold">{stats.newCount}</p>
          <p className="text-admin-text-muted text-xs mt-1">Сегодня: {stats.todayCount}</p>
        </Link>

        <Link href="/admin/leads?status=IN_PROGRESS" className="bg-white border border-admin-border rounded-xl p-5 hover:shadow-admin-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-admin-text-muted text-sm">В работе</p>
            <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Clock size={16} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-admin-text text-3xl font-bold">{stats.inProgress}</p>
        </Link>

        <Link href="/admin/leads?status=CLOSED" className="bg-white border border-admin-border rounded-xl p-5 hover:shadow-admin-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-admin-text-muted text-sm">Закрыто</p>
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <CheckCircle size={16} className="text-green-600" />
            </div>
          </div>
          <p className="text-admin-text text-3xl font-bold">{stats.closed}</p>
        </Link>

        <Link href="/admin/leads" className="bg-white border border-admin-border rounded-xl p-5 hover:shadow-admin-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <p className="text-admin-text-muted text-sm">Всего заявок</p>
            <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center">
              <TrendingUp size={16} className="text-stone-600" />
            </div>
          </div>
          <p className="text-admin-text text-3xl font-bold">{stats.total}</p>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2 bg-white border border-admin-border rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-admin-border">
            <h2 className="text-admin-text font-semibold">Последние заявки</h2>
            <Link href="/admin/leads" className="text-blue-600 text-sm hover:underline">
              Все заявки
            </Link>
          </div>
          <div className="divide-y divide-admin-border">
            {recentLeads.length === 0 ? (
              <p className="px-6 py-8 text-center text-admin-text-muted text-sm">
                Заявок пока нет
              </p>
            ) : (
              recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between px-6 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="text-admin-text text-sm font-medium">{lead.name}</p>
                    <p className="text-admin-text-muted text-xs mt-0.5">
                      {LEAD_TYPE_LABELS[lead.type]} · {formatDateRelative(lead.createdAt)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${LEAD_STATUS_COLORS[lead.status]}`}>
                    {LEAD_STATUS_LABELS[lead.status]}
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="space-y-4">
          <div className="bg-white border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text font-semibold mb-4">Быстрые действия</h2>
            <div className="space-y-2">
              {[
                { href: '/admin/news/new', label: 'Добавить новость', icon: PlusCircle },
                { href: '/admin/products/new', label: 'Добавить продукт', icon: PlusCircle },
                { href: '/admin/gallery', label: 'Загрузить фото', icon: PlusCircle },
              ].map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors text-sm text-admin-text-muted hover:text-admin-text"
                >
                  <Icon size={15} className="text-stone-400" />
                  {label}
                </Link>
              ))}
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors text-sm text-admin-text-muted hover:text-admin-text"
              >
                <ExternalLink size={15} className="text-stone-400" />
                Открыть сайт
              </Link>
            </div>
          </div>

          <div className="bg-white border border-admin-border rounded-xl p-5">
            <h2 className="text-admin-text font-semibold mb-3">Статистика сайта</h2>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-admin-text-muted">Активных продуктов</span>
                <span className="text-admin-text font-medium">{productsCount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-admin-text-muted">Опубликованных новостей</span>
                <span className="text-admin-text font-medium">{newsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
