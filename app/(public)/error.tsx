'use client'

import { useEffect } from 'react'

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[PublicError]', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-[#C8873A] text-sm font-semibold tracking-widest uppercase mb-3">Ошибка</p>
        <h1 className="font-display text-[#F5EFE6] text-3xl font-bold mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-[#7A6C5E] mb-2 text-sm">{error.message}</p>
        {error.digest && (
          <p className="text-[#4D4438] text-xs mb-6">digest: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-[#C8873A] hover:bg-[#E8A855] text-[#0F0D0A] font-semibold rounded-md transition-colors text-sm"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  )
}
