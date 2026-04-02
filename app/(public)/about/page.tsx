import { getCompanyInfo } from '@/lib/services/settings.service'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'О компании',
  description: 'История и философия Дербентской пивоварни. Традиции пивоварения Дагестана с 2008 года.',
}

export default async function AboutPage() {
  const info = await getCompanyInfo()

  const stats = (info?.stats as { value: string; label: string }[] | null) ?? [
    { value: '2008', label: 'Год основания' },
    { value: '15+', label: 'Лет на рынке' },
    { value: '20+', label: 'Сортов пива' },
    { value: '100%', label: 'Натуральный состав' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">О нас</span>
          <h1 className="font-display text-[clamp(2rem,5vw,4rem)] font-bold text-[#F5EFE6] mt-3">
            Дербентская пивоварня
          </h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-[#1A1712] border border-[#3D352B] rounded-xl p-6">
              <p className="font-display text-[#C8873A] text-4xl font-bold">{s.value}</p>
              <p className="text-[#7A6C5E] text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* History */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-2xl overflow-hidden bg-[#231F1A] aspect-[4/3]">
            {info?.historyImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.historyImageUrl} alt="История" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-10">🏭</span>
              </div>
            )}
          </div>
          <div>
            <div className="section-divider mb-5" />
            <h2 className="font-display text-[#F5EFE6] text-3xl font-bold mb-4">
              {info?.historyTitle ?? 'История бренда'}
            </h2>
            <p className="text-[#B8A898] leading-relaxed">
              {info?.historyText ?? 'Дербентская пивоварня основана в 2008 году в одном из старейших городов России — Дербенте. Мы объединяем вековые традиции дагестанского гостеприимства с современными стандартами пивоварения.'}
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="order-2 lg:order-1">
            <div className="section-divider mb-5" />
            <h2 className="font-display text-[#F5EFE6] text-3xl font-bold mb-4">
              {info?.philosophyTitle ?? 'Философия качества'}
            </h2>
            <p className="text-[#B8A898] leading-relaxed">
              {info?.philosophyText ?? 'Мы верим, что настоящее пиво должно создаваться из природных ингредиентов без компромиссов с качеством. Чистейшая вода с гор Дагестана, отборный солод и хмель — вот основа нашей рецептуры.'}
            </p>
          </div>
          <div className="order-1 lg:order-2 rounded-2xl overflow-hidden bg-[#231F1A] aspect-[4/3]">
            {info?.philosophyImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.philosophyImageUrl} alt="Философия" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-10">⭐</span>
              </div>
            )}
          </div>
        </div>

        {/* Production */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="rounded-2xl overflow-hidden bg-[#231F1A] aspect-[4/3]">
            {info?.productionImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.productionImageUrl} alt="Производство" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-8xl opacity-10">⚙️</span>
              </div>
            )}
          </div>
          <div>
            <div className="section-divider mb-5" />
            <h2 className="font-display text-[#F5EFE6] text-3xl font-bold mb-4">
              {info?.productionTitle ?? 'Современное производство'}
            </h2>
            <p className="text-[#B8A898] leading-relaxed">
              {info?.productionText ?? 'Наш завод оснащён передовым оборудованием европейского производства. Строгий контроль качества на каждом этапе — от выбора сырья до розлива в бутылки.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
