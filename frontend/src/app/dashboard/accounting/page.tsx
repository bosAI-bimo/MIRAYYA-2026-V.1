"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, FileText, CheckCircle, TrendingUp, AlertCircle, 
  CreditCard, ChevronRight, Activity, ArrowUpRight, X as XIcon, 
  Download, Printer, Check, Image as ImageIcon, RefreshCw, BarChart3, PieChart,
  ArrowDownRight, Building2, Wallet, FileSpreadsheet
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [eodFilter, setEodFilter] = useState("pending");
  const [poFilter, setPoFilter] = useState("pending");
  const [selectedEOD, setSelectedEOD] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openReviewModal = (item: any) => {
    setSelectedEOD(item);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setTimeout(() => setSelectedEOD(null), 300);
  };

  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  const openPOModal = (item: any) => {
    setSelectedPO(item);
    setIsPOModalOpen(true);
  };

  const closePOModal = () => {
    setIsPOModalOpen(false);
    setTimeout(() => setSelectedPO(null), 300);
  };

  const [selectedPettyCash, setSelectedPettyCash] = useState<any>(null);
  const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);

  const openPettyCashModal = (item: any) => {
    setSelectedPettyCash(item);
    setIsPettyCashModalOpen(true);
  };

  const closePettyCashModal = () => {
    setIsPettyCashModalOpen(false);
    setTimeout(() => setSelectedPettyCash(null), 300);
  };

  const [isRekonsiliasiModalOpen, setIsRekonsiliasiModalOpen] = useState(false);
  const closeRekonsiliasiModal = () => setIsRekonsiliasiModalOpen(false);

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
                  <span className="text-slate-900">Accounting</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Dashboard Accounting</h1>
          <p className="text-slate-500 font-medium">Ringkasan finansial, arus kas, persetujuan, dan target operasional cabang.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[160px] shadow-sm transition-all">
            <option value="all">Konsolidasi (Semua Cabang)</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Juni 2026</option>
            <option value="last_month">Mei 2026</option>
            <option value="this_year">Tahun 2026</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid - Expanded to 6 metrics for comprehensive overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {/* Laba Bersih */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-500 truncate">Laba Bersih</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-xl font-extrabold text-slate-900 tracking-tight truncate">Rp 124,5 Jt</div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-emerald-700 font-bold flex items-center bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                  <ArrowUpRight className="h-3 w-3 mr-0.5" /> 12.5%
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Omzet */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-500 truncate">Total Omzet</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-xl font-extrabold text-slate-900 tracking-tight truncate">Rp 450,2 Jt</div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-blue-700 font-bold flex items-center bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                  <Activity className="h-3 w-3 mr-0.5" /> Aktif
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Arus Kas Bersih */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-500 truncate">Arus Kas (Net)</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-xl font-extrabold text-slate-900 tracking-tight truncate">Rp +85,0 Jt</div>
              <div className="mt-2 flex items-center">
                <span className="text-[10px] text-slate-500 font-medium truncate">In: 500Jt | Out: 415Jt</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pencapaian Target */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col border-2 border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-500 truncate">Target Omzet</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-xl font-extrabold text-purple-600 tracking-tight truncate">82%</div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '82%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Persetujuan EOD */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col border-2 border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-500 truncate">EOD Pending</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-xl font-extrabold text-rose-600 tracking-tight truncate">5 <span className="text-sm font-semibold text-slate-500">Cabang</span></div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-rose-700 font-bold flex items-center bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                  Butuh Verifikasi
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Persetujuan PO */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-5 h-full flex flex-col border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="flex items-center space-x-3 mb-3 relative z-10">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-500 truncate">PO Pending</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-xl font-extrabold text-amber-600 tracking-tight truncate">3 <span className="text-sm font-semibold text-slate-500">Dokumen</span></div>
              <div className="mt-2 flex items-center">
                <span className="text-xs text-amber-700 font-bold flex items-center bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                  Review & Acc
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Capsule Tabs */}
          <div className="flex my-6 bg-slate-100/80 p-1.5 rounded-2xl md:rounded-full w-full overflow-x-auto no-scrollbar border-2 border-slate-200/50 shadow-inner">
            <TabsList className="bg-transparent p-0 flex gap-1 lg:gap-2 min-w-max h-auto">
              <TabsTrigger 
                value="overview" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Finansial & Arus Kas
              </TabsTrigger>
              <TabsTrigger 
                value="persetujuan" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Tugas Persetujuan
              </TabsTrigger>
              <TabsTrigger 
                value="rekonsiliasi" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Rekonsiliasi Bank
              </TabsTrigger>
              <TabsTrigger 
                value="anggaran" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Anggaran & Target
              </TabsTrigger>
              <TabsTrigger 
                value="pettycash" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Petty Cash
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* TAB 1: OVERVIEW FINANSIAL & ARUS KAS */}
          <TabsContent value="overview" className="mt-6 focus-visible:outline-none space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Laba Rugi Summary */}
              <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Ikhtisar Laba Rugi</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">Konsolidasi per Juni 2026</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50">Laporan Lengkap</Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Pendapatan Penjualan (Olsera)</span>
                      <span className="font-bold text-slate-900">Rp 450.200.000</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Harga Pokok Penjualan (HPP)</span>
                      <span className="font-bold text-slate-900">- Rp 210.500.000</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-800 font-bold">Laba Kotor</span>
                      <span className="font-extrabold text-slate-900">Rp 239.700.000</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Biaya Operasional (Payroll, Petty Cash, dll)</span>
                      <span className="font-bold text-slate-900">- Rp 115.200.000</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <span className="text-emerald-800 font-bold text-lg">Laba Bersih</span>
                      <span className="font-extrabold text-emerald-600 text-xl">Rp 124.500.000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Arus Kas Summary */}
              <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
                <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Ringkasan Arus Kas</CardTitle>
                    <CardDescription className="text-sm font-medium mt-1">Aliran dana masuk & keluar</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50">Jurnal Transaksi</Button>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                      <div className="flex items-center text-emerald-600 mb-2">
                        <ArrowDownRight className="w-5 h-5 mr-1" />
                        <span className="font-bold text-sm">Kas Masuk</span>
                      </div>
                      <div className="text-xl font-extrabold text-emerald-700">Rp 500.000.000</div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                      <div className="flex items-center text-rose-600 mb-2">
                        <ArrowUpRight className="w-5 h-5 mr-1" />
                        <span className="font-bold text-sm">Kas Keluar</span>
                      </div>
                      <div className="text-xl font-extrabold text-rose-700">Rp 415.000.000</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm">Saldo Akun Bank & Kas</h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      <div className="flex justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-slate-400 mr-2" />
                          <span className="text-sm font-medium text-slate-700">BCA - Operasional</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">Rp 350.500.000</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center">
                          <Building2 className="w-4 h-4 text-slate-400 mr-2" />
                          <span className="text-sm font-medium text-slate-700">Mandiri - Penerimaan</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">Rp 120.200.000</span>
                      </div>
                      <div className="flex justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center">
                          <Wallet className="w-4 h-4 text-slate-400 mr-2" />
                          <span className="text-sm font-medium text-slate-700">Kas Tunai Cabang (Total)</span>
                        </div>
                        <span className="text-sm font-bold text-slate-900">Rp 45.300.000</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: TUGAS PERSETUJUAN */}
          <TabsContent value="persetujuan" className="mt-6 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* EOD Approval List */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Persetujuan EOD</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Laporan harian cabang</p>
                  </div>
                  <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button 
                      onClick={() => setEodFilter("pending")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${eodFilter === 'pending' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Menunggu
                    </button>
                    <button 
                      onClick={() => setEodFilter("completed")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${eodFilter === 'completed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Selesai
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[400px]">
                  {(eodFilter === "pending" ? [
                    { branch: "Mirayya Sudirman", date: "11 Jun 2026", omzet: "Rp 12.500.000", cash: "Rp 4.500.000", edc: "Rp 5.000.000", qris: "Rp 3.000.000", pettyCash: "Rp 150.000", setoranBersih: "Rp 4.350.000", status: "Pending" },
                    { branch: "Mirayya Kemang", date: "11 Jun 2026", omzet: "Rp 8.200.000", cash: "Rp 2.200.000", edc: "Rp 3.000.000", qris: "Rp 3.000.000", pettyCash: "Rp 50.000", setoranBersih: "Rp 2.150.000", status: "Pending" },
                    { branch: "Mirayya PIK", date: "10 Jun 2026", omzet: "Rp 15.100.000", cash: "Rp 5.100.000", edc: "Rp 6.000.000", qris: "Rp 4.000.000", pettyCash: "Rp 200.000", setoranBersih: "Rp 4.900.000", status: "Pending" },
                  ] : [
                    { branch: "Mirayya Kelapa Gading", date: "09 Jun 2026", omzet: "Rp 10.500.000", status: "Disetujui" },
                    { branch: "Mirayya Bintaro", date: "09 Jun 2026", omzet: "Rp 9.200.000", status: "Ditolak" },
                    { branch: "Mirayya Sudirman", date: "08 Jun 2026", omzet: "Rp 14.100.000", status: "Disetujui" },
                  ]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          item.status === 'Pending' ? 'bg-rose-50 text-rose-500 border-rose-100/50 group-hover:bg-rose-100' :
                          item.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' :
                          'bg-slate-100 text-slate-500 border-slate-200/50'
                        } transition-colors`}>
                          {item.status === 'Ditolak' ? <XIcon className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 truncate">{item.branch}</p>
                            {item.status !== 'Pending' && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1 font-medium truncate">{item.date} • <span className="text-slate-700">{item.omzet}</span></p>
                        </div>
                      </div>
                      {item.status === 'Pending' ? (
                        <Button 
                          onClick={() => openReviewModal(item)}
                          variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-full px-5 h-9 font-semibold transition-all shadow-sm group-hover:shadow group-hover:border-slate-800 shrink-0 cursor-pointer">
                          Review
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700 font-semibold rounded-full px-3">
                          Detail
                        </Button>
                      )}
                    </div>
                  ))}
                  {eodFilter === "completed" && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                      <Link href="/dashboard/accounting/eod/history">
                        <Button variant="link" className="text-pink-600 font-bold text-sm">Lihat Semua Riwayat EOD</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* PO Approval List */}
              <div className="bg-white rounded-2xl shadow-sm border-2 border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50 gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Persetujuan PO</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Pengajuan Purchase Order</p>
                  </div>
                  <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button 
                      onClick={() => setPoFilter("pending")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${poFilter === 'pending' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Menunggu
                    </button>
                    <button 
                      onClick={() => setPoFilter("completed")}
                      className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${poFilter === 'completed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      Selesai
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[400px]">
                  {(poFilter === "pending" ? [
                    { branch: "Mirayya Kelapa Gading", id: "PO-2606-042", total: "Rp 4.500.000", status: "Pending", items: [
                      { name: "Wardah Lightening Serum", qty: 20, price: "Rp 75.000", category: "Fast Moving" },
                      { name: "Make Over Powerstay", qty: 10, price: "Rp 150.000", category: "Fast Moving" },
                      { name: "Emina Sun Battle", qty: 30, price: "Rp 50.000", category: "Fast Moving" }
                    ] },
                    { branch: "Mirayya Sudirman", id: "PO-2606-043", total: "Rp 2.100.000", status: "Pending", items: [
                      { name: "Somethinc Niacinamide", qty: 10, price: "Rp 120.000", category: "Fast Moving" },
                      { name: "Avoskin PHTE", qty: 5, price: "Rp 180.000", category: "Slow Moving" }
                    ] },
                  ] : [
                    { branch: "Mirayya Kemang", id: "PO-2606-039", total: "Rp 5.200.000", status: "Disetujui" },
                    { branch: "Mirayya PIK", id: "PO-2606-038", total: "Rp 1.500.000", status: "Ditolak" },
                  ]).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          item.status === 'Pending' ? 'bg-amber-50 text-amber-500 border-amber-100/50 group-hover:bg-amber-100' :
                          item.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' :
                          'bg-slate-100 text-slate-500 border-slate-200/50'
                        } transition-colors`}>
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 truncate">{item.branch}</p>
                            {item.status !== 'Pending' && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1 font-medium truncate">{item.id} • <span className="text-slate-700">{item.total}</span></p>
                        </div>
                      </div>
                      {item.status === 'Pending' ? (
                        <Button 
                          onClick={() => openPOModal(item)}
                          variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-full px-5 h-9 font-semibold transition-all shadow-sm group-hover:shadow group-hover:border-slate-800 shrink-0 cursor-pointer">
                          Review
                        </Button>
                      ) : (
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-700 font-semibold rounded-full px-3">
                          Detail
                        </Button>
                      )}
                    </div>
                  ))}
                  {poFilter === "completed" && (
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                      <Link href="/dashboard/accounting/po/history">
                        <Button variant="link" className="text-pink-600 font-bold text-sm">Lihat Semua Riwayat PO</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* TAB 3: REKONSILIASI BANK */}
          <TabsContent value="rekonsiliasi" className="mt-6 focus-visible:outline-none">
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50 flex justify-between flex-row items-center">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Status Rekonsiliasi Bank</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">Mutasi Rekening vs Penjualan POS Olsera</CardDescription>
                </div>
                <Button 
                  onClick={() => setIsRekonsiliasiModalOpen(true)}
                  className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-5 font-semibold shadow-sm transition-all text-sm h-10 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 mr-2" /> Mulai Rekonsiliasi
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Tanggal & Cabang</th>
                        <th className="px-6 py-4">Saldo Bank Statement</th>
                        <th className="px-6 py-4">Saldo Penjualan POS</th>
                        <th className="px-6 py-4 text-center">Selisih</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {[
                        { date: "10 Jun 2026", branch: "Mirayya Sudirman", bank: "Rp 15.100.000", pos: "Rp 15.100.000", diff: 0, status: "Cocok" },
                        { date: "10 Jun 2026", branch: "Mirayya Kemang", bank: "Rp 8.200.000", pos: "Rp 8.300.000", diff: -100000, status: "Selisih" },
                        { date: "10 Jun 2026", branch: "Mirayya PIK", bank: "Rp 12.000.000", pos: "Rp 12.000.000", diff: 0, status: "Cocok" },
                      ].map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-slate-800">{item.branch}</p>
                            <p className="text-xs text-slate-500 font-medium">{item.date}</p>
                          </td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{item.bank}</td>
                          <td className="px-6 py-4 font-semibold text-slate-700">{item.pos}</td>
                          <td className="px-6 py-4 text-center">
                            {item.diff === 0 ? (
                              <span className="text-emerald-600 font-bold">-</span>
                            ) : (
                              <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded">Rp -100.000</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.status === 'Cocok' ? (
                              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><Check className="w-3 h-3 mr-1" /> Cocok</span>
                            ) : (
                              <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold inline-flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Investigasi</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="sm" className="text-blue-600 font-semibold hover:bg-blue-50">Detail</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: ANGGARAN & TARGET OMZET */}
          <TabsContent value="anggaran" className="mt-6 focus-visible:outline-none space-y-6">
            {/* Target Omzet */}
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800">Pencapaian Target Omzet (Juni 2026)</CardTitle>
                <CardDescription className="text-sm font-medium mt-1">Perbandingan realisasi dengan target yang dihitung AI berdasarkan tren.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { branch: "Mirayya Sudirman", target: "Rp 150.000.000", actual: "Rp 135.000.000", percentage: 90, status: "safe" },
                    { branch: "Mirayya Kemang", target: "Rp 100.000.000", actual: "Rp 60.000.000", percentage: 60, status: "danger" },
                    { branch: "Mirayya PIK", target: "Rp 200.000.000", actual: "Rp 210.000.000", percentage: 105, status: "excellent" },
                    { branch: "Mirayya Kelapa Gading", target: "Rp 120.000.000", actual: "Rp 95.000.000", percentage: 79, status: "warning" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end text-sm">
                        <span className="font-bold text-slate-800 text-base">{item.branch}</span>
                        <span className="text-slate-500 font-medium text-xs bg-slate-100 px-2.5 py-1 rounded-md">
                          Realisasi: <span className="font-bold text-slate-700">{item.actual}</span> / {item.target}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            item.status === 'danger' ? 'bg-gradient-to-r from-rose-400 to-rose-500' : 
                            item.status === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                            item.status === 'excellent' ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                            'bg-gradient-to-r from-emerald-400 to-emerald-500'
                          }`}
                          style={{ width: `${Math.min(item.percentage, 100)}%` }}
                        ></div>
                        {/* Target Marker */}
                        <div className="absolute top-0 bottom-0 right-[20%] w-0.5 bg-slate-400 hidden"></div>
                      </div>
                      <div className="flex justify-end text-[10px] font-bold">
                        <span className={`${item.status === 'danger' ? 'text-rose-600' : item.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {item.percentage}% Tercapai
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pemantauan Anggaran Operasional */}
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800">Status Anggaran Operasional Cabang</CardTitle>
                <CardDescription className="text-sm font-medium mt-1">Pemantauan realisasi anggaran operasional per cabang.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { branch: "Mirayya Sudirman", budget: "Rp 15.000.000", used: "Rp 12.500.000", percentage: 83, status: "warning" },
                    { branch: "Mirayya Kemang", budget: "Rp 10.000.000", used: "Rp 4.200.000", percentage: 42, status: "safe" },
                    { branch: "Mirayya PIK", budget: "Rp 12.000.000", used: "Rp 11.500.000", percentage: 95, status: "danger" },
                    { branch: "Mirayya Kelapa Gading", budget: "Rp 10.000.000", used: "Rp 5.500.000", percentage: 55, status: "safe" },
                  ].map((item, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end text-sm">
                        <span className="font-bold text-slate-800 text-base">{item.branch}</span>
                        <span className="text-slate-500 font-medium text-xs bg-slate-100 px-2.5 py-1 rounded-md">
                          Terpakai: <span className="font-bold text-slate-700">{item.used}</span> / {item.budget}
                        </span>
                      </div>
                      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            item.status === 'danger' ? 'bg-gradient-to-r from-rose-400 to-rose-500' : 
                            item.status === 'warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 flex justify-end pt-6 border-t border-slate-100">
                  <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all">Kelola Anggaran Cabang</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: PETTY CASH */}
          <TabsContent value="pettycash" className="mt-6 focus-visible:outline-none">
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800">Monitoring Petty Cash</CardTitle>
                <CardDescription className="text-sm font-medium mt-1">Transaksi pengeluaran kas kecil cabang terbaru.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { branch: "Mirayya Sudirman", desc: "Beli galon & tisu", amount: "Rp 150.000", date: "11 Jun 2026", by: "Sari (Store Leader)" },
                    { branch: "Mirayya Kemang", desc: "Ongkir GoSend antar barang", amount: "Rp 45.000", date: "10 Jun 2026", by: "Budi (Store Leader)" },
                    { branch: "Mirayya PIK", desc: "Plastik sampah", amount: "Rp 35.000", date: "09 Jun 2026", by: "Rina (Store Leader)" },
                  ].map((item, i) => (
                    <div key={i} onClick={() => openPettyCashModal(item)} className="flex justify-between items-center p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl text-slate-500 flex items-center justify-center group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-slate-200 transition-all duration-300 shrink-0">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-base truncate">{item.desc}</h4>
                          <div className="text-sm text-slate-500 mt-1 font-medium flex items-center space-x-2 truncate">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs text-slate-600 shrink-0">{item.branch}</span>
                            <span className="shrink-0">•</span>
                            <span className="truncate">{item.by}</span>
                            <span className="shrink-0">•</span>
                            <span className="shrink-0">{item.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3 shrink-0">
                        <span className="inline-flex px-3 py-1.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-100/50">
                          - {item.amount}
                        </span>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-600 transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end">
                  <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-white hover:text-pink-700 rounded-full px-6 font-semibold shadow-sm transition-all">
                    Lihat Semua Transaksi
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </motion.div>
      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedEOD && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeReviewModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Review EOD</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedEOD.branch} • {selectedEOD.date}</p>
                </div>
                <button 
                  onClick={closeReviewModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 border-dashed">
                    <span className="text-sm font-bold text-slate-700">Total Omzet</span>
                    <span className="text-lg font-extrabold text-slate-900">{selectedEOD.omzet}</span>
                  </div>
                  
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Tunai (Cash)</span>
                      <span className="text-sm font-bold text-slate-700">{selectedEOD.cash}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">EDC</span>
                      <span className="text-sm font-bold text-slate-700">{selectedEOD.edc}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">QRIS</span>
                      <span className="text-sm font-bold text-slate-700">{selectedEOD.qris}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-200 my-2"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Pengeluaran Petty Cash</span>
                    <span className="text-sm font-bold text-rose-600">- {selectedEOD.pettyCash}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-200 my-2"></div>

                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="text-sm font-bold text-emerald-800">Setoran Bersih (Cash - Petty Cash)</span>
                    <span className="text-lg font-extrabold text-emerald-600">{selectedEOD.setoranBersih}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Printer className="w-4 h-4 mr-2" /> Cetak
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Download className="w-4 h-4 mr-2" /> Unduh PDF
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 rounded-xl transition-all border-none cursor-pointer">
                  <XIcon className="w-5 h-5 mr-2" /> Tolak
                </Button>
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <Check className="w-5 h-5 mr-2" /> Setujui EOD
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review PO Modal */}
      <AnimatePresence>
        {isPOModalOpen && selectedPO && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closePOModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Review Purchase Order</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedPO.branch} • <span className="text-slate-700 font-bold">{selectedPO.id}</span></p>
                </div>
                <button 
                  onClick={closePOModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pengajuan</span>
                    <p className="text-2xl font-extrabold text-slate-900">{selectedPO.total}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                    <div><span className="text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200">Menunggu Acc</span></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-slate-400" />
                    Rincian Item ({selectedPO.items?.length || 0})
                  </h4>
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Produk</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Harga</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPO.items?.map((product: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800">{product.name}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold mt-1 inline-block ${product.category === 'Fast Moving' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {product.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-slate-600">{product.qty}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-700">{product.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Printer className="w-4 h-4 mr-2" /> Cetak PO
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Download className="w-4 h-4 mr-2" /> Unduh PDF
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 rounded-xl transition-all border-none cursor-pointer">
                  <XIcon className="w-5 h-5 mr-2" /> Tolak
                </Button>
                <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <Check className="w-5 h-5 mr-2" /> Setujui PO
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Petty Cash Detail Modal */}
      <AnimatePresence>
        {isPettyCashModalOpen && selectedPettyCash && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closePettyCashModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Detail Petty Cash</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedPettyCash.branch}</p>
                </div>
                <button 
                  onClick={closePettyCashModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div className="space-y-1 pr-4">
                    <h4 className="font-bold text-slate-800">{selectedPettyCash.desc}</h4>
                    <p className="text-xs text-slate-500">{selectedPettyCash.date} • Dilaporkan oleh {selectedPettyCash.by}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-rose-600 whitespace-nowrap">- {selectedPettyCash.amount}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-slate-200 border-dashed gap-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">Bukti Struk/Kuitansi</p>
                    <p className="text-xs text-slate-500 mt-1">1 foto terlampir</p>
                  </div>
                  <Button variant="outline" className="mt-2 border-slate-200 text-slate-700 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 rounded-xl transition-all shadow-sm">
                    Lihat Foto Penuh
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80">
                <Button onClick={closePettyCashModal} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 rounded-xl shadow-sm transition-all cursor-pointer">
                  Tutup Detail
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rekonsiliasi Modal */}
      <AnimatePresence>
        {isRekonsiliasiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeRekonsiliasiModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Mulai Rekonsiliasi Bank</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Bandingkan mutasi bank dengan sistem POS</p>
                </div>
                <button 
                  onClick={closeRekonsiliasiModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Pilih Cabang</label>
                    <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer shadow-sm transition-all">
                      <option value="">-- Pilih Cabang --</option>
                      <option value="sudirman">Mirayya Sudirman</option>
                      <option value="kemang">Mirayya Kemang</option>
                      <option value="pik">Mirayya PIK</option>
                      <option value="kelapa_gading">Mirayya Kelapa Gading</option>
                      <option value="bintaro">Mirayya Bintaro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Tanggal Rekonsiliasi</label>
                    <input type="date" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer shadow-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Unggah Mutasi Bank (CSV/Excel)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-pink-500 shadow-sm mb-3 transition-colors">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Klik untuk mengunggah file</p>
                    <p className="text-xs text-slate-500 mt-1">Maks. 5MB</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={closeRekonsiliasiModal} className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold h-12 rounded-xl transition-all cursor-pointer">
                  Batal
                </Button>
                <Link href="/dashboard/accounting/rekonsiliasi" className="flex-1">
                  <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <RefreshCw className="w-5 h-5 mr-2" /> Proses Data
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
