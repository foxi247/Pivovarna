'use client'

import { useState } from 'react'
import { AlertTriangle, Trash2 } from 'lucide-react'

export default function ResetPage() {
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleReset() {
    if (confirm !== 'reset') return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка')
      setDone(true)
      setConfirm('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Ошибка')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Сброс данных</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Удаление аналитики и заявок</p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6">
        <div className="flex gap-3">
          <AlertTriangle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-700 font-semibold text-sm">Внимание! Это действие необратимо</p>
            <p className="text-red-600 text-sm mt-1">Будут удалены:</p>
            <ul className="text-red-600 text-sm mt-1 list-disc list-inside space-y-0.5">
              <li>Все заявки (лиды) и их история</li>
              <li>Вся аналитика посещений</li>
              <li>Журнал активности</li>
            </ul>
            <p className="text-red-600 text-sm mt-2">Контент сайта (статьи, продукты, галерея) <strong>не затрагивается</strong>.</p>
          </div>
        </div>
      </div>

      {done ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-green-700 font-medium">
          Данные успешно сброшены.
        </div>
      ) : (
        <div className="bg-white border border-admin-border rounded-xl p-5 space-y-4">
          <div>
            <label className="block text-admin-text text-sm font-medium mb-2">
              Для подтверждения введите слово <span className="font-mono font-bold">reset</span>
            </label>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="reset"
              className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            onClick={handleReset}
            disabled={confirm !== 'reset' || loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Trash2 size={16} />
            {loading ? 'Удаление...' : 'Сбросить данные'}
          </button>
        </div>
      )}
    </div>
  )
}
