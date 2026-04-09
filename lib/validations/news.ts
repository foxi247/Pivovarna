import { z } from 'zod'

export const newsArticleSchema = z.object({
  title: z.string().min(1, 'Введите заголовок').max(300),
  slug: z.string().optional(),
  categoryId: z.string().optional().nullable(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, 'Введите текст статьи'),
  coverImageUrl: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})

export type NewsArticleInput = z.infer<typeof newsArticleSchema>

export const newsCategorySchema = z.object({
  name: z.string().min(1, 'Введите название').max(100),
  slug: z.string().optional(),
  isActive: z.boolean().default(true),
})

export type NewsCategoryInput = z.infer<typeof newsCategorySchema>
