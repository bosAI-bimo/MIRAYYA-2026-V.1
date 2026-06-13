import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg leading-none">M</span>
            </div>
            <span className="font-bold text-xl text-slate-800 tracking-tight">
              Mirayya <span className="text-primary">Cosmetics</span>
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link href="#tentang-kami" className="hover:text-primary transition-colors">
              Tentang Kami
            </Link>
            <Link href="#produk" className="hover:text-primary transition-colors">
              Produk
            </Link>
            <Link href="#lokasi" className="hover:text-primary transition-colors">
              Lokasi
            </Link>
            <Link href="#kontak" className="hover:text-primary transition-colors">
              Kontak
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm font-semibold px-6 rounded-md">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
