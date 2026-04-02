'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { HeroSlide } from '@prisma/client'

interface HeroSectionProps {
  slide?: HeroSlide | null
}

export function HeroSection({ slide }: HeroSectionProps) {
  const title = slide?.title ?? 'Пиво, рождённое в Дагестане'
  const subtitle = slide?.subtitle ?? 'Дербентская пивоварня'
  const description = slide?.description ?? 'Традиции горного пивоварения и современные технологии. Каждый глоток — история, воплощённая в качестве.'
  const ctaText = slide?.ctaText ?? 'Наша продукция'
  const ctaUrl = slide?.ctaUrl ?? '/products'
  const ctaSecondaryText = slide?.ctaSecondaryText ?? 'История бренда'
  const ctaSecondaryUrl = slide?.ctaSecondaryUrl ?? '/about'

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#0F0D0A]" />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8873A]/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#A06828]/6 rounded-full blur-[100px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(200,135,58,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,135,58,1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
            <span className="w-8 h-[1px] bg-[#C8873A]" />
            {subtitle}
            <span className="w-8 h-[1px] bg-[#C8873A]" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[1.04] text-[#F5EFE6] mb-6"
        >
          {title.split(' ').map((word, i) => (
            <span
              key={i}
              className={i % 3 === 2 ? 'text-amber-gradient' : ''}
            >
              {word}{' '}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-[#B8A898] text-lg max-w-xl mx-auto leading-relaxed mb-10"
        >
          {description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href={ctaUrl}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C8873A] hover:bg-[#E8A855] text-[#0F0D0A] font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5 text-sm"
          >
            {ctaText}
          </Link>
          <Link
            href={ctaSecondaryUrl}
            className="inline-flex items-center justify-center px-8 py-3.5 border border-[#4D4438] hover:border-[#C8873A] text-[#B8A898] hover:text-[#C8873A] font-semibold rounded-md transition-all duration-200 text-sm"
          >
            {ctaSecondaryText}
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: '15+', label: 'Лет опыта' },
            { value: '20+', label: 'Сортов пива' },
            { value: '2008', label: 'Год основания' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-[#C8873A] text-3xl font-bold">{stat.value}</p>
              <p className="text-[#7A6C5E] text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1 text-[#4D4438]"
        >
          <span className="text-[10px] tracking-widest uppercase">Прокрутить</span>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  )
}
