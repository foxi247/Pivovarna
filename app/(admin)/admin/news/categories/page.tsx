import { getNewsCategories } from '@/lib/services/news.service'
import { Plus, Edit2 } from 'lucide-react'

export default async function AdminNewsCategoriesPage() {
  const categories = await getNewsCategories(false)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Категории новостей</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{categories.length} категорий</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors">
          <Plus size={16} />
          Добавить категорию
        </button>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        {categories.length === 0 ? (
          <p className="text-center py-12 text-admin-text-muted text-sm">Категорий нет</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-admin-border bg-stone-50">
              <tr>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Название</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статей</th>
                <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3 text-admin-text font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden sm:table-cell">{cat.slug}</td>
                  <td className="px-4 py-3 text-admin-text-muted">
                    {(cat as typeof cat & { _count: { articles: number } })._count?.articles ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm">
                      <Edit2 size={14} />
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
