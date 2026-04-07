'use client'

import { useEffect } from 'react'

export function ArticleViewTracker({ articleId }: { articleId: string }) {
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId }),
    }).catch(() => {/* silent */})
  }, [articleId])

  return null
}
