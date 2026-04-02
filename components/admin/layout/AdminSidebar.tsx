'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Globe, Info, Users, Package, Newspaper,
  Image, Phone, Search, Inbox, Settings, Database, FileText, LogOut, ChevronDown,
  FolderOpen,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useState } from 'react'

interface NavItem {
  href: string
  label: string
  icon: React.ElementType
  badge?: number
  children?: { href: string; label: string }[]
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Главная', icon: LayoutDashboard },
]

const siteItems: NavItem[] = [
  { href: '/admin/homepage', label: 'Главная страница', icon: Globe },
  { href: '/admin/about', label: 'О компании', icon: Info },
  { href: '/admin/team', label: 'Технолог', icon: Users },
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
]

const systemItems: NavItem[] = [
  { href: '/admin/leads', label: 'Заявки', icon: Inbox },
  { href: '/admin/contacts', label: 'Контакты', icon: Phone },
  { href: '/admin/seo', label: 'SEO', icon: Search },
  { href: '/admin/media', label: 'Медиафайлы', icon: FolderOpen },
  { href: '/admin/users', label: 'Пользователи', icon: Users },
  { href: '/admin/settings', label: 'Настройки', icon: Settings },
  { href: '/admin/logs', label: 'Журнал действий', icon: FileText },
]

interface SidebarGroupProps {
  title: string
  items: NavItem[]
  pathname: string
}

function SidebarGroup({ title, items, pathname }: SidebarGroupProps) {
  return (
    <div className="mb-4">
      <p className="px-3 py-1 text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
        {title}
      </p>
      {items.map((item) => (
        <SidebarItem key={item.href} item={item} pathname={pathname} />
      ))}
    </div>
  )
}

function SidebarItem({ item, pathname }: { item: NavItem; pathname: string }) {
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

interface AdminSidebarProps {
  newLeadsCount?: number
}

export function AdminSidebar({ newLeadsCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname()

  const systemItemsWithBadge = systemItems.map((item) =>
    item.href === '/admin/leads' ? { ...item, badge: newLeadsCount } : item
  )

  return (
    <aside className="w-56 flex-shrink-0 bg-white border-r border-admin-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-admin-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-stone-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-[10px]">ДП</span>
          </div>
          <div>
            <p className="text-stone-900 text-xs font-semibold leading-none">Дербентская</p>
            <p className="text-stone-400 text-[9px] leading-none mt-0.5 uppercase tracking-wider">Пивоварня</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {navItems.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}

        <div className="my-3 border-t border-stone-100" />
        <SidebarGroup title="Сайт" items={siteItems} pathname={pathname} />
        <SidebarGroup title="Контент" items={contentItems} pathname={pathname} />
        <SidebarGroup title="Система" items={systemItemsWithBadge} pathname={pathname} />
      </nav>

      {/* Logout */}
      <div className="px-2 py-3 border-t border-admin-border">
        <button
          onClick={() => signOut({ callbackUrl: '/auth/login' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-stone-500 hover:text-stone-900 hover:bg-stone-50 transition-colors"
        >
          <LogOut size={16} />
          Выйти
        </button>
      </div>
    </aside>
  )
}
