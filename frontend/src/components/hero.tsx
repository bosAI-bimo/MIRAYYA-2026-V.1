import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Shield, Heart } from "lucide-react";

export function Hero() {
  return (
    <section id="tentang-kami" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-secondary/40 via-white to-white -z-10" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-primary font-semibold text-sm mb-6">
            <Heart size={16} />
            <span>Pusat Kosmetik Terlengkap</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-800 leading-tight mb-6 tracking-tight">
            Selamat Datang di <span className="text-primary">Mirayya Cosmetics</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
            Pusat perbelanjaan kosmetik dan perawatan kecantikan terpercaya di Banjarnegara. Kami hadir sebagai solusi satu pintu untuk memenuhi segala kebutuhan kecantikan Anda dengan produk original, aman (BPOM), berkualitas, dan harga yang kompetitif.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 text-white rounded-md text-base h-12 px-8">
                Login to Dashboard
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#produk" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full rounded-md text-base h-12 px-8 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300">
                Lihat Produk
              </Button>
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-500" />
              <span>100% Original & BPOM</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              <span>Pelayanan Prima</span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary/60 via-secondary/60 to-primary/60 rounded-[2rem] blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-[1.5rem] shadow-2xl overflow-hidden aspect-[4/3] flex flex-col transform transition-transform duration-500 hover:scale-[1.02]">
            <div className="h-12 border-b border-slate-200/50 bg-slate-50/50 flex items-center px-4 gap-2 backdrop-blur-md">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80 shadow-sm" />
                <div className="w-3 h-3 rounded-full bg-emerald-400/80 shadow-sm" />
              </div>
            </div>
            <div className="flex-1 bg-slate-50/30 p-6 flex flex-col gap-5">
               <div className="flex justify-between items-center mb-2">
                 <div className="w-32 h-6 bg-slate-200/80 rounded-md animate-pulse" />
                 <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                   <div className="w-6 h-6 rounded-full bg-primary/30 animate-ping" />
                 </div>
               </div>
               <div className="grid grid-cols-3 gap-4">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="h-24 bg-white border border-slate-100 rounded-lg shadow-sm p-4 flex flex-col justify-center gap-2">
                     <div className="w-8 h-8 rounded-md bg-secondary/50" />
                     <div className="w-16 h-4 bg-slate-200 rounded animate-pulse" />
                   </div>
                 ))}
               </div>
               <div className="flex-1 bg-white border border-slate-100 rounded-lg shadow-sm mt-2 flex items-center justify-center">
                 <div className="w-3/4 h-3/4 rounded-lg bg-slate-50 border border-slate-100 border-dashed flex flex-col items-center justify-center gap-3">
                    <Heart className="w-8 h-8 text-slate-300" />
                    <div className="w-24 h-3 bg-slate-200 rounded-full" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
