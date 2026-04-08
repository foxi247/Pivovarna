import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import type { NewsArticleInput, NewsCategoryInput } from '@/lib/validations/news'

export async function getNewsArticles(publishedOnly = true, limit?: number) {
  return prisma.newsArticle.findMany({
    where: publishedOnly ? { isPublished: true } : undefined,
    include: { category: true },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
}

export async function getNewsArticleBySlug(slug: string) {
  return prisma.newsArticle.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getNewsCategories(activeOnly = true) {
  return prisma.newsCategory.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    include: { _count: { select: { articles: true } } },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function createNewsArticle(data: NewsArticleInput) {
  const slug = data.slug || slugify(data.title)
  const publishedAt = data.isPublished ? (data.publishedAt ?? new Date()) : null
  return prisma.newsArticle.create({
    data: { ...data, slug, publishedAt, categoryId: data.categoryId ?? undefined },
  })
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticleInput>) {
  const parsedAt = data.publishedAt ? new Date(data.publishedAt as unknown as string) : null
  const publishedAt = data.isPublished ? (parsedAt && !isNaN(parsedAt.getTime()) ? parsedAt : new Date()) : null
  return prisma.newsArticle.update({ where: { id }, data: { ...data, publishedAt, categoryId: data.categoryId ?? undefined } })
}

export async function deleteNewsArticle(id: string) {
  return prisma.newsArticle.delete({ where: { id } })
}

export async function createNewsCategory(data: NewsCategoryInput) {
  const slug = data.slug || slugify(data.name)
  return prisma.newsCategory.create({ data: { ...data, slug } })
}

export async function updateNewsCategory(id: string, data: Partial<NewsCategoryInput>) {
  return prisma.newsCategory.update({ where: { id }, data })
}

export async function deleteNewsCategory(id: string) {
  return prisma.newsCategory.delete({ where: { id } })
}
