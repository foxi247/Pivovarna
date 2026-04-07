'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export function PageTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin') || pathname.startsWith('/auth')) return

    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: pathname,
        referrer: document.referrer || undefined,
      }),
    }).catch(() => {/* silent */})
  }, [pathname])

  return null
}
