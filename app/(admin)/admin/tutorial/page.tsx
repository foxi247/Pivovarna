'use client'

import { useState } from 'react'
import { ChevronRight, ChevronLeft, X, BookOpen, LayoutDashboard, Newspaper, Package, Users, BarChart3, Image, FileText, Settings } from 'lucide-react'

const steps = [
  {
    icon: LayoutDashboard,
    title: 'Главная панель',
    description: 'На главной странице админки вы видите общую статистику: количество заявок, просмотры, активность пользователей.',
    hint: 'Используйте боковое меню для навигации между разделами.',
  },
  {
    icon: Newspaper,
    title: 'Новости',
    description: 'Создавайте и редактируйте новостные статьи. Каждая статья может иметь обложку, категорию, SEO-описание и текст.',
    hint: 'Статьи публикуются только при включённом переключателе "Опубликовано".',
  },
  {
    icon: Package,
    title: 'Продукция',
    description: 'Управляйте каталогом пива. Добавляйте сорта с описанием, характеристиками (ABV, IBU, OG) и фотографиями.',
    hint: 'Продукты можно сортировать перетаскиванием или полем "Порядок".',
  },
  {
    icon: Users,
    title: 'Сотрудники',
    description: 'Управляйте командой пивоварни. Добавляйте сотрудников с должностями, фотографиями и биографией.',
    hint: 'Сотрудники отображаются на странице "О нас" в том порядке, в котором вы их расставили.',
  },
  {
    icon: FileText,
    title: 'Заявки (CRM)',
    description: 'Все входящие заявки с сайта. Меняйте статусы, добавляйте комментарии, отслеживайте историю переписки.',
    hint: 'Заявки можно фильтровать по статусу и дате.',
  },
  {
    icon: BarChart3,
    title: 'Аналитика',
    description: 'Статистика посещений сайта: общее количество просмотров, самые популярные страницы и статьи, динамика за 7 дней.',
    hint: 'Данные обновляются в реальном времени по мере посещения сайта.',
  },
  {
    icon: Image,
    title: 'Медиабиблиотека',
    description: 'Загружайте и управляйте изображениями. Все фотографии сохраняются здесь и доступны для использования в других разделах.',
    hint: 'Поддерживаются форматы JPG, PNG, WebP. Рекомендуемый размер — до 5 МБ.',
  },
  {
    icon: Settings,
    title: 'Настройки',
    description: 'Общие настройки сайта: название компании, контакты, описание, SEO-параметры.',
    hint: 'Изменения отображаются на сайте сразу после сохранения.',
  },
]

export default function TutorialPage() {
  const [step, setStep] = useState(0)
  const [finished, setFinished] = useState(false)

  if (finished) {
    return (
      <div className="p-6 lg:p-8 max-w-2xl">
        <div className="bg-white border border-admin-border rounded-2xl p-10 text-center">
          <BookOpen size={48} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-admin-text text-xl font-semibold mb-2">Обучение завершено!</h2>
          <p className="text-admin-text-muted text-sm">Теперь вы знаете, как пользоваться панелью управления. Удачи!</p>
          <button
            onClick={() => { setFinished(false); setStep(0) }}
            className="mt-6 text-amber-600 hover:text-amber-700 text-sm font-medium"
          >
            Пройти снова
          </button>
        </div>
      </div>
    )
  }

  const current = steps[step]
  const Icon = current.icon
  const progress = ((step + 1) / steps.length) * 100

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Обучение</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">Шаг {step + 1} из {steps.length}</p>
        </div>
        <button
          onClick={() => setFinished(true)}
          className="flex items-center gap-1.5 text-admin-text-muted hover:text-admin-text text-sm transition-colors"
        >
          <X size={16} />
          Пропустить
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-admin-border rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="bg-white border border-admin-border rounded-2xl p-8">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center mb-6">
          <Icon size={28} className="text-amber-600" />
        </div>

        <h2 className="text-admin-text text-xl font-semibold mb-3">{current.title}</h2>
        <p className="text-admin-text-muted text-sm leading-relaxed mb-6">{current.description}</p>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm"><span className="font-semibold">Совет:</span> {current.hint}</p>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex justify-center gap-1.5 mt-6 mb-6">
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-amber-500' : 'bg-admin-border'}`}
          />
        ))}
      </div>

      <div className="flex gap-3">
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex items-center gap-1.5 border border-admin-border rounded-lg px-4 py-2.5 text-admin-text text-sm font-medium hover:bg-admin-bg transition-colors"
          >
            <ChevronLeft size={16} />
            Назад
          </button>
        )}
        <button
          onClick={() => step < steps.length - 1 ? setStep(step + 1) : setFinished(true)}
          className="flex-1 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
        >
          {step < steps.length - 1 ? (
            <>Далее <ChevronRight size={16} /></>
          ) : (
            'Завершить обучение'
          )}
        </button>
      </div>
    </div>
  )
}
