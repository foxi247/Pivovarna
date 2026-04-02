import { LeadForm } from '@/components/public/forms/LeadForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Партнёрам',
  description: 'Стать дистрибьютором Дербентской пивоварни. Условия оптовых поставок.',
}

export default function PartnersPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Для бизнеса</span>
            <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-bold text-[#F5EFE6] mt-3 mb-6">
              Партнёрам
            </h1>
            <p className="text-[#B8A898] leading-relaxed mb-8">
              Мы ищем надёжных дистрибьюторов и партнёров по всему региону. Предлагаем выгодные условия оптовых поставок, маркетинговую поддержку и гибкую систему скидок.
            </p>

            <div className="space-y-4">
              {[
                { title: 'Оптовые поставки', desc: 'Конкурентные цены при заказе от 50 ящиков' },
                { title: 'Маркетинговая поддержка', desc: 'POS-материалы, рекламные кампании, промо-акции' },
                { title: 'Персональный менеджер', desc: 'Выделенный сотрудник для работы с вашим аккаунтом' },
                { title: 'Логистика', desc: 'Собственная доставка по Дагестану и Северному Кавказу' },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 bg-[#1A1712] border border-[#3D352B] rounded-xl p-4">
                  <div className="w-2 h-2 rounded-full bg-[#C8873A] mt-2 flex-shrink-0" />
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
              type="DISTRIBUTION"
              source="website_partners_page"
              title="Стать дистрибьютором"
              subtitle="Заполните форму — наш менеджер свяжется с вами для обсуждения условий"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
