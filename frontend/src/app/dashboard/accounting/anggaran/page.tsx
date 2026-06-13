"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

const anggaranData = [
  { branch: "Mirayya Sudirman", budget: "Rp 15.000.000", used: "Rp 12.500.000", sisa: "Rp 2.500.000", percentage: 83, status: "warning" },
  { branch: "Mirayya Kemang", budget: "Rp 10.000.000", used: "Rp 4.200.000", sisa: "Rp 5.800.000", percentage: 42, status: "safe" },
  { branch: "Mirayya PIK", budget: "Rp 12.000.000", used: "Rp 11.500.000", sisa: "Rp 500.000", percentage: 95, status: "danger" },
  { branch: "Mirayya Kelapa Gading", budget: "Rp 10.000.000", used: "Rp 5.500.000", sisa: "Rp 4.500.000", percentage: 55, status: "safe" },
  { branch: "Mirayya Bintaro", budget: "Rp 8.000.000", used: "Rp 7.800.000", sisa: "Rp 200.000", percentage: 97, status: "danger" },
  { branch: "Pusat (Operasional)", budget: "Rp 50.000.000", used: "Rp 20.000.000", sisa: "Rp 30.000.000", percentage: 40, status: "safe" },
  { branch: "Pusat (Marketing)", budget: "Rp 30.000.000", used: "Rp 25.000.000", sisa: "Rp 5.000.000", percentage: 83, status: "warning" },
  { branch: "Mirayya Sudirman (Promosi)", budget: "Rp 5.000.000", used: "Rp 4.900.000", sisa: "Rp 100.000", percentage: 98, status: "danger" },
  { branch: "Mirayya Kemang (Maintenance)", budget: "Rp 3.000.000", used: "Rp 1.000.000", sisa: "Rp 2.000.000", percentage: 33, status: "safe" },
  { branch: "Mirayya PIK (Events)", budget: "Rp 8.000.000", used: "Rp 5.000.000", sisa: "Rp 3.000.000", percentage: 62, status: "safe" },
  { branch: "Pusat (IT)", budget: "Rp 15.000.000", used: "Rp 10.000.000", sisa: "Rp 5.000.000", percentage: 66, status: "warning" },
  { branch: "Mirayya Kelapa Gading (Staff)", budget: "Rp 2.000.000", used: "Rp 1.800.000", sisa: "Rp 200.000", percentage: 90, status: "danger" },
  { branch: "Mirayya Bintaro (Repair)", budget: "Rp 4.000.000", used: "Rp 2.500.000", sisa: "Rp 1.500.000", percentage: 62, status: "safe" },
  { branch: "Pusat (Logistik)", budget: "Rp 20.000.000", used: "Rp 18.000.000", sisa: "Rp 2.000.000", percentage: 90, status: "danger" },
  { branch: "Pusat (HRD)", budget: "Rp 10.000.000", used: "Rp 7.500.000", sisa: "Rp 2.500.000", percentage: 75, status: "warning" },
];

export default function BudgetPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(anggaranData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = anggaranData.slice(startIndex, startIndex + itemsPerPage);
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
                  <span className="text-slate-900">Anggaran Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Anggaran Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Buat Anggaran Baru
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Anggaran Juni 2026</CardTitle>
            <CardDescription>Pemantauan realisasi anggaran bulan berjalan.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari cabang..." 
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
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Total Anggaran</th>
                  <th className="px-6 py-4 font-medium">Terpakai</th>
                  <th className="px-6 py-4 font-medium">Sisa Anggaran</th>
                  <th className="px-6 py-4 font-medium">Status Pemakaian</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.budget}</td>
                    <td className="px-6 py-4 text-slate-600">{item.used}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.sisa}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === 'danger' ? 'bg-rose-500' : 
                              item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          item.status === 'danger' ? 'text-rose-600' : 
                          item.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit Anggaran">
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Hapus">
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
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
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, anggaranData.length)}</span> dari <span className="font-medium text-slate-700">{anggaranData.length}</span> data
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
