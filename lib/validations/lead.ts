import { z } from 'zod'

export const leadSchema = z.object({
  type: z.enum(['COOPERATION', 'DISTRIBUTION', 'WHOLESALE', 'FEEDBACK', 'TOUR', 'OTHER']),
  name: z.string().min(2, 'Введите ваше имя').max(100),
  phone: z.string().optional(),
  email: z.string().email('Некорректный email').optional().or(z.literal('')),
  company: z.string().optional(),
  message: z.string().min(10, 'Пожалуйста, опишите ваш запрос подробнее').max(2000),
  source: z.string().optional(),
}).refine(
  (data) => data.phone || data.email,
  {
    message: 'Укажите телефон или email для связи',
    path: ['phone'],
  }
)

export type LeadInput = z.infer<typeof leadSchema>

export const leadUpdateSchema = z.object({
  status: z.enum(['NEW', 'IN_PROGRESS', 'WAITING', 'CLOSED', 'REJECTED']).optional(),
  assignedToId: z.string().optional().nullable(),
  isRead: z.boolean().optional(),
})

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>

export const leadCommentSchema = z.object({
  text: z.string().min(1, 'Введите текст комментария').max(2000),
})

export type LeadCommentInput = z.infer<typeof leadCommentSchema>
