import { getGalleryItems, getGalleryCategories } from '@/lib/services/settings.service'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Галерея',
  description: 'Фотогалерея Дербентской пивоварни. Производство, продукция, мероприятия.',
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const [items, categories] = await Promise.all([
    getGalleryItems(searchParams.category),
    getGalleryCategories(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Фотографии</span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">Галерея</h1>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-10">
            <a
              href="/gallery"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchParams.category
                  ? 'bg-[#C8873A] text-[#0F0D0A]'
                  : 'bg-[#231F1A] text-[#B8A898] border border-[#3D352B]'
              }`}
            >
              Все фото
            </a>
            {categories.map((cat) => (
              <a
                key={cat.id}
                href={`/gallery?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  searchParams.category === cat.slug
                    ? 'bg-[#C8873A] text-[#0F0D0A]'
                    : 'bg-[#231F1A] text-[#B8A898] border border-[#3D352B]'
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center py-20 text-[#4D4438]">Фотографии скоро появятся</div>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="break-inside-avoid rounded-xl overflow-hidden bg-[#231F1A] group cursor-zoom-in"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.thumbUrl || item.imageUrl}
                  alt={item.title || 'Галерея'}
                  className="w-full block transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
