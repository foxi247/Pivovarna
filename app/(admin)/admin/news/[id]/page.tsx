import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getNewsCategories } from '@/lib/services/news.service'
import { NewsArticleForm } from '@/components/admin/news/NewsArticleForm'

export default async function AdminNewsEditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'

  const [article, categories] = await Promise.all([
    isNew ? null : prisma.newsArticle.findUnique({ where: { id: params.id } }),
    getNewsCategories(false),
  ])

  if (!isNew && !article) notFound()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">
          {isNew ? 'Новая статья' : `Редактировать: ${article!.title}`}
        </h1>
      </div>
      <div className="max-w-3xl">
        <NewsArticleForm article={article} categories={categories} />
      </div>
    </div>
  )
}
