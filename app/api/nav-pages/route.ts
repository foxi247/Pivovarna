import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const pages = await prisma.customPage.findMany({
      where: { isPublished: true, showInNav: true },
      select: { id: true, slug: true, navLabel: true, title: true, sortOrder: true },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(pages, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch {
    return NextResponse.json([], { headers: { 'Cache-Control': 'no-store' } })
  }
}
