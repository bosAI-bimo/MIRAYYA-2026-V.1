"use client";

import React from "react";
import { BrainCircuit, TrendingDown, Package, AlertCircle, TrendingUp, CheckCircle2, ChevronRight, Sparkles, Send, Bot, Zap, Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Data Mockup
const aiForecasting = [
  { day: 'Tgl 1', actual: 15000000, predicted: 15000000 },
  { day: 'Tgl 5', actual: 75000000, predicted: 76000000 },
  { day: 'Tgl 10', actual: 160000000, predicted: 155000000 },
  { day: 'Tgl 15', actual: 245000000, predicted: 240000000 },
  { day: 'Tgl 20', actual: 320000000, predicted: 310000000 },
  { day: 'Tgl 25', actual: null, predicted: 400000000 },
  { day: 'Tgl 30', actual: null, predicted: 515000000 },
];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function OwnerAiInsightsPage() {
  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/owner" className="hover:text-indigo-600 transition-colors">Dashboard Owner</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900 font-bold">AI Command Center</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            Evox AI Insights
          </h1>
          <p className="text-sm text-slate-500">Asisten cerdas untuk memantau, memprediksi, dan mengoptimalkan performa cabang Anda.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-indigo-100 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-indigo-50/30 text-indigo-900 cursor-pointer w-full sm:w-auto min-w-[140px] transition-all">
            <option value="all">🌐 Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
          </select>
          <Button className="bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 text-white px-4 py-2.5 rounded-xl w-full sm:w-auto">
            <Sparkles className="w-4 h-4 mr-2" /> Segarkan Analisis
          </Button>
        </div>
      </div>

      {/* SECTION 1: PREDICTIVE ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Health Score */}
        <Card className="border-2 border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-pulse" />
          <CardContent className="p-6 md:p-8 relative z-10 flex flex-col items-center justify-center text-center h-full">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4 border border-indigo-200">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> System Normal
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-6">Indeks Kesehatan Bisnis</h2>
            
            <div className="relative w-40 h-40 flex items-center justify-center bg-white rounded-full shadow-inner border-[6px] border-slate-50">
              <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * 85) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-slate-800">85</span>
                <span className="text-sm font-medium text-slate-500 block">/ 100</span>
              </div>
            </div>
            
            <p className="text-sm font-medium text-slate-600 mt-6 leading-relaxed">
              <span className="font-bold text-indigo-600">Sangat Baik.</span> Omzet stabil di jalurnya, namun Anda perlu memperhatikan efisiensi biaya (Petty Cash).
            </p>
          </CardContent>
        </Card>

        {/* Forecasting Chart */}
        <Card className="border-2 border-slate-200 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" /> Prediksi Pencapaian Omzet Bulan Ini
            </CardTitle>
            <CardDescription>Realisasi aktual vs Prediksi AI hingga akhir bulan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aiForecasting} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `${val/1000000}M`} />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatRupiah(value), name === 'actual' ? 'Realisasi' : 'Prediksi AI']} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="predicted" name="Prediksi AI" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                  <Line type="monotone" dataKey="actual" name="Realisasi" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SECTION 2: AI COMMAND CENTER (ASK AI) */}
      <Card className="border-2 border-indigo-200 bg-white shadow-sm overflow-hidden mb-8">
        <CardHeader className="pb-4 border-b border-indigo-50 bg-indigo-50/30">
          <CardTitle className="text-lg font-bold text-indigo-900 flex items-center">
            <Bot className="w-6 h-6 mr-2 text-indigo-600" /> Tanya Evox AI
          </CardTitle>
          <CardDescription className="text-indigo-700/70">Asisten cerdas Anda siap menganalisis data, memberikan rangkuman, dan menjawab pertanyaan.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-slate-50/50">
              
              {/* AI Greeting */}
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-indigo-100 shadow-sm">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">
                    Halo! Saya sudah meninjau data penjualan, absen karyawan, dan arus kas hari ini. 
                    Semuanya terlihat terkendali, namun margin di Cabang Barat sedikit menurun minggu ini. <br/><br/>
                    Ada metrik spesifik yang ingin Anda lihat laporannya?
                  </p>
                </div>
              </div>

              {/* User Mock */}
              <div className="flex gap-4 max-w-[85%] ml-auto justify-end">
                <div className="bg-indigo-600 p-4 rounded-2xl rounded-tr-sm shadow-sm text-white">
                  <p className="text-sm leading-relaxed">Tolong rangkumkan 3 prioritas tindakan utama untuk minggu ini berdasarkan data tersebut.</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center flex-shrink-0 border border-slate-300">
                  <span className="text-xs font-bold text-slate-500">YOU</span>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-4 max-w-[85%]">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-sm border border-indigo-100 shadow-sm space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed font-medium">Tentu! Ini 3 prioritas tindakan Anda berdasarkan anomali data terbaru:</p>
                  <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                    <li>Segera rotasi stok <strong>Cushion Foundation</strong> dari Cabang Timur (Overstock) ke Pusat (Kritis).</li>
                    <li>Luncurkan diskon <em>bundling</em> di Cabang Utara karena target omzet terancam tidak tercapai (-6%).</li>
                    <li>Periksa lonjakan pengeluaran Petty Cash di Cabang Selatan yang naik 25% tanpa peningkatan omzet yang linier.</li>
                  </ul>
                  <p className="text-xs text-indigo-500 font-bold mt-2 hover:underline cursor-pointer">Lihat detail di bawah 👇</p>
                </div>
              </div>

            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-200">
               <div className="flex flex-wrap gap-2 mb-3">
                <button className="text-[11px] px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors font-semibold">Buatkan laporan cabang pusat</button>
                <button className="text-[11px] px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors font-semibold">Siapa BA terbaik bulan ini?</button>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Ketik pertanyaan untuk Evox AI..." 
                  className="w-full pl-5 pr-14 py-4 bg-slate-100 border-none rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium"
                />
                <button className="absolute right-2 top-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: ACTIONABLE RECOMMENDATIONS */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-slate-800 flex items-center mb-4">
          <Zap className="w-6 h-6 mr-2 text-indigo-500" /> Detail Prioritas Tindakan
        </h2>
        
        {/* Insight 1 */}
        <Card className="border-l-4 border-l-rose-500 border-y-slate-200 border-r-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full filter blur-2xl" />
          <CardHeader className="pb-2 bg-rose-50/30">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white shadow-sm text-rose-600 rounded-xl border border-rose-100">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Optimalisasi Inventaris: Cushion Foundation</CardTitle>
                  <CardDescription className="text-xs mt-1 font-semibold text-rose-600/70">Kategori: Manajemen Stok • Cabang Pusat & Timur</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                Prioritas Tinggi
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Stok <strong className="text-slate-800">Mirayya Cushion Foundation</strong> di Cabang Pusat diprediksi habis dalam 4 hari. Sementara Cabang Timur memiliki kelebihan stok 200 unit (Idle Capital: Rp 30.000.000).
            </p>
            <div className="mt-4 bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center"><Lightbulb className="w-4 h-4 mr-1 text-rose-500"/> Saran AI:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 font-medium">
                <li>Lakukan transfer stok (Mutasi Antar Cabang) sebanyak 80 unit dari Cabang Timur ke Cabang Pusat.</li>
                <li>Tunda proses PO (Purchase Order) baru ke supplier untuk item ini.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3 pb-5">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-700 font-bold">Abaikan</Button>
            <Button className="bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 font-bold rounded-xl px-6">Setujui & Buat Draft Mutasi</Button>
          </CardFooter>
        </Card>

        {/* Insight 2 */}
        <Card className="border-l-4 border-l-amber-500 border-y-slate-200 border-r-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full filter blur-2xl" />
          <CardHeader className="pb-2 bg-amber-50/30">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white shadow-sm text-amber-600 rounded-xl border border-amber-100">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Strategi Promosi: Kejar Target Omzet Cabang Utara</CardTitle>
                  <CardDescription className="text-xs mt-1 font-semibold text-amber-600/70">Kategori: Penjualan & Marketing • Cabang Utara</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                Prioritas Menengah
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Cabang Utara berpotensi gagal mencapai target omzet bulan ini (saat ini di angka 94% dengan sisa 4 hari kerja). Analisis keranjang belanja menunjukkan produk <em>Mirayya Setting Spray</em> sering dibeli bersamaan dengan <em>Matte Lipstick</em>.
            </p>
            <div className="mt-4 bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center"><Lightbulb className="w-4 h-4 mr-1 text-amber-500"/> Saran AI:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 font-medium">
                <li>Terapkan promo "Buy Lipstick, Get 20% off Setting Spray" khusus untuk Cabang Utara di akhir pekan ini.</li>
                <li>Target kenaikan omzet yang diharapkan: Rp 4.500.000.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3 pb-5">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-700 font-bold">Abaikan</Button>
            <Button className="bg-amber-600 hover:bg-amber-700 text-white shadow-md shadow-amber-600/20 font-bold rounded-xl px-6">Terapkan Promo</Button>
          </CardFooter>
        </Card>

        {/* Insight 3 */}
        <Card className="border-l-4 border-l-blue-500 border-y-slate-200 border-r-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full filter blur-2xl" />
          <CardHeader className="pb-2 bg-blue-50/30">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white shadow-sm text-blue-600 rounded-xl border border-blue-100">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Audit Petty Cash Cabang Selatan</CardTitle>
                  <CardDescription className="text-xs mt-1 font-semibold text-blue-600/70">Kategori: Keuangan • Cabang Selatan</CardDescription>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                Peringatan Dini
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-slate-600 leading-relaxed font-medium">
              Penggunaan Petty Cash di Cabang Selatan meningkat sebesar 25% bulan ini dibandingkan rata-rata 3 bulan terakhir. Sebagian besar pengeluaran tercatat pada kategori "Lain-lain".
            </p>
            <div className="mt-4 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
              <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center"><Lightbulb className="w-4 h-4 mr-1 text-blue-500"/> Saran AI:</h4>
              <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1 font-medium">
                <li>Kirim notifikasi otomatis ke tim Accounting untuk mereview rincian EOD Cabang Selatan.</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-3 pb-5">
            <Button variant="ghost" className="text-slate-500 hover:text-slate-700 font-bold">Abaikan</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 font-bold rounded-xl px-6">Notifikasi Accounting</Button>
          </CardFooter>
        </Card>

      </div>
    </div>
  );
}
