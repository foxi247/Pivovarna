-- Создание таблиц аналитики для Supabase
-- Выполните этот SQL в Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS "page_views" (
    "id"        TEXT NOT NULL,
    "path"      TEXT NOT NULL,
    "referrer"  TEXT,
    "userAgent" TEXT,
    "country"   TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "page_views_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "article_views" (
    "id"        TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "article_views_pkey" PRIMARY KEY ("id")
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS "page_views_path_idx"      ON "page_views"("path");
CREATE INDEX IF NOT EXISTS "page_views_createdAt_idx"  ON "page_views"("createdAt");
CREATE INDEX IF NOT EXISTS "article_views_articleId_idx" ON "article_views"("articleId");

-- Внешний ключ article_views → news_articles
ALTER TABLE "article_views"
    ADD CONSTRAINT "article_views_articleId_fkey"
    FOREIGN KEY ("articleId")
    REFERENCES "news_articles"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;
