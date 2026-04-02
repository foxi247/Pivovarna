'use client'

import { ExternalLink, User } from 'lucide-react'
import Link from 'next/link'
import type { Session } from 'next-auth'
import { ROLE_LABELS } from '@/lib/utils'
import type { UserRole } from '@prisma/client'

interface AdminHeaderProps {
  session: Session | null
  title?: string
}

export function AdminHeader({ session, title }: AdminHeaderProps) {
  return (
    <header className="h-14 border-b border-admin-border bg-white flex items-center justify-between px-6 flex-shrink-0">
      <div>
        {title && <h1 className="text-admin-text font-semibold text-base">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800 text-sm transition-colors"
        >
          <ExternalLink size={14} />
          Сайт
        </Link>

        {session?.user && (
          <div className="flex items-center gap-2.5 pl-4 border-l border-admin-border">
            <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center">
              <User size={15} className="text-stone-600" />
            </div>
            <div>
              <p className="text-admin-text text-sm font-medium leading-none">{session.user.name}</p>
              <p className="text-admin-text-muted text-[11px] leading-none mt-0.5">
                {ROLE_LABELS[session.user.role as UserRole] ?? session.user.role}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
