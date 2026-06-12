"use client";

import React from "react";
import { BrainCircuit, TrendingDown, Package, AlertCircle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OwnerAiInsightsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-[#B76E79]" />
            AI Insights
          </h1>
          <p className="text-slate-500 mt-1">Rekomendasi otomatis berbasis data operasional Mirayya untuk mendukung keputusan strategis.</p>
        </div>
        <Button className="bg-[#B76E79] hover:bg-[#9A5A66] text-white">
          Generate Laporan Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-[#B76E79] border bg-[#F3D3D3]/20 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Rekomendasi</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">12</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#B76E79] shadow-sm">
              <BrainCircuit className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-200 border bg-emerald-50/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Potensi Penghematan</p>
              <h3 className="text-3xl font-bold text-emerald-600 mt-1">Rp8.5M</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-emerald-500 shadow-sm">
              <TrendingDown className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 border bg-blue-50/50 shadow-sm">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Tingkat Akurasi AI</p>
              <h3 className="text-3xl font-bold text-blue-600 mt-1">94.2%</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 border-b border-slate-200 pb-2">Rekomendasi Utama</h2>
        
        {/* Insight 1 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-md">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Optimalisasi Inventaris: Cushion Foundation</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Kategori: Manajemen Stok • Cabang Pusat & Timur</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                Prioritas Tinggi
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Stok <strong>Mirayya Cushion Foundation</strong> di Cabang Pusat diprediksi habis dalam 4 hari berdasarkan rata-rata penjualan 45 unit/hari minggu ini. Sementara itu, Cabang Timur memiliki kelebihan stok sebanyak 200 unit dengan perputaran yang lambat.
            </p>
            <div className="mt-4 bg-slate-50 p-4 rounded-md border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Saran Tindakan:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Lakukan transfer stok (Mutasi Antar Cabang) sebanyak 50-80 unit dari Cabang Timur ke Cabang Pusat.</li>
                <li>Tunda proses PO (Purchase Order) baru ke supplier untuk item ini hingga mutasi selesai untuk mencegah overstock.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="pt-0 justify-end gap-2">
            <Button variant="outline" className="text-slate-600">Abaikan</Button>
            <Button className="bg-[#B76E79] hover:bg-[#9A5A66] text-white">Buat Draft Mutasi</Button>
          </CardFooter>
        </Card>

        {/* Insight 2 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-md">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Strategi Promosi: Peningkatan Omzet Cabang Utara</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Kategori: Penjualan & Marketing • Cabang Utara</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                Prioritas Menengah
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Cabang Utara berpotensi gagal mencapai target omzet bulan ini (saat ini di angka 94% dengan sisa 4 hari kerja). Analisis keranjang belanja menunjukkan produk <em>Mirayya Setting Spray</em> sering dibeli bersamaan dengan <em>Matte Lipstick</em>.
            </p>
            <div className="mt-4 bg-slate-50 p-4 rounded-md border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Saran Tindakan:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Terapkan promo &quot;Buy Lipstick, Get 20% off Setting Spray&quot; khusus untuk Cabang Utara di akhir pekan ini.</li>
                <li>Target kenaikan omzet yang diharapkan: Rp 4.500.000.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="pt-0 justify-end gap-2">
            <Button variant="outline" className="text-slate-600">Abaikan</Button>
            <Button className="bg-[#B76E79] hover:bg-[#9A5A66] text-white">Terapkan Promo</Button>
          </CardFooter>
        </Card>

        {/* Insight 3 */}
        <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base">Efisiensi Biaya Operasional</CardTitle>
                  <CardDescription className="text-xs mt-0.5">Kategori: Keuangan • Cabang Selatan</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Prioritas Rendah
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed">
              Penggunaan Petty Cash di Cabang Selatan meningkat sebesar 25% bulan ini dibandingkan rata-rata 3 bulan terakhir. Sebagian besar pengeluaran tercatat pada kategori &quot;Perlengkapan Toko&quot;.
            </p>
            <div className="mt-4 bg-slate-50 p-4 rounded-md border border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Saran Tindakan:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                <li>Minta tim Accounting untuk melakukan review spesifik terhadap rincian EOD dan nota Petty Cash dari Cabang Selatan minggu ini.</li>
                <li>Pertimbangkan untuk menetapkan limit harian Petty Cash sementara jika tren berlanjut.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="pt-0 justify-end gap-2">
            <Button variant="outline" className="text-slate-600">Abaikan</Button>
            <Button className="bg-slate-800 hover:bg-slate-700 text-white">Notifikasi Accounting</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
