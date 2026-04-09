import { prisma } from '@/lib/db'
import type { LeadStatus, LeadType, Prisma } from '@prisma/client'

export interface LeadsFilter {
  status?: LeadStatus
  type?: LeadType
  assignedToId?: string
  search?: string
  page?: number
  limit?: number
}

export async function getLeads(filter: LeadsFilter = {}) {
  const { status, type, assignedToId, search, page = 1, limit = 25 } = filter
  const skip = (page - 1) * limit

  const where: Prisma.LeadWhereInput = {}
  if (status) where.status = status
  if (type) where.type = type
  if (assignedToId) where.assignedToId = assignedToId
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
      { phone: { contains: search, mode: 'insensitive' } },
      { company: { contains: search, mode: 'insensitive' } },
    ]
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      include: { assignedTo: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ])

  return { leads, total, pages: Math.ceil(total / limit) }
}

export async function getLeadById(id: string) {
  return prisma.lead.findUnique({
    where: { id },
    include: {
      assignedTo: { select: { id: true, name: true, email: true } },
      comments: {
        include: { author: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
      },
      statusHistory: {
        include: { changedBy: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })
}

export async function createLead(data: {
  type: LeadType
  name: string
  phone?: string
  email?: string
  company?: string
  message?: string
  source?: string
  ipAddress?: string
}) {
  // Ищем первого активного администратора для записи в историю статусов
  const systemUser = await prisma.user.findFirst({
    where: { isActive: true, role: { in: ['SUPERADMIN', 'ADMIN'] } },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
  })

  return prisma.lead.create({
    data: {
      ...data,
      ...(systemUser && {
        statusHistory: {
          create: {
            toStatus: 'NEW',
            changedById: systemUser.id,
            comment: 'Заявка создана',
          },
        },
      }),
    },
  })
}

export async function updateLeadStatus(
  leadId: string,
  toStatus: LeadStatus,
  userId: string,
  comment?: string
) {
  const VALID_STATUSES: LeadStatus[] = ['NEW', 'IN_PROGRESS', 'CLOSED', 'SPAM']
  if (!VALID_STATUSES.includes(toStatus)) {
    throw new Error(`Недопустимый статус: ${toStatus}`)
  }

  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) throw new Error('Заявка не найдена')

  return prisma.$transaction([
    prisma.lead.update({
      where: { id: leadId },
      data: { status: toStatus, isRead: true },
    }),
    prisma.leadStatusHistory.create({
      data: {
        leadId,
        fromStatus: lead.status,
        toStatus,
        changedById: userId,
        comment,
      },
    }),
  ])
}

export async function addLeadComment(leadId: string, authorId: string, text: string) {
  return prisma.leadComment.create({
    data: { leadId, authorId, text },
    include: { author: { select: { id: true, name: true, avatar: true } } },
  })
}

export async function assignLead(leadId: string, assignedToId: string | null) {
  return prisma.lead.update({
    where: { id: leadId },
    data: { assignedToId },
  })
}

export async function markLeadAsRead(leadId: string) {
  return prisma.lead.update({
    where: { id: leadId },
    data: { isRead: true },
  })
}

export async function getNewLeadsCount() {
  return prisma.lead.count({ where: { status: 'NEW', isRead: false } })
}

export async function getLeadsStats() {
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)

  const [total, newCount, inProgress, closed, todayCount] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: 'NEW' } }),
    prisma.lead.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.lead.count({ where: { status: 'CLOSED' } }),
    prisma.lead.count({ where: { createdAt: { gte: todayStart } } }),
  ])
  return { total, newCount, inProgress, closed, todayCount }
}
