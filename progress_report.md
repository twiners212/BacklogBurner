# Laporan Progres: BacklogBurner Frontend

Dokumen ini berisi rangkuman pekerjaan yang telah diselesaikan pada fase pertama (Pengembangan Frontend) untuk proyek **BacklogBurner**. Dokumen ini dapat digunakan sebagai referensi untuk melanjutkan pekerjaan di sesi berikutnya.

## 🛠️ Tech Stack & Konfigurasi yang Digunakan
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS v4
- **Komponen UI:** shadcn/ui (Radix UI)
- **Tema (Light/Dark):** `next-themes`
- **State Management:**
  - Server State: `@tanstack/react-query`
  - Client State: `zustand`
- **Ikon:** `lucide-react`
- **Tipografi:** Google Fonts (`Press Start 2P` untuk font pixel/heading, `Inter` untuk sans-serif).

---

## ✅ Apa Saja yang Sudah Selesai?

### 1. Theming & Styling (Retro-Neon)
- **`src/app/globals.css`** telah dikonfigurasi menggunakan sintaks CSS Variables baru dari Tailwind v4 (`@theme inline`).
- Palet warna "Cyber Arcade" (Dark Mode) dan "8-Bit Day" (Light Mode) telah berhasil diimplementasikan sesuai dengan `ARCHITECTURE.md`.
- Utility CSS kustom seperti animasi *glitch* (`.glitch-hover`), efek *CRT scanline* (`.crt-overlay`), dan border *neo-brutalism* (`.neo-border`) telah ditambahkan.
- Masalah linter IDE (peringatan `@custom-variant`, `@theme`) telah disembunyikan menggunakan pengaturan lokal di `.vscode/settings.json`.

### 2. Provider & State Management
- **`src/app/layout.tsx`**: Ditambahkan wrapper untuk `<ThemeProvider>` dan `<QueryProvider>`.
- **`src/components/theme-provider.tsx`**: Diinisialisasi untuk mengatur *toggle* mode terang/gelap.
- **`src/components/providers/query-provider.tsx`**: Diinisialisasi untuk manajemen React Query.
- **`src/hooks/use-ui-store.ts`**: Store Zustand dibuat untuk manajemen *state* UI global seperti status buka-tutup modal dan pemilihan ID game.

### 3. Komponen Shared (UI)
- **`Navbar.tsx`**: Navigasi responsif dengan tombol *toggle* tema (*Sun/Moon icon*) dari lucide-react.
- **`GameCard.tsx`**: Komponen visual utama yang merender gambar cover game, judul dengan efek glitch saat hover, serta indikator status dan skor/rating. Dilengkapi dengan overlay layar CRT.
- **`QuickSearch.tsx`**: *Input bar* simulasi pencarian database RAWG dengan styling neo-brutalist.
- *Komponen shadcn bawaan:* Button, Input, Badge, Tabs, Dropdown Menu, Skeleton, Pagination, dan Card.

### 4. Halaman & Routing
- **Landing Page (`/`)**: Halaman awal bergaya arcade untuk navigasi menuju login atau dashboard.
- **Autentikasi (`/login` & `/register`)**: Form UI statis dengan elemen styling neon.
- **Dashboard (`/dashboard`)**:
  - Diimplementasikan menggunakan data statis (Mock Data) untuk sementara.
  - Memiliki sistem **Filter Tabs** (All, Wanna Play, Playing, Completed, Dropped).
  - Memiliki sistem **Traditional Pagination** URL Search Params (`?page=2&status=Playing`).
  - Menggunakan CSS Grid (maksimal 8 game per halaman sesuai dengan arsitektur).

---

## 🚀 Langkah Selanjutnya (Next Phase)

Pada sesi pengembangan berikutnya, berikut adalah prioritas yang perlu dikerjakan:

1. **Integrasi Backend (Supabase):**
   - Menyiapkan koneksi PostgreSQL ke Supabase.
   - Membuat skema `users`, `games`, dan `user_games` menggunakan **Drizzle ORM**.
2. **Server Actions:**
   - Mengganti fungsi mock data di Dashboard dengan eksekusi `Server Actions` nyata (misalnya `getUserGames()`).
   - Implementasi API *fetching* eksternal ke RAWG API melalui `searchRawgGames()`.
3. **Autentikasi Nyata:**
   - Menyambungkan form `/login` dan `/register` menggunakan `Better Auth` atau autentikasi bawaan Supabase.
4. **Vercel Cron Job:**
   - Mengimplementasikan endpoint `/api/cron/keep-alive` untuk memastikan *database instance* Supabase tidak *hibernate*.
