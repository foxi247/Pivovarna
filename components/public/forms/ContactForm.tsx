'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { leadSchema, type LeadInput } from '@/lib/validations/lead'
import { Loader2 } from 'lucide-react'

type FormData = Omit<LeadInput, 'type'> & { type?: LeadInput['type'] }

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: { type: 'FEEDBACK' },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'website_contact_form' }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      reset()
      toast.success('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.')
    } catch {
      toast.error('Ошибка отправки. Попробуйте ещё раз или позвоните нам.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 rounded-full bg-[#C8873A]/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-[#C8873A] text-2xl">✓</span>
        </div>
        <h4 className="text-[#F5EFE6] font-semibold mb-2">Спасибо за обращение!</h4>
        <p className="text-[#7A6C5E] text-sm">Мы свяжемся с вами в ближайшее время.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-[#C8873A] text-sm hover:underline"
        >
          Отправить ещё
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-[#B8A898] text-sm mb-1.5">Ваше имя *</label>
        <input
          {...register('name')}
          placeholder="Иван Иванов"
          className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-2.5 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[#B8A898] text-sm mb-1.5">Телефон</label>
          <input
            {...register('phone')}
            placeholder="+7 (XXX) XXX-XX-XX"
            className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-2.5 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
          />
        </div>
        <div>
          <label className="block text-[#B8A898] text-sm mb-1.5">Email</label>
          <input
            {...register('email')}
            type="email"
            placeholder="email@example.com"
            className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-2.5 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors"
          />
        </div>
      </div>
      {errors.phone && <p className="text-red-400 text-xs -mt-3">{errors.phone.message}</p>}

      <div>
        <label className="block text-[#B8A898] text-sm mb-1.5">Сообщение *</label>
        <textarea
          {...register('message')}
          rows={4}
          placeholder="Ваш вопрос или предложение..."
          className="w-full bg-[#2E2820] border border-[#4D4438] rounded-lg px-4 py-2.5 text-[#F5EFE6] text-sm placeholder:text-[#4D4438] focus:outline-none focus:border-[#C8873A] transition-colors resize-none"
        />
        {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#C8873A] hover:bg-[#E8A855] disabled:opacity-50 text-[#0F0D0A] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Отправка...' : 'Отправить сообщение'}
      </button>
    </form>
  )
}
