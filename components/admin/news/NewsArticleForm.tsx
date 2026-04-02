'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Trash2, Eye } from 'lucide-react'
import type { NewsArticle, NewsCategory } from '@prisma/client'

interface NewsArticleFormProps {
  article: NewsArticle | null
  categories: NewsCategory[]
}

export function NewsArticleForm({ article, categories }: NewsArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      categoryId: article?.categoryId ?? '',
      excerpt: article?.excerpt ?? '',
      content: article?.content ?? '',
      coverImageUrl: article?.coverImageUrl ?? '',
      isPublished: article?.isPublished ?? false,
      seoTitle: article?.seoTitle ?? '',
      seoDescription: article?.seoDescription ?? '',
    },
  })

  const isPublished = watch('isPublished')

  const onSubmit = async (data: Record<string, unknown>) => {
    setLoading(true)
    try {
      const url = article ? `/api/admin/news/${article.id}` : '/api/admin/news'
      const method = article ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success(article ? 'Статья обновлена' : 'Статья создана')
      router.push('/admin/news')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!article || !confirm(`Удалить статью «${article.title}»?`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/news/${article.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Статья удалена')
      router.push('/admin/news')
    } catch {
      toast.error('Ошибка удаления')
    } finally {
      setDeleting(false)
    }
  }

  const inputCls = 'w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Основное</h2>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Заголовок *</label>
          <input {...register('title', { required: true })} className={inputCls} placeholder="Заголовок новости" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Slug (URL)</label>
            <input {...register('slug')} className={inputCls} placeholder="автозаполнение" />
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Категория</label>
            <select {...register('categoryId')} className={inputCls}>
              <option value="">Без категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">URL обложки</label>
          <input {...register('coverImageUrl')} className={inputCls} placeholder="https://..." />
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Краткое описание (для карточки)</label>
          <textarea {...register('excerpt')} rows={2} className={inputCls + ' resize-none'} placeholder="Краткое описание для списка новостей..." />
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Текст статьи *</label>
          <textarea
            {...register('content', { required: true })}
            rows={12}
            className={inputCls + ' resize-y font-mono text-xs'}
            placeholder="Текст статьи. Поддерживаются абзацы через Enter..."
          />
          <p className="text-admin-text-muted text-xs mt-1">Для разбивки на абзацы используйте пустую строку между текстом</p>
        </div>
      </div>

      {/* Публикация */}
      <div className="bg-white border border-admin-border rounded-xl p-6">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider mb-4">Публикация</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input {...register('isPublished')} type="checkbox" className="w-4 h-4 rounded border-admin-border accent-stone-900" />
          <div>
            <p className="text-admin-text text-sm font-medium">
              {isPublished ? '● Опубликовано' : '○ Черновик'}
            </p>
            <p className="text-admin-text-muted text-xs mt-0.5">
              {isPublished ? 'Статья видна посетителям сайта' : 'Статья скрыта от посетителей'}
            </p>
          </div>
        </label>
      </div>

      {/* SEO */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">SEO</h2>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">SEO Title</label>
          <input {...register('seoTitle')} className={inputCls} />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">SEO Description</label>
          <textarea {...register('seoDescription')} rows={2} className={inputCls + ' resize-none'} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>

        {article?.isPublished && (
          <a
            href={`/news/${article.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 px-4 py-2.5 border border-admin-border text-stone-600 rounded-lg text-sm hover:bg-stone-50 transition-colors"
          >
            <Eye size={15} />
            Просмотр
          </a>
        )}

        {article && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50 transition-colors ml-auto"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Удалить
          </button>
        )}
      </div>
    </form>
  )
}
