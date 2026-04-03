import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Страница не найдена — Дербентская пивоварня',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0D0A] flex items-center justify-center px-4">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-lg">
        {/* 404 number */}
        <div className="font-display text-[10rem] leading-none font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#C8873A] to-[#C8873A]/20 select-none mb-4">
          404
        </div>

        <h1 className="font-display text-2xl md:text-3xl text-white mb-4">
          Страница не найдена
        </h1>

        <p className="text-white/60 text-base mb-8 leading-relaxed">
          Возможно, страница была удалена или вы перешли по неверной ссылке.
          Вернитесь на главную и попробуйте снова.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 hover:bg-amber-400 text-[#0F0D0A] font-semibold rounded-lg transition-colors duration-200"
          >
            На главную
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 border border-white/20 hover:border-amber-500/60 text-white/80 hover:text-white rounded-lg transition-colors duration-200"
          >
            Наша продукция
          </Link>
        </div>

        {/* Beer mug decorative SVG */}
        <div className="mt-12 flex justify-center opacity-20">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="8" y="16" width="36" height="40" rx="4" stroke="#C8873A" strokeWidth="2.5"/>
            <path d="M44 24 C52 24 56 28 56 34 C56 40 52 44 44 44" stroke="#C8873A" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M8 16 C8 10 12 6 20 6 L36 6 C44 6 44 16 44 16" stroke="#C8873A" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="18" y1="30" x2="18" y2="48" stroke="#C8873A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4"/>
            <line x1="26" y1="28" x2="26" y2="48" stroke="#C8873A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4"/>
            <line x1="34" y1="30" x2="34" y2="48" stroke="#C8873A" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4"/>
          </svg>
        </div>
      </div>
    </div>
  )
}
