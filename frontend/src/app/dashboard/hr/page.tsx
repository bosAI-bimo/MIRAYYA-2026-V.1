"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserCheck, AlertCircle, FileText, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";

type Checkin = {
  name: string;
  role: string;
  branch: string;
  time: string;
  status: string;
};

type DashboardStats = {
  totalEmployees: number;
  presentToday: number;
  absent: number;
  recentCheckins: Checkin[];
};

export default function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetcher("/hr/dashboard-stats");
        setStats(data);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
        <h2 className="text-lg font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">Coba Lagi</Button>
      </div>
    );
  }

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
                  <span className="text-slate-900">HR</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard HR</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[160px] shadow-sm transition-all">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
          </select>
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Karyawan */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Karyawan</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-slate-800">{stats?.totalEmployees}</div>
              <p className="text-xs text-slate-500 mt-1 flex items-center">
                Data real-time dari database
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Hadir Hari Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-slate-200 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Hadir Hari Ini</CardTitle>
              <UserCheck className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-slate-800">{stats?.presentToday}</div>
              <p className="text-xs text-emerald-600 font-medium mt-1">
                Karyawan melakukan check-in hari ini
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Absen/Terlambat */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-rose-100 bg-rose-50/50 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Absen / Cuti</CardTitle>
              <AlertCircle className="h-4 w-4 text-rose-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-rose-600">{stats?.absent} <span className="text-sm font-normal text-slate-500">orang</span></div>
              <p className="text-xs text-slate-500 mt-1">Perlu pengecekan</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payroll Bulan Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-amber-100 bg-amber-50/50 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Status Payroll (Juni)</CardTitle>
              <FileText className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl lg:text-2xl font-bold text-amber-600">Pending</div>
              <p className="text-xs text-slate-500 mt-1">Menunggu proses (Tgl 25)</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Absensi Masuk Terbaru */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 shadow-sm border-slate-200 h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800 flex items-center justify-between">
                Check-in Terbaru
                <Link href="/dashboard/hr/absensi">
                  <Button variant="ghost" size="sm" className="text-primary text-xs h-8">Lihat Semua</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {stats?.recentCheckins.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-sm">Belum ada data check-in hari ini.</div>
                ) : (
                  stats?.recentCheckins.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-100 transition-colors cursor-default">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{item.role} • {item.branch}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-slate-700">{item.time}</p>
                        <p className={`text-xs mt-0.5 font-medium ${item.status === 'Terlambat' ? 'text-rose-500' : 'text-emerald-500'}`}>
                          {item.status}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Akses Cepat */}
        <motion.div variants={itemVariants}>
          <Card className="border-2 shadow-sm border-slate-200 h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-lg font-semibold text-slate-800">Akses Cepat</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <Link href="/dashboard/hr/karyawan" className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 hover:border-primary/50 hover:bg-rose-50/30 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm">Kelola Karyawan</h4>
                    <p className="text-xs text-slate-500">Tambah atau perbarui data karyawan</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </Link>

              <Link href="/dashboard/hr/payroll" className="flex items-center justify-between p-4 rounded-lg border-2 border-slate-200 hover:border-primary/50 hover:bg-rose-50/30 transition-colors group">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm">Proses Payroll</h4>
                    <p className="text-xs text-slate-500">Generate slip gaji bulan ini</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
