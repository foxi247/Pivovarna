import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Эндпоинт для создания первого администратора.
// Работает ТОЛЬКО если в базе нет ни одного пользователя.
export async function POST(request: Request) {
  try {
    const { email, password, name, secret } = await request.json()

    // Проверяем секрет (задаётся через env SETUP_SECRET)
    const setupSecret = process.env.SETUP_SECRET
    if (setupSecret && secret !== setupSecret) {
      return NextResponse.json({ error: 'Неверный секрет' }, { status: 403 })
    }

    if (!email || !password || !name) {
      return NextResponse.json({ error: 'email, password и name обязательны' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль минимум 6 символов' }, { status: 400 })
    }

    // Проверяем — если уже есть пользователи, отказываем
    const count = await prisma.user.count()
    if (count > 0) {
      return NextResponse.json(
        { error: 'Пользователи уже существуют. Эндпоинт недоступен.' },
        { status: 403 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: 'SUPERADMIN',
        isActive: true,
      },
      select: { id: true, email: true, name: true, role: true },
    })

    return NextResponse.json({ ok: true, user })
  } catch (err) {
    console.error('[Setup] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Ошибка сервера' },
      { status: 500 }
    )
  }
}

// GET — проверка: нужна ли настройка
export async function GET() {
  try {
    const count = await prisma.user.count()
    return NextResponse.json({ needsSetup: count === 0 })
  } catch {
    return NextResponse.json({ needsSetup: false, error: 'DB недоступна' }, { status: 500 })
  }
}
