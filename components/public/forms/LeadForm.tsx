'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { leadSchema, type LeadInput } from '@/lib/validations/lead'
import { Loader2 } from 'lucide-react'
import type { LeadType } from '@prisma/client'

interface LeadFormProps {
  type: LeadType
  title?: string
  subtitle?: string
  source: string
}

const typeLabels: Record<LeadType, string> = {
  COOPERATION: 'Сотрудничество',
  DISTRIBUTION: 'Дистрибуция',
  WHOLESALE: 'Оптовая закупка',
  FEEDBACK: 'Обратная связь',
  TOUR: 'Экскурсия',
  OTHER: 'Другое',
}

export function LeadForm({ type, title, subtitle, source }: LeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { type },
  })

  const onSubmit = async (data: LeadInput) => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      reset()
    } catch {
      toast.error('Ошибка отправки. Попробуйте позже или позвоните нам.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#C8873A]/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-[#C8873A] text-3xl">✓</span>
        </div>
        <h3 className="font-display text-[#F5EFE6] text-2xl font-bold mb-3">Заявка принята!</h3>
        <p className="text-[#B8A898]">Мы свяжемся с вами в ближайшее рабочее время.</p>
      </div>
    )
  }

  return (
    <div>
      {title && (
        <div className="mb-8">
          <h2 className="font-display text-[#F5EFE6] text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-[#B8A898]">{subtitle}</p>}
          <div className="mt-4">
            <span className="inline-block bg-[#C8873A]/15 text-[#C8873A] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              {typeLabels[type]}
            </span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('type')} value={type} />

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#B8A898] text-sm mb-2">Ваше имя *</label>
            <input
              {...register('name')}
              placeholder="Иван Иванов"
              className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-3 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-[#B8A898] text-sm mb-2">Компания</label>
            <input
              {...register('company')}
              placeholder="ООО «Название»"
              className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-3 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#B8A898] text-sm mb-2">Телефон</label>
            <input
              {...register('phone')}
              placeholder="+7 (XXX) XXX-XX-XX"
              className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-3 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#B8A898] text-sm mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              placeholder="email@company.ru"
              className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-3 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
            />
          </div>
        </div>
        {errors.phone && <p className="text-red-400 text-xs -mt-3">{errors.phone.message}</p>}

        <div>
          <label className="block text-[#B8A898] text-sm mb-2">Сообщение *</label>
          <textarea
            {...register('message')}
            rows={5}
            placeholder="Опишите ваш запрос подробнее..."
            className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-3 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors resize-none"
          />
          {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#C8873A] hover:bg-[#E8A855] disabled:opacity-50 text-[#0F0D0A] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Отправка...' : 'Отправить заявку'}
        </button>

        <p className="text-[#4D4438] text-xs text-center">
          Отправляя форму, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>
    </div>
  )
}
