"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, MapPin, ReceiptText, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/ui/loading-screen";

export default function KaryawanDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher('/hr/employee-dashboard')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
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
                  <span className="text-slate-900">Karyawan</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Karyawan</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingScreen />
      ) : (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Kehadiran Hari Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Status Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-800">Belum Check-In</div>
            <p className="text-xs text-slate-500 mt-1">Sif Pagi: 08:00 - 16:00</p>
            <Link href="/dashboard/karyawan/absensi" className="block mt-4">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Check-In Sekarang
              </Button>
            </Link>
          </CardContent>
        </Card>
        </motion.div>

        {/* Ringkasan Bulan Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Kehadiran Bulan Ini</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-800">{data?.totalKehadiran || 0} Hari</div>
            <div className="flex space-x-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Tepat Waktu</span>
                <span className="text-sm font-semibold text-emerald-600">{data?.tepatWaktu || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Terlambat</span>
                <span className="text-sm font-semibold text-rose-500">{data?.terlambat || 0}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Absen</span>
                <span className="text-sm font-semibold text-slate-600">{data?.absen || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Gaji Terakhir */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Slip Gaji Terakhir</CardTitle>
            <ReceiptText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-xl lg:text-2xl font-bold text-slate-800">Mei 2026</div>
            <p className="text-xs text-slate-500 mt-1">Tersedia untuk diunduh</p>
            <Link href="/dashboard/karyawan/slip-gaji" className="block mt-4">
              <Button variant="outline" className="w-full border-primary text-primary hover:bg-secondary">
                Lihat Slip Gaji
              </Button>
            </Link>
          </CardContent>
        </Card>
        </motion.div>
      </div>
      )}

      {/* Riwayat Terakhir */}
      <motion.div variants={itemVariants}>
        <Card className="border-2 shadow-sm border-slate-200 hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Absensi Terakhir</CardTitle>
          <CardDescription>5 aktivitas check-in/out terakhir Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data?.riwayatAbsensi || []).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-10 rounded-full ${item.status === 'Tepat Waktu' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                  <div>
                    <p className="font-medium text-slate-800">{item.date}</p>
                    <div className="flex items-center text-xs text-slate-500 space-x-2 mt-1">
                      <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {item.in} - {item.out}</span>
                      <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {item.location}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    item.status === 'Tepat Waktu' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
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
