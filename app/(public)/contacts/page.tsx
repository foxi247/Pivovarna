export const dynamic = 'force-dynamic'

import { ContactForm } from '@/components/public/forms/ContactForm'
import { getSiteSettings } from '@/lib/services/settings.service'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Контактная информация Дербентской пивоварни. Адрес, телефон, email, режим работы.',
}

export default async function ContactsPage() {
  const settings = await getSiteSettings()

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Как нас найти</span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">Контакты</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 mb-12">
          {[
            { icon: MapPin, label: 'Адрес', value: settings?.address ?? 'г. Дербент, ул. Производственная, 15' },
            { icon: Phone, label: 'Телефон', value: settings?.phone ?? '+7 (8722) 00-00-00', href: `tel:${settings?.phone}` },
            { icon: Mail, label: 'Email', value: settings?.email ?? 'info@pivovarna.ru', href: `mailto:${settings?.email}` },
            { icon: Clock, label: 'Режим работы', value: settings?.workingHours ?? 'Пн–Пт: 9:00–18:00' },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="bg-[#1A1712] border border-[#3D352B] rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#C8873A]/15 flex items-center justify-center mb-4">
                <Icon size={18} className="text-[#C8873A]" />
              </div>
              <p className="text-[#7A6C5E] text-xs uppercase tracking-wider mb-1">{label}</p>
              {href ? (
                <a href={href} className="text-[#F5EFE6] hover:text-[#C8873A] transition-colors font-medium">
                  {value}
                </a>
              ) : (
                <p className="text-[#F5EFE6] font-medium">{value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Map placeholder */}
          <div className="bg-[#1A1712] border border-[#3D352B] rounded-2xl overflow-hidden aspect-video lg:aspect-auto flex items-center justify-center">
            <div className="text-center p-8">
              <MapPin size={40} className="text-[#3D352B] mx-auto mb-3" />
              <p className="text-[#4D4438] text-sm">Карта</p>
              <p className="text-[#4D4438] text-xs mt-1">Дербент, Дагестан</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-[#1A1712] border border-[#3D352B] rounded-2xl p-8">
            <h2 className="font-display text-[#F5EFE6] text-xl font-semibold mb-6">Написать нам</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
