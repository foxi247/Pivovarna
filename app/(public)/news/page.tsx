import { getNewsArticles, getNewsCategories } from '@/lib/services/news.service'
import { NewsCard } from '@/components/public/news/NewsCard'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Новости',
  description: 'Новости Дербентской пивоварни: события, достижения, новые сорта.',
}

export default async function NewsPage() {
  const [articles, categories] = await Promise.all([
    getNewsArticles(true),
    getNewsCategories(),
  ])

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Актуальное</span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">Новости</h1>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-20 text-[#4D4438]">Новости скоро появятся</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
