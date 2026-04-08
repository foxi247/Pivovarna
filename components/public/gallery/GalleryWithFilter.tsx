'use client'

import { useState } from 'react'
import type { GalleryItem, GalleryCategory } from '@prisma/client'

type Item = GalleryItem & { category: GalleryCategory | null }
type Cat = GalleryCategory & { _count: { items: number } }

interface Props {
  items: Item[]
  categories: Cat[]
}

export function GalleryWithFilter({ items, categories }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [lightbox, setLightbox] = useState<Item | null>(null)

  const filtered = active ? items.filter((i) => i.category?.slug === active) : items

  return (
    <>
      {/* Filter tabs */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-10">
          <button
            onClick={() => setActive(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              !active
                ? 'bg-[#C8873A] text-[#0F0D0A]'
                : 'bg-[#231F1A] text-[#B8A898] border border-[#3D352B] hover:text-[#F5EFE6]'
            }`}
          >
            Все фото
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                active === cat.slug
                  ? 'bg-[#C8873A] text-[#0F0D0A]'
                  : 'bg-[#231F1A] text-[#B8A898] border border-[#3D352B] hover:text-[#F5EFE6]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Masonry grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-[#4D4438]">Фотографии скоро появятся</div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid rounded-xl overflow-hidden bg-[#231F1A] group cursor-zoom-in"
              onClick={() => setLightbox(item)}
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

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightbox.imageUrl}
            alt={lightbox.title || ''}
            className="max-w-full max-h-full object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
          />
          {lightbox.title && (
            <p className="absolute bottom-6 left-0 right-0 text-center text-white/70 text-sm">{lightbox.title}</p>
          )}
        </div>
      )}
    </>
  )
}
