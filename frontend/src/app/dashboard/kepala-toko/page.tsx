"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ShoppingCart, FileCheck, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";
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
                  <span className="text-slate-900">Kepala Toko</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Kepala Toko</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="today">Hari Ini</option>
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status EOD Hari Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Status Laporan EOD</CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mt-1">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <div className="text-lg lg:text-xl font-bold text-slate-800">Belum Dikirim</div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Segera kirim laporan End of Day setelah toko tutup.</p>
            <Link href="/dashboard/kepala-toko/eod" className="block mt-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Isi Laporan EOD
              </Button>
            </Link>
          </CardContent>
        </Card>
        </motion.div>

        {/* Ringkasan Anggaran */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Sisa Anggaran Cabang</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-800">Rp 1.250.000</div>
            <div className="flex items-center space-x-2 mt-2">
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-xs font-medium text-slate-600">75% Terpakai</span>
            </div>
            <Link href="/dashboard/kepala-toko/budgeting" className="block mt-4">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-secondary">
                Lihat Detail Budget
              </Button>
            </Link>
          </CardContent>
        </Card>
        </motion.div>

        {/* Peringatan Stok */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Peringatan Stok Menipis</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-rose-600">3 Produk</div>
            <p className="text-xs text-slate-500 mt-1">Lipstick Matte, Serum, Toner</p>
            <Link href="/dashboard/kepala-toko/order" className="block mt-4">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-secondary">
                <ShoppingCart className="w-4 h-4 mr-2" /> Ajukan PO
              </Button>
            </Link>
          </CardContent>
        </Card>
        </motion.div>
      </div>

      {/* Riwayat Order Terakhir */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 shadow-sm border-slate-200 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Pengajuan PO Terakhir</CardTitle>
          <CardDescription>Status pengajuan Purchase Order bulan ini</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { id: "PO-202606-003", date: "10 Jun 2026", items: 5, total: "Rp 3.500.000", status: "Menunggu Approval" },
              { id: "PO-202606-002", date: "05 Jun 2026", items: 12, total: "Rp 8.200.000", status: "Disetujui" },
              { id: "PO-202605-015", date: "28 Mei 2026", items: 8, total: "Rp 5.100.000", status: "Disetujui" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                    <ShoppingCart className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-800">{item.id}</p>
                    <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1">
                      <span>{item.date}</span>
                      <span>•</span>
                      <span>{item.items} Item</span>
                      <span>•</span>
                      <span className="font-medium">{item.total}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </motion.div>
    </motion.div>
  );
}
