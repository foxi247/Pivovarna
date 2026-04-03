'use client'
import { AnimatedSection } from '@/components/public/ui/AnimatedSection'
import type { TeamPerson } from '@prisma/client'

interface TeamSectionProps {
  person?: TeamPerson | null
}

export function TeamSection({ person }: TeamSectionProps) {
  if (!person) return null

  const achievements = (person.achievements as { title: string; year?: string }[] | null) ?? []

  return (
    <section id="team" className="py-28 bg-[#1A1712] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute left-0 top-0 w-96 h-full bg-gradient-to-r from-[#C8873A]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Photo */}
          <AnimatedSection direction="right">
            <div className="relative max-w-md mx-auto lg:mx-0">
              {/* Background accent */}
              <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#C8873A]/10 rounded-2xl" />
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-[#C8873A]/20 rounded-2xl" />

              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#231F1A]">
                {person.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={person.photoUrl}
                    alt={person.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-[#C8873A]/20 flex items-center justify-center">
                      <span className="text-[#C8873A] text-4xl">👨‍🍳</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Experience badge */}
              {person.experience && (
                <div className="absolute top-6 -left-6 bg-[#C8873A] text-[#0F0D0A] rounded-xl px-4 py-3 shadow-lg">
                  <p className="font-display text-2xl font-bold leading-none">{person.experience.split(' ')[0]}</p>
                  <p className="text-xs font-semibold mt-0.5 leading-none">
                    {person.experience.split(' ').slice(1).join(' ')}
                  </p>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* Info */}
          <div>
            <AnimatedSection delay={0.1}>
              <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">
                Лицо компании
              </span>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] font-bold text-[#F5EFE6] mt-3 mb-1">
                {person.name}
              </h2>
              <p className="text-[#C8873A] text-base mb-6">{person.role}</p>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-[#B8A898] leading-relaxed mb-8">{person.bio}</p>
            </AnimatedSection>

            {/* Quote */}
            {person.quote && (
              <AnimatedSection delay={0.3}>
                <blockquote className="relative border-l-2 border-[#C8873A] pl-5 mb-8">
                  <p className="font-display text-[#F5EFE6] text-lg italic leading-relaxed">
                    &ldquo;{person.quote}&rdquo;
                  </p>
                  {person.quoteAuthor && (
                    <footer className="text-[#7A6C5E] text-sm mt-2">— {person.quoteAuthor}</footer>
                  )}
                </blockquote>
              </AnimatedSection>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <AnimatedSection delay={0.35}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((a, i) => (
                    <div key={i} className="flex gap-3 bg-[#231F1A] rounded-lg p-3">
                      <div className="w-8 h-8 rounded-full bg-[#C8873A]/15 flex items-center justify-center flex-shrink-0">
                        <span className="text-[#C8873A] text-xs">★</span>
                      </div>
                      <div>
                        <p className="text-[#F5EFE6] text-sm font-medium leading-tight">{a.title}</p>
                        {a.year && <p className="text-[#7A6C5E] text-xs mt-0.5">{a.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
