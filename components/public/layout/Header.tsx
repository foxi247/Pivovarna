'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const STATIC_NAV = [
  { href: '/', label: 'Главная', exact: true },
  { href: '/about', label: 'О нас', exact: false },
  { href: '/products', label: 'Продукция', exact: false },
  { href: '/news', label: 'Новости', exact: false },
  { href: '/gallery', label: 'Галерея', exact: false },
  { href: '/tours', label: 'Экскурсии', exact: false },
  { href: '/contacts', label: 'Контакты', exact: false },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [extraLinks, setExtraLinks] = useState<{ href: string; label: string; exact: boolean }[]>([])
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    fetch('/api/nav-pages').then(r => r.ok ? r.json() : []).then((pages: { slug: string; navLabel: string | null; title: string }[]) => {
      setExtraLinks(pages.map(p => ({ href: `/${p.slug}`, label: p.navLabel || p.title, exact: false })))
    }).catch(() => {})
  }, [])

  const navLinks = [...STATIC_NAV, ...extraLinks]

  function isActive(link: { href: string; exact: boolean }) {
    if (link.exact) return pathname === link.href
    return pathname === link.href || pathname.startsWith(link.href + '/')
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-[#0F0D0A]/95 backdrop-blur-md border-b border-[#3D352B] py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#C8873A] flex items-center justify-center">
              <span className="text-[#0F0D0A] font-bold text-sm">ДП</span>
            </div>
            <div>
              <p className="font-display text-[#F5EFE6] text-sm font-semibold leading-none tracking-wide">
                Дербентская
              </p>
              <p className="text-[#C8873A] text-[10px] tracking-[0.25em] uppercase leading-none mt-0.5">
                Пивоварня
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative text-sm transition-colors duration-200 pb-0.5',
                    active ? 'text-[#C8873A]' : 'text-[#B8A898] hover:text-[#F5EFE6]'
                  )}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#C8873A] rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/cooperation"
              className="hidden lg:inline-flex items-center px-5 py-2.5 bg-[#C8873A] hover:bg-[#E8A855] text-[#0F0D0A] text-sm font-semibold rounded-md transition-all duration-200 hover:-translate-y-0.5"
            >
              Сотрудничество
            </Link>
            <button
              className="lg:hidden text-[#B8A898] hover:text-[#F5EFE6] transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Меню"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 inset-x-0 z-40 pt-20 pb-8 bg-[#0F0D0A]/98 backdrop-blur-md border-b border-[#3D352B]"
          >
            <nav className="flex flex-col gap-1 px-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'block py-3 text-lg border-b border-[#2E2820] transition-colors',
                      isActive(link) ? 'text-[#C8873A]' : 'text-[#F5EFE6]'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-4"
              >
                <Link
                  href="/cooperation"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center py-3 bg-[#C8873A] text-[#0F0D0A] font-semibold rounded-md"
                >
                  Сотрудничество
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
