import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import type { NewsArticle, NewsCategory } from '@prisma/client'

interface NewsCardProps {
  article: NewsArticle & { category: NewsCategory | null }
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group block bg-[#1A1712] border border-[#3D352B] rounded-xl overflow-hidden hover:border-[#C8873A]/40 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover */}
      <div className="aspect-video bg-[#231F1A] overflow-hidden">
        {article.coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.coverImageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-20">📰</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          {article.category && (
            <span className="text-[#C8873A] text-[10px] font-semibold tracking-widest uppercase">
              {article.category.name}
            </span>
          )}
          <span className="text-[#4D4438] text-[10px]">
            {article.publishedAt ? formatDate(article.publishedAt) : ''}
          </span>
        </div>

        <h3 className="font-display text-[#F5EFE6] font-semibold text-lg leading-tight mb-2 group-hover:text-[#C8873A] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-[#7A6C5E] text-sm line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}
