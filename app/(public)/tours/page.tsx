import { LeadForm } from '@/components/public/forms/LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Экскурсии и дегустации',
  description: 'Запишитесь на экскурсию по Дербентской пивоварне. Узнайте как создаётся наше пиво.',
}

export default function ToursPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Для гостей</span>
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#F5EFE6] mt-3 mb-6">
              Экскурсии и дегустации
            </h1>
            <p className="text-[#B8A898] leading-relaxed mb-6">
              Приглашаем вас погрузиться в мир пивоварения — увидеть производственный процесс изнутри, узнать секреты создания наших сортов и оценить их вкус.
            </p>
            <div className="space-y-4">
              {[
                { title: 'Производственная экскурсия', desc: 'Осмотр варочного цеха, ферментационного отделения и цеха розлива' },
                { title: 'Дегустация', desc: 'Знакомство с ключевыми сортами нашего ассортимента' },
                { title: 'Встреча с технологом', desc: 'Рассказ о рецептурах и истории каждого сорта' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-[#1A1712] border border-[#3D352B] rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-[#C8873A]/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#C8873A] text-sm">✓</span>
                  </div>
                  <div>
                    <p className="text-[#F5EFE6] font-semibold text-sm">{item.title}</p>
                    <p className="text-[#7A6C5E] text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#1A1712] border border-[#3D352B] rounded-2xl p-8">
            <LeadForm
              type="TOUR"
              source="website_tours_page"
              title="Записаться на экскурсию"
              subtitle="Укажите предпочтительную дату и количество участников в сообщении"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
