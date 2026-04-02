import { getTeamPersons } from '@/lib/services/settings.service'
import { TeamPersonForm } from '@/components/admin/team/TeamPersonForm'
import { Plus } from 'lucide-react'

export default async function AdminTeamPage() {
  const persons = await getTeamPersons(false)
  const person = persons[0] ?? null

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-admin-text text-2xl font-semibold">Технолог / Лицо компании</h1>
        <p className="text-admin-text-muted text-sm mt-0.5">
          Информация отображается в отдельном акцентном блоке на сайте
        </p>
      </div>
      <div className="max-w-3xl">
        <TeamPersonForm person={person} />
      </div>
    </div>
  )
}
