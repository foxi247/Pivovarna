import { getGalleryItems, getGalleryCategories } from '@/lib/services/settings.service'
import { GalleryWithFilter } from '@/components/public/gallery/GalleryWithFilter'
import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Галерея',
  description: 'Фотогалерея Дербентской пивоварни. Производство, продукция, мероприятия.',
}

export default async function GalleryPage() {
  const [items, categories] = await Promise.all([
    getGalleryItems(),
    getGalleryCategories(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Фотографии</span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">Галерея</h1>
        </div>

        <GalleryWithFilter items={items} categories={categories} />
      </div>
    </div>
  )
}
