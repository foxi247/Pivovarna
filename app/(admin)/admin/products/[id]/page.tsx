import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import { getProductCategories } from '@/lib/services/products.service'
import { ProductForm } from '@/components/admin/products/ProductForm'

export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  const isNew = params.id === 'new'

  const [product, categories] = await Promise.all([
    isNew ? null : prisma.product.findUnique({ where: { id: params.id } }),
    getProductCategories(false),
  ])

  if (!isNew && !product) notFound()

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">
          {isNew ? 'Добавить продукт' : `Редактировать: ${product!.name}`}
        </h1>
      </div>
      <div className="max-w-3xl">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}
