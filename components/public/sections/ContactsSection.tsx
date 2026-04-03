'use client'
import { AnimatedSection } from '@/components/public/ui/AnimatedSection'
import { ContactForm } from '@/components/public/forms/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import type { SiteSettings } from '@prisma/client'

interface ContactsSectionProps {
  settings?: SiteSettings | null
}

export function ContactsSection({ settings }: ContactsSectionProps) {
  return (
    <section id="contacts" className="py-28 bg-[#1A1712]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <AnimatedSection>
              <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                Контакты
              </span>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-bold text-[#F5EFE6] mt-3 mb-8">
                Свяжитесь с нами
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C8873A]/15 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-[#C8873A]" />
                  </div>
                  <div>
                    <p className="text-[#7A6C5E] text-xs mb-0.5 uppercase tracking-wider">Адрес</p>
                    <p className="text-[#F5EFE6]">{settings?.address ?? 'г. Дербент, ул. Производственная, 15'}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C8873A]/15 flex items-center justify-center flex-shrink-0">
                    <Phone size={18} className="text-[#C8873A]" />
                  </div>
                  <div>
                    <p className="text-[#7A6C5E] text-xs mb-0.5 uppercase tracking-wider">Телефон</p>
                    <a href={`tel:${settings?.phone ?? '+78722000000'}`} className="text-[#F5EFE6] hover:text-[#C8873A] transition-colors">
                      {settings?.phone ?? '+7 (8722) 00-00-00'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C8873A]/15 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-[#C8873A]" />
                  </div>
                  <div>
                    <p className="text-[#7A6C5E] text-xs mb-0.5 uppercase tracking-wider">Email</p>
                    <a href={`mailto:${settings?.email ?? 'info@pivovarna.ru'}`} className="text-[#F5EFE6] hover:text-[#C8873A] transition-colors">
                      {settings?.email ?? 'info@pivovarna.ru'}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#C8873A]/15 flex items-center justify-center flex-shrink-0">
                    <Clock size={18} className="text-[#C8873A]" />
                  </div>
                  <div>
                    <p className="text-[#7A6C5E] text-xs mb-0.5 uppercase tracking-wider">Режим работы</p>
                    <p className="text-[#F5EFE6]">{settings?.workingHours ?? 'Пн–Пт: 9:00–18:00'}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Form */}
          <AnimatedSection delay={0.3} direction="left">
            <div className="bg-[#231F1A] border border-[#3D352B] rounded-2xl p-8">
              <h3 className="font-display text-[#F5EFE6] text-xl font-semibold mb-6">
                Написать нам
              </h3>
              <ContactForm />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
