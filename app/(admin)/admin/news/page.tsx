import { getNewsArticles } from '@/lib/services/news.service'
import Link from 'next/link'
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default async function AdminNewsPage() {
  const articles = await getNewsArticles(false).catch(() => [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Новости</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{articles.length} статей</p>
        </div>
        <Link
          href="/admin/news/new"
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
        >
          <Plus size={16} />
          Добавить новость
        </Link>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-admin-border bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Заголовок</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Категория</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Дата</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-admin-text-muted">
                  Статей пока нет
                </td>
              </tr>
            ) : (
              articles.map((article) => (
                <tr key={article.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden">
                        {article.coverImageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={article.coverImageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">📰</div>
                        )}
                      </div>
                      <p className="text-admin-text font-medium line-clamp-1">{article.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted hidden md:table-cell">
                    {article.category?.name || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {article.isPublished ? (
                      <span className="flex items-center gap-1 text-green-700 text-xs">
                        <Eye size={12} /> Опубликована
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-stone-400 text-xs">
                        <EyeOff size={12} /> Черновик
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden md:table-cell">
                    {article.publishedAt ? formatDate(article.publishedAt, 'd MMM yyyy') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/news/${article.id}`}
                      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Edit2 size={14} />
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
