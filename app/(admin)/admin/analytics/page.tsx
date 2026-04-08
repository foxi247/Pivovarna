import { prisma } from '@/lib/db'
import { Eye, Newspaper, TrendingUp, Calendar } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - 7)

  let data = {
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    totalArticleViews: 0,
    topPages: [] as { path: string; _count: { path: number } }[],
    topArticles: [] as { articleId: string; _count: { articleId: number } }[],
    dailyStats: [] as { day: string; count: number }[],
    articleMap: {} as Record<string, { id: string; title: string; slug: string }>,
    dbError: false,
    dbErrorMsg: '',
  }

  try {
    const [
      totalViews,
      todayViews,
      weekViews,
      totalArticleViews,
      topArticlesRaw,
      topPages,
    ] = await Promise.all([
      prisma.pageView.count(),
      prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.pageView.count({ where: { createdAt: { gte: weekStart } } }),
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
    ])

    const articleIds = topArticlesRaw.map((a) => a.articleId)
    const articles = articleIds.length > 0
      ? await prisma.newsArticle.findMany({
          where: { id: { in: articleIds } },
          select: { id: true, title: true, slug: true },
        })
      : []

    // Raw SQL отдельно — если упадёт, остальные данные всё равно покажутся
    let dailyStats: { day: string; count: number }[] = []
    try {
      const rawDailyStats = await prisma.$queryRaw<{ day: unknown; count: unknown }[]>`
        SELECT DATE(created_at) as day, COUNT(*) as count
        FROM page_views
        WHERE created_at >= ${weekStart}
        GROUP BY DATE(created_at)
        ORDER BY day ASC
      `
      dailyStats = rawDailyStats.map((d) => ({
        day: d.day instanceof Date
          ? d.day.toISOString().slice(0, 10)
          : String(d.day).slice(0, 10),
        count: Number(d.count),
      }))
    } catch (rawErr) {
      console.error('[Analytics] $queryRaw error:', rawErr)
    }

    data = {
      totalViews,
      todayViews,
      weekViews,
      totalArticleViews,
      topPages,
      topArticles: topArticlesRaw,
      dailyStats,
      articleMap: Object.fromEntries(articles.map((a) => [a.id, a])),
      dbError: false,
      dbErrorMsg: '',
    }
  } catch (err) {
    console.error('[Analytics] DB error:', err)
    data.dbError = true
    data.dbErrorMsg = err instanceof Error ? err.message : String(err)
  }

  const stats = [
    { label: 'Всего посещений', value: data.totalViews.toLocaleString('ru'), icon: Eye, color: 'bg-blue-50 text-blue-600' },
    { label: 'Сегодня', value: data.todayViews.toLocaleString('ru'), icon: TrendingUp, color: 'bg-green-50 text-green-600' },
    { label: 'За 7 дней', value: data.weekViews.toLocaleString('ru'), icon: Calendar, color: 'bg-amber-50 text-amber-600' },
    { label: 'Прочтений статей', value: data.totalArticleViews.toLocaleString('ru'), icon: Newspaper, color: 'bg-purple-50 text-purple-600' },
  ]

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Аналитика</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Статистика посещений сайта</p>
      </div>

      {data.dbError && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-amber-800 text-sm space-y-1">
          <p><strong>Ошибка загрузки аналитики.</strong> Вероятно, таблицы <code className="bg-amber-100 px-1 rounded">page_views</code> / <code className="bg-amber-100 px-1 rounded">article_views</code> отсутствуют в БД.</p>
          {data.dbErrorMsg && (
            <p className="font-mono text-xs break-all">{data.dbErrorMsg}</p>
          )}
          <p>Зайдите в Supabase → SQL Editor и выполните SQL из файла <code className="bg-amber-100 px-1 rounded">prisma/create-analytics-tables.sql</code></p>
        </div>
      )}

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

      {!data.dbError && (
        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top pages */}
            <div className="bg-white border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text font-semibold mb-4">Популярные страницы</h2>
              {data.topPages.length === 0 ? (
                <p className="text-admin-text-muted text-sm">Нет данных — ждём первых посетителей</p>
              ) : (
                <div className="space-y-2">
                  {data.topPages.map((p) => (
                    <div key={p.path} className="flex items-center justify-between py-2 border-b border-admin-border last:border-0">
                      <span className="text-admin-text text-sm font-mono truncate max-w-[200px]">{p.path}</span>
                      <span className="text-admin-text-muted text-sm font-medium tabular-nums">{p._count.path}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top articles */}
            <div className="bg-white border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text font-semibold mb-4">Топ статей по прочтениям</h2>
              {data.topArticles.length === 0 ? (
                <p className="text-admin-text-muted text-sm">Нет данных</p>
              ) : (
                <div className="space-y-2">
                  {data.topArticles.map((a) => {
                    const article = data.articleMap[a.articleId]
                    return (
                      <div key={a.articleId} className="flex items-center justify-between py-2 border-b border-admin-border last:border-0">
                        <span className="text-admin-text text-sm truncate max-w-[200px]">
                          {article?.title ?? 'Удалённая статья'}
                        </span>
                        <span className="text-admin-text-muted text-sm font-medium tabular-nums">{a._count.articleId}</span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Daily bar chart */}
          {data.dailyStats.length > 0 && (
            <div className="mt-6 bg-white border border-admin-border rounded-xl p-5">
              <h2 className="text-admin-text font-semibold mb-4">Посещения за 7 дней</h2>
              <div className="flex items-end gap-2 h-32">
                {data.dailyStats.map((d) => {
                  const max = Math.max(...data.dailyStats.map((x) => x.count), 1)
                  const height = Math.round((d.count / max) * 100)
                  return (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-admin-text-muted tabular-nums">{d.count}</span>
                      <div
                        className="w-full bg-amber-400 rounded-t transition-all"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <span className="text-[9px] text-admin-text-muted">
                        {new Date(d.day + 'T00:00:00').toLocaleDateString('ru', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
