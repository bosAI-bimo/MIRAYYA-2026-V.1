"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingDown, Clock, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

const budgetHistory = [
  { id: "PO-202606-003", date: "10 Jun 2026", desc: "Restock Lipstick & Serum", amount: "- Rp 1.500.000", status: "Disetujui" },
  { id: "PC-202606-002", date: "08 Jun 2026", desc: "Petty Cash: Tisu & Sabun Cuci Tangan", amount: "- Rp 250.000", status: "Disetujui" },
  { id: "PO-202606-001", date: "02 Jun 2026", desc: "Restock Toner (Bulk)", amount: "- Rp 2.000.000", status: "Disetujui" },
  { id: "PC-202606-003", date: "11 Jun 2026", desc: "Petty Cash: ATK", amount: "- Rp 150.000", status: "Menunggu" },
  { id: "PO-202606-004", date: "12 Jun 2026", desc: "Restock Cushion & Foundation", amount: "- Rp 3.000.000", status: "Menunggu" },
  { id: "PC-202606-004", date: "13 Jun 2026", desc: "Petty Cash: Galon Air", amount: "- Rp 50.000", status: "Disetujui" },
  { id: "PO-202606-005", date: "14 Jun 2026", desc: "Restock Skincare Bundle", amount: "- Rp 2.500.000", status: "Ditolak" },
  { id: "PC-202606-005", date: "15 Jun 2026", desc: "Petty Cash: Kopi & Gula", amount: "- Rp 80.000", status: "Disetujui" },
  { id: "PO-202606-006", date: "16 Jun 2026", desc: "Restock Body Lotion", amount: "- Rp 1.200.000", status: "Disetujui" },
  { id: "PC-202606-006", date: "17 Jun 2026", desc: "Petty Cash: Pembersih Lantai", amount: "- Rp 60.000", status: "Disetujui" },
  { id: "PO-202606-007", date: "18 Jun 2026", desc: "Restock Lip Cream", amount: "- Rp 900.000", status: "Disetujui" },
  { id: "PC-202606-007", date: "19 Jun 2026", desc: "Petty Cash: Listrik Prabayar", amount: "- Rp 500.000", status: "Menunggu" },
  { id: "PO-202606-008", date: "20 Jun 2026", desc: "Restock Masker Wajah", amount: "- Rp 400.000", status: "Disetujui" },
  { id: "PC-202606-008", date: "21 Jun 2026", desc: "Petty Cash: Internet", amount: "- Rp 350.000", status: "Disetujui" },
  { id: "PO-202606-009", date: "22 Jun 2026", desc: "Restock Kapas Kecantikan", amount: "- Rp 150.000", status: "Disetujui" },
];

export default function BudgetingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(budgetHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = budgetHistory.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/kepala-toko" className="hover:text-pink-600 transition-colors">Dashboard Kepala Toko</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Anggaran Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Anggaran Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 shadow-sm border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-slate-400" />
              Total Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">Rp 5.000.000</div>
            <p className="text-xs text-slate-500 mt-1">Periode Juni 2026</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2 text-slate-400" />
              Terpakai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">Rp 3.750.000</div>
            <div className="flex items-center mt-1">
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">75% dari total anggaran</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Sisa Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">Rp 1.250.000</div>
            <p className="text-xs text-primary/70 mt-1">Tersedia untuk pengajuan</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Penggunaan Anggaran</CardTitle>
          <CardDescription>Daftar Purchase Order yang memotong anggaran bulan ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">ID Referensi</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Keterangan</th>
                  <th className="px-4 py-3 font-medium text-right">Nominal</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{item.id}</td>
                    <td className="px-4 py-3 text-slate-600">{item.date}</td>
                    <td className="px-4 py-3 text-slate-600">{item.desc}</td>
                    <td className="px-4 py-3 font-medium text-right text-rose-600">{item.amount}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, budgetHistory.length)}</span> dari <span className="font-medium text-slate-700">{budgetHistory.length}</span> data
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
