import { getHeroSlides, getHomeSections } from '@/lib/services/settings.service'
import Link from 'next/link'
import { Plus, Edit2, Eye, EyeOff } from 'lucide-react'

export default async function AdminHomepagePage() {
  const [slides, sections] = await Promise.all([
    getHeroSlides(false),
    getHomeSections(),
  ])

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Главная страница</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Hero-слайды и порядок секций</p>
      </div>

      {/* Hero slides */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-admin-text font-semibold">Hero-слайды</h2>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-stone-900 text-white rounded-lg text-xs hover:bg-stone-800 transition-colors">
            <Plus size={14} />
            Добавить слайд
          </button>
        </div>
        <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
          {slides.length === 0 ? (
            <p className="text-center py-8 text-admin-text-muted text-sm">Слайдов нет. Добавьте первый.</p>
          ) : (
            slides.map((slide) => (
              <div key={slide.id} className="flex items-center justify-between px-5 py-4 border-b border-admin-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-10 rounded-lg bg-stone-100 overflow-hidden flex-shrink-0">
                    {slide.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div>
                    <p className="text-admin-text text-sm font-medium">{slide.title}</p>
                    {slide.subtitle && <p className="text-admin-text-muted text-xs">{slide.subtitle}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${slide.isActive ? 'text-green-600' : 'text-stone-400'}`}>
                    {slide.isActive ? '● Активен' : '○ Скрыт'}
                  </span>
                  <button className="text-blue-600 text-xs hover:underline flex items-center gap-1">
                    <Edit2 size={12} /> Редактировать
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Sections order */}
      <div>
        <h2 className="text-admin-text font-semibold mb-4">Порядок секций</h2>
        <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-stone-50 border-b border-admin-border">
            <p className="text-admin-text-muted text-xs">Перетащите секции для изменения порядка (будет доступно после установки)</p>
          </div>
          {sections.map((section) => {
            const labels: Record<string, string> = {
              HERO: 'Главный экран',
              ABOUT_BRIEF: 'О компании',
              STATS: 'Статистика',
              PRODUCTS: 'Продукция',
              TEAM_PERSON: 'Технолог',
              NEWS: 'Новости',
              GALLERY: 'Галерея',
              PARTNERS: 'Партнёры',
              CONTACTS_CTA: 'Контакты',
            }
            return (
              <div key={section.id} className="flex items-center justify-between px-5 py-3.5 border-b border-admin-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-stone-300">≡</span>
                  <span className="text-admin-text text-sm">{labels[section.key] ?? section.key}</span>
                </div>
                <span className={`text-xs ${section.isVisible ? 'text-green-600' : 'text-stone-400'}`}>
                  {section.isVisible ? 'Отображается' : 'Скрыта'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
