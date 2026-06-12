import {
  Users,
  Store,
  MapPin,
  BrainCircuit,
  CreditCard,
  Target
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Multi-role & Multi-cabang",
    description: "Sistem yang beradaptasi untuk Owner, HR, Accounting, Kepala Toko, dan BA dengan hak akses terpisah.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Integrasi POS Olsera",
    description: "Tarik data penjualan, produk, HPP, dan stok secara real-time langsung dari sistem Olsera.",
    icon: Store,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Absensi Selfie & GPS",
    description: "Check-in dan check-out dengan verifikasi foto selfie dan lokasi presisi untuk keakuratan data HR.",
    icon: MapPin,
    color: "text-rose-500",
    bgColor: "bg-rose-50"
  },
  {
    title: "Insight AI untuk Owner",
    description: "Rekomendasi stok, promosi, dan analisis produk fast/slow moving didukung oleh kecerdasan buatan.",
    icon: BrainCircuit,
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  },
  {
    title: "Accounting & Payroll Terpusat",
    description: "Otomatisasi perhitungan gaji bulanan, rekonsiliasi bank, dan laporan laba-rugi per cabang.",
    icon: CreditCard,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50"
  },
  {
    title: "Target Revenue Tracking",
    description: "Pantau pencapaian target omzet cabang setiap bulan dengan analisis tren dan selisih nominal.",
    icon: Target,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50"
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
            Fitur Lengkap untuk Skala Bisnis Anda
          </h2>
          <p className="text-slate-600 text-lg">
            Mirraya ERP dirancang khusus untuk memenuhi kebutuhan operasional toko retail kosmetik dari ujung ke ujung.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:-translate-y-2 hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-white/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <CardTitle className="text-xl text-slate-800 font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
