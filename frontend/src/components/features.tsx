import {
  Heart,
  Star,
  User,
  ShoppingBag
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Skincare & Masker",
    description: "Solusi perawatan wajah komprehensif untuk berbagai jenis dan kondisi kulit.",
    icon: Heart,
    color: "text-blue-500",
    bgColor: "bg-blue-50"
  },
  {
    title: "Cosmetics & Makeup",
    description: "Ragam produk riasan wajah berkualitas untuk kebutuhan harian hingga acara formal.",
    icon: Star,
    color: "text-rose-500",
    bgColor: "bg-rose-50"
  },
  {
    title: "Bodycare & Haircare",
    description: "Perawatan rambut dan tubuh mutakhir agar tetap sehat, ternutrisi, dan segar sepanjang hari.",
    icon: User,
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    title: "Aksesoris Kecantikan",
    description: "Peralatan penunjang makeup dan aplikator perawatan diri untuk hasil yang maksimal.",
    icon: ShoppingBag,
    color: "text-amber-500",
    bgColor: "bg-amber-50"
  }
];

export function Features() {
  return (
    <section id="produk" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
            Produk & Layanan Kami
          </h2>
          <p className="text-slate-600 text-lg">
            Kami menyediakan produk perawatan komprehensif dari ujung kepala hingga ujung kaki untuk memancarkan kecantikan alami Anda.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group hover:-translate-y-2 hover:shadow-lg hover:border-primary/20 transition-all duration-300 bg-white/60 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
                <CardHeader className="relative z-10">
                  <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.color} flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} strokeWidth={2} />
                  </div>
                  <CardTitle className="text-lg lg:text-xl text-slate-800 font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <CardDescription className="text-slate-600 text-sm lg:text-base leading-relaxed">
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
