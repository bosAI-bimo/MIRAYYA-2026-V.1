const fs = require('fs');

const accountingContent = fs.readFileSync('c:/Users/LENOVO/Downloads/erp mirayya evox id/frontend/src/app/dashboard/accounting/layout.tsx', 'utf8');

const roles = [
  {
    pathName: 'hr',
    componentName: 'HRLayout',
    icons: 'LayoutDashboard, Users, MapPin, CalendarClock, Banknote, LogOut, Menu, X, ChevronLeft, ChevronRight',
    links: '[\n  { name: "Dashboard", href: "/dashboard/hr", icon: LayoutDashboard },\n  { name: "Data Karyawan", href: "/dashboard/hr/karyawan", icon: Users },\n  { name: "Data Cabang", href: "/dashboard/hr/cabang", icon: MapPin },\n  { name: "Riwayat Absensi", href: "/dashboard/hr/absensi", icon: CalendarClock },\n  { name: "Payroll & Gaji", href: "/dashboard/hr/payroll", icon: Banknote },\n]',
    menuTitle: 'Menu HR',
    initials: 'HR',
    userName: 'Siti Rahma',
    userRole: 'HR Manager'
  },
  {
    pathName: 'karyawan',
    componentName: 'KaryawanLayout',
    icons: 'LayoutDashboard, CalendarCheck, Receipt, LogOut, Menu, X, ChevronLeft, ChevronRight',
    links: '[\n  { name: "Dashboard", href: "/dashboard/karyawan", icon: LayoutDashboard },\n  { name: "Absensi", href: "/dashboard/karyawan/absensi", icon: CalendarCheck },\n  { name: "Slip Gaji", href: "/dashboard/karyawan/slip-gaji", icon: Receipt },\n]',
    menuTitle: 'Menu Karyawan',
    initials: 'JD',
    userName: 'Jane Doe',
    userRole: 'Beauty Advisor'
  },
  {
    pathName: 'kepala-toko',
    componentName: 'KepalaTokoLayout',
    icons: 'LayoutDashboard, Wallet, Package, ShoppingCart, FileCheck, LogOut, Menu, X, ChevronLeft, ChevronRight',
    links: '[\n  { name: "Dashboard", href: "/dashboard/kepala-toko", icon: LayoutDashboard },\n  { name: "Budgeting", href: "/dashboard/kepala-toko/budgeting", icon: Wallet },\n  { name: "Inventory", href: "/dashboard/kepala-toko/inventory", icon: Package },\n  { name: "Pengajuan PO", href: "/dashboard/kepala-toko/order", icon: ShoppingCart },\n  { name: "Laporan EOD", href: "/dashboard/kepala-toko/eod", icon: FileCheck },\n]',
    menuTitle: 'Menu Kepala Toko',
    initials: 'AS',
    userName: 'Ahmad Store',
    userRole: 'Kepala Toko'
  },
  {
    pathName: 'owner',
    componentName: 'OwnerLayout',
    icons: 'LayoutDashboard, Store, Users, BrainCircuit, LogOut, Menu, X, ChevronLeft, ChevronRight',
    links: '[\n  { name: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard },\n  { name: "Data Cabang", href: "/dashboard/owner/cabang", icon: Store },\n  { name: "Data Karyawan", href: "/dashboard/owner/karyawan", icon: Users },\n  { name: "AI Insights", href: "/dashboard/owner/ai-insights", icon: BrainCircuit },\n]',
    menuTitle: 'Owner Navigation',
    initials: 'OW',
    userName: 'Ibu Owner',
    userRole: 'Business Owner'
  }
];

for (const role of roles) {
  let content = accountingContent;
  
  // Replace icons specifically for lucide-react without swallowing previous imports
  content = content.replace(/import\s+\{[^}]*\}\s+from\s+"lucide-react";/, 'import {\n  ' + role.icons.split(', ').join(',\n  ') + '\n} from "lucide-react";');
  
  // Replace links
  content = content.replace(/const sidebarLinks = \[[\s\S]*?\];/, 'const sidebarLinks = ' + role.links + ';');
  
  // Replace component name
  content = content.replace(/export default function AccountingLayout/, 'export default function ' + role.componentName);
  
  // Replace menu title
  content = content.replace(/>\s*Menu Accounting\s*<\/p>/, '>\n            ' + role.menuTitle + '\n          </p>');
  
  // Replace /dashboard/accounting string
  content = content.replace(/"\/dashboard\/accounting"/g, '"/dashboard/' + role.pathName + '"');
  
  // Replace profile initials
  content = content.replace(/>\s*AC\s*<\/div>/, '>\n              ' + role.initials + '\n            </div>');
  
  // Replace profile name
  content = content.replace(/Budi Santoso/, role.userName);
  
  // Replace profile role
  content = content.replace(/>Accounting</, '>' + role.userRole + '<');
  
  fs.writeFileSync('c:/Users/LENOVO/Downloads/erp mirayya evox id/frontend/src/app/dashboard/' + role.pathName + '/layout.tsx', content);
  console.log('Fixed and updated ' + role.pathName + '/layout.tsx');
}
