'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Save, Plus, Trash2 } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ui/ImageUpload'
import type { TeamPerson } from '@prisma/client'

interface TeamPersonFormProps {
  person: TeamPerson | null
}

export function TeamPersonForm({ person }: TeamPersonFormProps) {
  const [loading, setLoading] = useState(false)
  const [achievements, setAchievements] = useState<{ title: string; year: string }[]>(
    (person?.achievements as { title: string; year: string }[] | null) ?? []
  )

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: person?.name ?? '',
      role: person?.role ?? 'Главный технолог',
      bio: person?.bio ?? '',
      quote: person?.quote ?? '',
      quoteAuthor: person?.quoteAuthor ?? '',
      experience: person?.experience ?? '',
      photoUrl: person?.photoUrl ?? '',
      isVisible: person?.isVisible ?? true,
    },
  })

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, achievements, id: person?.id }),
      })
      if (!res.ok) throw new Error()
      toast.success('Сохранено')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  const addAchievement = () => setAchievements([...achievements, { title: '', year: '' }])
  const removeAchievement = (i: number) => setAchievements(achievements.filter((_, idx) => idx !== i))
  const updateAchievement = (i: number, field: 'title' | 'year', value: string) => {
    setAchievements(achievements.map((a, idx) => idx === i ? { ...a, [field]: value } : a))
  }

  const inputCls = 'w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Основное */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Основное</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Имя и фамилия</label>
            <input {...register('name')} placeholder="Алибек Магомедов" className={inputCls} />
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Должность</label>
            <input {...register('role')} placeholder="Главный технолог" className={inputCls} />
          </div>
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Опыт работы</label>
          <input {...register('experience')} placeholder="25 лет в пивоварении" className={inputCls} />
          <p className="text-admin-text-muted text-xs mt-1">Отображается как акцент-бейдж на фото</p>
        </div>

        <div>
          <ImageUpload
            value={(watch('photoUrl') as string) ?? ''}
            onChange={(url) => setValue('photoUrl', url)}
            folder="team"
            label="Фото технолога"
            aspectRatio="square"
            hint="Рекомендуется квадратное фото, минимум 400×400 px"
          />
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Биография</label>
          <textarea {...register('bio')} rows={5} className={inputCls + ' resize-none'} placeholder="Краткое описание..." />
        </div>

        <div className="flex items-center gap-3">
          <input {...register('isVisible')} type="checkbox" id="isVisible" className="w-4 h-4 rounded border-admin-border" />
          <label htmlFor="isVisible" className="text-admin-text text-sm">Отображать на сайте</label>
        </div>
      </div>

      {/* Цитата */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Цитата</h2>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Текст цитаты</label>
          <textarea {...register('quote')} rows={3} className={inputCls + ' resize-none'} placeholder="«Пиво — это жидкий хлеб, наследие поколений»" />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Подпись к цитате</label>
          <input {...register('quoteAuthor')} placeholder="Алибек Магомедов, главный технолог" className={inputCls} />
        </div>
      </div>

      {/* Достижения */}
      <div className="bg-white border border-admin-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Достижения и награды</h2>
          <button
            type="button"
            onClick={addAchievement}
            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
          >
            <Plus size={14} />
            Добавить
          </button>
        </div>
        {achievements.length === 0 ? (
          <p className="text-admin-text-muted text-sm">Нет достижений. Нажмите «Добавить».</p>
        ) : (
          <div className="space-y-3">
            {achievements.map((a, i) => (
              <div key={i} className="flex gap-3 items-start">
                <input
                  value={a.title}
                  onChange={(e) => updateAchievement(i, 'title', e.target.value)}
                  placeholder="Название награды или достижения"
                  className={inputCls + ' flex-1'}
                />
                <input
                  value={a.year}
                  onChange={(e) => updateAchievement(i, 'year', e.target.value)}
                  placeholder="Год"
                  className="border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 w-20"
                />
                <button
                  type="button"
                  onClick={() => removeAchievement(i)}
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  )
}
