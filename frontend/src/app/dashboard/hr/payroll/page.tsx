"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Calculator, CheckCircle2, FileText, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

const payrollData = [
  { id: "PR-001", name: "Siti Rahma", role: "HR Manager", branch: "Pusat", baseSalary: "Rp 8.000.000", allowance: "Rp 1.000.000", deduction: "Rp 150.000", net: "Rp 8.850.000", status: "Generated" },
  { id: "PR-002", name: "Budi Santoso", role: "Accounting", branch: "Pusat", baseSalary: "Rp 7.500.000", allowance: "Rp 1.000.000", deduction: "Rp 0", net: "Rp 8.500.000", status: "Generated" },
  { id: "PR-003", name: "Anita Wijaya", role: "BA", branch: "Mirayya Sudirman", baseSalary: "Rp 4.500.000", allowance: "Rp 800.000", deduction: "Rp 50.000", net: "Rp 5.250.000", status: "Pending" },
  { id: "PR-004", name: "Rina Marlina", role: "Store Leader", branch: "Mirayya PIK", baseSalary: "Rp 5.500.000", allowance: "Rp 1.200.000", deduction: "Rp 0", net: "Rp 6.700.000", status: "Pending" },
  { id: "PR-005", name: "Dina Mariana", role: "BA", branch: "Mirayya Kelapa Gading", baseSalary: "Rp 4.500.000", allowance: "Rp 500.000", deduction: "Rp 250.000", net: "Rp 4.750.000", status: "Pending" },
  { id: "PR-006", name: "Agus Salim", role: "Store Leader", branch: "Mirayya Kemang", baseSalary: "Rp 5.500.000", allowance: "Rp 1.200.000", deduction: "Rp 100.000", net: "Rp 6.600.000", status: "Generated" },
  { id: "PR-007", name: "Dewi Lestari", role: "BA", branch: "Mirayya PIK", baseSalary: "Rp 4.500.000", allowance: "Rp 700.000", deduction: "Rp 0", net: "Rp 5.200.000", status: "Generated" },
  { id: "PR-008", name: "Fajar Siddiq", role: "Gudang", branch: "Pusat", baseSalary: "Rp 4.000.000", allowance: "Rp 500.000", deduction: "Rp 50.000", net: "Rp 4.450.000", status: "Pending" },
  { id: "PR-009", name: "Gita Savitri", role: "BA", branch: "Mirayya Kelapa Gading", baseSalary: "Rp 4.500.000", allowance: "Rp 800.000", deduction: "Rp 0", net: "Rp 5.300.000", status: "Generated" },
  { id: "PR-010", name: "Hadi Kusuma", role: "Kasir", branch: "Mirayya Bintaro", baseSalary: "Rp 4.200.000", allowance: "Rp 600.000", deduction: "Rp 100.000", net: "Rp 4.700.000", status: "Pending" },
  { id: "PR-011", name: "Intan Nuraini", role: "BA", branch: "Mirayya Sudirman", baseSalary: "Rp 4.500.000", allowance: "Rp 500.000", deduction: "Rp 0", net: "Rp 5.000.000", status: "Generated" },
  { id: "PR-012", name: "Joko Supriyanto", role: "Security", branch: "Mirayya PIK", baseSalary: "Rp 3.800.000", allowance: "Rp 400.000", deduction: "Rp 0", net: "Rp 4.200.000", status: "Generated" },
  { id: "PR-013", name: "Kirana Larasati", role: "Store Leader", branch: "Mirayya Bintaro", baseSalary: "Rp 5.500.000", allowance: "Rp 1.000.000", deduction: "Rp 200.000", net: "Rp 6.300.000", status: "Pending" },
  { id: "PR-014", name: "Sari Indah", role: "BA", branch: "Mirayya Kemang", baseSalary: "Rp 4.500.000", allowance: "Rp 0", deduction: "Rp 0", net: "Rp 4.500.000", status: "Pending" },
  { id: "PR-015", name: "Tono Mulyono", role: "Security", branch: "Mirayya Sudirman", baseSalary: "Rp 3.800.000", allowance: "Rp 400.000", deduction: "Rp 50.000", net: "Rp 4.150.000", status: "Generated" },
];

export default function PayrollPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(payrollData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = payrollData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/hr" className="hover:text-pink-600 transition-colors">Dashboard HR</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Payroll & Gaji</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Payroll & Gaji</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="border-slate-200 text-slate-600 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Rekap
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Calculator className="w-4 h-4 mr-2" />
            Hitung Ulang
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pengeluaran Gaji (Estimasi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp 284.500.000</div>
            <p className="text-xs text-slate-500 mt-1">Periode Juni 2026</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Slip Gaji Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">12 / 58</div>
            <p className="text-xs text-slate-500 mt-1">Karyawan</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Jadwal Penggajian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">25 Jun 2026</div>
            <p className="text-xs text-amber-600 font-medium mt-1">14 hari lagi</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bulan-ini" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="bulan-ini">Periode Bulan Ini</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bulan-ini" className="mt-4">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Daftar Payroll Juni 2026</CardTitle>
                <CardDescription>Berdasarkan data kehadiran 26 Mei - 25 Juni.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama karyawan..."
                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary h-9 text-sm"
                  />
                </div>
                <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[140px]">
                  <option value="all">Semua Cabang</option>
                  <option value="sudirman">Mirayya Sudirman</option>
                  <option value="kemang">Mirayya Kemang</option>
                  <option value="pik">Mirayya PIK</option>
                  <option value="kelapa_gading">Mirayya Kelapa Gading</option>
                  <option value="bintaro">Mirayya Bintaro</option>
                </select>
                <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
                  <option value="this_month">Bulan Ini</option>
                  <option value="last_month">Bulan Lalu</option>
                  <option value="this_year">Tahun Ini</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Karyawan</th>
                      <th className="px-6 py-4">Gaji Pokok</th>
                      <th className="px-6 py-4 text-emerald-600">Tunjangan</th>
                      <th className="px-6 py-4 text-rose-600">Potongan</th>
                      <th className="px-6 py-4 font-semibold text-slate-800">Total Bersih</th>
                      <th className="px-6 py-4 text-center">Status Slip</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((pr) => (
                      <tr key={pr.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 whitespace-nowrap">{pr.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5 whitespace-nowrap">{pr.role} • {pr.branch}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{pr.baseSalary}</td>
                        <td className="px-6 py-4 text-emerald-600 whitespace-nowrap">+{pr.allowance}</td>
                        <td className="px-6 py-4 text-rose-600 whitespace-nowrap">-{pr.deduction}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{pr.net}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {pr.status === 'Generated' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Tersedia
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                              Belum Dibuat
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {pr.status === 'Generated' ? (
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-rose-50 text-xs h-8">
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Unduh Slip
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-rose-50 text-xs h-8">
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Generate Slip
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
                <div className="text-sm text-slate-500">
                  Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, payrollData.length)}</span> dari <span className="font-medium text-slate-700">{payrollData.length}</span> data
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
        </TabsContent>
        
        <TabsContent value="riwayat" className="mt-4">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Riwayat Payroll Belum Tersedia</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Sistem belum memiliki data riwayat payroll untuk periode sebelumnya. Data akan muncul di sini setelah payroll bulan ini diselesaikan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
