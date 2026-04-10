'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { HeroSlide } from '@prisma/client'

interface HeroSectionProps {
  slides?: HeroSlide[]
  slide?: HeroSlide | null // backward compat
}

const FALLBACK_SLIDE = {
  title: 'Пиво, рождённое в Дагестане',
  subtitle: 'Дербентская пивоварня',
  description: 'Традиции горного пивоварения и современные технологии. Каждый глоток — история, воплощённая в качестве.',
  ctaText: 'Наша продукция',
  ctaUrl: '/products',
  ctaSecondaryText: 'История бренда',
  ctaSecondaryUrl: '/about',
  imageUrl: '',
}

const STATS = [
  { value: '15+', label: 'Лет опыта' },
  { value: '20+', label: 'Сортов пива' },
  { value: '2008', label: 'Год основания' },
]

const SLIDE_DURATION = 6000

export function HeroSection({ slides: slidesProp, slide }: HeroSectionProps) {
  // Normalise: prefer slides array, fall back to single slide, then fallback
  const slides = (() => {
    if (slidesProp && slidesProp.length > 0) return slidesProp
    if (slide) return [slide]
    return []
  })()

  const hasCMS = slides.length > 0

  const getSlide = (idx: number) => ({
    title: slides[idx]?.title ?? FALLBACK_SLIDE.title,
    subtitle: slides[idx]?.subtitle ?? FALLBACK_SLIDE.subtitle,
    description: slides[idx]?.description ?? FALLBACK_SLIDE.description,
    ctaText: slides[idx]?.ctaText ?? FALLBACK_SLIDE.ctaText,
    ctaUrl: slides[idx]?.ctaUrl ?? FALLBACK_SLIDE.ctaUrl,
    ctaSecondaryText: slides[idx]?.ctaSecondaryText ?? FALLBACK_SLIDE.ctaSecondaryText,
    ctaSecondaryUrl: slides[idx]?.ctaSecondaryUrl ?? FALLBACK_SLIDE.ctaSecondaryUrl,
    imageUrl: slides[idx]?.imageUrl ?? '',
  })

  const [current, setCurrent] = useState(0)
  const total = hasCMS ? slides.length : 1

  const next = useCallback(() => setCurrent(c => (c + 1) % total), [total])
  const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total])

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [next, total])

  const s = hasCMS ? getSlide(current) : FALLBACK_SLIDE

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <AnimatePresence mode="cross">
        {s.imageUrl ? (
          <motion.div
            key={`bg-${current}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <img
              src={s.imageUrl}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-[#0F0D0A]/70" />
          </motion.div>
        ) : (
          <motion.div
            key="bg-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-[#0F0D0A]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C8873A]/8 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#A06828]/6 rounded-full blur-[100px]" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1]"
        style={{
          backgroundImage: 'linear-gradient(rgba(200,135,58,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,135,58,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                <span className="w-8 h-[1px] bg-[#C8873A]" />
                {s.subtitle}
                <span className="w-8 h-[1px] bg-[#C8873A]" />
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[1.04] text-[#F5EFE6] mb-6">
              {s.title.split(' ').map((word, i) => (
                <span key={i} className={i % 3 === 2 ? 'text-amber-gradient' : ''}>
                  {word}{' '}
                </span>
              ))}
            </h1>

            <p className="text-[#B8A898] text-lg max-w-xl mx-auto leading-relaxed mb-10">
              {s.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={s.ctaUrl || '/products'}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#C8873A] hover:bg-[#E8A855] text-[#0F0D0A] font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5 text-sm"
              >
                {s.ctaText}
              </Link>
              {s.ctaSecondaryText && (
                <Link
                  href={s.ctaSecondaryUrl || '/about'}
                  className="inline-flex items-center justify-center px-8 py-3.5 border border-[#4D4438] hover:border-[#C8873A] text-[#B8A898] hover:text-[#C8873A] font-semibold rounded-md transition-all duration-200 text-sm"
                >
                  {s.ctaSecondaryText}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-[#C8873A] text-3xl font-bold">{stat.value}</p>
              <p className="text-[#7A6C5E] text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Carousel controls */}
      {total > 1 && (
        <>
          {/* Prev/Next arrows */}
          <button
            onClick={prev}
            aria-label="Предыдущий"
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Следующий"
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
          >
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Слайд ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2 bg-[#C8873A]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
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
