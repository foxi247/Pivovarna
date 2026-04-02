import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, pattern = 'd MMMM yyyy') {
  return format(new Date(date), pattern, { locale: ru })
}

export function formatDateRelative(date: Date | string) {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ru })
}

export function slugify(text: string): string {
  const translitMap: Record<string, string> = {
    а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh',
    з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o',
    п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'ts',
    ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu',
    я: 'ya',
  }
  return text
    .toLowerCase()
    .split('')
    .map((char) => translitMap[char] ?? char)
    .join('')
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '…'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

export const LEAD_TYPE_LABELS: Record<string, string> = {
  COOPERATION: 'Сотрудничество',
  DISTRIBUTION: 'Дистрибуция',
  WHOLESALE: 'Оптовая закупка',
  FEEDBACK: 'Обратная связь',
  TOUR: 'Экскурсия',
  OTHER: 'Другое',
}

export const LEAD_STATUS_LABELS: Record<string, string> = {
  NEW: 'Новая',
  IN_PROGRESS: 'В работе',
  WAITING: 'Ожидает ответа',
  CLOSED: 'Закрыта',
  REJECTED: 'Отклонена',
}

export const LEAD_STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  WAITING: 'bg-orange-100 text-orange-800',
  CLOSED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export const ROLE_LABELS: Record<string, string> = {
  SUPERADMIN: 'Суперадмин',
  ADMIN: 'Администратор',
  MANAGER: 'Менеджер',
  CONTENT_EDITOR: 'Редактор',
}
