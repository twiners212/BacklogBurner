# ARCHITECTURE.md - BacklogBurner

## 1. Project Overview
**BacklogBurner** adalah aplikasi *personal game library tracker* bergaya *2D retro-neon gaming* yang memungkinkan pengguna mencari, menambahkan, melacak progres, dan memberikan ulasan pada video game.
- **Target Host:** Vercel (Frontend & Serverless) + Supabase Cloud (Database).
- **Target User:** *Gamers* dan *Completionists* (Usia 15-35 tahun).
- **Fokus Teknis:** Server Actions, Data Caching, Pagination, Theming (Light/Dark), dan Infrastructure Maintenance.

## 2. Tech Stack
- **Frontend/Framework:** Next.js 14+ (App Router), React, Tailwind CSS.
- **UI Components:** shadcn/ui (Radix UI) & `next-themes` (untuk Light/Dark mode).
- **State Management:** TanStack Query (Server State) & Zustand (Client State).
- **Backend/Database:** PostgreSQL (via Supabase) & Drizzle ORM.
- **Autentikasi:** Better Auth.
- **External API:** RAWG Video Games Database API.

## 3. Directory Structure (Next.js App Router)
Menggunakan struktur *colocation* standar Next.js yang memisahkan UI, logika server, dan akses database.

```text
backlogburner/
├── ARCHITECTURE.md          -> Dokumen referensi TDD
├── .env.local               -> DATABASE_URL, RAWG_API_KEY, BETTER_AUTH_SECRET
├── drizzle.config.ts        -> Konfigurasi migrasi Drizzle
├── vercel.json              -> Konfigurasi Vercel Cron Jobs
├── src/
│   ├── app/                 -> NEXT.JS APP ROUTER
│   │   ├── (auth)/          -> Route group untuk login/register
│   │   ├── api/cron/        -> Route handlers untuk Keep-alive ping
│   │   ├── dashboard/       -> Private routes (Koleksi game pengguna)
│   │   └── layout.tsx       -> Root layout & Providers
│   ├── components/
│   │   ├── ui/              -> Komponen shadcn/ui
│   │   └── shared/          -> Komponen custom (GameCard, QuickSearch)
│   ├── hooks/               -> Custom hooks (useDebounce)
│   ├── lib/
│   │   ├── db/              -> Drizzle setup & schema
│   │   └── actions/         -> SERVER ACTIONS (Logika backend murni)
│   └── styles/              -> globals.css (Tailwind base & Glitch animations)

```

## 4. UI/UX & Styling Rules (CRITICAL)

* **Tema Visual (2D Retro-Neon):** - Menggunakan *font* bergaya *pixel* atau *monospace* untuk *heading*, dan *sans-serif* bersih untuk teks detail.
* Elemen UI menggunakan *border* tegas (neo-brutalism) dan efek *glowing box-shadow* (neon) saat di-*hover*.
* *Cover art* game diberikan efek *CRT scanline* ringan menggunakan CSS (mix-blend-overlay).
* Terdapat efek animasi *RGB Glitch* via pseudo-element CSS pada judul kartu saat kursor diarahkan.


* **Light / Dark Mode:**
* Wajib menggunakan `next-themes`.
* *Dark mode (Cyber Arcade):* Latar gelap pekat dengan neon menyala (Cyan & Magenta).
* *Light mode (8-Bit Day):* Warna dasar beige/kertas retro dengan garis tepi hitam solid.


* **Layout & Pagination:**
* *Grid System:* Maksimal menampilkan **8 game per halaman** di layar *desktop* (grid 4x2).
* *Navigasi Halaman:* Menggunakan gaya *Traditional Pagination* (`[1] [2] [3] Next`) di bagian bawah *grid*. Terhubung langsung dengan parameter URL (`?page=2`).



## 5. State Management

* **TanStack Query:** Digunakan untuk eksekusi API (RAWG & Supabase) dan menangani *state pagination* (menggunakan strategi `placeholderData` untuk menghindari UI berkedip). Memanfaatkan `useMutation` dan `invalidateQueries` untuk reaktivitas UI instan.
* **Zustand (`useUIStore`):** Murni untuk *client state* yang ringan dan sinkronis, seperti pengaturan modal UI.
* **URL Search Params:** Sumber kebenaran tunggal (*single source of truth*) untuk filter tab (Wanna Play, Playing, dll.) agar halaman *bookmarkable*.

## 6. Server Actions Contract

Menggantikan REST API internal untuk mutasi data yang aman dan cepat.

* **Fungsi:** `searchRawgGames(query)`
* Memanggil RAWG API. Terlindungi di server untuk menyembunyikan `RAWG_API_KEY`.


* **Fungsi:** `getUserGames(userId, status, page = 1, limit = 8)`
* Melakukan eksekusi via Drizzle dengan `LIMIT` dan `OFFSET`. Mengembalikan data game beserta metadata `totalPages`.


* **Fungsi:** `addGameToLibrary(gameData, status)`
* Melakukan operasi PostgreSQL `UPSERT` (`onConflictDoUpdate`) pada tabel master `games` untuk menghemat data, lalu `INSERT` ke tabel `user_games`.


* **Fungsi:** `updateGameReview(userGameId, rating, review)`
* Menyimpan skor evaluasi (1-10) dari modal pengguna ke database.



## 7. Database Schema (Drizzle ORM)

```typescript
import { pgTable, serial, varchar, integer, text, timestamp, pgEnum, uniqueIndex } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const gameStatusEnum = pgEnum('game_status', ['Wanna Play', 'Playing', 'Completed', 'Dropped']);

export const users = pgTable('users', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const games = pgTable('games', {
  id: serial('id').primaryKey(),
  apiId: integer('api_id').notNull().unique(),
  title: varchar('title', { length: 255 }).notNull(),
  coverUrl: varchar('cover_url', { length: 500 }),
  releaseDate: varchar('release_date', { length: 50 }),
});

export const userGames = pgTable('user_games', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id, { onDelete: 'cascade' }).notNull(),
  gameId: integer('game_id').references(() => games.id, { onDelete: 'cascade' }).notNull(),
  status: gameStatusEnum('status').default('Wanna Play').notNull(),
  rating: integer('rating'),
  review: text('review'),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (table) => {
  return {
    userGameUnique: uniqueIndex('user_game_idx').on(table.userId, table.gameId),
  };
});

```

## 8. Color Palette (Retro-Neon)

* **Dark Mode (Cyber Arcade):**
* *Background:* `#0B0C10` (Deep Void)
* *Surface:* `#1F2833` (Arcade Cabinet)
* *Border/Outline:* `#45A29E` (Muted Cyan)
* *Neon Accents:* `#66FCF1` (Cyan Glow) dan `#FF007F` (Neon Pink)


* **Light Mode (8-Bit Day):**
* *Background:* `#F5F5DC` (Beige/Retro Paper)
* *Border/Outline:* `#000000` (Solid Black)
* *Solid Accents:* `#FF00FF` (Magenta) dan `#00FFFF` (Cyan 100%)



## 9. Deployment & Infrastructure Strategy

Proyek ini memadukan **Vercel** untuk Frontend/Serverless dan **Supabase Cloud** untuk Database PostgreSQL. Mengingat Supabase *Free Tier* akan menjeda (membekukan) database setelah 7 hari inaktif, sistem proteksi **Automated Keep-Alive Ping** diimplementasikan agar portofolio selalu online.

### A. Keep-Alive Route Handler (Serverless Function)

Sebuah endpoint rahasia yang mengeksekusi *query* sangat ringan untuk mengelabui sensor inaktivitas Supabase dan mencegah *cold start* di Vercel.
**File:** `src/app/api/cron/keep-alive/route.ts`

```typescript
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({ success: true, message: "Database is warm and awake!" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Ping failed" }, { status: 500 });
  }
}

```

### B. Vercel Cron Configuration

Pemicu otomatis yang diatur berjalan setiap hari **Senin** dan **Kamis** pada pukul **10:00 pagi**.
**File:** `vercel.json` (Root Directory)

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 10 * * 1,4"
    }
  ]
}

```

*Note: `CRON_SECRET` wajib ditambahkan pada tab Environment Variables di dashboard Vercel sebagai lapisan keamanan.*

```

```
