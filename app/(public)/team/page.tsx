import { getTeamPersons } from '@/lib/services/settings.service'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Наш технолог',
  description: 'Главный технолог Дербентской пивоварни — лицо бренда и гарант качества.',
}

export default async function TeamPage() {
  const persons = await getTeamPersons()
  const person = persons[0]

  if (!person) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <p className="text-[#4D4438]">Информация скоро появится</p>
      </div>
    )
  }

  const achievements = (person.achievements as { title: string; year?: string }[] | null) ?? []
  const certifications = (person.certifications as { name: string; issuer?: string }[] | null) ?? []

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Photo */}
          <div className="relative max-w-lg mx-auto lg:mx-0 sticky top-28">
            <div className="absolute -bottom-6 -right-6 w-full h-full bg-[#C8873A]/10 rounded-2xl" />
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] bg-[#231F1A]">
              {person.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl opacity-10">👨‍🍳</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Лицо компании</span>
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#F5EFE6] mt-3 mb-1">
              {person.name}
            </h1>
            <p className="text-[#C8873A] text-lg mb-6">{person.role}</p>

            {person.experience && (
              <div className="inline-flex items-center gap-2 bg-[#C8873A]/15 rounded-full px-4 py-1.5 mb-6">
                <span className="text-[#C8873A] font-semibold text-sm">{person.experience}</span>
              </div>
            )}

            <p className="text-[#B8A898] leading-relaxed mb-8">{person.bio}</p>

            {person.quote && (
              <blockquote className="border-l-2 border-[#C8873A] pl-5 mb-8">
                <p className="font-display text-[#F5EFE6] text-xl italic leading-relaxed">
                  &ldquo;{person.quote}&rdquo;
                </p>
                {person.quoteAuthor && (
                  <footer className="text-[#7A6C5E] text-sm mt-2">— {person.quoteAuthor}</footer>
                )}
              </blockquote>
            )}

            {achievements.length > 0 && (
              <div className="mb-8">
                <h2 className="text-[#F5EFE6] font-semibold text-sm uppercase tracking-wider mb-4">
                  Достижения
                </h2>
                <div className="space-y-3">
                  {achievements.map((a, i) => (
                    <div key={i} className="flex gap-3 bg-[#1A1712] border border-[#3D352B] rounded-lg p-4">
                      <span className="text-[#C8873A] text-sm mt-0.5 flex-shrink-0">★</span>
                      <div>
                        <p className="text-[#F5EFE6] text-sm font-medium">{a.title}</p>
                        {a.year && <p className="text-[#7A6C5E] text-xs mt-0.5">{a.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="text-[#F5EFE6] font-semibold text-sm uppercase tracking-wider mb-4">
                  Сертификаты
                </h2>
                <div className="flex flex-wrap gap-2">
                  {certifications.map((c, i) => (
                    <span key={i} className="bg-[#231F1A] border border-[#3D352B] text-[#B8A898] text-xs px-3 py-1.5 rounded-full">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
