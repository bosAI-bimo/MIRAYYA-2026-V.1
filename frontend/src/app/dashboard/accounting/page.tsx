"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, FileText, CheckCircle, TrendingUp, AlertCircle, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AccountingDashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Accounting</h1>
        <p className="text-slate-600 mt-1">Ringkasan keuangan, persetujuan tertunda, dan pemantauan anggaran.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Laba Bersih Bulan Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Laba Bersih (Bulan Ini)</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp 124.500.000</div>
            <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" /> +12.5% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        </motion.div>

        {/* Total Omzet */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Omzet (Bulan Ini)</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp 450.200.000</div>
            <p className="text-xs text-slate-500 mt-1 flex items-center">
              Seluruh Cabang
            </p>
          </CardContent>
        </Card>
        </motion.div>

        {/* Persetujuan EOD Tertunda */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-rose-100 bg-rose-50/50 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Persetujuan EOD</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">5 <span className="text-sm font-normal text-slate-500">laporan</span></div>
            <p className="text-xs text-slate-500 mt-1">Menunggu verifikasi</p>
          </CardContent>
        </Card>
        </motion.div>

        {/* Persetujuan PO Tertunda */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-amber-100 bg-amber-50/50 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Persetujuan PO</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">3 <span className="text-sm font-normal text-slate-500">pengajuan</span></div>
            <p className="text-xs text-slate-500 mt-1">Butuh persetujuan</p>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="persetujuan" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="persetujuan">Tugas Persetujuan</TabsTrigger>
          <TabsTrigger value="anggaran">Pemantauan Anggaran</TabsTrigger>
          <TabsTrigger value="pettycash">Petty Cash</TabsTrigger>
        </TabsList>
        
        <TabsContent value="persetujuan" className="mt-4">
          <div className="grid gap-6 md:grid-cols-2">
            {/* EOD Approval List */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
                  EOD Menunggu Persetujuan
                  <Link href="/dashboard/accounting/eod">
                    <Button variant="ghost" size="sm" className="text-primary text-xs h-8">Lihat Semua</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { branch: "Mirayya Sudirman", date: "11 Jun 2026", omzet: "Rp 12.500.000", status: "Pending" },
                    { branch: "Mirayya Kemang", date: "11 Jun 2026", omzet: "Rp 8.200.000", status: "Pending" },
                    { branch: "Mirayya PIK", date: "10 Jun 2026", omzet: "Rp 15.100.000", status: "Pending" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.branch}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.date} • {item.omzet}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">Review</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* PO Approval List */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
                  PO Menunggu Persetujuan
                  <Link href="/dashboard/accounting/po">
                    <Button variant="ghost" size="sm" className="text-primary text-xs h-8">Lihat Semua</Button>
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {[
                    { branch: "Mirayya Kelapa Gading", id: "PO-2606-042", total: "Rp 4.500.000", status: "Pending" },
                    { branch: "Mirayya Sudirman", id: "PO-2606-043", total: "Rp 2.100.000", status: "Pending" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{item.branch}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.id} • {item.total}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="text-xs">Review</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="anggaran" className="mt-4">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800">Status Anggaran Cabang (Juni 2026)</CardTitle>
              <CardDescription>Pemantauan realisasi anggaran operasional per cabang.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { branch: "Mirayya Sudirman", budget: "Rp 15.000.000", used: "Rp 12.500.000", percentage: 83, status: "warning" },
                  { branch: "Mirayya Kemang", budget: "Rp 10.000.000", used: "Rp 4.200.000", percentage: 42, status: "safe" },
                  { branch: "Mirayya PIK", budget: "Rp 12.000.000", used: "Rp 11.500.000", percentage: 95, status: "danger" },
                  { branch: "Mirayya Kelapa Gading", budget: "Rp 10.000.000", used: "Rp 5.500.000", percentage: 55, status: "safe" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-700">{item.branch}</span>
                      <span className="text-slate-500">Terpakai: <span className="font-medium text-slate-700">{item.used}</span> / {item.budget}</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          item.status === 'danger' ? 'bg-rose-500' : 
                          item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button className="bg-primary hover:bg-primary/90 text-white">Kelola Anggaran</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pettycash" className="mt-4">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-slate-800">Monitoring Petty Cash</CardTitle>
              <CardDescription>Transaksi pengeluaran kas kecil cabang terbaru.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { branch: "Mirayya Sudirman", desc: "Beli galon & tisu", amount: "Rp 150.000", date: "11 Jun 2026", by: "Sari (Store Leader)" },
                  { branch: "Mirayya Kemang", desc: "Ongkir GoSend antar barang", amount: "Rp 45.000", date: "10 Jun 2026", by: "Budi (Store Leader)" },
                  { branch: "Mirayya PIK", desc: "Plastik sampah", amount: "Rp 35.000", date: "09 Jun 2026", by: "Rina (Store Leader)" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-start p-4 border rounded-lg hover:border-primary/30 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 p-2 bg-slate-100 rounded-md text-slate-500">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 text-sm">{item.desc}</h4>
                        <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                          <p>Cabang: <span className="font-medium">{item.branch}</span></p>
                          <p>Oleh: {item.by} • {item.date}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 bg-rose-50 text-rose-600 text-xs font-semibold rounded-md">
                        - {item.amount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end">
                <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
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
