"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, CheckCircle, TrendingUp, AlertCircle, CreditCard, ChevronRight, Activity, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountingDashboard() {
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Dashboard Accounting</h1>
          <p className="text-slate-500 mt-2 text-sm lg:text-base">Ringkasan keuangan, persetujuan tertunda, dan pemantauan anggaran keseluruhan cabang.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 md:mt-0">
          <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[140px]">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Laba Bersih Bulan Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center space-x-4 mb-5 relative z-10">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 group-hover:bg-emerald-100 transition-colors duration-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700 truncate">Laba Bersih</p>
                <p className="text-xs font-medium text-slate-500 truncate">Bulan Ini</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight truncate">Rp 124,5 Jt</div>
              <div className="mt-3 flex flex-wrap items-center gap-y-1">
                <span className="text-xs text-emerald-700 font-bold flex items-center bg-emerald-100 px-2 py-1 rounded-md shrink-0">
                  <ArrowUpRight className="h-3 w-3 mr-1" /> +12.5%
                </span>
                <span className="text-xs font-medium text-slate-500 ml-2 truncate">vs bulan lalu</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Total Omzet */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center space-x-4 mb-5 relative z-10">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-100 transition-colors duration-300">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700 truncate">Total Omzet</p>
                <p className="text-xs font-medium text-slate-500 truncate">Seluruh Cabang</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight truncate">Rp 450,2 Jt</div>
              <div className="mt-3 flex flex-wrap items-center gap-y-1">
                <span className="text-xs text-blue-700 font-bold flex items-center bg-blue-100 px-2 py-1 rounded-md shrink-0">
                  <Activity className="h-3 w-3 mr-1" /> 15 Cabang
                </span>
                <span className="text-xs font-medium text-slate-500 ml-2 truncate">aktif beroperasi</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Persetujuan EOD Tertunda */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-rose-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center space-x-4 mb-5 relative z-10">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-600 group-hover:bg-rose-100 transition-colors duration-300">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700 truncate">Persetujuan EOD</p>
                <p className="text-xs font-medium text-slate-500 truncate">Menunggu Verifikasi</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-2xl xl:text-3xl font-extrabold text-rose-600 tracking-tight truncate">5 <span className="text-sm xl:text-base font-semibold text-slate-500">Laporan</span></div>
              <div className="mt-3 flex flex-wrap items-center gap-y-1">
                <span className="text-xs text-rose-700 font-bold flex items-center bg-rose-100 px-2 py-1 rounded-md shrink-0">
                  Segera
                </span>
                <span className="text-xs font-medium text-slate-500 ml-2 truncate">butuh tindakan</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Persetujuan PO Tertunda */}
        <motion.div variants={itemVariants} className="h-full">
          <div className="bg-white rounded-2xl shadow-sm p-6 h-full flex flex-col border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 relative overflow-hidden group cursor-pointer">
            <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-amber-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="flex items-center space-x-4 mb-5 relative z-10">
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-100 transition-colors duration-300">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-700 truncate">Persetujuan PO</p>
                <p className="text-xs font-medium text-slate-500 truncate">Pengajuan Pembelian</p>
              </div>
            </div>
            <div className="mt-auto relative z-10">
              <div className="text-2xl xl:text-3xl font-extrabold text-amber-600 tracking-tight truncate">3 <span className="text-sm xl:text-base font-semibold text-slate-500">Dokumen</span></div>
              <div className="mt-3 flex flex-wrap items-center gap-y-1">
                <span className="text-xs text-amber-700 font-bold flex items-center bg-amber-100 px-2 py-1 rounded-md shrink-0">
                  Pending
                </span>
                <span className="text-xs font-medium text-slate-500 ml-2 truncate">menunggu acc</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="persetujuan" className="w-full">
          {/* Capsule Tabs */}
          <div className="flex my-6 lg:my-10 bg-slate-100/80 p-1.5 rounded-2xl md:rounded-full w-full md:w-max overflow-x-auto no-scrollbar border border-slate-200/50 shadow-inner">
            <TabsList className="bg-transparent p-0 flex gap-1 lg:gap-2 min-w-max h-auto">
              <TabsTrigger 
                value="persetujuan" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-8 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Tugas Persetujuan
              </TabsTrigger>
              <TabsTrigger 
                value="anggaran" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-8 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Pemantauan Anggaran
              </TabsTrigger>
              <TabsTrigger 
                value="pettycash" 
                className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-5 lg:px-8 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
              >
                Petty Cash
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="persetujuan" className="mt-6 focus-visible:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* EOD Approval List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">EOD Menunggu Persetujuan</h3>
                    <p className="text-xs text-slate-500 mt-1">Laporan harian cabang</p>
                  </div>
                  <Link href="/dashboard/accounting/eod">
                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 text-xs font-bold rounded-full px-4 h-8">
                      Lihat Semua
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 flex-1">
                  {[
                    { branch: "Mirayya Sudirman", date: "11 Jun 2026", omzet: "Rp 12.500.000", status: "Pending" },
                    { branch: "Mirayya Kemang", date: "11 Jun 2026", omzet: "Rp 8.200.000", status: "Pending" },
                    { branch: "Mirayya PIK", date: "10 Jun 2026", omzet: "Rp 15.100.000", status: "Pending" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center border border-rose-100/50 group-hover:bg-rose-100 transition-colors shrink-0">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 truncate">{item.branch}</p>
                          <p className="text-sm text-slate-500 mt-1 font-medium truncate">{item.date} • <span className="text-slate-700">{item.omzet}</span></p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-full px-5 h-9 font-semibold transition-all shadow-sm group-hover:shadow group-hover:border-slate-800 shrink-0 cursor-pointer">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* PO Approval List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full overflow-hidden">
                <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">PO Menunggu Persetujuan</h3>
                    <p className="text-xs text-slate-500 mt-1">Pengajuan Purchase Order</p>
                  </div>
                  <Link href="/dashboard/accounting/po">
                    <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 text-xs font-bold rounded-full px-4 h-8">
                      Lihat Semua
                    </Button>
                  </Link>
                </div>
                <div className="divide-y divide-slate-100 flex-1">
                  {[
                    { branch: "Mirayya Kelapa Gading", id: "PO-2606-042", total: "Rp 4.500.000", status: "Pending" },
                    { branch: "Mirayya Sudirman", id: "PO-2606-043", total: "Rp 2.100.000", status: "Pending" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center border border-amber-100/50 group-hover:bg-amber-100 transition-colors shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-slate-800 truncate">{item.branch}</p>
                          <p className="text-sm text-slate-500 mt-1 font-medium truncate">{item.id} • <span className="text-slate-700">{item.total}</span></p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="border-slate-200 text-slate-600 hover:bg-slate-800 hover:text-white rounded-full px-5 h-9 font-semibold transition-all shadow-sm group-hover:shadow group-hover:border-slate-800 shrink-0 cursor-pointer">
                        Review
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="anggaran" className="mt-6 focus-visible:outline-none">
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
              <CardHeader className="px-6 py-6 border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800">Status Anggaran Cabang (Juni 2026)</CardTitle>
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

          <TabsContent value="pettycash" className="mt-6 focus-visible:outline-none">
            <Card className="shadow-sm border-slate-200 rounded-2xl overflow-hidden">
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
                    <div key={i} className="flex justify-between items-center p-6 hover:bg-slate-50 transition-colors group gap-4 cursor-pointer">
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
                      <div className="text-right shrink-0">
                        <span className="inline-flex px-3 py-1.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-100/50">
                          - {item.amount}
                        </span>
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
    </motion.div>
  );
}
