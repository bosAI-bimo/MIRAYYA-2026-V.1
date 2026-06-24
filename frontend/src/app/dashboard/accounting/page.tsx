"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, FileText, CheckCircle, TrendingUp, AlertCircle, 
  CreditCard, ChevronRight, Activity, ArrowUpRight, X as XIcon, 
  Download, Printer, Check, Image as ImageIcon, RefreshCw, BarChart3, PieChart,
  ArrowDownRight, Building2, Wallet, FileSpreadsheet, Loader2
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { GlobalFilter } from "@/components/ui/global-filter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AccountingDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [filterBranch, setFilterBranch] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("this_month");
  const [rekonForm, setRekonForm] = useState({ branchId: "", date: "", file: null as File | null });

  const loadDashboardData = async (branchId?: string, period?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (branchId && branchId !== 'all') params.set('branchId', branchId);
      if (period) params.set('period', period);
      const queryStr = params.toString() ? `?${params.toString()}` : '';
      const data = await fetcher(`/accounting/dashboard-stats${queryStr}`);
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
          <GlobalFilter 
            onFilterChange={(branchId, dateRange) => {
              setFilterBranch(branchId);
              setFilterPeriod(dateRange);
              loadDashboardData(branchId, dateRange);
            }} 
          />
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading ? (
        <LoadingScreen />
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Laba Bersih */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Laba Bersih</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Rp {(stats?.labaBersih || 0).toLocaleString('id-ID')}</div>
              <p className="text-xs text-slate-500 flex items-center mt-1 font-medium">
                —
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Total Omzet */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Omzet</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <DollarSign className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Rp {(stats?.totalOmzet || 0).toLocaleString('id-ID')}</div>
              <p className="text-xs text-blue-600 flex items-center mt-1 font-medium">
                <Activity className="w-3 h-3 mr-1" /> Aktif
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Arus Kas Bersih */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Arus Kas (Net)</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <RefreshCw className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Rp +{(stats?.arusKasNet || 0).toLocaleString('id-ID')}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium truncate">
                Estimasi bulan ini
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pencapaian Target */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Target Omzet</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <BarChart3 className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats?.targetOmzetPercentage || 0}%</div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: `${stats?.targetOmzetPercentage || 0}%` }}></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Persetujuan EOD */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">EOD Pending</CardTitle>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                <AlertCircle className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats?.pendingEod || 0} <span className="text-sm font-semibold text-slate-500">Cabang</span></div>
              <p className="text-xs text-rose-600 mt-1 font-medium">
                Butuh Verifikasi
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Persetujuan PO */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">PO Pending</CardTitle>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <FileText className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{stats?.pendingPo || 0} <span className="text-sm font-semibold text-slate-500">Dokumen</span></div>
              <p className="text-xs text-amber-600 mt-1 font-medium">
                Review & Acc
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      )}

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
                  <Link href="/dashboard/accounting/laporan">
                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50">Laporan Lengkap</Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Pendapatan Penjualan (Olsera)</span>
                      <span className="font-bold text-slate-900">Rp {(stats?.totalOmzet || 0).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Harga Pokok Penjualan (HPP)</span>
                      <span className="font-bold text-slate-900">- Rp {((stats?.totalOmzet || 0) * 0.4).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-800 font-bold">Laba Kotor</span>
                      <span className="font-extrabold text-slate-900">Rp {((stats?.totalOmzet || 0) * 0.6).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-slate-600 font-medium">Biaya Operasional (Payroll, Petty Cash, dll)</span>
                      <span className="font-bold text-slate-900">- Rp {((stats?.totalOmzet || 0) * 0.6 - (stats?.labaBersih || 0)).toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <span className="text-emerald-800 font-bold text-lg">Laba Bersih</span>
                      <span className="font-extrabold text-emerald-600 text-xl">Rp {(stats?.labaBersih || 0).toLocaleString('id-ID')}</span>
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
                  <Link href="/dashboard/accounting/laporan/arus-kas">
                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50">Jurnal Transaksi</Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                      <div className="flex items-center text-emerald-600 mb-2">
                        <ArrowDownRight className="w-5 h-5 mr-1" />
                        <span className="font-bold text-sm">Kas Masuk</span>
                      </div>
                      <div className="text-xl font-extrabold text-emerald-700">Rp {(stats?.totalOmzet || 0).toLocaleString('id-ID')}</div>
                    </div>
                    <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                      <div className="flex items-center text-rose-600 mb-2">
                        <ArrowUpRight className="w-5 h-5 mr-1" />
                        <span className="font-bold text-sm">Kas Keluar</span>
                      </div>
                      <div className="text-xl font-extrabold text-rose-700">Rp {((stats?.totalOmzet || 0) - (stats?.arusKasNet || 0)).toLocaleString('id-ID')}</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-800 text-sm">Saldo Akun Bank & Kas</h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {stats?.rekonsiliasiList && stats.rekonsiliasiList.length > 0 ? (
                        stats.rekonsiliasiList.slice(0, 3).map((rek: any, i: number) => (
                          <div key={i} className="flex justify-between p-3 bg-white hover:bg-slate-50 transition-colors">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 text-slate-400 mr-2" />
                              <span className="text-sm font-medium text-slate-700">{rek.branch}</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900">{rek.bankBalance}</span>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-500">Data belum tersedia</div>
                      )}
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
                  {(eodFilter === "pending" ? (stats?.pendingEodList || []) : (stats?.completedEodList || [])).map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                          item.status === 'PENDING' ? 'bg-rose-50 text-rose-500 border-rose-100/50 group-hover:bg-rose-100' :
                          item.status === 'APPROVED' || item.status === 'Disetujui' ? 'bg-emerald-50 text-emerald-500 border-emerald-100/50' :
                          'bg-slate-100 text-slate-500 border-slate-200/50'
                        } transition-colors`}>
                          {item.status === 'REJECTED' || item.status === 'Ditolak' ? <XIcon className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 truncate">{item.branch}</p>
                            {item.status !== 'PENDING' && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.status === 'APPROVED' || item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                {item.status}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1 font-medium truncate">{item.date} • <span className="text-slate-700">{item.omzet}</span></p>
                        </div>
                      </div>
                      {item.status === 'PENDING' ? (
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
                  {(poFilter === "pending" ? (stats?.pendingPoList || []) : (stats?.completedPoList || [])).map((item: any, i: number) => (
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
                      {(stats?.rekonsiliasiList || []).map((item: any, i: number) => (
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
                  {(stats?.pencapaianTargetList || []).map((item: any, i: number) => (
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
                  {(stats?.anggaranCabangList || []).map((item: any, i: number) => (
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
                  <Link href="/dashboard/accounting/anggaran">
                    <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-6 font-semibold shadow-sm hover:shadow-md transition-all">Kelola Anggaran Cabang</Button>
                  </Link>
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
                <Button 
                  disabled={isApproving}
                  onClick={async () => {
                    try {
                      setIsApproving(true);
                      await fetcher(`/accounting/eod-reports/${selectedEOD.id}/approve`, {
                        method: 'PUT',
                        body: JSON.stringify({ status: 'REJECTED' })
                      });
                      toast.success("EOD berhasil ditolak");
                      closeReviewModal();
                      loadDashboardData(filterBranch, filterPeriod);
                    } catch (err: any) {
                      toast.error("Gagal menolak EOD: " + (err.message || "Terjadi kesalahan"));
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 rounded-xl transition-all border-none cursor-pointer"
                >
                  {isApproving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <XIcon className="w-5 h-5 mr-2" />} Tolak
                </Button>
                <Button 
                  disabled={isApproving}
                  onClick={async () => {
                    try {
                      setIsApproving(true);
                      await fetcher(`/accounting/eod-reports/${selectedEOD.id}/approve`, {
                        method: 'PUT',
                        body: JSON.stringify({ status: 'APPROVED' })
                      });
                      toast.success("EOD berhasil disetujui");
                      closeReviewModal();
                      loadDashboardData(filterBranch, filterPeriod);
                    } catch (err: any) {
                      toast.error("Gagal menyetujui EOD: " + (err.message || "Terjadi kesalahan"));
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {isApproving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Check className="w-5 h-5 mr-2" />} Setujui EOD
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
                <Button 
                  disabled={isApproving}
                  onClick={async () => {
                    try {
                      setIsApproving(true);
                      await fetcher(`/store/orders/${selectedPO.id}/approve`, {
                        method: 'PUT',
                        body: JSON.stringify({ status: 'REJECTED' })
                      });
                      toast.success("Purchase Order berhasil ditolak");
                      closePOModal();
                      loadDashboardData(filterBranch, filterPeriod);
                    } catch (err: any) {
                      toast.error("Gagal menolak PO: " + (err.message || "Terjadi kesalahan"));
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 rounded-xl transition-all border-none cursor-pointer"
                >
                  {isApproving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <XIcon className="w-5 h-5 mr-2" />} Tolak
                </Button>
                <Button 
                  disabled={isApproving}
                  onClick={async () => {
                    try {
                      setIsApproving(true);
                      await fetcher(`/store/orders/${selectedPO.id}/approve`, {
                        method: 'PUT',
                        body: JSON.stringify({ status: 'APPROVED' })
                      });
                      toast.success("Purchase Order berhasil disetujui");
                      closePOModal();
                      loadDashboardData(filterBranch, filterPeriod);
                    } catch (err: any) {
                      toast.error("Gagal menyetujui PO: " + (err.message || "Terjadi kesalahan"));
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  {isApproving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Check className="w-5 h-5 mr-2" />} Setujui PO
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
                    <select 
                      value={rekonForm.branchId}
                      onChange={(e) => setRekonForm({...rekonForm, branchId: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer shadow-sm transition-all"
                    >
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
                    <input 
                      type="date" 
                      value={rekonForm.date}
                      onChange={(e) => setRekonForm({...rekonForm, date: e.target.value})}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer shadow-sm transition-all" 
                    />
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
                <Button 
                  disabled={isApproving}
                  onClick={async () => {
                    if (!rekonForm.branchId || !rekonForm.date) {
                      toast.error("Pilih cabang dan tanggal terlebih dahulu");
                      return;
                    }
                    try {
                      setIsApproving(true);
                      await fetcher('/accounting/bank-reconciliations', {
                        method: 'POST',
                        body: JSON.stringify({
                          branchId: rekonForm.branchId,
                          reconcileDate: rekonForm.date,
                          bankAccount: 'BCA',
                          bankStatementBalance: '0',
                          posSalesBalance: '0',
                          difference: '0',
                          notes: 'Rekonsiliasi baru dimulai'
                        })
                      });
                      toast.success("Berhasil memulai proses rekonsiliasi");
                      closeRekonsiliasiModal();
                      setRekonForm({ branchId: '', date: '', file: null });
                      router.push("/dashboard/accounting/rekonsiliasi");
                    } catch (err: any) {
                      toast.error("Gagal memproses rekonsiliasi: " + (err.message || "Terjadi kesalahan"));
                    } finally {
                      setIsApproving(false);
                    }
                  }}
                  className="flex-1 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                >
                  <RefreshCw className="w-5 h-5 mr-2" /> Proses Data
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
