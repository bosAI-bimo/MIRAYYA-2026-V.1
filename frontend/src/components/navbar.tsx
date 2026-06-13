import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <img src="/logo.png" alt="Mirayya Cosmetics" className="h-20 w-auto object-contain scale-125 transform origin-left drop-shadow-sm" />
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


