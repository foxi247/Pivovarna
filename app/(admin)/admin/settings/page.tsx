import { getSiteSettings } from '@/lib/services/settings.service'
import { SettingsForm } from '@/components/admin/settings/SettingsForm'

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings().catch(() => null)

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Настройки сайта</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">Основные параметры и контактная информация</p>
      </div>
      <div className="max-w-2xl">
        <SettingsForm settings={settings} />
      </div>
    </div>
  )
}
