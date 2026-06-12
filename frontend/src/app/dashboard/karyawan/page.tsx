"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, MapPin, ReceiptText } from "lucide-react";
import Link from "next/link";

export default function KaryawanDashboard() {
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Dashboard Karyawan</h1>
        <p className="text-slate-600 mt-1">Selamat datang kembali, Jane. Berikut adalah ringkasan aktivitas Anda.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Kehadiran Hari Ini */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Status Hari Ini</CardTitle>
            <Clock className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Belum Check-In</div>
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
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Kehadiran Bulan Ini</CardTitle>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">18 Hari</div>
            <div className="flex space-x-4 mt-2">
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Tepat Waktu</span>
                <span className="text-sm font-semibold text-emerald-600">16</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Terlambat</span>
                <span className="text-sm font-semibold text-rose-500">2</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-500">Absen</span>
                <span className="text-sm font-semibold text-slate-600">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </motion.div>

        {/* Gaji Terakhir */}
        <motion.div variants={itemVariants} className="h-full">
          <Card className="shadow-sm hover:shadow-md transition-shadow border-slate-200 h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Slip Gaji Terakhir</CardTitle>
            <ReceiptText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Mei 2026</div>
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

      {/* Riwayat Terakhir */}
      <motion.div variants={itemVariants}>
        <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Absensi Terakhir</CardTitle>
          <CardDescription>5 aktivitas check-in/out terakhir Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { date: "11 Jun 2026", in: "07:55", out: "16:05", status: "Tepat Waktu", location: "Mirayya Pusat" },
              { date: "10 Jun 2026", in: "07:50", out: "16:00", status: "Tepat Waktu", location: "Mirayya Pusat" },
              { date: "09 Jun 2026", in: "08:15", out: "16:10", status: "Terlambat", location: "Mirayya Pusat" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
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
