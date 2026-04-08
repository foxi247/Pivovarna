import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function buildUrl() {
  const url = process.env.DATABASE_URL ?? ''
  // Добавляем connection_limit=1 для serverless (Vercel) чтобы не исчерпать
  // лимит соединений Supabase Session Pooler (max 15)
  if (!url || url.includes('connection_limit')) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}connection_limit=1&pool_timeout=10`
}

function createPrismaClient() {
  return new PrismaClient({
    datasources: { db: { url: buildUrl() } },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
