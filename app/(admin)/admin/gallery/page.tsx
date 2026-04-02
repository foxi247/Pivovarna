import { getGalleryItems, getGalleryCategories } from '@/lib/services/settings.service'
import { Plus, Eye, EyeOff, Trash2 } from 'lucide-react'

export default async function AdminGalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(undefined, false),
    getGalleryCategories(false),
  ])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Галерея</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">{items.length} фотографий</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 transition-colors">
          <Plus size={16} />
          Загрузить фото
        </button>
      </div>

      {items.length === 0 ? (
        <div className="bg-white border border-admin-border rounded-xl py-20 text-center">
          <p className="text-admin-text-muted">Фотографий пока нет</p>
          <p className="text-admin-text-muted text-sm mt-1">Загрузите первое фото, чтобы начать</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div key={item.id} className="group relative rounded-xl overflow-hidden bg-stone-100 aspect-square border border-admin-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.thumbUrl || item.imageUrl}
                alt={item.title || ''}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-stone-100 transition-colors">
                  {item.isActive ? (
                    <EyeOff size={14} className="text-stone-700" />
                  ) : (
                    <Eye size={14} className="text-stone-700" />
                  )}
                </button>
                <button className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Trash2 size={14} className="text-white" />
                </button>
              </div>
              {!item.isActive && (
                <div className="absolute top-2 right-2 bg-stone-700/80 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Скрыт
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
