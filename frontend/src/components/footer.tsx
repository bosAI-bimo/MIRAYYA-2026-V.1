import Link from "next/link";
import { Phone, Mail, MapPin, ShoppingBag, AtSign, Smartphone } from "lucide-react";

export function Footer() {
  return (
    <footer id="kontak" className="bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg leading-none">M</span>
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">
                Mirayya <span className="text-primary">Cosmetics</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
              Pusat perbelanjaan kosmetik dan perawatan kecantikan terpercaya yang berbasis di Banjarnegara, Jawa Tengah.
            </p>
            <div className="flex flex-col gap-3 text-sm text-slate-500">
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-primary" />
                <span>08XX-XXXX-XXXX (WhatsApp CS)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-primary" />
                <span>mirayyacosmetics@gmail.com</span>
              </div>
            </div>
          </div>
          
          <div id="lokasi">
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-primary" />
              Lokasi Cabang
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>Pusat: Jl. Pemuda, Banjarnegara</li>
              <li>Cabang Mandiraja</li>
              <li>Cabang Wonosobo</li>
              <li>Cabang Sokaraja</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <ShoppingBag size={18} className="text-primary" />
              Media Sosial & Toko
            </h4>
            <ul className="space-y-3 text-sm text-slate-500">
              <li>
                <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <AtSign size={16} /> @mirayyacosmetics.bna_
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <Smartphone size={16} /> @mirayyacosmetics (TikTok)
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">
                  <ShoppingBag size={16} /> Shopee / Tokopedia
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Mirayya Cosmetics. All rights reserved.
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
