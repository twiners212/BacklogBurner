# Changelog & Progress Report — BacklogBurner

---

## Phase 1: Frontend Foundation (Selesai Sebelum Sesi)

| Area | Status |
|------|--------|
| Theming Retro-Neon (Dark/Light) | ✅ |
| Tailwind v4 + CSS Variables | ✅ |
| shadcn/ui components | ✅ |
| Navbar, GameCard, QuickSearch | ✅ |
| Landing page, Auth pages (UI) | ✅ |
| Dashboard (mock data) | ✅ |
| Zustand store + TanStack Query provider | ✅ |

---

## Phase 2: Backend Setup

### Dependencies Installed
- `drizzle-orm`, `drizzle-kit` — ORM + migration
- `postgres` (postgres.js) — database driver
- ~~`@neondatabase/serverless`~~ → diganti `postgres` (kompatibel lokal)
- ~~`better-auth`, `@better-auth/drizzle-adapter`~~ → **dihapus** (auth dihapus)

### Database
- PostgreSQL lokal via Supabase Docker (`localhost:54322`)
- Migration `0000_zippy_magik.sql` — 2 tabel: `games`, `user_games`
- `game_status` ENUM: `Wanna Play`, `Playing`, `Completed`, `Dropped`
- `games.api_id` nullable (untuk future RAWG integration)
- `user_games.gameId` FK → `games.id` ON DELETE CASCADE
- **Schema**: `src/lib/db/schema/games.ts`

### Server Actions
| Action | File | Fungsi |
|--------|------|--------|
| `getUserGames` | `src/lib/actions/getUserGames.ts` | Fetch library + pagination + status counts |
| `addGameToLibrary` | `src/lib/actions/addGameToLibrary.ts` | Add game (setiap entry punya row `games` sendiri) |
| `getGameDetail` | `src/lib/actions/getGameDetail.ts` | Fetch detail untuk modal |
| `updateGame` | `src/lib/actions/updateGame.ts` | Edit title, cover, release, status, rating, review |
| `deleteGame` | `src/lib/actions/deleteGame.ts` | Hapus game + cascade cleanup |

---

## Phase 3: Authentication → **Dihapus**

Better Auth pernah diimplementasi (login, register, proxy middleware, 4 tabel auth), lalu **dihapus total** atas permintaan user. Aplikasi sekarang single-user tanpa auth.

### Files deleted
- `src/lib/auth.ts` (Better Auth instance)
- `src/app/api/auth/[...all]/route.ts`
- `proxy.ts` (middleware)
- `src/app/(auth)/` (login + register pages)
- `src/lib/db/schema/auth.ts` (user, session, account, verification)
- `src/lib/actions/updateGameReview.ts` (merged ke updateGame)

---

## Phase 4: Frontend Features

### Dashboard (Live Data)
- `src/app/dashboard/page.tsx` — real data via `getUserGames`, TanStack Query
- Pagination via URL search params (`?page=2&status=Playing`)
- Filter tabs: All, Wanna Play, Playing, Completed, Dropped
- TOTAL GAMES dari `statusCounts.total` (semua status)
- Loading skeleton saat fetch

### Game Detail Modal
- `src/components/shared/GameDetailModal.tsx`
- Cover image + title + release date + status
- Rating 1-10 (grid buttons)
- Playing Impression textarea
- Edit semua field + DELETE with `window.confirm`
- `queryClient.invalidateQueries` — update realtime tanpa reload

### Add Game Modal
- `src/components/shared/AddGameModal.tsx`
- Form: title (required), cover URL, release date (datepicker), status
- Dedup sudah tidak ada — setiap entry punya row games sendiri

### QuickSearch
- `src/components/shared/QuickSearch.tsx`
- Realtime filter (setiap ketikan langsung filter library)
- X button hapus query
- Add Game button

### Floating Icons Animation
- `src/components/shared/FloatingIcons.tsx`
- 36 ikon retro (lucide-react) melayang di background
- Landing page + dashboard
- Warna neon Cyan/Magenta bergantian
- CSS animation murni (zero JS overhead)
- `pointer-events: none`, `opacity: 0.12`

### Navbar
- Logo BacklogBurner → link ke landing page
- Theme toggle (Dark/Light)

---

## Architecture Perubahan Signifikan

### Sebelum: Shared Master Table
```
games: [id=1, "Cyberpunk"] ← shared oleh semua entry
```

### Sesudah: Isolated per Entry
```
games: [id=10, "Cyberpunk"] ← milik entry A sendiri
       [id=11, "Cyberpunk"] ← milik entry B sendiri (beda row)
```
Setiap `addGameToLibrary` selalu INSERT row baru di `games`. Delete cukup hapus `games` → cascade ke `user_games`.

### Database Driver Path
```
@neondatabase/serverless → postgres.js
```
Neon driver pakai WebSocket, tidak kompatibel PostgreSQL lokal. `postgres.js` works everywhere.

---

## File Structure Final

```
src/
├── app/
│   ├── dashboard/page.tsx       ← Library + floating icons
│   ├── api/cron/keep-alive/route.ts
│   ├── page.tsx                 ← Landing + floating icons
│   ├── layout.tsx               ← Providers
│   └── globals.css              ← Animasi float, glitch, crt, neo-border
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx
│   │   ├── GameCard.tsx
│   │   ├── QuickSearch.tsx
│   │   ├── AddGameModal.tsx
│   │   ├── GameDetailModal.tsx
│   │   └── FloatingIcons.tsx    ← BARU
│   ├── providers/query-provider.tsx
│   ├── theme-provider.tsx
│   └── ui/ (shadcn)
├── hooks/
│   └── use-ui-store.ts
├── lib/
│   ├── db/
│   │   ├── index.ts
│   │   └── schema/
│   │       ├── index.ts
│   │       └── games.ts
│   ├── actions/
│   │   ├── types.ts
│   │   ├── addGameToLibrary.ts
│   │   ├── getUserGames.ts
│   │   ├── getGameDetail.ts
│   │   ├── updateGame.ts
│   │   └── deleteGame.ts
│   └── utils.ts
├── drizzle.config.ts
├── vercel.json
├── .env.local
└── .env.example
```

## Routes

```
/            → Landing page → ENTER LIBRARY
/dashboard   → Library (add, edit, delete, filter, pagination)
/api/cron/keep-alive → Database ping (Vercel Cron)
```
