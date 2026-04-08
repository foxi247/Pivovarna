import { getSiteSettings } from '@/lib/services/settings.service'
import { SettingsForm } from '@/components/admin/settings/SettingsForm'

export default async function AdminContactsPage() {
  const settings = await getSiteSettings().catch(() => null)
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Контакты</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Контактная информация отображается на сайте</p>
      </div>
      <div className="max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  )
}
