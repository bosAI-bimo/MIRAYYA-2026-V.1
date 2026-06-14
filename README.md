# Mirayya ERP — Sistem Manajemen Toko Kosmetik

Aplikasi ERP terintegrasi untuk **Mirayya Cosmetics** yang menyatukan pengelolaan keuangan, SDM, operasional toko, dan analisis bisnis berbasis AI dalam satu platform.

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: TailwindCSS 4 + shadcn/ui
- **Animasi**: Framer Motion
- **Grafik**: Recharts
- **Auth** *(planned)*: Better Auth
- **Database** *(planned)*: PostgreSQL + Drizzle ORM
- **POS Integration** *(planned)*: Olsera REST API

## Struktur Proyek

```
├── docs/
│   ├── prd.md              # Product Requirements Document
│   └── lp.md               # Company Profile / Landing Page Content
├── frontend/
│   └── src/
│       ├── app/             # Next.js App Router pages
│       │   ├── dashboard/   # Dashboard utama (Unified Layout + RBAC Sidebar)
│       │   │   ├── accounting/   # Modul Akuntansi
│       │   │   ├── hr/           # Modul HR & Karyawan
│       │   │   ├── owner/        # Modul Owner (AI Insights)
│       │   │   ├── kepala-toko/  # Modul Operasional Toko
│       │   │   └── karyawan/     # Modul Portal Karyawan (Absensi)
│       │   └── login/       # Halaman Login
│       ├── components/      # Komponen UI reusable
│       │   ├── layout/      # DashboardSidebar (navigasi terpusat)
│       │   └── ui/          # shadcn/ui components
│       ├── config/          # Konfigurasi navigasi & RBAC
│       ├── types/           # Type definitions (auth, dll)
│       └── lib/             # Utilities
```

## Quick Start

```bash
cd frontend
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Modul & Role

| Modul | Akses |
|-------|-------|
| Dashboard Owner + AI Insights | Owner |
| Akuntansi (EOD, PO, Anggaran, Petty Cash, Laporan) | Owner, Accounting |
| HR & Karyawan (Data, Absensi, Payroll) | Owner, HR |
| Operasional Toko (Budget, Inventory, PO, EOD) | Owner, Kepala Toko |
| Portal Karyawan (Absensi, Slip Gaji) | Owner, BA |

## Dokumentasi

- [Product Requirements Document](docs/prd.md)
- [Company Profile](docs/lp.md)
