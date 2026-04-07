'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/about', label: 'О нас' },
  { href: '/products', label: 'Продукция' },
  { href: '/news', label: 'Новости' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/tours', label: 'Экскурсии' },
  { href: '/contacts', label: 'Контакты' },
]

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
          <Link href="/" className="flex items-center gap-3 group">
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
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm transition-colors duration-200',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'text-[#C8873A]'
                    : 'text-[#B8A898] hover:text-[#F5EFE6]'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA + mobile */}
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
                      pathname === link.href ? 'text-[#C8873A]' : 'text-[#F5EFE6]'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
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
