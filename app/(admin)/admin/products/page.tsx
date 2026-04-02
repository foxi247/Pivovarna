import { getProducts } from '@/lib/services/products.service'
import Link from 'next/link'
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'

export default async function AdminProductsPage() {
  const products = await getProducts(undefined, false)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Продукция</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{products.length} позиций</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors"
        >
          <Plus size={16} />
          Добавить продукт
        </Link>
      </div>

      <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-admin-border bg-stone-50">
            <tr>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Название</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden md:table-cell">Категория</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Характеристики</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Статус</th>
              <th className="text-left px-4 py-3 text-admin-text-muted font-medium text-xs uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-admin-text-muted">
                  Продуктов пока нет
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-stone-100 flex-shrink-0 overflow-hidden">
                        {product.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300 text-lg">🍺</div>
                        )}
                      </div>
                      <div>
                        <p className="text-admin-text font-medium">{product.name}</p>
                        <p className="text-admin-text-muted text-xs">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-admin-text-muted hidden md:table-cell">{product.category.name}</td>
                  <td className="px-4 py-3 text-admin-text-muted text-xs hidden lg:table-cell">
                    {[
                      product.alcoholContent && `${product.alcoholContent}% алк.`,
                      product.bitterness && `${product.bitterness} IBU`,
                    ].filter(Boolean).join(' · ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {product.isActive ? (
                        <span className="flex items-center gap-1 text-green-700 text-xs">
                          <Eye size={12} /> Опубликован
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-stone-400 text-xs">
                          <EyeOff size={12} /> Скрыт
                        </span>
                      )}
                      {product.isNew && <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-full">Новинка</span>}
                      {product.isPopular && <span className="bg-green-100 text-green-700 text-[10px] px-1.5 py-0.5 rounded-full">Хит</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}`}
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
