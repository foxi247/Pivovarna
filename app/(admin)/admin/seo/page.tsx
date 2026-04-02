import { getAllSeoSettings, upsertSeoSettings } from '@/lib/services/settings.service'
import { SeoForm } from '@/components/admin/seo/SeoForm'

const pages = [
  { key: 'home', label: 'Главная страница' },
  { key: 'about', label: 'О компании' },
  { key: 'products', label: 'Продукция' },
  { key: 'news', label: 'Новости' },
  { key: 'gallery', label: 'Галерея' },
  { key: 'contacts', label: 'Контакты' },
  { key: 'cooperation', label: 'Сотрудничество' },
  { key: 'tours', label: 'Экскурсии' },
]

export default async function AdminSeoPage() {
  const allSeo = await getAllSeoSettings()
  const seoMap = Object.fromEntries(allSeo.map((s) => [s.page, s]))

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">SEO настройки</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Meta-теги и Open Graph для каждой страницы</p>
      </div>
      <SeoForm pages={pages} seoMap={seoMap} />
    </div>
  )
}
