'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Trash2 } from 'lucide-react'
import { productSchema, type ProductInput } from '@/lib/validations/product'
import type { Product, ProductCategory } from '@prisma/client'

interface ProductFormProps {
  product: Product | null
  categories: ProductCategory[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      categoryId: product?.categoryId ?? '',
      description: product?.description ?? '',
      imageUrl: product?.imageUrl ?? '',
      alcoholContent: product?.alcoholContent ?? undefined,
      bitterness: product?.bitterness ?? undefined,
      density: product?.density ?? undefined,
      color: product?.color ?? '',
      volume: product?.volume ?? '',
      ingredients: product?.ingredients ?? '',
      isNew: product?.isNew ?? false,
      isPopular: product?.isPopular ?? false,
      isSeasonal: product?.isSeasonal ?? false,
      isActive: product?.isActive ?? true,
      seoTitle: product?.seoTitle ?? '',
      seoDescription: product?.seoDescription ?? '',
    },
  })

  const onSubmit = async (data: ProductInput) => {
    setLoading(true)
    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success(product ? 'Продукт обновлён' : 'Продукт создан')
      router.push('/admin/products')
    } catch {
      toast.error('Ошибка сохранения')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!product || !confirm(`Удалить «${product.name}»? Это действие необратимо.`)) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Продукт удалён')
      router.push('/admin/products')
    } catch {
      toast.error('Ошибка удаления')
    } finally {
      setDeleting(false)
    }
  }

  const inputCls = 'w-full border border-admin-border rounded-lg px-3 py-2.5 text-admin-text text-sm focus:outline-none focus:ring-2 focus:ring-stone-300 bg-white'
  const errMsg = (msg?: string) => msg ? <p className="text-red-500 text-xs mt-1">{msg}</p> : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Основное */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Основное</h2>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Название *</label>
          <input {...register('name')} className={inputCls} placeholder="Дербентское светлое" />
          {errMsg(errors.name?.message)}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Slug (URL)</label>
            <input {...register('slug')} className={inputCls} placeholder="avtomaticheski-zapolnit" />
            <p className="text-admin-text-muted text-xs mt-1">Оставьте пустым для автозаполнения</p>
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Категория *</label>
            <select {...register('categoryId')} className={inputCls}>
              <option value="">Выберите категорию</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errMsg(errors.categoryId?.message)}
          </div>
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Описание *</label>
          <textarea {...register('description')} rows={4} className={inputCls + ' resize-none'} placeholder="Подробное описание сорта..." />
          {errMsg(errors.description?.message)}
        </div>

        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">URL изображения</label>
          <input {...register('imageUrl')} className={inputCls} placeholder="https://res.cloudinary.com/..." />
        </div>
      </div>

      {/* Характеристики */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Характеристики</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Крепость, %</label>
            <input {...register('alcoholContent', { valueAsNumber: true })} type="number" step="0.1" min="0" max="20" className={inputCls} placeholder="4.8" />
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Горечь, IBU</label>
            <input {...register('bitterness', { valueAsNumber: true })} type="number" step="1" min="0" max="200" className={inputCls} placeholder="18" />
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Плотность, °</label>
            <input {...register('density', { valueAsNumber: true })} type="number" step="0.1" min="0" max="30" className={inputCls} placeholder="12.0" />
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Тип</label>
            <input {...register('color')} className={inputCls} placeholder="Светлое" />
          </div>
          <div>
            <label className="block text-admin-text text-sm font-medium mb-1.5">Объём</label>
            <input {...register('volume')} className={inputCls} placeholder="0.5л, 1л, 5л" />
          </div>
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">Состав</label>
          <textarea {...register('ingredients')} rows={2} className={inputCls + ' resize-none'} placeholder="Вода, солод ячменный, хмель..." />
        </div>
      </div>

      {/* Метки и статус */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">Метки и статус</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'isActive' as const, label: 'Опубликован (показывать на сайте)' },
            { name: 'isNew' as const, label: 'Метка «Новинка»' },
            { name: 'isPopular' as const, label: 'Метка «Хит продаж»' },
            { name: 'isSeasonal' as const, label: 'Метка «Сезонное»' },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-2.5 cursor-pointer">
              <input {...register(name)} type="checkbox" className="w-4 h-4 rounded border-admin-border accent-stone-900" />
              <span className="text-admin-text text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* SEO */}
      <div className="bg-white border border-admin-border rounded-xl p-6 space-y-4">
        <h2 className="text-admin-text-muted font-semibold text-sm uppercase tracking-wider">SEO</h2>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">SEO Title</label>
          <input {...register('seoTitle')} className={inputCls} placeholder="Заголовок для поисковиков" />
        </div>
        <div>
          <label className="block text-admin-text text-sm font-medium mb-1.5">SEO Description</label>
          <textarea {...register('seoDescription')} rows={2} className={inputCls + ' resize-none'} placeholder="Описание для поисковиков" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white rounded-lg text-sm hover:bg-stone-800 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>

        {product && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {deleting ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
            Удалить
          </button>
        )}
      </div>
    </form>
  )
}
