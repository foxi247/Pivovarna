'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Save, X, GripVertical } from 'lucide-react'

interface TourFeature {
  title: string
  desc: string
}

interface ToursData {
  heading?: string
  subheading?: string
  intro?: string
  features?: TourFeature[]
}

const DEFAULT_DATA: ToursData = {
  heading: 'Экскурсии и дегустации',
  subheading: 'Для гостей',
  intro: 'Приглашаем вас погрузиться в мир пивоварения — увидеть производственный процесс изнутри, узнать секреты создания наших сортов и оценить их вкус.',
  features: [
    { title: 'Производственная экскурсия', desc: 'Осмотр варочного цеха, ферментационного отделения и цеха розлива' },
    { title: 'Дегустация', desc: 'Знакомство с ключевыми сортами нашего ассортимента' },
    { title: 'Встреча с технологом', desc: 'Рассказ о рецептурах и истории каждого сорта' },
  ],
}

export default function AdminToursPage() {
  const [data, setData] = useState<ToursData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/page-content/tours')
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object' && !d.error) setData({ ...DEFAULT_DATA, ...d })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/admin/page-content/tours', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Ошибка')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  function addFeature() {
    setData(d => ({ ...d, features: [...(d.features ?? []), { title: '', desc: '' }] }))
  }

  function removeFeature(idx: number) {
    setData(d => ({ ...d, features: d.features?.filter((_, i) => i !== idx) }))
  }

  function updateFeature(idx: number, field: keyof TourFeature, value: string) {
    setData(d => ({
      ...d,
      features: d.features?.map((f, i) => i === idx ? { ...f, [field]: value } : f),
    }))
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-admin-text-muted text-sm">Загрузка...</div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Экскурсии</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">Содержимое страницы экскурсий и дегустаций</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
        >
          <Save size={16} />
          {saving ? 'Сохранение...' : saved ? 'Сохранено ✓' : 'Сохранить'}
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">{error}</div>
      )}

      <div className="space-y-6">
        {/* Main text */}
        <div className="bg-white border border-admin-border rounded-xl p-5">
          <h2 className="text-admin-text font-semibold mb-4">Основной текст</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Надпись над заголовком</label>
              <input
                value={data.subheading ?? ''}
                onChange={e => setData(d => ({ ...d, subheading: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Для гостей"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Заголовок страницы</label>
              <input
                value={data.heading ?? ''}
                onChange={e => setData(d => ({ ...d, heading: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Экскурсии и дегустации"
              />
            </div>
            <div>
              <label className="block text-admin-text-muted text-xs mb-1">Вводный текст</label>
              <textarea
                rows={3}
                value={data.intro ?? ''}
                onChange={e => setData(d => ({ ...d, intro: e.target.value }))}
                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="bg-white border border-admin-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-admin-text font-semibold">Пункты программы</h2>
            <button
              onClick={addFeature}
              className="flex items-center gap-1.5 text-xs text-[#C8873A] hover:text-[#b57830] font-medium transition-colors"
            >
              <Plus size={14} />
              Добавить пункт
            </button>
          </div>
          <div className="space-y-3">
            {(data.features ?? []).map((feature, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-stone-50 border border-admin-border rounded-lg p-3">
                <GripVertical size={16} className="text-admin-text-muted mt-2 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <input
                    value={feature.title}
                    onChange={e => updateFeature(idx, 'title', e.target.value)}
                    className="w-full border border-admin-border rounded-lg px-3 py-1.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                    placeholder="Название пункта"
                  />
                  <input
                    value={feature.desc}
                    onChange={e => updateFeature(idx, 'desc', e.target.value)}
                    className="w-full border border-admin-border rounded-lg px-3 py-1.5 text-admin-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                    placeholder="Описание"
                  />
                </div>
                <button onClick={() => removeFeature(idx)} className="p-1 text-admin-text-muted hover:text-red-500 transition-colors mt-1">
                  <X size={14} />
                </button>
              </div>
            ))}
            {(data.features ?? []).length === 0 && (
              <p className="text-admin-text-muted text-sm text-center py-4">Нет пунктов. Нажмите «Добавить пункт».</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
