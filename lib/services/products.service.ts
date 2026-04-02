import { prisma } from '@/lib/db'
import { slugify } from '@/lib/utils'
import type { ProductInput, ProductCategoryInput } from '@/lib/validations/product'

export async function getProductCategories(activeOnly = true) {
  return prisma.productCategory.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    include: { _count: { select: { products: true } } },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getProducts(categorySlug?: string, activeOnly = true) {
  return prisma.product.findMany({
    where: {
      ...(activeOnly ? { isActive: true } : {}),
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    },
    include: { category: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function createProduct(data: ProductInput) {
  const slug = data.slug || slugify(data.name)
  return prisma.product.create({
    data: { ...data, slug, alcoholContent: data.alcoholContent ?? undefined, bitterness: data.bitterness ?? undefined, density: data.density ?? undefined },
  })
}

export async function updateProduct(id: string, data: Partial<ProductInput>) {
  return prisma.product.update({ where: { id }, data })
}

export async function deleteProduct(id: string) {
  return prisma.product.delete({ where: { id } })
}

export async function updateProductsOrder(ids: string[]) {
  await Promise.all(
    ids.map((id, index) => prisma.product.update({ where: { id }, data: { sortOrder: index } }))
  )
}

export async function createProductCategory(data: ProductCategoryInput) {
  const slug = data.slug || slugify(data.name)
  return prisma.productCategory.create({ data: { ...data, slug } })
}

export async function updateProductCategory(id: string, data: Partial<ProductCategoryInput>) {
  return prisma.productCategory.update({ where: { id }, data })
}

export async function deleteProductCategory(id: string) {
  return prisma.productCategory.delete({ where: { id } })
}
