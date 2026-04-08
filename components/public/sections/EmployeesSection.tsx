import type { Employee } from '@prisma/client'

interface Props {
  employees: Employee[]
}

export function EmployeesSection({ employees }: Props) {
  const active = employees.filter((e) => e.isActive)
  if (active.length === 0) return null

  return (
    <section className="py-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-[#C8873A] text-xs font-semibold tracking-[0.35em] uppercase">Команда</span>
          <h2 className="font-display text-[clamp(1.8rem,4vw,3rem)] font-bold text-[#F5EFE6] mt-3">
            Наши сотрудники
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {active.map((emp) => (
            <div key={emp.id} className="text-center group">
              <div className="w-20 h-20 mx-auto rounded-full bg-[#2E2820] overflow-hidden mb-3">
                {emp.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={emp.photoUrl}
                    alt={emp.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#C8873A] font-bold text-xl">
                    {emp.name.charAt(0)}
                  </div>
                )}
              </div>
              <p className="text-[#F5EFE6] text-sm font-semibold leading-tight">{emp.name}</p>
              <p className="text-[#7A6C5E] text-xs mt-0.5">{emp.position}</p>
              {emp.department && (
                <p className="text-[#4D4438] text-[10px] mt-0.5">{emp.department}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
