"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { 
  TrendingUp, 
  Store, 
  Target, 
  BrainCircuit, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock Data
const omzetData = [
  { name: 'Cabang Pusat', omzet: 125000000, target: 120000000 },
  { name: 'Cabang Utara', omzet: 85000000, target: 90000000 },
  { name: 'Cabang Selatan', omzet: 95000000, target: 80000000 },
  { name: 'Cabang Timur', omzet: 110000000, target: 105000000 },
  { name: 'Cabang Barat', omzet: 70000000, target: 75000000 },
  { name: 'Cabang Baru', omzet: 45000000, target: 50000000 },
];

const fastMoving = [
  { id: 1, name: "Mirayya Liptint Velvet", sold: 1240, branch: "Semua Cabang", stock: 150 },
  { id: 2, name: "Mirayya Cushion Foundation", sold: 850, branch: "Cabang Pusat", stock: 80 },
  { id: 3, name: "Mirayya Glow Serum", sold: 720, branch: "Cabang Timur", stock: 200 },
];

const slowMoving = [
  { id: 4, name: "Mirayya Matte Lipstick (Old Ed.)", sold: 45, branch: "Cabang Barat", stock: 300 },
  { id: 5, name: "Mirayya Setting Spray", sold: 60, branch: "Cabang Baru", stock: 150 },
];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function OwnerDashboardPage() {
  const totalOmzet = omzetData.reduce((acc, curr) => acc + curr.omzet, 0);
  const totalTarget = omzetData.reduce((acc, curr) => acc + curr.target, 0);
  const targetAchievement = ((totalOmzet / totalTarget) * 100).toFixed(1);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard" className="hover:text-pink-600 transition-colors">Dashboard</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Owner</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Owner Dashboard</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Omzet (Bulan Ini)</CardTitle>
              <TrendingUp className="w-5 h-5 text-[#B76E79]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{formatRupiah(totalOmzet)}</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +12.5% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pencapaian Target</CardTitle>
              <Target className="w-5 h-5 text-[#B76E79]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{targetAchievement}%</div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-2">
                <div 
                  className={`h-2 rounded-full ${Number(targetAchievement) >= 100 ? 'bg-emerald-500' : 'bg-[#B76E79]'}`} 
                  style={{ width: `${Math.min(Number(targetAchievement), 100)}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Transaksi</CardTitle>
              <Package className="w-5 h-5 text-[#B76E79]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">4,892</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1">
                <ArrowUpRight className="w-3 h-3 mr-1" />
                +8.2% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-slate-200 hover:shadow-md transition-shadow group h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Cabang Aktif</CardTitle>
              <Store className="w-5 h-5 text-[#B76E79]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">6</div>
              <p className="text-xs text-slate-500 mt-1">
                Dari 6 cabang terdaftar
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <Card className="border-2 border-slate-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Perbandingan Omzet Cabang</CardTitle>
            <CardDescription>Realisasi vs Target Bulan Ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={omzetData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(value) => `Rp${value / 1000000}M`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f1f5f9' }}
                    formatter={(value: any) => [formatRupiah(Number(value)), ""]}
                  />
                  <Legend />
                  <Bar dataKey="omzet" name="Realisasi" fill="#B76E79" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Target Revenue Tracking List */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Pantauan Target Omzet</CardTitle>
            <CardDescription>Cabang dengan performa di bawah target</CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <div className="divide-y divide-slate-100">
              {omzetData.map((branch) => {
                const isUnderTarget = branch.omzet < branch.target;
                const deficit = branch.target - branch.omzet;
                const percent = Math.round((branch.omzet / branch.target) * 100);

                return (
                  <div key={branch.name} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div>
                      <h4 className={`text-sm font-medium ${isUnderTarget ? 'text-rose-600' : 'text-slate-800'}`}>
                        {branch.name}
                        {isUnderTarget && <AlertTriangle className="w-3 h-3 inline ml-2 text-rose-500" />}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatRupiah(branch.omzet)} / {formatRupiah(branch.target)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${isUnderTarget ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {percent}%
                      </span>
                      {isUnderTarget && (
                        <p className="text-[10px] text-rose-500 mt-0.5">-{formatRupiah(deficit)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fast & Slow Moving Products */}
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-800">Produk Fast & Slow Moving</CardTitle>
            <CardDescription>Berdasarkan data penjualan 30 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-emerald-600 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Fast Moving (Top 3)
                </h4>
                <div className="space-y-3">
                  {fastMoving.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.branch} • Stok: {item.stock}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-emerald-600">{item.sold}</span>
                        <p className="text-[10px] text-slate-500">terjual</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-rose-600 mb-3 flex items-center">
                  <ArrowDownRight className="w-4 h-4 mr-2" />
                  Slow Moving
                </h4>
                <div className="space-y-3">
                  {slowMoving.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-rose-50/50 rounded-lg border border-rose-100">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">{item.branch} • Stok: {item.stock}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-rose-600">{item.sold}</span>
                        <p className="text-[10px] text-slate-500">terjual</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights Summary */}
        <Card className="border-2 border-slate-200 border-none bg-gradient-to-br from-primary/10 via-background to-background shadow-soft relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="w-24 h-24 text-primary" />
          </div>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center text-primary">
              <BrainCircuit className="w-5 h-5 mr-2" />
              Insight AI Mirayya
            </CardTitle>
            <CardDescription>Rekomendasi otomatis berbasis data operasional</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <h5 className="font-semibold text-slate-800 text-sm mb-1">Rekomendasi Restock</h5>
              <p className="text-sm text-slate-600">
                Stok <strong>Mirayya Cushion Foundation</strong> di Cabang Pusat diprediksi habis dalam 4 hari. Disarankan untuk memindahkan 50 unit dari Cabang Timur yang overstock.
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <h5 className="font-semibold text-slate-800 text-sm mb-1">Peringatan Target Omzet</h5>
              <p className="text-sm text-slate-600">
                Cabang Utara dan Cabang Baru memiliki tren penurunan di minggu ke-3. Saran: Jalankan promosi bundling untuk produk <em>Mirayya Setting Spray</em>.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-shadow">
              <h5 className="font-semibold text-slate-800 text-sm mb-1">Efisiensi Operasional</h5>
              <p className="text-sm text-slate-600">
                Penggunaan Petty Cash di Cabang Selatan meningkat 25% bulan ini dibandingkan rata-rata historis. Perlu peninjauan oleh tim Accounting.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
