'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Save, Plus, X, Upload } from 'lucide-react'
import type { CompanyInfo } from '@prisma/client'

interface Stat { value: string; label: string }

interface AboutFormProps {
  info: CompanyInfo | null
}

const DEFAULT_STATS: Stat[] = [
  { value: '2008', label: 'Год основания' },
  { value: '15+', label: 'Лет на рынке' },
  { value: '20+', label: 'Сортов пива' },
  { value: '100%', label: 'Натуральный состав' },
]

function parseStats(raw: unknown): Stat[] {
  if (Array.isArray(raw) && raw.length > 0) return raw as Stat[]
  return DEFAULT_STATS
}

function ImageField({
  label,
  value,
  onChange,
  folder,
}: {
  label: string
  value: string
  onChange: (url: string) => void
  folder: string
}) {
  const [uploading, setUploading] = useState(false)

  async function handleFile(file: File) {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')
      onChange(data.url)
      toast.success('Фото загружено')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Ошибка загрузки')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-admin-text text-sm font-medium mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://... или загрузите файл →"
          className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
        <label className={`flex items-center gap-1.5 px-3 py-2 border border-admin-border rounded-lg text-sm text-admin-text-muted hover:bg-stone-50 cursor-pointer transition-colors flex-shrink-0 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
          <Upload size={14} />
          {uploading ? '...' : 'Файл'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </label>
      </div>
      {value && (
        <img src={value} alt="" className="mt-2 h-32 w-full object-cover rounded-lg border border-admin-border" />
      )}
    </div>
  )
}

export function AboutForm({ info }: AboutFormProps) {
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<Stat[]>(parseStats(info?.stats))
  const [historyImageUrl, setHistoryImageUrl] = useState(info?.historyImageUrl ?? '')
  const [productionImageUrl, setProductionImageUrl] = useState(info?.productionImageUrl ?? '')
  const [philosophyImageUrl, setPhilosophyImageUrl] = useState(info?.philosophyImageUrl ?? '')

  const { register, handleSubmit } = useForm({
    defaultValues: {
      foundedYear: info?.foundedYear ?? 2008,
      historyTitle: info?.historyTitle ?? 'История бренда',
      historyText: info?.historyText ?? '',
      productionTitle: info?.productionTitle ?? 'Современное производство',
      productionText: info?.productionText ?? '',
      philosophyTitle: info?.philosophyTitle ?? 'Философия качества',
      philosophyText: info?.philosophyText ?? '',
    },
  })

  function updateStat(idx: number, field: keyof Stat, value: string) {
    setStats(s => s.map((st, i) => i === idx ? { ...st, [field]: value } : st))
  }

  function addStat() {
    setStats(s => [...s, { value: '', label: '' }])
  }

  function removeStat(idx: number) {
    setStats(s => s.filter((_, i) => i !== idx))
  }

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, stats, historyImageUrl, productionImageUrl, philosophyImageUrl }),
      })
      if (!res.ok) throw new Error()
      toast.success('Сохранено')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">История</h2>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Год основания</label>
          <input
            {...register('foundedYear', { valueAsNumber: true })}
            type="number"
            className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 max-w-[140px]"
          />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Заголовок раздела</label>
          <input {...register('historyTitle')} className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Текст об истории</label>
          <textarea {...register('historyText')} rows={5} className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none" />
        </div>
        <ImageField label="Фото / изображение" value={historyImageUrl} onChange={setHistoryImageUrl} folder="about" />
      </div>

      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Производство</h2>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Заголовок</label>
          <input {...register('productionTitle')} className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Текст</label>
          <textarea {...register('productionText')} rows={5} className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none" />
        </div>
        <ImageField label="Фото / изображение" value={productionImageUrl} onChange={setProductionImageUrl} folder="about" />
      </div>

      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Философия</h2>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Заголовок</label>
          <input {...register('philosophyTitle')} className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Текст</label>
          <textarea {...register('philosophyText')} rows={5} className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none" />
        </div>
        <ImageField label="Фото / изображение" value={philosophyImageUrl} onChange={setPhilosophyImageUrl} folder="about" />
      </div>

      {/* Stats editor */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Статистика</h2>
          <button type="button" onClick={addStat} className="flex items-center gap-1.5 text-xs text-[#C8873A] hover:text-[#b57830] font-medium transition-colors">
            <Plus size={13} /> Добавить
          </button>
        </div>
        <div className="space-y-2">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                value={stat.value}
                onChange={e => updateStat(idx, 'value', e.target.value)}
                className="w-28 border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 font-semibold"
                placeholder="2008"
              />
              <input
                value={stat.label}
                onChange={e => updateStat(idx, 'label', e.target.value)}
                className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                placeholder="Год основания"
              />
              <button type="button" onClick={() => removeStat(idx)} className="p-1 text-admin-text-muted hover:text-red-500 transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
          {stats.length === 0 && (
            <p className="text-admin-text-muted text-sm text-center py-3">Нет показателей. Нажмите «Добавить».</p>
          )}
        </div>
      </div>

      <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
        {loading ? 'Сохранение...' : 'Сохранить'}
      </button>
    </form>
  )
}
