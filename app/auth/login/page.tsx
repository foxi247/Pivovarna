import { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-admin-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold">ДП</span>
          </div>
          <h1 className="text-admin-text text-xl font-semibold">Вход в панель управления</h1>
          <p className="text-admin-text-muted text-sm mt-1">Дербентская пивоварня</p>
        </div>

        <Suspense fallback={<div className="bg-white border border-admin-border rounded-xl p-6 h-48 animate-pulse" />}>
          <LoginForm />
        </Suspense>

        <p className="text-center text-admin-text-muted text-xs mt-6">
          Дербентская пивоварня © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  )
}
