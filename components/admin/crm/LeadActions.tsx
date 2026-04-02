'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'
import { LEAD_STATUS_LABELS } from '@/lib/utils'
import type { LeadStatus } from '@prisma/client'

interface LeadActionsProps {
  leadId: string
  currentStatus: LeadStatus
  currentAssigneeId?: string
  users: { id: string; name: string }[]
  userId: string
}

export function LeadActions({ leadId, currentStatus, currentAssigneeId, users, userId }: LeadActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState(currentStatus)
  const [assigneeId, setAssigneeId] = useState(currentAssigneeId || '')

  const handleStatusChange = async (newStatus: LeadStatus) => {
    setStatus(newStatus)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, userId }),
      })
      if (!res.ok) throw new Error()
      toast.success('Статус обновлён')
      startTransition(() => router.refresh())
    } catch {
      toast.error('Ошибка обновления статуса')
      setStatus(currentStatus)
    }
  }

  const handleAssign = async (newAssigneeId: string) => {
    setAssigneeId(newAssigneeId)
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedToId: newAssigneeId || null }),
      })
      if (!res.ok) throw new Error()
      toast.success('Ответственный назначен')
      startTransition(() => router.refresh())
    } catch {
      toast.error('Ошибка')
    }
  }

  const handleAddComment = async () => {
    if (!comment.trim()) return
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment, authorId: userId }),
      })
      if (!res.ok) throw new Error()
      toast.success('Комментарий добавлен')
      setComment('')
      startTransition(() => router.refresh())
    } catch {
      toast.error('Ошибка добавления комментария')
    }
  }

  const statuses: LeadStatus[] = ['NEW', 'IN_PROGRESS', 'WAITING', 'CLOSED', 'REJECTED']

  return (
    <div className="space-y-4 border-t border-admin-border pt-4 mt-4">
      {/* Status change */}
      <div>
        <p className="text-admin-text-muted text-xs mb-2 font-medium uppercase tracking-wider">Изменить статус</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusChange(s)}
              disabled={s === status}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                s === status
                  ? 'ring-2 ring-stone-400 ring-offset-1 opacity-70 cursor-default'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {LEAD_STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Assign */}
      <div>
        <p className="text-admin-text-muted text-xs mb-2 font-medium uppercase tracking-wider">Ответственный</p>
        <select
          value={assigneeId}
          onChange={(e) => handleAssign(e.target.value)}
          className="w-full border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
        >
          <option value="">Не назначен</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
      </div>

      {/* Comment */}
      <div>
        <p className="text-admin-text-muted text-xs mb-2 font-medium uppercase tracking-wider">Добавить комментарий</p>
        <div className="flex gap-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Внутренний комментарий..."
            rows={2}
            className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-sm text-admin-text resize-none focus:outline-none focus:ring-2 focus:ring-stone-300"
          />
          <button
            onClick={handleAddComment}
            disabled={!comment.trim() || isPending}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-40 transition-colors self-end"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </div>
      </div>
    </div>
  )
}
