import { prisma } from '@/lib/db'
import { Eye, Newspaper, TrendingUp, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [
    totalViews,
    todayViews,
    weekViews,
    monthViews,
    totalArticleViews,
    topArticles,
    topPages,
    dailyStats,
  ] = await Promise.all([
    prisma.pageView.count(),
    prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
    prisma.pageView.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.articleView.count(),
    prisma.articleView.groupBy({
      by: ['articleId'],
      _count: { articleId: true },
      orderBy: { _count: { articleId: 'desc' } },
      take: 5,
    }),
    prisma.pageView.groupBy({
      by: ['path'],
      _count: { path: true },
      orderBy: { _count: { path: 'desc' } },
      take: 10,
    }),
    // Last 7 days
    prisma.$queryRaw<{ day: string; count: bigint }[]>`
      SELECT DATE(created_at) as day, COUNT(*) as count
      FROM page_views
      WHERE created_at >= ${weekStart}
      GROUP BY DATE(created_at)
      ORDER BY day ASC
    `,
  ])

  // Fetch article titles
  const articleIds = topArticles.map((a) => a.articleId)
  const articles = await prisma.newsArticle.findMany({
    where: { id: { in: articleIds } },
    select: { id: true, title: true, slug: true },
  })
  const articleMap = Object.fromEntries(articles.map((a) => [a.id, a]))

  const stats = [
    { label: 'Всего посещений', value: totalViews.toLocaleString('ru'), icon: Eye, color: 'bg-blue-50 text-blue-600' },
    { label: 'Сегодня', value: todayViews.toLocaleString('ru'), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'За 7 дней', value: weekViews.toLocaleString('ru'), icon: Users, color: 'bg-amber-50 text-amber-600' },
    { label: 'Прочтений новостей', value: totalArticleViews.toLocaleString('ru'), icon: Newspaper, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Аналитика</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Статистика посещений сайта</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border border-admin-border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              <s.icon size={18} />
            </div>
            <p className="text-2xl font-bold text-admin-text">{s.value}</p>
            <p className="text-admin-text-muted text-xs mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top pages */}
        <div className="bg-white border border-admin-border rounded-xl p-5">
          <h2 className="text-admin-text font-semibold mb-4">Популярные страницы</h2>
          {topPages.length === 0 ? (
            <p className="text-admin-text-muted text-sm">Нет данных</p>
          ) : (
            <div className="space-y-2">
              {topPages.map((p) => (
                <div key={p.path} className="flex items-center justify-between py-2 border-b border-admin-border last:border-0">
                  <span className="text-admin-text text-sm font-mono truncate max-w-[200px]">{p.path}</span>
                  <span className="text-admin-text-muted text-sm font-medium">{Number(p._count.path)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top articles */}
        <div className="bg-white border border-admin-border rounded-xl p-5">
          <h2 className="text-admin-text font-semibold mb-4">Топ статей по прочтениям</h2>
          {topArticles.length === 0 ? (
            <p className="text-admin-text-muted text-sm">Нет данных</p>
          ) : (
            <div className="space-y-2">
              {topArticles.map((a) => {
                const article = articleMap[a.articleId]
                return (
                  <div key={a.articleId} className="flex items-center justify-between py-2 border-b border-admin-border last:border-0">
                    <span className="text-admin-text text-sm truncate max-w-[200px]">
                      {article?.title ?? a.articleId}
                    </span>
                    <span className="text-admin-text-muted text-sm font-medium">{Number(a._count.articleId)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daily chart (text) */}
      {dailyStats.length > 0 && (
        <div className="mt-6 bg-white border border-admin-border rounded-xl p-5">
          <h2 className="text-admin-text font-semibold mb-4">Посещения за последние 7 дней</h2>
          <div className="flex items-end gap-2 h-32">
            {dailyStats.map((d) => {
              const count = Number(d.count)
              const max = Math.max(...dailyStats.map((x) => Number(x.count)), 1)
              const height = Math.round((count / max) * 100)
              return (
                <div key={String(d.day)} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-admin-text-muted">{count}</span>
                  <div
                    className="w-full bg-amber-400 rounded-t"
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                  <span className="text-[9px] text-admin-text-muted">
                    {new Date(String(d.day)).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
