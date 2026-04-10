import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const record = await prisma.pageContent.findUnique({ where: { key: 'nav_config' } })
    return NextResponse.json(record?.data ?? { hidden: [], customHidden: [] })
  } catch {
    return NextResponse.json({ hidden: [], customHidden: [] })
  }
}
