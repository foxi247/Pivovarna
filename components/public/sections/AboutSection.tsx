import { AnimatedSection, StaggerContainer, staggerItem } from '@/components/public/ui/AnimatedSection'
import { motion } from 'framer-motion'
import type { CompanyInfo } from '@prisma/client'

interface AboutSectionProps {
  info?: CompanyInfo | null
}

const defaultStats = [
  { value: '2008', label: 'Год основания' },
  { value: '15+', label: 'Лет на рынке' },
  { value: '20+', label: 'Сортов пива' },
  { value: '100%', label: 'Натуральный состав' },
]

export function AboutSection({ info }: AboutSectionProps) {
  const stats = (info?.stats as { value: string; label: string }[] | null) ?? defaultStats

  return (
    <section id="about" className="py-28 bg-[#0F0D0A] relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#C8873A]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <div>
            <AnimatedSection delay={0}>
              <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                О пивоварне
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] font-bold text-[#F5EFE6] mt-3 mb-6 leading-tight">
                {info?.historyTitle ?? 'История, вписанная в каждый бокал'}
              </h2>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-[#B8A898] leading-relaxed mb-6">
                {info?.historyText ?? 'Дербентская пивоварня основана в 2008 году в древнем городе Дербент — одном из старейших городов России. Мы создаём пиво, которое объединяет вековые традиции Дагестана с современными стандартами качества.'}
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <p className="text-[#B8A898] leading-relaxed mb-10">
                {info?.philosophyText ?? 'Каждый сорт — это результат многолетней работы наших технологов и многовековой мудрости горных мастеров. Мы используем только натуральные ингредиенты: чистейшую воду с горных источников Дагестана, отборный солод и хмель.'}
              </p>
            </AnimatedSection>

            {/* Stats */}
            <StaggerContainer delay={0.4} className="grid grid-cols-2 gap-6">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={staggerItem}
                  className="border-l-2 border-[#C8873A] pl-4"
                >
                  <p className="font-display text-[#C8873A] text-3xl font-bold">{stat.value}</p>
                  <p className="text-[#7A6C5E] text-sm mt-0.5">{stat.label}</p>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>

          {/* Visual */}
          <AnimatedSection delay={0.2} direction="left">
            <div className="relative">
              {/* Decorative frame */}
              <div className="absolute -inset-4 border border-[#3D352B] rounded-2xl" />
              <div className="absolute -inset-8 border border-[#2E2820] rounded-3xl" />

              <div className="relative rounded-xl overflow-hidden bg-[#231F1A] aspect-[4/5]">
                {info?.historyImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={info.historyImageUrl}
                    alt="История пивоварни"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 rounded-full bg-[#C8873A]/20 flex items-center justify-center mx-auto mb-4">
                        <span className="text-[#C8873A] text-3xl">🍺</span>
                      </div>
                      <p className="text-[#4D4438] text-sm">Дербентская пивоварня</p>
                    </div>
                  </div>
                )}

                {/* Overlay card */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0F0D0A] via-[#0F0D0A]/70 to-transparent p-6">
                  <p className="text-[#C8873A] text-xs font-semibold tracking-widest uppercase mb-1">
                    Основана
                  </p>
                  <p className="font-display text-[#F5EFE6] text-2xl font-bold">
                    {info?.foundedYear ?? 2008} год
                  </p>
                  <p className="text-[#7A6C5E] text-sm">г. Дербент, Республика Дагестан</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}
