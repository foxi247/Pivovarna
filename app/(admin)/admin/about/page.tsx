import { getCompanyInfo } from '@/lib/services/settings.service'
import { AboutForm } from '@/components/admin/about/AboutForm'

export default async function AdminAboutPage() {
  const info = await getCompanyInfo()
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">О компании</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Контент страницы «О нас»</p>
      </div>
      <div className="max-w-3xl">
        <AboutForm info={info} />
      </div>
    </div>
  )
}
