"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ShoppingCart, FileCheck, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function KepalaTokoDashboard() {
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Kepala Toko</h1>
        <p className="text-slate-600 mt-1">Selamat datang kembali, Ahmad. Berikut adalah ringkasan cabang Anda hari ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status EOD Hari Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Status Laporan EOD</CardTitle>
            <FileCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mt-1">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <div className="text-xl font-bold text-slate-800">Belum Dikirim</div>
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
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Sisa Anggaran Cabang</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp 1.250.000</div>
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
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Peringatan Stok Menipis</CardTitle>
            <AlertCircle className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">3 Produk</div>
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
        <Card className="shadow-sm border-slate-200">
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
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
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
