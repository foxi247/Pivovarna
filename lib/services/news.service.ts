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

function parsePublishedAt(raw: string | null | undefined): Date | null {
  if (!raw) return null
  const d = new Date(raw)
  return isNaN(d.getTime()) ? null : d
}

export async function createNewsArticle(data: NewsArticleInput) {
  const slug = data.slug?.trim() || slugify(data.title)
  const publishedAt = data.isPublished
    ? (parsePublishedAt(data.publishedAt) ?? new Date())
    : null
  return prisma.newsArticle.create({
    data: {
      title: data.title,
      slug,
      categoryId: data.categoryId || null,
      excerpt: data.excerpt || null,
      content: data.content,
      coverImageUrl: data.coverImageUrl || null,
      isPublished: data.isPublished,
      publishedAt,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
    },
  })
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticleInput>) {
  const publishedAt = data.isPublished !== undefined
    ? (data.isPublished ? (parsePublishedAt(data.publishedAt) ?? new Date()) : null)
    : undefined
  return prisma.newsArticle.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.slug !== undefined && { slug: data.slug?.trim() || undefined }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId || null }),
      ...(data.excerpt !== undefined && { excerpt: data.excerpt || null }),
      ...(data.content !== undefined && { content: data.content }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl || null }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
      ...(publishedAt !== undefined && { publishedAt }),
      ...(data.seoTitle !== undefined && { seoTitle: data.seoTitle || null }),
      ...(data.seoDescription !== undefined && { seoDescription: data.seoDescription || null }),
    },
  })
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
