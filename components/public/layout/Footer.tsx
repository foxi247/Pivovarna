import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const footerLinks = [
  { href: '/about', label: 'О нас' },
  { href: '/products', label: 'Продукция' },
  { href: '/team', label: 'Наш технолог' },
  { href: '/news', label: 'Новости' },
  { href: '/gallery', label: 'Галерея' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/cooperation', label: 'Сотрудничество' },
  { href: '/tours', label: 'Экскурсии' },
  { href: '/partners', label: 'Партнёрам' },
]

export function Footer() {
  return (
    <footer className="bg-[#1A1712] border-t border-[#3D352B]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#C8873A] flex items-center justify-center flex-shrink-0">
                <span className="text-[#0F0D0A] font-bold text-sm">ДП</span>
              </div>
              <div>
                <p className="font-display text-[#F5EFE6] text-sm font-semibold leading-none">Дербентская</p>
                <p className="text-[#C8873A] text-[10px] tracking-[0.25em] uppercase leading-none mt-0.5">Пивоварня</p>
              </div>
            </div>
            <p className="text-[#7A6C5E] text-sm leading-relaxed">
              Премиальное пиво из сердца Дагестана. Традиции, качество и современные технологии пивоварения с 2008 года.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#F5EFE6] text-sm font-semibold mb-4 uppercase tracking-widest">Навигация</h4>
            <ul className="space-y-2.5">
              {footerLinks.slice(0, 5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#7A6C5E] hover:text-[#C8873A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More links */}
          <div>
            <h4 className="text-[#F5EFE6] text-sm font-semibold mb-4 uppercase tracking-widest">Ещё</h4>
            <ul className="space-y-2.5">
              {footerLinks.slice(5).map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#7A6C5E] hover:text-[#C8873A] text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="text-[#F5EFE6] text-sm font-semibold mb-4 uppercase tracking-widest">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex gap-2.5 text-sm text-[#7A6C5E]">
                <MapPin size={14} className="text-[#C8873A] mt-0.5 flex-shrink-0" />
                <span>г. Дербент, ул. Производственная, 15</span>
              </li>
              <li>
                <a href="tel:+78722000000" className="flex gap-2.5 text-sm text-[#7A6C5E] hover:text-[#C8873A] transition-colors">
                  <Phone size={14} className="text-[#C8873A] mt-0.5 flex-shrink-0" />
                  +7 (8722) 00-00-00
                </a>
              </li>
              <li>
                <a href="mailto:info@pivovarna.ru" className="flex gap-2.5 text-sm text-[#7A6C5E] hover:text-[#C8873A] transition-colors">
                  <Mail size={14} className="text-[#C8873A] mt-0.5 flex-shrink-0" />
                  info@pivovarna.ru
                </a>
              </li>
              <li className="flex gap-2.5 text-sm text-[#7A6C5E]">
                <Clock size={14} className="text-[#C8873A] mt-0.5 flex-shrink-0" />
                Пн–Пт: 9:00–18:00
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#3D352B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#4D4438] text-sm">
            © {new Date().getFullYear()} Дербентская пивоварня. Все права защищены.
          </p>
          <p className="text-[#4D4438] text-xs">
            Информация носит ознакомительный характер. 18+
          </p>
        </div>
      </div>
    </footer>
  )
}
