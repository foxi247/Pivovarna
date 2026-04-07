# CONTEXT.md — Дербентская пивоварня

> This file exists so that a new Claude session can be quickly oriented.
> When the user says "продолжай" or "continue", read this file first.

## Project

Next.js 14 App Router web app for **Дербентская пивоварня** (Derbent Brewery).
- Public site: marketing pages at `app/(public)/`
- Admin panel: CMS at `app/(admin)/admin/`
- DB: PostgreSQL via **Prisma** (`lib/db.ts`)
- Auth: NextAuth.js (`lib/auth.ts`)
- Styling: Tailwind CSS

## Repo

- Branch for development: `claude/derbent-brewery-platform-zOgeD`
- Remote: `foxi247/Pivovarna` on GitHub

## Architecture

```
app/
  (public)/          # Public-facing site
    layout.tsx       # includes PageTracker for analytics
    page.tsx         # homepage: Hero → About → Team → Products → News → Contacts
    news/[slug]/     # article page with ArticleViewTracker
    products/        # products listing + detail
    about/ gallery/ contacts/ cooperation/ partners/ tours/ team/
  (admin)/admin/     # Admin panel (requires auth)
    layout.tsx       # sidebar + mobile hamburger
    page.tsx         # dashboard
    analytics/       # page views, article reads stats
    employees/       # staff CRUD
    leads/           # CRM
    news/            # news CRUD
    products/        # products CRUD
    gallery/         # media
    reset/           # delete analytics+leads with "reset" confirmation
    tutorial/        # onboarding walkthrough
    settings/
  api/
    analytics/       # POST: record PageView or ArticleView
    admin/
      employees/     # GET/POST + [id] PATCH/DELETE
      reset/         # POST with { confirm: "reset" }
      news/          # CRUD
      products/      # CRUD
      leads/         # CRUD
auth/login/          # login page with "← На сайт" link
```

## Prisma schema highlights

```prisma
model PageView    { id, path, referrer, userAgent, country, createdAt }
model ArticleView { id, articleId → NewsArticle, createdAt }
model Employee   { id, name, position, department, photoUrl, bio, email, phone, isActive, sortOrder, createdAt, updatedAt }
model NewsArticle { ... views ArticleView[] }
```

After any schema change: `npx prisma generate && npx prisma db push`

## Key patterns

- **RBAC**: all admin API routes use `requireAuth(roles[])` from `lib/api-auth.ts`
- **Real-time updates**: every admin mutation calls `revalidatePath()` so ISR cache is cleared
- **JSON field safety**: Prisma JSON fields may be `{}` not `[]` — always use `Array.isArray(field)` before `.map()`
- **Analytics**: `PageTracker` in public layout sends POST to `/api/analytics` on every navigation; `ArticleViewTracker` fires on article page mount
- **AdminSidebar**: mobile = hamburger + drawer; desktop = `hidden lg:flex w-56` sticky sidebar
- **framer-motion**: DO NOT use `useInView` — causes client-side crash. Use native IntersectionObserver (`AnimatedSection.tsx`)
- **DOMPurify**: do NOT use `isomorphic-dompurify` — bundles jsdom into client, crashes browser. News content comes from trusted admins.

## Completed features (this session)

- [x] Fix framer-motion `useInView` crash (AnimatedSection.tsx → native IntersectionObserver)
- [x] Fix `.map()` crash on JSON fields (Array.isArray guards in AboutSection, TeamSection)
- [x] Fix TeamSection mobile (photo limited, text first on mobile)
- [x] Homepage section order: Hero → About → Team → Products → News carousel → Contacts
- [x] News section horizontal carousel with arrow buttons + "Все новости" CTA
- [x] Admin sidebar mobile hamburger + drawer
- [x] Admin sidebar: Analytics, Employees, Reset nav items; "На сайт" + "Обучение" + logout
- [x] Logout → `/auth/login` with `signOut({ callbackUrl: ... })`
- [x] Login page → "← На сайт" link
- [x] Prisma schema: PageView, ArticleView, Employee models
- [x] `/api/analytics` POST endpoint
- [x] `/api/admin/reset` POST endpoint
- [x] `/api/admin/employees` GET/POST + `[id]` PATCH/DELETE
- [x] Analytics admin page (`/admin/analytics`)
- [x] Reset admin page (`/admin/reset`)
- [x] Employees admin page (`/admin/employees`)
- [x] Tutorial admin page (`/admin/tutorial`)
- [x] PageTracker in public layout
- [x] ArticleViewTracker on news article pages
- [x] Header nav: added Экскурсии
- [x] `revalidatePath` in news + products admin APIs
- [x] Error boundary `app/(public)/error.tsx`

## Pending / known issues

- [ ] Supabase migration: user needs to set DATABASE_URL in `.env` to Supabase connection string, then run `npx prisma db push`
- [ ] `prisma db push` not yet run — schema has new models, needs migration on actual DB
- [ ] Admin pages: about, team, homepage content editor (settings-based) — not yet built
- [ ] Gallery upload may need Supabase storage URL update
- [ ] Add `revalidatePath` to settings/about/team APIs

## Commands

```bash
# Dev server
npm run dev

# After schema changes
npx prisma generate
npx prisma db push

# Push branch
git push -u origin claude/derbent-brewery-platform-zOgeD
```
