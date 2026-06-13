"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReceiptText, Download, Filter, Search, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SlipGajiKaryawan() {
  const slips = [
    { period: "Mei 2026", date: "28 Mei 2026", amount: "Rp 3.500.000", status: "Tersedia" },
    { period: "April 2026", date: "28 Apr 2026", amount: "Rp 3.500.000", status: "Tersedia" },
    { period: "Maret 2026", date: "28 Mar 2026", amount: "Rp 3.450.000", status: "Tersedia" },
    { period: "Februari 2026", date: "28 Feb 2026", amount: "Rp 3.500.000", status: "Tersedia" },
    { period: "Januari 2026", date: "28 Jan 2026", amount: "Rp 3.500.000", status: "Tersedia" },
  ];

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/karyawan" className="hover:text-pink-600 transition-colors">Dashboard Karyawan</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Slip Gaji</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Slip Gaji</h1>
        </div>
      </div>

      {/* Slip Gaji Terbaru */}
      <Card className="border-2 border-slate-200 bg-gradient-to-br from-white to-secondary/30">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-1">
                <ReceiptText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Slip Gaji Terbaru</h3>
                <p className="text-2xl font-bold text-slate-800">{slips[0].period}</p>
                <div className="flex items-center text-sm text-slate-600 mt-2 space-x-4">
                  <span>Tanggal Terbit: <strong className="text-slate-800">{slips[0].date}</strong></span>
                </div>
              </div>
            </div>
            
            <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white flex items-center gap-2 h-12 px-6">
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Riwayat Slip Gaji */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <CardTitle>Riwayat Slip Gaji</CardTitle>
            <CardDescription>Semua slip gaji yang diterbitkan untuk Anda</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari bulan/tahun..." 
                className="h-9 w-full rounded-md border-2 border-slate-200 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
              <option value="this_month">Bulan Ini</option>
              <option value="last_month">Bulan Lalu</option>
              <option value="this_year">Tahun Ini</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {slips.map((slip, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{slip.period}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Diterbitkan: {slip.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between sm:w-[300px]">
                  <div className="text-left sm:text-right">
                    <p className="text-xs text-slate-500 uppercase">Take Home Pay</p>
                    <p className="font-semibold text-slate-800">*********</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4 border-slate-200 text-slate-600 hover:text-primary hover:border-primary/50">
                    <Download className="w-4 h-4 mr-2" />
                    Unduh
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
