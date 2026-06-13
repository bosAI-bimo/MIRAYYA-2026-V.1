"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

const employees = [
  { id: "EMP-001", name: "Siti Rahma", email: "siti.hr@mirayya.com", role: "HR Manager", branch: "Pusat", status: "Aktif" },
  { id: "EMP-002", name: "Budi Santoso", email: "budi.acc@mirayya.com", role: "Accounting", branch: "Pusat", status: "Aktif" },
  { id: "EMP-003", name: "Anita Wijaya", email: "anita.ba@mirayya.com", role: "BA", branch: "Mirayya Sudirman", status: "Aktif" },
  { id: "EMP-004", name: "Rina Marlina", email: "rina.sl@mirayya.com", role: "Store Leader", branch: "Mirayya PIK", status: "Aktif" },
  { id: "EMP-005", name: "Dina Mariana", email: "dina.ba@mirayya.com", role: "BA", branch: "Mirayya Kelapa Gading", status: "Cuti" },
  { id: "EMP-006", name: "Sari Indah", email: "sari.ba@mirayya.com", role: "BA", branch: "Mirayya Kemang", status: "Nonaktif" },
  { id: "EMP-007", name: "Tono Mulyono", email: "tono@mirayya.com", role: "Security", branch: "Mirayya Sudirman", status: "Aktif" },
  { id: "EMP-008", name: "Agus Salim", email: "agus@mirayya.com", role: "Store Leader", branch: "Mirayya Kemang", status: "Aktif" },
  { id: "EMP-009", name: "Dewi Lestari", email: "dewi.l@mirayya.com", role: "BA", branch: "Mirayya PIK", status: "Aktif" },
  { id: "EMP-010", name: "Fajar Siddiq", email: "fajar@mirayya.com", role: "Gudang", branch: "Pusat", status: "Aktif" },
  { id: "EMP-011", name: "Gita Savitri", email: "gita@mirayya.com", role: "BA", branch: "Mirayya Kelapa Gading", status: "Aktif" },
  { id: "EMP-012", name: "Hadi Kusuma", email: "hadi@mirayya.com", role: "Kasir", branch: "Mirayya Bintaro", status: "Aktif" },
  { id: "EMP-013", name: "Intan Nuraini", email: "intan@mirayya.com", role: "BA", branch: "Mirayya Sudirman", status: "Cuti" },
  { id: "EMP-014", name: "Joko Supriyanto", email: "joko@mirayya.com", role: "Security", branch: "Mirayya PIK", status: "Aktif" },
  { id: "EMP-015", name: "Kirana Larasati", email: "kirana@mirayya.com", role: "Store Leader", branch: "Mirayya Bintaro", status: "Aktif" },
];

export default function KaryawanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = employees.slice(startIndex, startIndex + itemsPerPage);

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
                  <span className="text-slate-900">Data Karyawan</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Karyawan</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Daftar Karyawan</CardTitle>
            <CardDescription>Semua karyawan aktif dan nonaktif di seluruh cabang.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama atau ID..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary h-9"
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
                  <th className="px-6 py-4">ID Karyawan</th>
                  <th className="px-6 py-4">Nama & Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-medium">{emp.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{emp.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{emp.branch}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        emp.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        emp.status === 'Cuti' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-rose-50">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, employees.length)}</span> dari <span className="font-medium text-slate-700">{employees.length}</span> data
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
