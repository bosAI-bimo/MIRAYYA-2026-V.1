import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">M</span>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Mirraya <span className="text-primary">ERP</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              Sistem manajemen operasional terpadu yang dirancang khusus untuk mengoptimalkan efisiensi Mirraya Cosmetics.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Fitur</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-primary transition-colors">Absensi & HR</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Accounting & Payroll</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Integrasi Olsera</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">AI Insights</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Pusat Bantuan</h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="#" className="hover:text-primary transition-colors">Panduan Penggunaan</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Hubungi Support</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Mirraya Cosmetics. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-slate-600 transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-slate-600 transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
