'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import type { SiteSettings } from '@prisma/client'

interface SettingsFormProps {
  settings: SiteSettings | null
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)

  type FormValues = {
    siteName: string
    siteTagline: string
    phone: string
    phoneSecond: string
    email: string
    address: string
    workingHours: string
    socialVk: string
    socialTelegram: string
    socialInstagram: string
    socialWhatsapp: string
    footerText: string
  }

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      siteName: settings?.siteName ?? 'Дербентская пивоварня',
      siteTagline: settings?.siteTagline ?? '',
      phone: settings?.phone ?? '',
      phoneSecond: settings?.phoneSecond ?? '',
      email: settings?.email ?? '',
      address: settings?.address ?? '',
      workingHours: settings?.workingHours ?? '',
      socialVk: settings?.socialVk ?? '',
      socialTelegram: settings?.socialTelegram ?? '',
      socialInstagram: settings?.socialInstagram ?? '',
      socialWhatsapp: settings?.socialWhatsapp ?? '',
      footerText: settings?.footerText ?? '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Настройки сохранены')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  const Field = ({ name, label, placeholder, type = 'text' }: { name: keyof FormValues; label: string; placeholder?: string; type?: string }) => (
    <div>
      <label className="block text-admin-text text-sm font-medium mb-1.5">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white"
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text font-semibold text-sm uppercase tracking-wider text-admin-text-muted">Основное</h2>
        <Field name="siteName" label="Название сайта" placeholder="Дербентская пивоварня" />
        <Field name="siteTagline" label="Слоган" placeholder="Премиальное пиво из Дагестана" />
      </div>

      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text font-semibold text-sm uppercase tracking-wider text-admin-text-muted">Контакты</h2>
        <Field name="phone" label="Основной телефон" placeholder="+7 (8722) 00-00-00" />
        <Field name="phoneSecond" label="Дополнительный телефон" placeholder="+7 (XXX) XXX-XX-XX" />
        <Field name="email" label="Email" type="email" placeholder="info@pivovarna.ru" />
        <Field name="address" label="Адрес" placeholder="г. Дербент, ул. Производственная, 15" />
        <Field name="workingHours" label="Режим работы" placeholder="Пн–Пт: 9:00–18:00" />
      </div>

      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text font-semibold text-sm uppercase tracking-wider text-admin-text-muted">Социальные сети</h2>
        <Field name="socialVk" label="ВКонтакте" placeholder="https://vk.com/..." />
        <Field name="socialTelegram" label="Telegram" placeholder="https://t.me/..." />
        <Field name="socialInstagram" label="Instagram" placeholder="https://instagram.com/..." />
        <Field name="socialWhatsapp" label="WhatsApp" placeholder="+7 XXX XXX-XX-XX" />
      </div>

      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text font-semibold text-sm uppercase tracking-wider text-admin-text-muted">Подвал сайта</h2>
        <Field name="footerText" label="Текст в подвале" placeholder="© 2024 Дербентская пивоварня" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        {loading ? 'Сохранение...' : 'Сохранить настройки'}
      </button>
    </form>
  )
}
