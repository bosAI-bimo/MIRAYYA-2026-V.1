"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, ShoppingCart, FileCheck, CheckCircle2, AlertCircle, ChevronRight, Package, ClipboardList, TrendingDown, Clock, ArrowRight, Receipt, Activity, Banknote, Store } from "lucide-react";
import Link from "next/link";

export default function KepalaTokoDashboard() {
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
                  <span className="text-slate-900">Kepala Toko</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Overview Cabang</h1>
          <p className="text-slate-500 font-medium">Ringkasan operasional harian, anggaran, dan ketersediaan stok toko.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="today">Hari Ini</option>
            <option value="this_week">Minggu Ini</option>
            <option value="this_month">Bulan Ini</option>
          </select>
          <Link href="/dashboard/kepala-toko/eod">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-md shadow-pink-500/20 rounded-xl px-5">
              <FileCheck className="w-4 h-4 mr-2" />
              Laporan EOD
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid - 6 metrics in Owner Dashboard Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
        
        {/* KPI 1: Sisa Anggaran PO */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Sisa Anggaran PO</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Store className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Rp 8.500.000</div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                45% Terpakai
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI 2: Sisa Petty Cash */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Sisa Petty Cash</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><Wallet className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Rp 1.250.000</div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                65% Terpakai
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI 3: Penjualan Hari Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Penjualan Hari Ini</CardTitle>
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Banknote className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">Rp 4.250.000</div>
              <p className="text-xs text-purple-600 flex items-center mt-1 font-medium">
                14 Transaksi
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI 4: EOD Status */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Status EOD Hari Ini</CardTitle>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><FileCheck className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-600">Belum Dikirim</div>
              <p className="text-xs text-rose-500 flex items-center mt-1 font-medium">
                <Clock className="w-3 h-3 mr-1" /> Toko tutup jam 22:00
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI 5: Stok Menipis */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-amber-200 bg-amber-50/30 hover:border-amber-400 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-700">Peringatan Stok</CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><TrendingDown className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">12 Item</div>
              <p className="text-xs text-amber-600 flex items-center mt-1 font-medium">
                <AlertCircle className="w-3 h-3 mr-1" /> 3 Produk Kritis
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPI 6: PO Aktif */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">PO Aktif (Pending)</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><ShoppingCart className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">2 Dokumen</div>
              <p className="text-xs text-indigo-600 flex items-center mt-1 font-medium">
                <Activity className="w-3 h-3 mr-1" /> Menunggu Approval
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Riwayat Order Terakhir */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Status Purchase Order</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">Pengajuan PO ke Gudang Pusat</CardDescription>
                </div>
                <Link href="/dashboard/kepala-toko/order">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    Kelola PO <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { id: "PO-202606-003", date: "10 Jun 2026", items: 5, total: "Rp 3.500.000", status: "Menunggu Approval", color: "amber" },
                    { id: "PO-202606-002", date: "05 Jun 2026", items: 12, total: "Rp 8.200.000", status: "Sedang Dikirim", color: "blue" },
                    { id: "PO-202605-015", date: "28 Mei 2026", items: 8, total: "Rp 5.100.000", status: "Selesai", color: "emerald" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 lg:px-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-${item.color}-50 text-${item.color}-600 border border-${item.color}-100`}>
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.id}</p>
                          <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1 font-medium">
                            <span>{item.date}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{item.items} Item</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="font-bold text-slate-700">{item.total}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full
                          ${item.status === 'Selesai' ? 'bg-emerald-100 text-emerald-700' : ''}
                          ${item.status === 'Sedang Dikirim' ? 'bg-blue-100 text-blue-700' : ''}
                          ${item.status === 'Menunggu Approval' ? 'bg-amber-100 text-amber-700' : ''}
                        `}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Petty Cash & Keuangan Overview */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Aktivitas Petty Cash</CardTitle>
                  <CardDescription className="text-sm font-medium mt-1">Pengeluaran operasional cabang terbaru</CardDescription>
                </div>
                <Link href="/dashboard/kepala-toko/budgeting">
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                    Lihat Semua <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { title: "Beli Air Minum Galon", date: "Hari Ini, 10:30", amount: "Rp 150.000", type: "Konsumsi", icon: Receipt },
                    { title: "Plastik Kemasan", date: "Kemarin, 14:15", amount: "Rp 320.000", type: "Perlengkapan", icon: Receipt },
                    { title: "Biaya Kebersihan Bulanan", date: "12 Jun 2026", amount: "Rp 200.000", type: "Operasional", icon: Receipt },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 lg:px-6 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-600">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{item.title}</p>
                          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-1 font-medium">
                            <span>{item.date}</span>
                            <span>•</span>
                            <span className="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">{item.type}</span>
                          </div>
                        </div>
                      </div>
                      <div className="font-bold text-slate-800">
                        - {item.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Column (Narrower) */}
        <div className="space-y-6">
          {/* Inventory Alerts */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden flex flex-col h-full">
              <CardHeader className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-primary" />
                  Peringatan Stok
                </CardTitle>
                <CardDescription className="text-sm font-medium mt-1">Barang yang perlu segera dipesan</CardDescription>
              </CardHeader>
              <CardContent className="p-6 flex-1">
                <div className="space-y-5">
                  {[
                    { name: "Lipstick Matte Ruby", stock: 2, min: 10 },
                    { name: "Serum Vitamin C 30ml", stock: 5, min: 15 },
                    { name: "Toner Exfoliating", stock: 8, min: 20 },
                    { name: "Sunscreen SPF 50", stock: 12, min: 25 },
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700 truncate mr-2">{item.name}</span>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded shrink-0">{item.stock} / {item.min}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all ${item.stock <= 5 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                          style={{ width: `${(item.stock / item.min) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <Link href="/dashboard/kepala-toko/inventory" className="w-full">
                  <Button variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded-xl">
                    Cek Semua Stok
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card className="border-2 shadow-sm border-slate-200 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-50 to-white">
              <CardHeader className="px-6 py-5 border-b border-slate-100 bg-white">
                <CardTitle className="text-lg font-bold text-slate-800">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  <Link href="/dashboard/kepala-toko/order" className="block">
                    <Button variant="outline" className="w-full justify-start text-slate-700 font-semibold border-slate-200 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl h-11">
                      <ShoppingCart className="w-4 h-4 mr-3 text-slate-400" />
                      Buat Purchase Order
                    </Button>
                  </Link>
                  <Link href="/dashboard/kepala-toko/budgeting" className="block">
                    <Button variant="outline" className="w-full justify-start text-slate-700 font-semibold border-slate-200 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl h-11">
                      <Receipt className="w-4 h-4 mr-3 text-slate-400" />
                      Catat Pengeluaran Petty Cash
                    </Button>
                  </Link>
                  <Link href="/dashboard/kepala-toko/eod" className="block">
                    <Button variant="outline" className="w-full justify-start text-slate-700 font-semibold border-slate-200 hover:text-primary hover:border-primary/50 hover:bg-primary/5 rounded-xl h-11">
                      <ClipboardList className="w-4 h-4 mr-3 text-slate-400" />
                      Draft Laporan EOD
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

