'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'
import { Loader2 } from 'lucide-react'
import type { LeadType } from '@prisma/client'

export interface FormFieldConfig {
  visible: boolean
  required: boolean
  label?: string
  placeholder?: string
}

export interface LeadFormConfig {
  title?: string
  subtitle?: string
  buttonText?: string
  fields?: {
    phone?: FormFieldConfig
    email?: FormFieldConfig
    company?: FormFieldConfig
    message?: FormFieldConfig
  }
}

interface LeadFormProps {
  type: LeadType
  title?: string
  subtitle?: string
  source: string
  config?: LeadFormConfig
}

const typeLabels: Record<LeadType, string> = {
  COOPERATION: 'Сотрудничество',
  DISTRIBUTION: 'Дистрибуция',
  WHOLESALE: 'Оптовая закупка',
  FEEDBACK: 'Обратная связь',
  TOUR: 'Экскурсия',
  OTHER: 'Другое',
}

function buildSchema(cfg: LeadFormConfig['fields']) {
  const phoneRequired = cfg?.phone?.required && cfg?.phone?.visible
  const emailRequired = cfg?.email?.required && cfg?.email?.visible
  const messageRequired = cfg?.message?.required !== false

  return z.object({
    type: z.enum(['COOPERATION', 'DISTRIBUTION', 'WHOLESALE', 'FEEDBACK', 'TOUR', 'OTHER']),
    name: z.string().min(2, 'Введите ваше имя').max(100),
    phone: phoneRequired
      ? z.string().min(1, 'Укажите телефон')
      : z.string().optional(),
    email: emailRequired
      ? z.string().email('Некорректный email')
      : z.string().email('Некорректный email').optional().or(z.literal('')),
    company: z.string().optional(),
    message: messageRequired
      ? z.string().min(10, 'Опишите ваш запрос').max(2000)
      : z.string().optional(),
    source: z.string().optional(),
  }).refine(
    (data) => {
      const showPhone = cfg?.phone?.visible !== false
      const showEmail = cfg?.email?.visible !== false
      if (!showPhone && !showEmail) return true
      return data.phone || data.email
    },
    { message: 'Укажите телефон или email для связи', path: ['phone'] }
  )
}

type FormValues = {
  type: LeadType
  name: string
  phone?: string
  email?: string
  company?: string
  message?: string
  source?: string
}

const inputCls = 'w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-3 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors'

export function LeadForm({ type, title: titleProp, subtitle: subtitleProp, source, config }: LeadFormProps) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const fields = config?.fields ?? {}
  const showPhone = fields.phone?.visible !== false
  const showEmail = fields.email?.visible !== false
  const showCompany = fields.company?.visible !== false
  const showMessage = fields.message?.visible !== false

  const schema = buildSchema(fields)
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type },
  })

  const onSubmit = async (data: FormValues) => {
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

  const title = config?.title || titleProp
  const subtitle = config?.subtitle || subtitleProp
  const buttonText = config?.buttonText || 'Отправить заявку'

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

        {/* Name — always shown */}
        <div>
          <label className="block text-[#B8A898] text-sm mb-2">Ваше имя *</label>
          <input {...register('name')} placeholder="Иван Иванов" className={inputCls} />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Phone + Email row */}
        {(showPhone || showEmail) && (
          <div className={`grid gap-4 ${showPhone && showEmail ? 'sm:grid-cols-2' : ''}`}>
            {showPhone && (
              <div>
                <label className="block text-[#B8A898] text-sm mb-2">
                  {fields.phone?.label || 'Телефон'}{fields.phone?.required ? ' *' : ''}
                </label>
                <input
                  {...register('phone')}
                  placeholder={fields.phone?.placeholder || '+7 (XXX) XXX-XX-XX'}
                  className={inputCls}
                />
              </div>
            )}
            {showEmail && (
              <div>
                <label className="block text-[#B8A898] text-sm mb-2">
                  {fields.email?.label || 'Email'}{fields.email?.required ? ' *' : ''}
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder={fields.email?.placeholder || 'email@company.ru'}
                  className={inputCls}
                />
              </div>
            )}
          </div>
        )}
        {errors.phone && <p className="text-red-400 text-xs -mt-3">{errors.phone.message}</p>}

        {/* Company */}
        {showCompany && (
          <div>
            <label className="block text-[#B8A898] text-sm mb-2">
              {fields.company?.label || 'Компания'}{fields.company?.required ? ' *' : ''}
            </label>
            <input
              {...register('company')}
              placeholder={fields.company?.placeholder || 'ООО «Название»'}
              className={inputCls}
            />
          </div>
        )}

        {/* Message */}
        {showMessage && (
          <div>
            <label className="block text-[#B8A898] text-sm mb-2">
              {fields.message?.label || 'Сообщение'}{fields.message?.required !== false ? ' *' : ''}
            </label>
            <textarea
              {...register('message')}
              rows={5}
              placeholder={fields.message?.placeholder || 'Опишите ваш запрос подробнее...'}
              className={`${inputCls} resize-none`}
            />
            {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#C8873A] hover:bg-[#E8A855] disabled:opacity-50 text-[#0F0D0A] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          {loading ? 'Отправка...' : buttonText}
        </button>

        <p className="text-[#4D4438] text-xs text-center">
          Отправляя форму, вы соглашаетесь с обработкой персональных данных
        </p>
      </form>
    </div>
  )
}
