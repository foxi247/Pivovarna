'use client'
import Link from 'next/link'
import { AnimatedSection } from '@/components/public/ui/AnimatedSection'
import { NewsCard } from '@/components/public/news/NewsCard'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import type { NewsArticle, NewsCategory } from '@prisma/client'

interface NewsSectionProps {
  articles: (NewsArticle & { category: NewsCategory | null })[]
}

export function NewsSection({ articles }: NewsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (articles.length === 0) return null

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir === 'right' ? 340 : -340, behavior: 'smooth' })
  }

  return (
    <section id="news" className="py-20 bg-[#1A1712]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <AnimatedSection>
              <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                Актуальное
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#F5EFE6] mt-3">
                Новости пивоварни
              </h2>
            </AnimatedSection>
          </div>

          <AnimatedSection delay={0.2}>
            <div className="flex items-center gap-3">
              {/* Scroll arrows */}
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-[#3D352B] flex items-center justify-center text-[#7A6C5E] hover:border-[#C8873A] hover:text-[#C8873A] transition-colors"
                aria-label="Назад"
              >
                <ArrowRight size={16} className="rotate-180" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-[#3D352B] flex items-center justify-center text-[#7A6C5E] hover:border-[#C8873A] hover:text-[#C8873A] transition-colors"
                aria-label="Вперёд"
              >
                <ArrowRight size={16} />
              </button>
              <Link
                href="/news"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C8873A] hover:bg-[#E8A855] text-[#0F0D0A] text-sm font-semibold rounded-md transition-colors"
              >
                Все новости
                <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedSection>
        </div>

        {/* Horizontal scrollable strip */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              className="flex-none w-[300px] sm:w-[340px] snap-start"
            >
              <NewsCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
