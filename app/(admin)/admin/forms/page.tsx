'use client'

import { useEffect, useState } from 'react'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'

interface FormFieldConfig {
  visible: boolean
  required: boolean
  label?: string
  placeholder?: string
}

interface FormConfig {
  title?: string
  subtitle?: string
  buttonText?: string
  fields?: {
    phone?: FormFieldConfig
    email?: FormFieldConfig
    company?: FormFieldConfig
    message?: FormFieldConfig
  }
}

const FIELD_LABELS: Record<string, string> = {
  phone: 'Телефон',
  email: 'Email',
  company: 'Компания',
  message: 'Сообщение',
}

const DEFAULT_FIELD = (visible: boolean, required: boolean): FormFieldConfig => ({ visible, required })

const FORM_PAGES = [
  { key: 'form_cooperation', label: 'Сотрудничество', defaultTitle: 'Стать партнёром' },
  { key: 'form_partners', label: 'Партнёры', defaultTitle: 'Стать дистрибьютором' },
  { key: 'form_tours', label: 'Экскурсии', defaultTitle: 'Записаться на экскурсию' },
]

const DEFAULT_CFG: FormConfig = {
  title: '',
  subtitle: '',
  buttonText: 'Отправить заявку',
  fields: {
    phone: DEFAULT_FIELD(true, false),
    email: DEFAULT_FIELD(true, false),
    company: DEFAULT_FIELD(true, false),
    message: DEFAULT_FIELD(true, true),
  },
}

function FormEditor({ formKey, label }: { formKey: string; label: string }) {
  const [cfg, setCfg] = useState<FormConfig>(DEFAULT_CFG)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setLoading(true)
    fetch(`/api/admin/page-content/${formKey}`)
      .then(r => r.json())
      .then(d => {
        if (d && typeof d === 'object' && !d.error) {
          setCfg({ ...DEFAULT_CFG, ...d, fields: { ...DEFAULT_CFG.fields, ...(d.fields ?? {}) } })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [open, formKey])

  async function save() {
    setSaving(true); setSaved(false); setSaveError('')
    try {
      const res = await fetch(`/api/admin/page-content/${formKey}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error || 'Ошибка сервера')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e: unknown) {
      setSaveError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setSaving(false)
    }
  }

  function setFieldProp(key: string, prop: keyof FormFieldConfig, value: boolean | string) {
    setCfg(c => ({
      ...c,
      fields: {
        ...c.fields,
        [key]: { ...(c.fields?.[key as keyof typeof c.fields] ?? DEFAULT_FIELD(true, false)), [prop]: value },
      },
    }))
  }

  return (
    <div className="bg-white border border-admin-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-stone-50 transition-colors"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-admin-text font-semibold">{label}</span>
        {open ? <ChevronUp size={16} className="text-admin-text-muted" /> : <ChevronDown size={16} className="text-admin-text-muted" />}
      </button>

      {open && (
        <div className="border-t border-admin-border p-5 space-y-5">
          {loading ? (
            <p className="text-admin-text-muted text-sm">Загрузка...</p>
          ) : (
            <>
              {/* Texts */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-admin-text-muted text-xs mb-1">Заголовок формы</label>
                  <input value={cfg.title ?? ''} onChange={e => setCfg(c => ({ ...c, title: e.target.value }))}
                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
                </div>
                <div>
                  <label className="block text-admin-text-muted text-xs mb-1">Текст кнопки</label>
                  <input value={cfg.buttonText ?? ''} onChange={e => setCfg(c => ({ ...c, buttonText: e.target.value }))}
                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-admin-text-muted text-xs mb-1">Подзаголовок</label>
                  <input value={cfg.subtitle ?? ''} onChange={e => setCfg(c => ({ ...c, subtitle: e.target.value }))}
                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300" />
                </div>
              </div>

              {/* Field toggles */}
              <div>
                <p className="text-admin-text-muted text-xs font-semibold uppercase tracking-wider mb-2">Поля формы</p>
                <p className="text-admin-text-muted text-xs mb-3">«Имя» всегда обязательно и не может быть скрыто.</p>
                <div className="border border-admin-border rounded-xl divide-y divide-admin-border">
                  {(['phone', 'email', 'company', 'message'] as const).map(key => {
                    const f = cfg.fields?.[key] ?? DEFAULT_FIELD(key !== 'company', key === 'message')
                    return (
                      <div key={key} className="flex items-center justify-between px-4 py-3">
                        <div>
                          <p className="text-admin-text text-sm font-medium">{FIELD_LABELS[key]}</p>
                          {f.visible && (
                            <label className="flex items-center gap-1.5 text-xs text-admin-text-muted cursor-pointer mt-1">
                              <input type="checkbox" checked={f.required}
                                onChange={e => setFieldProp(key, 'required', e.target.checked)} className="rounded" />
                              Обязательное
                            </label>
                          )}
                        </div>
                        <div
                          onClick={() => setFieldProp(key, 'visible', !f.visible)}
                          className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${f.visible ? 'bg-stone-900' : 'bg-stone-200'}`}
                        >
                          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${f.visible ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {saveError && <p className="text-red-500 text-sm">{saveError}</p>}
              <button onClick={save} disabled={saving}
                className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                <Save size={14} />
                {saving ? 'Сохранение...' : saved ? 'Сохранено ✓' : 'Сохранить'}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminFormsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Формы заявок</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">
          Настройте поля, заголовки и тексты для каждой формы на сайте. Нажмите на форму чтобы раскрыть настройки.
        </p>
      </div>
      <div className="space-y-3">
        {FORM_PAGES.map(fp => (
          <FormEditor key={fp.key} formKey={fp.key} label={fp.label} />
        ))}
      </div>
    </div>
  )
}
