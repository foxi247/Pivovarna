'use client'

import { useEffect, useState } from 'react'
import { Save, Eye, EyeOff, Navigation } from 'lucide-react'

interface NavItem {
  key: string
  label: string
  href: string
  visible: boolean
  isCustom?: boolean
  customId?: string
}

// Static pages that can be hidden
const STATIC_NAV: Omit<NavItem, 'visible'>[] = [
  { key: 'home', label: 'Главная', href: '/' },
  { key: 'about', label: 'О нас', href: '/about' },
  { key: 'products', label: 'Продукция', href: '/products' },
  { key: 'news', label: 'Новости', href: '/news' },
  { key: 'gallery', label: 'Галерея', href: '/gallery' },
  { key: 'tours', label: 'Экскурсии', href: '/tours' },
  { key: 'contacts', label: 'Контакты', href: '/contacts' },
  { key: 'cooperation', label: 'Сотрудничество (кнопка)', href: '/cooperation' },
]

interface NavConfig {
  hidden: string[]      // keys of hidden static pages
  customHidden: string[] // ids of hidden custom pages
}

interface CustomPage {
  id: string
  slug: string
  title: string
  navLabel: string | null
  showInNav: boolean
  isPublished: boolean
}

export default function AdminNavigationPage() {
  const [config, setConfig] = useState<NavConfig>({ hidden: [], customHidden: [] })
  const [customPages, setCustomPages] = useState<CustomPage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/navigation').then(r => r.ok ? r.json() : null),
      fetch('/api/admin/custom-pages').then(r => r.ok ? r.json() : []),
    ]).then(([navConfig, pages]) => {
      if (navConfig) setConfig(navConfig)
      // Show all custom pages so admin can manage their nav visibility regardless of publish state
      setCustomPages(pages)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  function toggleStatic(key: string) {
    setConfig(c => ({
      ...c,
      hidden: c.hidden.includes(key)
        ? c.hidden.filter(k => k !== key)
        : [...c.hidden, key],
    }))
  }

  function toggleCustom(id: string) {
    setConfig(c => ({
      ...c,
      customHidden: c.customHidden.includes(id)
        ? c.customHidden.filter(k => k !== id)
        : [...c.customHidden, id],
    }))
  }

  async function save() {
    setSaving(true); setError(''); setSaved(false)
    try {
      const res = await fetch('/api/admin/navigation', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
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

  if (loading) return <div className="p-8 text-center text-admin-text-muted text-sm">Загрузка...</div>

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-admin-text text-2xl font-semibold">Навигация</h1>
          <p className="text-admin-text-muted text-sm mt-0.5">
            Включите или отключите страницы в меню сайта. Скрытые страницы остаются в базе — контент не удаляется.
          </p>
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

      {/* Static pages */}
      <div className="bg-white border border-admin-border rounded-xl overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-admin-border bg-stone-50">
          <p className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider flex items-center gap-2">
            <Navigation size={13} />
            Основные страницы
          </p>
        </div>
        <div className="divide-y divide-admin-border">
          {STATIC_NAV.map(item => {
            const isVisible = !config.hidden.includes(item.key)
            return (
              <div key={item.key} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-admin-text text-sm font-medium">{item.label}</p>
                  <p className="text-admin-text-muted text-xs">{item.href}</p>
                </div>
                <button
                  onClick={() => toggleStatic(item.key)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    isVisible
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                  }`}
                >
                  {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                  {isVisible ? 'Показать' : 'Скрыта'}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom pages */}
      {customPages.length > 0 && (
        <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-admin-border bg-stone-50">
            <p className="text-xs font-semibold text-admin-text-muted uppercase tracking-wider">Произвольные страницы</p>
          </div>
          <div className="divide-y divide-admin-border">
            {customPages.map(page => {
              const canBeInNav = page.showInNav && page.isPublished
              const isVisible = canBeInNav && !config.customHidden.includes(page.id)
              return (
                <div key={page.id} className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <p className="text-admin-text text-sm font-medium">{page.navLabel || page.title}</p>
                    <p className="text-admin-text-muted text-xs">/{page.slug}</p>
                    {!page.isPublished && (
                      <p className="text-xs text-amber-600 mt-0.5">Не опубликована — не будет показана в меню</p>
                    )}
                    {page.isPublished && !page.showInNav && (
                      <p className="text-xs text-amber-600 mt-0.5">«Показывать в навигации» выключено в настройках страницы</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleCustom(page.id)}
                    disabled={!canBeInNav}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      isVisible
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
                    }`}
                  >
                    {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                    {isVisible ? 'Показана' : 'Скрыта'}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-admin-text-muted">
        Изменения вступают в силу немедленно после сохранения. Контент страниц не удаляется — страница просто пропадает из меню.
      </p>
    </div>
  )
}
