# LearnMate Campus 🎓

Platform Pembelajaran Digital Kampus - Dibangun dengan Next.js, SQLite (Prisma ORM), dan NextAuth.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite (`prisma/dev.db`)
- **ORM**: Prisma 6
- **Auth**: NextAuth.js v5 (beta)
- **Icons**: Lucide React

## Fitur

### 👨‍🎓 Mahasiswa
- Dashboard dengan statistik belajar
- Jadwal kuliah hari ini
- Daftar mata kuliah aktif dengan progress
- Detail mata kuliah (materi, tugas, pengumuman)
- Portal Quiz & Evaluasi
- Rekap Nilai

### 👨‍🏫 Dosen
- Dashboard dengan statistik mengajar
- Jadwal mengajar hari ini
- Mata kuliah yang diampu
- Daftar mahasiswa
- Manajemen tugas & penilaian
- Manajemen quiz

## Setup & Instalasi

### 1. Setup Environment

Konfigurasi `.env` menggunakan SQLite (tanpa perlu install database server eksternal):

```bash
DATABASE_URL="file:./dev.db"
AUTH_SECRET="super-secret-key-change-in-production"
AUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 2. Install Dependencies & Setup Database

```bash
npm install
npm run db:setup    # Push schema ke SQLite & seed data
```

### 3. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Akun Demo & Development Shortcut

Tersedia fitur **1-Click Quick Login** di halaman login (`/login`). Anda dapat langsung klik akun untuk masuk tanpa mengetik:

| Role | Nama | Email | Password |
|------|------|-------|----------|
| Mahasiswa | Budi Santoso | `budi@student.learnmate.ac.id` | `password123` |
| Mahasiswa | Ani Wijaya | `ani@student.learnmate.ac.id` | `password123` |
| Dosen | Dr. Ahmad Fauzi, M.Kom | `dr.ahmad@learnmate.ac.id` | `password123` |
| Dosen | Prof. Siti Nurhaliza, Ph.D | `prof.siti@learnmate.ac.id` | `password123` |
| Admin | Administrator Kampus | `admin@learnmate.ac.id` | `password123` |

## Struktur Project

```
src/
├── app/
│   ├── api/auth/[...nextauth]/   # NextAuth API route
│   ├── dashboard/
│   │   ├── mata-kuliah/          # Halaman mata kuliah
│   │   │   └── [id]/            # Detail mata kuliah
│   │   ├── tugas/               # Halaman tugas
│   │   ├── quiz/                # Halaman quiz & evaluasi
│   │   ├── nilai/               # Halaman rekap nilai
│   │   ├── mahasiswa/           # Halaman daftar mahasiswa (dosen)
│   │   └── settings/            # Halaman pengaturan
│   ├── login/                   # Halaman login
│   └── globals.css
├── components/
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── StatCard.tsx
├── lib/
│   ├── auth.ts                  # NextAuth configuration
│   └── prisma.ts                # Prisma client singleton
├── types/
│   └── next-auth.d.ts           # NextAuth type augmentation
└── middleware.ts                 # Route protection
prisma/
├── schema.prisma                # Database schema
└── seed.ts                      # Seed data
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:setup` | Push schema + seed (combined) |
| `npm run db:studio` | Open Prisma Studio |
