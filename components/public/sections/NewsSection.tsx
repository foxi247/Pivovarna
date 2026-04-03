'use client'
import Link from 'next/link'
import { AnimatedSection, StaggerContainer, staggerItem } from '@/components/public/ui/AnimatedSection'
import { NewsCard } from '@/components/public/news/NewsCard'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { NewsArticle, NewsCategory } from '@prisma/client'

interface NewsSectionProps {
  articles: (NewsArticle & { category: NewsCategory | null })[]
}

export function NewsSection({ articles }: NewsSectionProps) {
  if (articles.length === 0) return null

  return (
    <section id="news" className="py-28 bg-[#1A1712]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
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
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[#C8873A] hover:text-[#E8A855] text-sm font-semibold transition-colors group"
            >
              Все новости
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => (
            <motion.div key={article.id} variants={staggerItem}>
              <NewsCard article={article} />
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
