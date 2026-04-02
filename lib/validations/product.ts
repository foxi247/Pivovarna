import { z } from 'zod'

export const productSchema = z.object({
  name: z.string().min(1, 'Введите название').max(200),
  slug: z.string().min(1).max(200).optional(),
  categoryId: z.string().min(1, 'Выберите категорию'),
  description: z.string().min(1, 'Введите описание'),
  imageUrl: z.string().optional().nullable(),
  alcoholContent: z.number().min(0).max(100).optional().nullable(),
  bitterness: z.number().min(0).max(200).optional().nullable(),
  density: z.number().min(0).max(30).optional().nullable(),
  color: z.string().optional().nullable(),
  volume: z.string().optional().nullable(),
  ingredients: z.string().optional().nullable(),
  isNew: z.boolean().default(false),
  isPopular: z.boolean().default(false),
  isSeasonal: z.boolean().default(false),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
})

export type ProductInput = z.infer<typeof productSchema>

export const productCategorySchema = z.object({
  name: z.string().min(1, 'Введите название').max(100),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
})

export type ProductCategoryInput = z.infer<typeof productCategorySchema>
