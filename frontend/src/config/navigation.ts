import {
  LayoutDashboard,
  CheckCircle,
  FileText,
  CreditCard,
  Target,
  BarChart3,
  Building,
  Users,
  MapPin,
  CalendarClock,
  Banknote,
  Store,
  BrainCircuit,
  Wallet,
  Package,
  ShoppingCart,
  FileCheck,
  CalendarCheck,
  Receipt,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { type UserRole } from '@/types/auth';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  allowedRoles: UserRole[];
  children?: NavItem[];
  /** Label section group (misal: "ACCOUNTING", "HR"). Hanya perlu di item level pertama. */
  sectionLabel?: string;
}

/**
 * Konfigurasi navigasi terpusat.
 * 
 * Setiap modul memiliki sectionLabel untuk grouping visual di sidebar.
 * Sub-menu didefinisikan di `children` dan akan tampil sebagai dropdown/accordion.
 * 
 * allowedRoles menentukan siapa yang bisa melihat menu ini.
 * Owner selalu bisa melihat SEMUA menu (ditambahkan secara eksplisit).
 */
export const navigationConfig: NavItem[] = [
  // ═══════════════════════════════════════
  // MODUL OWNER
  // ═══════════════════════════════════════
  {
    title: 'Dashboard',
    href: '/dashboard/owner',
    icon: LayoutDashboard,
    allowedRoles: ['owner'],
    sectionLabel: 'OVERVIEW',
    children: [

      {
        title: 'AI Insights',
        href: '/dashboard/owner/ai-insights',
        icon: BrainCircuit,
        allowedRoles: ['owner'],
      },
    ],
  },

  // ═══════════════════════════════════════
  // MODUL ACCOUNTING
  // ═══════════════════════════════════════
  {
    title: 'Akuntansi',
    href: '/dashboard/accounting',
    icon: BarChart3,
    allowedRoles: ['owner', 'accounting'],
    sectionLabel: 'KEUANGAN',
    children: [
      {
        title: 'Persetujuan EOD',
        href: '/dashboard/accounting/eod',
        icon: CheckCircle,
        allowedRoles: ['owner', 'accounting'],
      },
      {
        title: 'Persetujuan PO',
        href: '/dashboard/accounting/po',
        icon: FileText,
        allowedRoles: ['owner', 'accounting'],
      },
      {
        title: 'Anggaran Cabang',
        href: '/dashboard/accounting/anggaran',
        icon: Target,
        allowedRoles: ['owner', 'accounting'],
      },
      {
        title: 'Petty Cash',
        href: '/dashboard/accounting/pettycash',
        icon: CreditCard,
        allowedRoles: ['owner', 'accounting'],
      },
      {
        title: 'Laporan Keuangan',
        href: '/dashboard/accounting/laporan',
        icon: BarChart3,
        allowedRoles: ['owner', 'accounting'],
      },
      {
        title: 'Rekonsiliasi Bank',
        href: '/dashboard/accounting/rekonsiliasi',
        icon: Building,
        allowedRoles: ['owner', 'accounting'],
      },
    ],
  },

  // ═══════════════════════════════════════
  // MODUL HR
  // ═══════════════════════════════════════
  {
    title: 'HR & Karyawan',
    href: '/dashboard/hr',
    icon: Users,
    allowedRoles: ['owner', 'hr'],
    sectionLabel: 'SDM',
    children: [
      {
        title: 'Data Karyawan',
        href: '/dashboard/hr/karyawan',
        icon: Users,
        allowedRoles: ['owner', 'hr'],
      },
      {
        title: 'Data Cabang',
        href: '/dashboard/hr/cabang',
        icon: MapPin,
        allowedRoles: ['owner', 'hr'],
      },
      {
        title: 'Riwayat Absensi',
        href: '/dashboard/hr/absensi',
        icon: CalendarClock,
        allowedRoles: ['owner', 'hr'],
      },
      {
        title: 'Payroll & Gaji',
        href: '/dashboard/hr/payroll',
        icon: Banknote,
        allowedRoles: ['owner', 'hr'],
      },
    ],
  },

  // ═══════════════════════════════════════
  // MODUL KEPALA TOKO
  // ═══════════════════════════════════════
  {
    title: 'Operasional Toko',
    href: '/dashboard/kepala-toko',
    icon: Store,
    allowedRoles: ['owner', 'kepala-toko'],
    sectionLabel: 'OPERASIONAL',
    children: [
      {
        title: 'Budgeting',
        href: '/dashboard/kepala-toko/budgeting',
        icon: Wallet,
        allowedRoles: ['owner', 'kepala-toko'],
      },
      {
        title: 'Inventory',
        href: '/dashboard/kepala-toko/inventory',
        icon: Package,
        allowedRoles: ['owner', 'kepala-toko'],
      },
      {
        title: 'Pengajuan PO',
        href: '/dashboard/kepala-toko/order',
        icon: ShoppingCart,
        allowedRoles: ['owner', 'kepala-toko'],
      },
      {
        title: 'Laporan EOD',
        href: '/dashboard/kepala-toko/eod',
        icon: FileCheck,
        allowedRoles: ['owner', 'kepala-toko'],
      },
    ],
  },

  // ═══════════════════════════════════════
  // MODUL KARYAWAN
  // ═══════════════════════════════════════
  {
    title: 'Portal Karyawan',
    href: '/dashboard/karyawan',
    icon: CalendarCheck,
    allowedRoles: ['owner', 'karyawan'],
    sectionLabel: 'KARYAWAN',
    children: [
      {
        title: 'Absensi',
        href: '/dashboard/karyawan/absensi',
        icon: CalendarCheck,
        allowedRoles: ['owner', 'karyawan'],
      },
      {
        title: 'Slip Gaji',
        href: '/dashboard/karyawan/slip-gaji',
        icon: Receipt,
        allowedRoles: ['owner', 'karyawan'],
      },
    ],
  },

  // ═══════════════════════════════════════
  // MODUL PENGATURAN
  // ═══════════════════════════════════════
  {
    title: 'Pengaturan Global',
    href: '/dashboard/settings',
    icon: Settings,
    allowedRoles: ['owner'],
    sectionLabel: 'SISTEM',
  },
];

/**
 * Filter navigasi berdasarkan role user.
 * Mengembalikan hanya menu yang rolenya cocok.
 */
export function getNavigationForRole(role: UserRole): NavItem[] {
  return navigationConfig
    .filter((item) => item.allowedRoles.includes(role))
    .map((item) => ({
      ...item,
      children: item.children?.filter((child) =>
        child.allowedRoles.includes(role)
      ),
    }));
}
