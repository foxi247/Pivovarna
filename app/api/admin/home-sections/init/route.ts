import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-auth'
import { prisma } from '@/lib/db'

const DEFAULT_SECTIONS = [
  { key: 'HERO', sortOrder: 0 },
  { key: 'ABOUT_BRIEF', sortOrder: 1 },
  { key: 'STATS', sortOrder: 2 },
  { key: 'PRODUCTS', sortOrder: 3 },
  { key: 'TEAM_PERSON', sortOrder: 4 },
  { key: 'NEWS', sortOrder: 5 },
  { key: 'GALLERY', sortOrder: 6 },
  { key: 'PARTNERS', sortOrder: 7 },
  { key: 'CONTACTS_CTA', sortOrder: 8 },
] as const

export async function POST() {
  const { error } = await requireAuth(['SUPERADMIN', 'ADMIN', 'CONTENT_EDITOR'])
  if (error) return error
  try {
    // Upsert each section — safe to call multiple times
    await Promise.all(
      DEFAULT_SECTIONS.map(({ key, sortOrder }) =>
        prisma.homeSection.upsert({
          where: { key },
          update: {},
          create: { key, isVisible: true, sortOrder },
        })
      )
    )
    const sections = await prisma.homeSection.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json({ success: true, sections })
  } catch (err) {
    console.error('[POST /api/admin/home-sections/init]', err)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
