"use client";

import React, { useState } from "react";
import { Search, MapPin, Store, MoreVertical, ExternalLink, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon, Phone, Users, Edit, UserPlus, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockBranches = [
  { id: "BR-01", name: "Cabang Pusat", address: "Jl. Sudirman No. 123, Jakarta", manager: "Andi Saputra", employees: 12, performance: 104, target: 120000000, omzet: 125000000 },
  { id: "BR-02", name: "Cabang Utara", address: "Mall Kelapa Gading, Lt 2", manager: "Budi Santoso", employees: 8, performance: 94, target: 90000000, omzet: 85000000 },
  { id: "BR-03", name: "Cabang Selatan", address: "Pondok Indah Mall, Lt 1", manager: "Citra Lestari", employees: 9, performance: 118, target: 80000000, omzet: 95000000 },
  { id: "BR-04", name: "Cabang Timur", address: "Jl. Pemuda No. 45, Jakarta", manager: "Dewi Purnamasari", employees: 10, performance: 104, target: 105000000, omzet: 110000000 },
  { id: "BR-05", name: "Cabang Barat", address: "Central Park Mall, Lt UG", manager: "Eko Pratama", employees: 7, performance: 93, target: 75000000, omzet: 70000000 },
  { id: "BR-06", name: "Cabang Baru", address: "AEON Mall BSD, Lt 1", manager: "Fina Wijaya", employees: 5, performance: 90, target: 50000000, omzet: 45000000 },
  { id: "BR-07", name: "Cabang Bekasi", address: "Summarecon Mall Bekasi", manager: "Gilang Ramadhan", employees: 11, performance: 105, target: 95000000, omzet: 100000000 },
  { id: "BR-08", name: "Cabang Depok", address: "Margocity Lt 1", manager: "Hana Salsabila", employees: 6, performance: 88, target: 60000000, omzet: 53000000 },
  { id: "BR-09", name: "Cabang Bogor", address: "Botani Square", manager: "Irfan Hakim", employees: 9, performance: 110, target: 85000000, omzet: 93500000 },
  { id: "BR-10", name: "Cabang Tangerang", address: "Supermal Karawaci", manager: "Joko Susilo", employees: 14, performance: 115, target: 110000000, omzet: 126500000 },
  { id: "BR-11", name: "Cabang Senayan", address: "Senayan City Lt UG", manager: "Kartika Putri", employees: 10, performance: 102, target: 130000000, omzet: 132600000 },
  { id: "BR-12", name: "Cabang Menteng", address: "Grand Indonesia Lt 2", manager: "Lukman Hakim", employees: 15, performance: 120, target: 150000000, omzet: 180000000 },
  { id: "BR-13", name: "Cabang Pluit", address: "Pluit Village", manager: "Maya Sari", employees: 7, performance: 95, target: 70000000, omzet: 66500000 },
  { id: "BR-14", name: "Cabang Puri", address: "Puri Indah Mall", manager: "Nadia Vega", employees: 8, performance: 98, target: 85000000, omzet: 83300000 },
  { id: "BR-15", name: "Cabang Cibubur", address: "Trans Studio Mall Cibubur", manager: "Oky Setiawan", employees: 6, performance: 108, target: 65000000, omzet: 70200000 },
];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function OwnerCabangPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedCabang, setSelectedCabang] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (branch: any) => {
    setSelectedCabang({ ...branch, phone: "021-555-" + branch.id.replace(/\D/g,'') + "00", status: branch.performance >= 100 ? "Aktif" : "Perlu Perhatian" });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCabang(null), 300);
  };
  
  const totalPages = Math.ceil(mockBranches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = mockBranches.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/owner" className="hover:text-pink-600 transition-colors">Dashboard Owner</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Data Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari cabang..." 
              className="pl-9 w-full bg-white border-slate-200 rounded-xl"
            />
          </div>
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <Button className="bg-[#B76E79] hover:bg-[#9A5A66] text-white rounded-xl py-2.5 px-4 w-full sm:w-auto">
            <Store className="w-4 h-4 mr-2" />
            Tambah
          </Button>
        </div>
      </div>

      <Card className="border-2 border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Cabang</th>
                  <th className="px-6 py-4">Kepala Toko</th>
                  <th className="px-6 py-4">Alamat</th>
                  <th className="px-6 py-4 text-center">Jumlah Karyawan</th>
                  <th className="px-6 py-4 text-right">Target & Omzet (Bulan Ini)</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((branch) => (
                  <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#F3D3D3] text-[#B76E79] flex items-center justify-center font-bold mr-3">
                          {branch.name.charAt(7) || 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{branch.name}</div>
                          <div className="text-xs text-slate-500">{branch.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{branch.manager}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-slate-600 max-w-[200px]">
                        <MapPin className="w-4 h-4 mr-1.5 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate" title={branch.address}>{branch.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {branch.employees} orang
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-slate-800">{formatRupiah(branch.omzet)}</div>
                      <div className="text-xs mt-0.5 flex items-center justify-end">
                        <span className="text-slate-500 mr-2">Target: {formatRupiah(branch.target)}</span>
                        <span className={`font-bold ${branch.performance >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ({branch.performance}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => openModal(branch)} variant="outline" size="sm" className="h-8 text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-primary hover:border-pink-200">
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          Detail
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
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, mockBranches.length)}</span> dari <span className="font-medium text-slate-700">{mockBranches.length}</span> data
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

      {/* Modal Detail Cabang */}
      <AnimatePresence>
        {isModalOpen && selectedCabang && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Detail Cabang</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedCabang.id}</p>
                </div>
                <button 
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4 pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-[#F3D3D3] text-[#B76E79] flex items-center justify-center font-bold text-2xl shadow-sm">
                    {selectedCabang.name.charAt(7) || 'C'}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedCabang.name}</h2>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      selectedCabang.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                    }`}>
                      {selectedCabang.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center text-slate-500 mb-1.5">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Karyawan</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedCabang.employees} Orang</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center text-slate-500 mb-1.5">
                      <Phone className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Telepon</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedCabang.phone}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-start text-slate-500 mb-1.5">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5" />
                    <span className="text-xs font-medium">Alamat Lengkap</span>
                  </div>
                  <p className="font-semibold text-slate-800 pl-6">{selectedCabang.address}</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="flex-col h-auto py-3 gap-2 border-slate-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200">
                    <Edit className="w-4 h-4" />
                    <span className="text-xs">Edit Info</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-3 gap-2 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                    <UserPlus className="w-4 h-4" />
                    <span className="text-xs">Alokasi HR</span>
                  </Button>
                  <Button variant="outline" className="flex-col h-auto py-3 gap-2 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                    <Power className="w-4 h-4" />
                    <span className="text-xs">Nonaktifkan</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
