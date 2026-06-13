"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, AlertTriangle, Building, CreditCard, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

const rekonsiliasiData = [
  { date: "10 Jun 2026", account: "BCA - 123456789", bank: "Rp 125.500.000", system: "Rp 125.500.000", diff: "Rp 0", status: "match" },
  { date: "10 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 85.200.000", system: "Rp 85.200.000", diff: "Rp 0", status: "match" },
  { date: "09 Jun 2026", account: "BCA - 123456789", bank: "Rp 110.000.000", system: "Rp 110.050.000", diff: "- Rp 50.000", status: "mismatch" },
  { date: "08 Jun 2026", account: "BNI - 456123789", bank: "Rp 45.100.000", system: "Rp 45.100.000", diff: "Rp 0", status: "match" },
  { date: "07 Jun 2026", account: "BCA - 123456789", bank: "Rp 98.400.000", system: "Rp 98.400.000", diff: "Rp 0", status: "match" },
  { date: "06 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 70.000.000", system: "Rp 70.000.000", diff: "Rp 0", status: "match" },
  { date: "05 Jun 2026", account: "BCA - 123456789", bank: "Rp 85.000.000", system: "Rp 84.500.000", diff: "+ Rp 500.000", status: "mismatch" },
  { date: "04 Jun 2026", account: "BNI - 456123789", bank: "Rp 30.500.000", system: "Rp 30.500.000", diff: "Rp 0", status: "match" },
  { date: "03 Jun 2026", account: "BCA - 123456789", bank: "Rp 75.200.000", system: "Rp 75.200.000", diff: "Rp 0", status: "match" },
  { date: "02 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 60.100.000", system: "Rp 60.100.000", diff: "Rp 0", status: "match" },
  { date: "01 Jun 2026", account: "BCA - 123456789", bank: "Rp 50.000.000", system: "Rp 50.000.000", diff: "Rp 0", status: "match" },
  { date: "31 May 2026", account: "BNI - 456123789", bank: "Rp 25.000.000", system: "Rp 25.100.000", diff: "- Rp 100.000", status: "mismatch" },
  { date: "30 May 2026", account: "BCA - 123456789", bank: "Rp 45.000.000", system: "Rp 45.000.000", diff: "Rp 0", status: "match" },
  { date: "29 May 2026", account: "Mandiri - 987654321", bank: "Rp 35.500.000", system: "Rp 35.500.000", diff: "Rp 0", status: "match" },
  { date: "28 May 2026", account: "BCA - 123456789", bank: "Rp 40.200.000", system: "Rp 40.200.000", diff: "Rp 0", status: "match" },
];

export default function RekonsiliasiBankPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(rekonsiliasiData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = rekonsiliasiData.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/accounting" className="hover:text-pink-600 transition-colors">Accounting</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Rekonsiliasi Bank</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Rekonsiliasi Bank</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Rekonsiliasi Baru
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 shadow-sm border-slate-200 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Saldo Bank (BCA, Mandiri, BNI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 flex items-center">
              <Building className="w-6 h-6 mr-3 text-slate-400" />
              Rp 342.150.000
            </div>
            <p className="text-xs text-slate-500 mt-2">Terakhir diperbarui: 11 Jun 2026, 09:00</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pencatatan Sistem (EDC & Transfer)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-slate-400" />
              Rp 342.150.000
            </div>
            <p className="text-xs text-slate-500 mt-2">Berdasarkan laporan EOD yang disetujui</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Rekonsiliasi</CardTitle>
            <CardDescription>Catatan pencocokan saldo per hari/minggu.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari rekening..." 
                className="pl-9 pr-4 py-2 border-2 border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full md:w-auto min-w-[140px]">
              <option value="all">Semua Cabang</option>
              <option value="sudirman">Mirayya Sudirman</option>
              <option value="kemang">Mirayya Kemang</option>
              <option value="pik">Mirayya PIK</option>
              <option value="kelapa_gading">Mirayya Kelapa Gading</option>
              <option value="bintaro">Mirayya Bintaro</option>
            </select>
            <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full md:w-auto min-w-[130px]">
              <option value="this_month">Bulan Ini</option>
              <option value="last_month">Bulan Lalu</option>
              <option value="this_year">Tahun Ini</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Tanggal Rekonsiliasi</th>
                  <th className="px-6 py-4 font-medium">Rekening Bank</th>
                  <th className="px-6 py-4 font-medium">Saldo Bank</th>
                  <th className="px-6 py-4 font-medium">Pencatatan Sistem</th>
                  <th className="px-6 py-4 font-medium text-right">Selisih</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.account}</td>
                    <td className="px-6 py-4 text-slate-800">{item.bank}</td>
                    <td className="px-6 py-4 text-slate-800">{item.system}</td>
                    <td className={`px-6 py-4 text-right font-medium ${item.diff === 'Rp 0' ? 'text-slate-500' : 'text-rose-600'}`}>{item.diff}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {item.status === 'match' ? (
                          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Cocok
                          </div>
                        ) : (
                          <div className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Selisih
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, rekonsiliasiData.length)}</span> dari <span className="font-medium text-slate-700">{rekonsiliasiData.length}</span> data
            </div>
            <div className="flex items-center gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center justify-center text-sm font-medium px-3 text-slate-600">
                Halaman {currentPage} dari {totalPages}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
