'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Save, ChevronDown } from 'lucide-react'
import type { SeoSettings } from '@prisma/client'

interface SeoFormProps {
  pages: { key: string; label: string }[]
  seoMap: Record<string, SeoSettings>
}

export function SeoForm({ pages, seoMap }: SeoFormProps) {
  const [activeTab, setActiveTab] = useState(pages[0].key)
  const [data, setData] = useState<Record<string, Record<string, string>>>(() => {
    const init: Record<string, Record<string, string>> = {}
    pages.forEach(({ key }) => {
      const seo = seoMap[key]
      init[key] = {
        title: seo?.title ?? '',
        description: seo?.description ?? '',
        keywords: seo?.keywords ?? '',
        ogTitle: seo?.ogTitle ?? '',
        ogDescription: seo?.ogDescription ?? '',
      }
    })
    return init
  })
  const [loading, setLoading] = useState(false)

  const update = (page: string, field: string, value: string) => {
    setData((prev) => ({ ...prev, [page]: { ...prev[page], [field]: value } }))
  }

  const handleSave = async (page: string) => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, ...data[page] }),
      })
      if (!res.ok) throw new Error()
      toast.success('SEO сохранено')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  const activePage = pages.find((p) => p.key === activeTab)!
  const activeData = data[activeTab]

  return (
    <div className="flex gap-6">
      {/* Tabs */}
      <div className="w-48 flex-shrink-0">
        <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
          {pages.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-admin-border last:border-0 ${
                activeTab === key
                  ? 'bg-stone-100 text-admin-text font-medium'
                  : 'text-admin-text-muted hover:bg-stone-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="flex-1">
        <div className="bg-white border border-admin-border rounded-xl p-6">
          <h2 className="text-admin-text font-semibold mb-6">{activePage.label}</h2>
          <div className="space-y-4">
            {[
              { key: 'title', label: 'Title (заголовок страницы)', placeholder: '60–70 символов', rows: 1 },
              { key: 'description', label: 'Description (описание)', placeholder: '120–160 символов', rows: 2 },
              { key: 'keywords', label: 'Keywords (ключевые слова)', placeholder: 'слово1, слово2, ...', rows: 1 },
              { key: 'ogTitle', label: 'OG Title (заголовок для соцсетей)', placeholder: 'Заголовок для шеринга', rows: 1 },
              { key: 'ogDescription', label: 'OG Description (описание для соцсетей)', placeholder: 'Описание для шеринга', rows: 2 },
            ].map(({ key, label, placeholder, rows }) => (
              <div key={key}>
                <label className="block text-admin-text text-sm font-medium mb-1.5">{label}</label>
                {rows === 1 ? (
                  <input
                    value={activeData[key] ?? ''}
                    onChange={(e) => update(activeTab, key, e.target.value)}
                    placeholder={placeholder}
                    className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300"
                  />
                ) : (
                  <textarea
                    value={activeData[key] ?? ''}
                    onChange={(e) => update(activeTab, key, e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    className="w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 resize-none"
                  />
                )}
                <p className="text-admin-text-muted text-xs mt-1">
                  {(activeData[key] ?? '').length} символов
                </p>
              </div>
            ))}

            <button
              onClick={() => handleSave(activeTab)}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors"
            >
              <Save size={15} />
              Сохранить SEO для страницы «{activePage.label}»
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
