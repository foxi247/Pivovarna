'use client'
import Link from 'next/link'
import { AnimatedSection } from '@/components/public/ui/AnimatedSection'
import { ArrowRight } from 'lucide-react'
import type { GalleryItem } from '@prisma/client'

interface GallerySectionProps {
  items: GalleryItem[]
}

export function GallerySection({ items }: GallerySectionProps) {
  if (items.length === 0) return null

  const preview = items.slice(0, 6)

  return (
    <section id="gallery" className="py-28 bg-[#0F0D0A]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <AnimatedSection>
              <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                Фотогалерея
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#F5EFE6] mt-3">
                Жизнь пивоварни
              </h2>
            </AnimatedSection>
          </div>
          <AnimatedSection delay={0.2}>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-[#C8873A] hover:text-[#E8A855] text-sm font-semibold transition-colors group"
            >
              Смотреть всё
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {preview.map((item, i) => (
            <AnimatedSection key={item.id} delay={i * 0.05} className={i === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
              <Link
                href="/gallery"
                className="group block aspect-square overflow-hidden rounded-xl bg-[#231F1A] relative"
              >
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.thumbUrl || item.imageUrl}
                    alt={item.title || 'Галерея'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl opacity-20">📷</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Просмотр</span>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
