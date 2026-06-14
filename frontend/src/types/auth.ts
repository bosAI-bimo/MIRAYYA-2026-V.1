// Definisi Role sesuai PRD (prd.md section 2 & 4)
// owner       = Pemilik bisnis, akses penuh
// hr          = HR Manager
// accounting  = Staff Accounting
// kepala-toko = Kepala Toko / Store Leader
// ba          = Beauty Advisor / Karyawan
export type UserRole = 'owner' | 'hr' | 'accounting' | 'kepala-toko' | 'ba';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  branch?: string; // Nama cabang (nullable, owner tidak terikat cabang)
  initials: string; // Untuk avatar (misal: "OW", "AC", "HR")
  roleLabel: string; // Label tampilan (misal: "Business Owner", "Accounting")
}

// Helper: Dummy user data untuk development (simulasi sebelum ada auth)
export const demoUsers: Record<UserRole, User> = {
  owner: {
    id: '1',
    name: 'Ibu Owner',
    email: 'owner@mirayya.com',
    role: 'owner',
    initials: 'OW',
    roleLabel: 'Business Owner',
  },
  hr: {
    id: '2',
    name: 'Siti Rahma',
    email: 'hr@mirayya.com',
    role: 'hr',
    initials: 'HR',
    roleLabel: 'HR Manager',
  },
  accounting: {
    id: '3',
    name: 'Budi Santoso',
    email: 'accounting@mirayya.com',
    role: 'accounting',
    initials: 'AC',
    roleLabel: 'Accounting',
  },
  'kepala-toko': {
    id: '4',
    name: 'Ahmad Store',
    email: 'store@mirayya.com',
    role: 'kepala-toko',
    branch: 'Mirayya Sudirman',
    initials: 'AS',
    roleLabel: 'Kepala Toko',
  },
  ba: {
    id: '5',
    name: 'Jane Doe',
    email: 'jane@mirayya.com',
    role: 'ba',
    branch: 'Mirayya Sudirman',
    initials: 'JD',
    roleLabel: 'Beauty Advisor',
  },
};
