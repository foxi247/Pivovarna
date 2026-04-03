import { notFound } from 'next/navigation'
import { getNewsArticleBySlug } from '@/lib/services/news.service'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 300
export const dynamicParams = true

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getNewsArticleBySlug(params.slug)
  if (!article) return {}
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt ?? '',
    openGraph: article.coverImageUrl ? { images: [article.coverImageUrl] } : {},
  }
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const article = await getNewsArticleBySlug(params.slug)
  if (!article || !article.isPublished) notFound()

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-[#7A6C5E] hover:text-[#C8873A] text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Все новости
        </Link>

        {article.coverImageUrl && (
          <div className="rounded-2xl overflow-hidden aspect-video mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={article.coverImageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
          {article.category && (
            <span className="text-[#C8873A] text-xs font-semibold tracking-widest uppercase">
              {article.category.name}
            </span>
          )}
          {article.publishedAt && (
            <span className="text-[#4D4438] text-sm">{formatDate(article.publishedAt)}</span>
          )}
        </div>

        <h1 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-[#F5EFE6] mb-6 leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-[#B8A898] text-lg leading-relaxed mb-8 border-l-2 border-[#C8873A] pl-5">
            {article.excerpt}
          </p>
        )}

        <div
          className="prose prose-invert prose-amber max-w-none text-[#B8A898] leading-relaxed [&_h2]:font-display [&_h2]:text-[#F5EFE6] [&_h3]:text-[#F5EFE6] [&_strong]:text-[#F5EFE6]"
          dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br />') }}
        />
      </div>
    </div>
  )
}
