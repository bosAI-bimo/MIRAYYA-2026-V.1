"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, 
  Store, 
  Target, 
  BrainCircuit, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  AlertTriangle,
  ChevronRight,
  DollarSign,
  Users,
  UserCheck,
  FileText,
  Activity,
  Heart,
  UserPlus,
  RefreshCw,
  Frown,
  XCircle,
  Lightbulb,
  Award,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Banknote,
  ArrowRight,
  Clock,
  UserMinus,
  Sparkles,
  Send,
  Bot,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line
} from 'recharts';
import { Button } from "@/components/ui/button";

// --- MOCK DATA ---

// 1. Financial Data
const omzetData = [
  { name: 'Cabang Pusat', omzet: 125000000, target: 120000000 },
  { name: 'Cabang Utara', omzet: 85000000, target: 90000000 },
  { name: 'Cabang Selatan', omzet: 95000000, target: 80000000 },
  { name: 'Cabang Timur', omzet: 110000000, target: 105000000 },
  { name: 'Cabang Barat', omzet: 70000000, target: 75000000 },
  { name: 'Cabang Baru', omzet: 45000000, target: 50000000 },
];

const profitTrend = [
  { month: 'Jan', profit: 45000000 },
  { month: 'Feb', profit: 52000000 },
  { month: 'Mar', profit: 48000000 },
  { month: 'Apr', profit: 61000000 },
  { month: 'Mei', profit: 59000000 },
  { month: 'Jun', profit: 72000000 },
];

// 5. Detailed Financial Data
const cashFlowStatus = {
  in: 520000000,
  out: 448000000,
  net: 72000000
};

const costBreakdown = [
  { name: 'Gaji Karyawan', value: 245000000, color: '#f43f5e' },
  { name: 'Pembelian Inventory (PO)', value: 150000000, color: '#8b5cf6' },
  { name: 'Petty Cash Cabang', value: 35000000, color: '#f59e0b' },
  { name: 'Marketing & Ads', value: 18000000, color: '#06b6d4' },
];

const paymentMethods = [
  { name: 'QRIS', value: 45, color: '#10b981' },
  { name: 'Tunai', value: 30, color: '#f59e0b' },
  { name: 'EDC/Card', value: 25, color: '#3b82f6' },
];

const branchProfitability = [
  { branch: 'Cabang Pusat', revenue: 125000000, cost: 95000000, profit: 30000000, margin: 24, status: 'Healthy' },
  { branch: 'Cabang Timur', revenue: 110000000, cost: 85000000, profit: 25000000, margin: 22.7, status: 'Healthy' },
  { branch: 'Cabang Selatan', revenue: 95000000, cost: 82000000, profit: 13000000, margin: 13.6, status: 'Warning' },
  { branch: 'Cabang Utara', revenue: 85000000, cost: 70000000, profit: 15000000, margin: 17.6, status: 'Healthy' },
  { branch: 'Cabang Barat', revenue: 70000000, cost: 68000000, profit: 2000000, margin: 2.8, status: 'Critical' },
  { branch: 'Cabang Baru', revenue: 45000000, cost: 48000000, profit: -3000000, margin: -6.6, status: 'Critical' },
].sort((a, b) => b.profit - a.profit);

// 2. RFM Data
const rfmSegmentDistribution = [
  { name: 'Champions', value: 35, color: '#10b981', desc: 'Belanja sering, terbaru, nominal besar' },
  { name: 'Loyal', value: 25, color: '#3b82f6', desc: 'Sering belanja & nominal lumayan' },
  { name: 'Potential Loyalist', value: 15, color: '#8b5cf6', desc: 'Baru tapi sudah >1x belanja' },
  { name: 'New Customers', value: 10, color: '#06b6d4', desc: 'Baru pertama kali belanja' },
  { name: 'At Risk', value: 10, color: '#f59e0b', desc: 'Sering belanja tapi sudah lama tidak datang' },
  { name: 'Lost', value: 5, color: '#f43f5e', desc: 'Lama tidak datang, frekuensi rendah' },
];

const rfmScatterData = [
  { name: "Diana (Champions)", recency: 2, frequency: 24, monetary: 8500000, fill: "#10b981" },
  { name: "Siti (Champions)", recency: 5, frequency: 18, monetary: 4200000, fill: "#10b981" },
  { name: "Bunga (Loyal)", recency: 12, frequency: 15, monetary: 3800000, fill: "#3b82f6" },
  { name: "Rina (Potential)", recency: 4, frequency: 3, monetary: 800000, fill: "#8b5cf6" },
  { name: "Ani (At Risk)", recency: 45, frequency: 8, monetary: 1500000, fill: "#f59e0b" },
  { name: "Maya (Lost)", recency: 85, frequency: 2, monetary: 450000, fill: "#f43f5e" },
  { name: "Kirana (New)", recency: 1, frequency: 1, monetary: 250000, fill: "#06b6d4" },
  { name: "Sarah (Loyal)", recency: 20, frequency: 12, monetary: 2900000, fill: "#3b82f6" },
  { name: "Citra (At Risk)", recency: 50, frequency: 11, monetary: 3100000, fill: "#f59e0b" },
  { name: "Putri (Champions)", recency: 3, frequency: 22, monetary: 6200000, fill: "#10b981" },
];

const rfmCustomers = [
  { id: 1, name: "Diana Kartika", branch: "Cabang Pusat", lastPurchase: "2 hari lalu", frequency: 24, spent: 8500000, segment: "Champions" },
  { id: 2, name: "Putri Titian", branch: "Cabang Timur", lastPurchase: "3 hari lalu", frequency: 22, spent: 6200000, segment: "Champions" },
  { id: 3, name: "Siti Rahma", branch: "Cabang Utara", lastPurchase: "5 hari lalu", frequency: 18, spent: 4200000, segment: "Champions" },
  { id: 4, name: "Bunga Jelita", branch: "Cabang Selatan", lastPurchase: "12 hari lalu", frequency: 15, spent: 3800000, segment: "Loyal" },
  { id: 5, name: "Sarah Sechan", branch: "Cabang Utara", lastPurchase: "20 hari lalu", frequency: 12, spent: 2900000, segment: "Loyal" },
];

// 3. Product & Inventory Data
const fastMoving = [
  { id: 1, name: "Mirayya Liptint Velvet", sold: 1240, branch: "Semua Cabang", stock: 150 },
  { id: 2, name: "Mirayya Cushion Foundation", sold: 850, branch: "Cabang Pusat", stock: 80 },
  { id: 3, name: "Mirayya Glow Serum", sold: 720, branch: "Cabang Timur", stock: 200 },
];

const mediumMoving = [
  { id: 4, name: "Mirayya Acne Spot Gel", sold: 450, branch: "Semua Cabang", stock: 320 },
  { id: 5, name: "Mirayya Hydrating Toner", sold: 380, branch: "Cabang Selatan", stock: 210 },
  { id: 6, name: "Mirayya Loose Powder", sold: 310, branch: "Cabang Utara", stock: 150 },
];

const slowMoving = [
  { id: 7, name: "Mirayya Matte Lipstick (Old Ed.)", sold: 45, branch: "Cabang Barat", stock: 300, idleCapital: 15000000 },
  { id: 8, name: "Mirayya Setting Spray", sold: 60, branch: "Cabang Baru", stock: 150, idleCapital: 12000000 },
];

const deadStock = [
  { id: 9, name: "Mirayya Eyeshadow Palette (V1)", sold: 0, branch: "Gudang Pusat", stock: 450, idleCapital: 45000000, action: "Flash Sale 50%" },
  { id: 10, name: "Mirayya Contour Stick", sold: 0, branch: "Cabang Barat", stock: 120, idleCapital: 8400000, action: "Buy 1 Get 1" },
];

const criticalStock = [
  { branch: "Cabang Pusat", name: "Cushion Refill 02", sisa: 5, status: "Kritis" },
  { branch: "Cabang Selatan", name: "Liptint Velvet 04", sisa: 8, status: "Kritis" },
  { branch: "Cabang Baru", name: "Sunscreen Gel", sisa: 12, status: "Warning" },
];

// 4. HR Data
const attendanceDetails = [
  { branch: "Pusat", Tepat: 10, Telat: 2, Izin: 0, Alpha: 0 },
  { branch: "Utara", Tepat: 6, Telat: 1, Izin: 1, Alpha: 0 },
  { branch: "Selatan", Tepat: 8, Telat: 1, Izin: 0, Alpha: 1 },
  { branch: "Timur", Tepat: 10, Telat: 0, Izin: 0, Alpha: 0 },
  { branch: "Barat", Tepat: 6, Telat: 2, Izin: 0, Alpha: 0 },
  { branch: "Baru", Tepat: 6, Telat: 0, Izin: 0, Alpha: 0 },
];

const topPerformers = [
  { id: 1, name: "Diana Kartika", role: "Sr. Beauty Advisor", branch: "Cabang Pusat", sales: 45000000, target: 40000000, achievement: 112 },
  { id: 2, name: "Putri Titian", role: "Beauty Advisor", branch: "Cabang Timur", sales: 38000000, target: 35000000, achievement: 108 },
  { id: 3, name: "Sarah Sechan", role: "Store Leader", branch: "Cabang Utara", sales: 32000000, target: 30000000, achievement: 106 },
];

const lateActionList = [
  { id: 1, name: "Sari Indah", role: "BA", branch: "Cabang Pusat", time: "09:15 WIB", delay: 15, sp: 0, action: "Teguran Lisan" },
  { id: 2, name: "Budi Santoso", role: "Store Leader", branch: "Cabang Utara", time: "09:20 WIB", delay: 20, sp: 1, action: "Kirim SP 2" },
  { id: 3, name: "Ani Yudhoyono", role: "BA", branch: "Cabang Selatan", time: "09:45 WIB", delay: 45, sp: 2, action: "Review SP 3" },
];

// 5. AI Insights Data
const aiForecasting = [
  { day: 'Tgl 1', actual: 15000000, predicted: 15000000 },
  { day: 'Tgl 5', actual: 75000000, predicted: 76000000 },
  { day: 'Tgl 10', actual: 160000000, predicted: 155000000 },
  { day: 'Tgl 15', actual: 245000000, predicted: 240000000 },
  { day: 'Tgl 20', actual: 320000000, predicted: 310000000 },
  { day: 'Tgl 25', actual: null, predicted: 400000000 },
  { day: 'Tgl 30', actual: null, predicted: 515000000 },
];

const aiRecommendations = [
  { id: 1, type: "Kritis", title: "Idle Capital Membengkak", desc: "Terdapat Rp 53.400.000 modal mengendap di Dead Stock Cabang Pusat & Barat. Segera adakan Flash Sale akhir pekan ini untuk mencairkan kas.", icon: AlertCircle, color: "rose" },
  { id: 2, type: "Peringatan", title: "Margin Laba Cabang Barat Menurun", desc: "Margin laba Cabang Barat anjlok ke 2.8%. Evaluasi kembali biaya operasional dan efisiensi Petty Cash di cabang tersebut.", icon: AlertTriangle, color: "amber" },
  { id: 3, type: "Peluang", title: "Segmen 'Champions' Bertumbuh", desc: "Terdapat peningkatan 15% pada jumlah pelanggan segmen Champions. Luncurkan program loyalitas eksklusif (Mirayya VIP) untuk mempertahankan mereka.", icon: Lightbulb, color: "emerald" },
];

// Utils
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
      className="space-y-6 lg:space-y-8"
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
                  <span className="text-slate-900">Owner Command Center</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Owner Command Center</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[160px] shadow-sm transition-all">
            <option value="all">Semua Cabang (Konsolidasi)</option>
            <option value="sudirman">Mirayya Pusat (Sudirman)</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
            <option value="baru">Mirayya Baru</option>
          </select>
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* 8 KPI Cards (2 rows x 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Row 1 */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Omzet</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><DollarSign className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{formatRupiah(totalOmzet)}</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +12.5% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Laba Bersih (Estimasi)</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{formatRupiah(72000000)}</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> Margin 13.6%
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-[#B76E79]/50 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Pencapaian Target</CardTitle>
              <div className="p-2 bg-rose-50 rounded-lg text-[#B76E79]"><Target className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{targetAchievement}%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-[#B76E79] h-full rounded-full" style={{ width: `${Math.min(Number(targetAchievement), 100)}%` }} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-violet-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Transaksi</CardTitle>
              <div className="p-2 bg-violet-50 rounded-lg text-violet-600"><Package className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">4,892</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> +8.2% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Row 2 */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Karyawan</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">54</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Di 6 Cabang
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-teal-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Tingkat Kehadiran</CardTitle>
              <div className="p-2 bg-teal-50 rounded-lg text-teal-600"><UserCheck className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">96.3%</div>
              <p className="text-xs text-rose-500 flex items-center mt-1 font-medium">
                <AlertCircle className="w-3 h-3 mr-1" /> 2 Orang Terlambat
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">PO Pending</CardTitle>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><FileText className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">3</div>
              <p className="text-xs text-amber-600 mt-1 font-medium">
                Menunggu Acc Accounting
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-rose-200 bg-rose-50/30 hover:border-rose-400 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-rose-700">Stok Kritis</CardTitle>
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><AlertTriangle className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">8 Item</div>
              <p className="text-xs text-rose-500 mt-1 font-medium">
                Sisa &lt; 10 pcs
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="rfm" className="w-full">
          {/* Capsule Tabs */}
          <div className="flex my-6 lg:my-8 bg-slate-100/80 p-1.5 rounded-2xl md:rounded-full w-full overflow-x-auto no-scrollbar border-2 border-slate-200/50 shadow-inner">
            <TabsList className="bg-transparent p-0 flex gap-1 lg:gap-2 min-w-max h-auto">
              <TabsTrigger value="rfm" className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-6 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer flex items-center">
                <Heart className="w-4 h-4 mr-2" /> Analisis RFM Pelanggan
              </TabsTrigger>
              <TabsTrigger value="finance" className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-6 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer flex items-center">
                <DollarSign className="w-4 h-4 mr-2" /> Ringkasan Keuangan
              </TabsTrigger>
              <TabsTrigger value="inventory" className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-6 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer flex items-center">
                <Package className="w-4 h-4 mr-2" /> Produk & Inventory
              </TabsTrigger>
              <TabsTrigger value="hr" className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-6 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer flex items-center">
                <Users className="w-4 h-4 mr-2" /> SDM & Kehadiran
              </TabsTrigger>
              <TabsTrigger value="ai" className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-6 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer flex items-center">
                <BrainCircuit className="w-4 h-4 mr-2" /> AI Insights
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 2: RFM ANALYSIS */}
          <TabsContent value="rfm" className="mt-6 space-y-6 focus-visible:outline-none">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold text-slate-800">RFM Customer Segmentation</h2>
                <p className="text-sm text-slate-500">Menganalisis perilaku pelanggan berdasarkan Recency, Frequency, dan Monetary.</p>
              </div>
              <Button variant="outline" className="text-pink-600 border-pink-200 hover:bg-pink-50">Unduh Laporan RFM</Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Segment Distribution */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">Distribusi Segmen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={rfmSegmentDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {rfmSegmentDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value}% Pelanggan`, name]}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-2 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                    {rfmSegmentDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                          <span className="font-medium text-slate-700">{item.name}</span>
                        </div>
                        <span className="font-bold text-slate-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Scatter Chart: RFM */}
              <Card className="border-2 border-slate-200 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">Peta Sebaran Pelanggan (Recency vs Frequency)</CardTitle>
                  <CardDescription>Ukuran bubble menunjukkan Monetary (total belanja).</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                          type="number" 
                          dataKey="recency" 
                          name="Recency" 
                          unit=" hari" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                          domain={[0, 100]}
                          reversed
                        />
                        <YAxis 
                          type="number" 
                          dataKey="frequency" 
                          name="Frequency" 
                          unit="x" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#64748b', fontSize: 12 }} 
                        />
                        <ZAxis type="number" dataKey="monetary" range={[50, 400]} name="Monetary" />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }} 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-3 rounded-xl shadow-lg border border-slate-100">
                                  <p className="font-bold text-slate-800">{data.name}</p>
                                  <p className="text-xs text-slate-500 mt-1">Recency: {data.recency} hari lalu</p>
                                  <p className="text-xs text-slate-500">Frequency: {data.frequency}x transaksi</p>
                                  <p className="text-xs text-slate-500">Monetary: {formatRupiah(data.monetary)}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter data={rfmScatterData} fill="#8884d8">
                          {rfmScatterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.8} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center text-xs text-slate-500 mt-2 space-x-6">
                    <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#10b981] mr-2"/> Champions/Loyal</span>
                    <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#f59e0b] mr-2"/> At Risk</span>
                    <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-[#f43f5e] mr-2"/> Lost</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Customers Table & Actionable RFM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="border-2 border-slate-200 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-slate-800">Top Customers (High Value)</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3">Nama Pelanggan</th>
                          <th className="px-6 py-3">Cabang Favorit</th>
                          <th className="px-6 py-3">Last Order</th>
                          <th className="px-6 py-3">Total Spent</th>
                          <th className="px-6 py-3">Segment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {rfmCustomers.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50/50">
                            <td className="px-6 py-4 font-bold text-slate-800">{c.name}</td>
                            <td className="px-6 py-4 text-slate-600">{c.branch}</td>
                            <td className="px-6 py-4 text-slate-600">{c.lastPurchase}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{formatRupiah(c.spent)}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                c.segment === 'Champions' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                {c.segment}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-slate-800">RFM Action Plan</CardTitle>
                  <CardDescription>Rekomendasi taktik marketing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                    <h4 className="flex items-center text-sm font-bold text-emerald-800 mb-1">
                      <Award className="w-4 h-4 mr-2" /> Champions (35%)
                    </h4>
                    <p className="text-xs text-emerald-600">Berikan akses eksklusif ke produk baru atau program reward spesial. Jangan berikan diskon berlebih agar margin terjaga.</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                    <h4 className="flex items-center text-sm font-bold text-amber-800 mb-1">
                      <RefreshCw className="w-4 h-4 mr-2" /> At Risk (10%)
                    </h4>
                    <p className="text-xs text-amber-600">Kirim email personal / WA broadcast dengan penawaran &quot;We Miss You&quot; (Diskon 20%).</p>
                  </div>
                  <div className="bg-cyan-50 border border-cyan-100 p-4 rounded-xl">
                    <h4 className="flex items-center text-sm font-bold text-cyan-800 mb-1">
                      <UserPlus className="w-4 h-4 mr-2" /> New Customers (10%)
                    </h4>
                    <p className="text-xs text-cyan-600">Kirim panduan penggunaan produk (edukasi) untuk mendorong pembelian kedua.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 1: FINANCE */}
          <TabsContent value="finance" className="mt-6 space-y-6 focus-visible:outline-none">
            {/* Cash Flow Summary & Bank Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card className="border-2 border-slate-200 bg-gradient-to-br from-emerald-50 to-white shadow-sm lg:col-span-3 h-full">
                <CardContent className="p-6 h-full flex flex-col justify-center">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full">
                    <div className="w-full">
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Pemasukan (Cash In)</p>
                      <h4 className="text-2xl font-bold text-emerald-600">{formatRupiah(cashFlowStatus.in)}</h4>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                    <div className="w-full">
                      <p className="text-sm font-medium text-slate-500 mb-1">Total Pengeluaran (Cash Out)</p>
                      <h4 className="text-2xl font-bold text-rose-600">{formatRupiah(cashFlowStatus.out)}</h4>
                    </div>
                    <div className="hidden md:block w-px h-12 bg-slate-200"></div>
                    <div className="w-full">
                      <p className="text-sm font-medium text-slate-500 mb-1">Surplus/Defisit Kas (Net Flow)</p>
                      <h4 className="text-2xl font-extrabold text-slate-800">{formatRupiah(cashFlowStatus.net)}</h4>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-amber-50/50 shadow-sm flex flex-col justify-center items-center text-center p-6">
                <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                <h4 className="font-bold text-amber-800 text-sm">Rekonsiliasi Bank</h4>
                <p className="text-xs text-amber-700 mt-1">Ada 2 selisih belum diselesaikan di Cabang Barat</p>
                <Button variant="link" className="text-amber-600 font-bold p-0 mt-1 h-auto text-xs">Lihat Detail</Button>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cost Breakdown */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">Struktur Biaya Operasional</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={costBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {costBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [formatRupiah(value), name]}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2 mt-4 max-h-[150px] overflow-y-auto pr-2 no-scrollbar">
                    {costBreakdown.map((item, idx) => {
                      const percentage = Math.round((item.value / cashFlowStatus.out) * 100);
                      return (
                        <div key={idx} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                            <span className="font-medium text-slate-700">{item.name}</span>
                          </div>
                          <span className="font-bold text-slate-900">{percentage}%</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Omzet vs Target Chart */}
              <Card className="border-2 border-slate-200 lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-semibold text-slate-800">Omzet per Cabang vs Target</CardTitle>
                    <div className="flex items-center space-x-4 text-xs font-medium text-slate-500">
                      <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-[#B76E79] mr-1.5"/> Realisasi</span>
                      <span className="flex items-center"><div className="w-3 h-3 rounded-sm bg-[#cbd5e1] mr-1.5"/> Target</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={omzetData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `${val/1000000}M`} />
                        <Tooltip formatter={(value: number, name: string) => [formatRupiah(value), name]} cursor={{ fill: '#f8fafc' }} />
                        <Bar dataKey="omzet" name="Realisasi" fill="#B76E79" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="target" name="Target" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <p className="text-xs text-slate-500 font-medium">Metode Pembayaran (Overall):</p>
                    <div className="flex flex-wrap gap-3 text-xs font-bold">
                      {paymentMethods.map((pm, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md text-slate-700 flex items-center" style={{borderLeft: `3px solid ${pm.color}`}}>
                          {pm.name}: {pm.value}%
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Branch Profitability Table */}
              <Card className="border-2 border-slate-200 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">Analisis Profitabilitas per Cabang</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-3">Cabang</th>
                          <th className="px-6 py-3 text-right">Omzet</th>
                          <th className="px-6 py-3 text-right">Total Biaya</th>
                          <th className="px-6 py-3 text-right">Laba / (Rugi)</th>
                          <th className="px-6 py-3 text-right">Margin</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {branchProfitability.map((b, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-6 py-3 font-bold text-slate-800 flex items-center">
                              {idx === 0 && <span className="mr-2 text-xl" title="Juara 1">🥇</span>}
                              {idx === 1 && <span className="mr-2 text-xl" title="Juara 2">🥈</span>}
                              {idx === 2 && <span className="mr-2 text-xl" title="Juara 3">🥉</span>}
                              {idx > 2 && (b.status === 'Critical' ? <AlertCircle className="w-4 h-4 text-rose-500 mr-2" /> : 
                               b.status === 'Warning' ? <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" /> :
                               <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />)}
                              {b.branch}
                            </td>
                            <td className="px-6 py-3 text-right font-medium text-slate-700">{formatRupiah(b.revenue)}</td>
                            <td className="px-6 py-3 text-right font-medium text-slate-700">{formatRupiah(b.cost)}</td>
                            <td className={`px-6 py-3 text-right font-bold ${b.profit < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                              {formatRupiah(b.profit)}
                            </td>
                            <td className="px-6 py-3 text-right">
                              <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                                b.margin >= 20 ? 'bg-emerald-100 text-emerald-700' : 
                                b.margin > 10 ? 'bg-blue-100 text-blue-700' : 
                                b.margin > 0 ? 'bg-amber-100 text-amber-700' : 
                                'bg-rose-100 text-rose-700'
                              }`}>
                                {b.margin}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Laba Trend */}
              <Card className="border-2 border-slate-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-slate-800">Tren Laba Bersih (6 Bulan)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px] w-full mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={profitTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={(val) => `${val/1000000}M`} />
                        <Tooltip formatter={(value: number, name: string) => [formatRupiah(value), name === 'profit' ? 'Laba Bersih' : name]} />
                        <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Laba Bersih Bulan Ini</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">{formatRupiah(profitTrend[5].profit)}</p>
                    <p className="text-xs text-emerald-600 flex items-center mt-1 font-semibold">
                      <TrendingUp className="w-3 h-3 mr-1" /> Naik 22% vs Bulan Lalu
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: INVENTORY */}
          <TabsContent value="inventory" className="mt-6 space-y-6 focus-visible:outline-none">
            {/* Inventory Health KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-slate-200 hover:border-emerald-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Fast Moving</p>
                    <h4 className="text-xl font-extrabold text-emerald-600">32 Item</h4>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="w-5 h-5" /></div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-200 hover:border-blue-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Medium Moving</p>
                    <h4 className="text-xl font-extrabold text-blue-600">85 Item</h4>
                  </div>
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Activity className="w-5 h-5" /></div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-200 hover:border-amber-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Slow Moving</p>
                    <h4 className="text-xl font-extrabold text-amber-600">14 Item</h4>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><ArrowDownRight className="w-5 h-5" /></div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-200 hover:border-rose-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Dead Stock</p>
                    <h4 className="text-xl font-extrabold text-rose-600">8 Item</h4>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><XCircle className="w-5 h-5" /></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Product Movement Board */}
              <Card className="border-2 border-slate-200 lg:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-800">Movement Board</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="fast" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-xl mb-4">
                      <TabsTrigger value="fast" className="rounded-lg text-xs font-bold data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">Fast</TabsTrigger>
                      <TabsTrigger value="medium" className="rounded-lg text-xs font-bold data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">Medium</TabsTrigger>
                      <TabsTrigger value="slow" className="rounded-lg text-xs font-bold data-[state=active]:bg-amber-50 data-[state=active]:text-amber-700">Slow</TabsTrigger>
                      <TabsTrigger value="dead" className="rounded-lg text-xs font-bold data-[state=active]:bg-rose-50 data-[state=active]:text-rose-700">Dead Stock</TabsTrigger>
                    </TabsList>

                    <TabsContent value="fast" className="mt-0 focus-visible:outline-none">
                      <div className="divide-y divide-slate-100">
                        {fastMoving.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{item.branch} • Stok tersisa: {item.stock}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-extrabold text-emerald-600">{item.sold} <span className="text-xs font-medium text-slate-500">terjual/bln</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="medium" className="mt-0 focus-visible:outline-none">
                      <div className="divide-y divide-slate-100">
                        {mediumMoving.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{item.branch} • Stok tersisa: {item.stock}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-extrabold text-blue-600">{item.sold} <span className="text-xs font-medium text-slate-500">terjual/bln</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="slow" className="mt-0 focus-visible:outline-none">
                      <div className="divide-y divide-slate-100">
                        {slowMoving.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-amber-600 mt-0.5 font-semibold">Idle Capital: {formatRupiah(item.idleCapital!)}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{item.branch} • Stok: {item.stock}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-base font-extrabold text-amber-600">{item.sold} <span className="text-xs font-medium text-slate-500">terjual/bln</span></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="dead" className="mt-0 focus-visible:outline-none">
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 mb-4">
                        <p className="text-xs text-rose-700 font-medium">⚠️ Terdapat barang yang tidak laku selama &gt;3 bulan berturut-turut. Segera lakukan promosi *clearance sale* untuk mencairkan *Idle Capital*.</p>
                      </div>
                      <div className="divide-y divide-rose-100">
                        {deadStock.map((item) => (
                          <div key={item.id} className="flex justify-between items-center py-3">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-rose-600 mt-0.5 font-semibold">Kerugian Mengendap: {formatRupiah(item.idleCapital!)}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{item.branch} • Menumpuk: {item.stock} pcs</p>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-1 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-lg shadow-sm">{item.action}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                  </Tabs>
                </CardContent>
              </Card>

              {/* Critical Stock */}
              <Card className="border-2 border-rose-200 bg-rose-50/20">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-rose-700 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" /> Stok Kritis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {criticalStock.map((stock, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-rose-100 shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{stock.name}</p>
                          <p className="text-xs text-slate-500">{stock.branch}</p>
                        </div>
                        <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-1 rounded">Sisa {stock.sisa}</span>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full mt-2 bg-rose-600 hover:bg-rose-700 text-white shadow-sm">Review PO Otomatis</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 4: HR */}
          <TabsContent value="hr" className="mt-6 space-y-6 focus-visible:outline-none">
            {/* HR Overview KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-slate-200 hover:border-indigo-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Karyawan Aktif</p>
                    <h4 className="text-xl font-extrabold text-indigo-600">54 Orang</h4>
                  </div>
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users className="w-5 h-5" /></div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-200 hover:border-emerald-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Tingkat Kehadiran</p>
                    <h4 className="text-xl font-extrabold text-emerald-600">96.3%</h4>
                  </div>
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><UserCheck className="w-5 h-5" /></div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-200 hover:border-amber-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Cuti / Sakit / Izin</p>
                    <h4 className="text-xl font-extrabold text-amber-600">1 Orang</h4>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><UserMinus className="w-5 h-5" /></div>
                </CardContent>
              </Card>
              <Card className="border-2 border-slate-200 hover:border-rose-300 transition-all shadow-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Turnover Bulan Ini</p>
                    <h4 className="text-xl font-extrabold text-rose-600">0%</h4>
                  </div>
                  <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><RefreshCw className="w-5 h-5" /></div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Leaderboard Pegawai Terbaik */}
              <Card className="border-2 border-slate-200 lg:col-span-2">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-[#B76E79]" /> Top Performers (Sales)
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mt-2">
                    {topPerformers.map((emp, i) => (
                      <div key={emp.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-[#B76E79] flex items-center justify-center font-bold text-slate-800 shadow-sm">
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{emp.name}</p>
                            <p className="text-xs text-slate-500">{emp.role} • {emp.branch}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-emerald-600">{formatRupiah(emp.sales)}</p>
                          <p className="text-[10px] font-bold text-slate-500">{emp.achievement}% dari target</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actionable Late List */}
              <Card className="border-2 border-slate-200 bg-amber-50/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-amber-700 flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Keterlambatan Hari Ini
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    {lateActionList.map((late) => (
                      <div key={late.id} className="bg-white p-3 rounded-xl border border-amber-100 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{late.name}</p>
                            <p className="text-xs text-slate-500">{late.branch}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-rose-600">Telat {late.delay}m</p>
                            <p className="text-[10px] text-slate-400">{late.time}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center border-t border-slate-50 pt-2 mt-1">
                          <span className="text-[10px] font-medium text-slate-500">History: {late.sp} SP aktif</span>
                          <Button size="sm" variant="outline" className="h-6 text-[10px] px-2 border-amber-200 text-amber-700 hover:bg-amber-50">{late.action}</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stacked Bar Chart for Attendance */}
              <Card className="border-2 border-slate-200 lg:col-span-3">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold text-slate-800">Analisis Kehadiran per Cabang</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={attendanceDetails} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="branch" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }} 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                        <Bar dataKey="Tepat" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                        <Bar dataKey="Telat" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Izin" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Alpha" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 5: AI INSIGHTS */}
          <TabsContent value="ai" className="mt-6 focus-visible:outline-none space-y-6">
             <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-violet-50/30 shadow-soft relative overflow-hidden">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-1000" />
              
              <CardContent className="p-6 md:p-8 relative z-10">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-between">
                  {/* Health Score */}
                  <div className="flex flex-col items-center justify-center text-center md:text-left md:items-start md:w-1/3">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-4 border border-indigo-200">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Evox AI Analyst
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-2">Indeks Kesehatan Bisnis</h2>
                    <p className="text-sm text-slate-500 mb-6">Analisis komprehensif dari Omzet, Laba, SDM, dan Inventori.</p>
                    
                    <div className="relative w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-inner border-4 border-slate-50">
                      <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#6366f1" strokeWidth="8" strokeDasharray="282.7" strokeDashoffset={282.7 - (282.7 * 82) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
                      </svg>
                      <div className="text-center">
                        <span className="text-3xl font-extrabold text-slate-800">82</span>
                        <span className="text-xs text-slate-500 block">/ 100</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/80 rounded-xl border border-indigo-100 shadow-sm">
                      <p className="text-xs font-medium text-slate-700 leading-relaxed">
                        <span className="font-bold text-indigo-600">Status: Sangat Baik.</span> Omzet stabil di jalurnya, namun Anda perlu memperhatikan efisiensi biaya (Petty Cash) dan penumpukan stok lama.
                      </p>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="w-full md:w-2/3">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-indigo-500" /> Prioritas Tindakan Minggu Ini
                    </h3>
                    <div className="space-y-4">
                      {aiRecommendations.map((rec) => {
                        const IconComponent = rec.icon;
                        const isKritis = rec.color === "rose";
                        const isPeringatan = rec.color === "amber";
                        
                        return (
                          <div key={rec.id} className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                              isKritis ? 'bg-rose-100 text-rose-600' : 
                              isPeringatan ? 'bg-amber-100 text-amber-600' : 
                              'bg-emerald-100 text-emerald-600'
                            }`}>
                              <IconComponent className="w-5 h-5" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                                  isKritis ? 'bg-rose-50 text-rose-700 border border-rose-200' : 
                                  isPeringatan ? 'bg-amber-50 text-amber-700 border border-amber-200' : 
                                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {rec.type}
                                </span>
                                <h4 className="text-sm font-bold text-slate-800">{rec.title}</h4>
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">{rec.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Forecasting Chart */}
              <Card className="border-2 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" /> Prediksi Pencapaian Omzet
                  </CardTitle>
                  <CardDescription>Realisasi aktual vs Prediksi AI hingga akhir bulan.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px] w-full">
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
                  <div className="mt-4 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-indigo-900 font-medium leading-relaxed">Berdasarkan tren 20 hari terakhir, sistem memprediksi total omzet akhir bulan akan mencapai <strong>Rp 515.000.000</strong>. Ini sedikit di bawah target Anda (Rp 520.000.000). Tingkatkan <em>upselling</em> di minggu terakhir untuk menutup kekurangan.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ask AI Mockup */}
              <Card className="border-2 border-slate-200 flex flex-col">
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
                    <Bot className="w-5 h-5 mr-2 text-indigo-500" /> Tanya Evox AI
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0 flex flex-col bg-slate-50/50">
                  <div className="flex-1 p-6 space-y-4">
                    {/* Chat Bubble AI */}
                    <div className="flex gap-3 max-w-[85%]">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm">
                        <p className="text-sm text-slate-700">Halo! Saya asisten AI Anda. Anda bisa menanyakan laporan harian, analisis cabang, atau prediksi tren. Apa yang ingin Anda ketahui hari ini?</p>
                      </div>
                    </div>
                    {/* Prompts */}
                    <div className="flex flex-wrap gap-2 pl-11">
                      <button className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors">Buatkan rangkuman performa hari ini</button>
                      <button className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors">Kenapa margin Cabang Barat turun?</button>
                      <button className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full hover:bg-indigo-100 transition-colors">Siapa BA terbaik bulan ini?</button>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-slate-200 mt-auto">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Ketik pertanyaan untuk Evox AI..." 
                        className="w-full pl-4 pr-12 py-3 bg-slate-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                      <button className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
