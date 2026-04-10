'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Globe, Info, Users, Package, Newspaper,
  Image, Phone, Search, Inbox, Settings, FileText, LogOut,
  ChevronDown, FolderOpen, BarChart2, Menu, X, ExternalLink,
  GraduationCap, UserSquare2, MapPin, LayoutTemplate,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  roles?: string[]
  children?: { href: string; label: string }[]
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Главная', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Аналитика', icon: BarChart2 },
]

const siteItems: NavItem[] = [
  { href: '/admin/homepage', label: 'Главная страница', icon: Globe },
  { href: '/admin/about', label: 'О компании', icon: Info },
  { href: '/admin/team', label: 'Технолог', icon: Users },
  { href: '/admin/employees', label: 'Сотрудники', icon: UserSquare2 },
  { href: '/admin/tours', label: 'Экскурсии', icon: MapPin },
]

const contentItems: NavItem[] = [
  {
    href: '/admin/products',
    label: 'Продукция',
    icon: Package,
    children: [
      { href: '/admin/products', label: 'Все продукты' },
      { href: '/admin/products/categories', label: 'Категории' },
    ],
  },
  {
    href: '/admin/news',
    label: 'Новости',
    icon: Newspaper,
    children: [
      { href: '/admin/news', label: 'Все статьи' },
      { href: '/admin/news/categories', label: 'Категории' },
    ],
  },
  { href: '/admin/gallery', label: 'Галерея', icon: Image },
  { href: '/admin/pages', label: 'Произвольные страницы', icon: LayoutTemplate },
]

const systemItems: NavItem[] = [
  { href: '/admin/leads', label: 'Заявки', icon: Inbox },
  { href: '/admin/contacts', label: 'Контакты', icon: Phone, roles: ['SUPERADMIN', 'ADMIN'] },
  { href: '/admin/seo', label: 'SEO', icon: Search, roles: ['SUPERADMIN', 'ADMIN'] },
  { href: '/admin/media', label: 'Медиафайлы', icon: FolderOpen },
  { href: '/admin/users', label: 'Пользователи', icon: Users, roles: ['SUPERADMIN', 'ADMIN'] },
  { href: '/admin/settings', label: 'Настройки', icon: Settings, roles: ['SUPERADMIN', 'ADMIN'] },
  { href: '/admin/reset', label: 'Сброс данных', icon: FileText, roles: ['SUPERADMIN'] },
  { href: '/admin/logs', label: 'Журнал', icon: FileText, roles: ['SUPERADMIN', 'ADMIN'] },
]

function SidebarItem({
  item,
  pathname,
  onNav,
}: {
  item: NavItem
  pathname: string
  onNav?: () => void
}) {
  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
  const [open, setOpen] = useState(isActive)
  const Icon = item.icon

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(!open)}
          className={cn(
            'w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
            isActive ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
          )}
        >
          <span className="flex items-center gap-3">
            <Icon size={16} />
            {item.label}
          </span>
          <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
        </button>
        {open && (
          <div className="ml-7 mt-0.5 space-y-0.5">
            {item.children.map((child) => (
              <Link
                key={child.href}
                href={child.href}
                onClick={onNav}
                className={cn(
                  'block px-3 py-1.5 rounded-md text-sm transition-colors',
                  pathname === child.href
                    ? 'text-stone-900 font-medium bg-stone-100'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                )}
              >
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onNav}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
        isActive ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
      )}
    >
      <Icon size={16} />
      {item.label}
      {item.badge !== undefined && item.badge > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  )
}

function SidebarContent({
  pathname,
  newLeadsCount,
  userRole,
  onNav,
}: {
  pathname: string
  newLeadsCount: number
  userRole: string
  onNav?: () => void
}) {
  function canSee(item: NavItem) {
    if (!item.roles) return true
    return item.roles.includes(userRole)
  }

  const systemWithBadge = systemItems
    .filter(canSee)
    .map((item) =>
      item.href === '/admin/leads' ? { ...item, badge: newLeadsCount } : item
    )

  return (
    <>
      {/* Logo */}
      <div className="px-4 py-4 border-b border-admin-border flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[10px]">ДП</span>
          </div>
          <div>
            <p className="text-stone-900 text-xs font-semibold leading-none">Дербентская</p>
            <p className="text-stone-400 text-[9px] leading-none mt-0.5 uppercase tracking-wider">Панель управления</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} onNav={onNav} />
        ))}

        <div className="my-3 border-t border-stone-100" />

        <p className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Сайт</p>
        {siteItems.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} onNav={onNav} />
        ))}

        <div className="my-3 border-t border-stone-100" />

        <p className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Контент</p>
        {contentItems.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} onNav={onNav} />
        ))}

        <div className="my-3 border-t border-stone-100" />

        {systemWithBadge.length > 0 && (
          <>
            <p className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">Система</p>
            {systemWithBadge.map((item) => (
              <SidebarItem key={item.href} item={item} pathname={pathname} onNav={onNav} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="px-2 py-3 border-t border-admin-border space-y-1 flex-shrink-0">
        <Link
          href="/admin/tutorial"
          onClick={onNav}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <GraduationCap size={16} />
          Обучение
        </Link>
        <Link
          href="/"
          target="_blank"
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <ExternalLink size={16} />
          На сайт
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </>
  )
}

interface AdminSidebarProps {
  newLeadsCount?: number
  userRole?: string
}

export function AdminSidebar({ newLeadsCount = 0, userRole = 'CONTENT_EDITOR' }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-admin-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[10px]">ДП</span>
          </div>
          <span className="text-stone-900 text-sm font-semibold">Панель управления</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
          aria-label="Меню"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          'lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-white border-r border-admin-border flex flex-col transition-transform duration-300',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarContent
          pathname={pathname}
          newLeadsCount={newLeadsCount}
          userRole={userRole}
          onNav={() => setMobileOpen(false)}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 flex-shrink-0 bg-white border-r border-admin-border h-screen sticky top-0 flex-col">
        <SidebarContent pathname={pathname} newLeadsCount={newLeadsCount} userRole={userRole} />
      </aside>
    </>
  )
}
