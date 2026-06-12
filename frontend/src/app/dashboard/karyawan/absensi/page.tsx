"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, MapPin, Clock, Filter, Search } from "lucide-react";

export default function AbsensiKaryawan() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "capturing" | "success">("idle");

  const handleCheckIn = () => {
    setIsCheckingIn(true);
    setCheckInStatus("capturing");
    
    // Simulate capturing photo and GPS
    setTimeout(() => {
      setCheckInStatus("success");
      setTimeout(() => {
        setIsCheckingIn(false);
        setCheckInStatus("idle");
      }, 2000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Absensi Harian</h1>
        <p className="text-slate-600 mt-1">Lakukan check-in dan check-out dengan foto selfie dan lokasi.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Check In / Check Out */}
        <Card>
          <CardHeader>
            <CardTitle>Mulai Sif Anda</CardTitle>
            <CardDescription>Pastikan wajah Anda terlihat jelas dan lokasi aktif</CardDescription>
          </CardHeader>
          <CardContent>
            {isCheckingIn && checkInStatus === "capturing" ? (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium text-center">
                  Mengambil lokasi GPS dan foto selfie...
                </p>
              </div>
            ) : isCheckingIn && checkInStatus === "success" ? (
              <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p className="text-emerald-700 font-medium text-center text-lg">
                  Check-In Berhasil!
                </p>
                <p className="text-emerald-600 text-sm mt-1">08:00 WIB • Mirayya Pusat</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm">Lokasi saat ini: <strong className="text-slate-800">Mirayya Pusat (Akurasi: 5m)</strong></span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-32 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white"
                    onClick={handleCheckIn}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">Check-In</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-32 rounded-2xl flex flex-col items-center justify-center gap-3 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    disabled
                  >
                    <div className="w-12 h-12 bg-slate-200/50 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">Check-Out</span>
                  </Button>
                </div>
                <p className="text-xs text-center text-slate-500 font-medium">
                  Check-out hanya bisa dilakukan setelah Anda check-in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Tambahan */}
        <Card className="bg-gradient-to-br from-slate-50 to-white border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Sif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Jadwal Hari Ini</p>
              <p className="text-lg font-medium text-slate-800">08:00 - 16:00 WIB</p>
            </div>
            <div className="w-full h-px bg-slate-200"></div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Jam Kerja Bulan Ini</p>
              <p className="text-lg font-medium text-slate-800">144 Jam</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Absensi */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Riwayat Absensi</CardTitle>
            <CardDescription>Data kehadiran Anda bulan ini</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari tanggal..." 
                className="flex h-9 w-[150px] sm:w-[200px] rounded-[calc(var(--radius)-2px)] border border-border bg-background pl-9 pr-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9 border-border">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-100 rounded-md">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-md">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Check-In</th>
                  <th className="px-4 py-3 font-semibold">Check-Out</th>
                  <th className="px-4 py-3 font-semibold">Durasi</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-md">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { date: "11 Jun 2026", in: "07:55", out: "16:05", duration: "8j 10m", status: "Tepat Waktu" },
                  { date: "10 Jun 2026", in: "07:50", out: "16:00", duration: "8j 10m", status: "Tepat Waktu" },
                  { date: "09 Jun 2026", in: "08:15", out: "16:10", duration: "7j 55m", status: "Terlambat" },
                  { date: "08 Jun 2026", in: "07:58", out: "16:02", duration: "8j 4m", status: "Tepat Waktu" },
                  { date: "07 Jun 2026", in: "-", out: "-", duration: "-", status: "Libur" },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.date}</td>
                    <td className="px-4 py-3 text-slate-600">{row.in}</td>
                    <td className="px-4 py-3 text-slate-600">{row.out}</td>
                    <td className="px-4 py-3 text-slate-600">{row.duration}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.status === 'Tepat Waktu' ? 'bg-emerald-100 text-emerald-700' : 
                        row.status === 'Terlambat' ? 'bg-rose-100 text-rose-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
