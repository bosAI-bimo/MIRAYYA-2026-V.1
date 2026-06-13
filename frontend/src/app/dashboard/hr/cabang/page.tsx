"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, MoreHorizontal, Phone, Users, ChevronRight, X as XIcon, Edit, UserPlus, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function CabangPage() {
  const branches = [
    { id: "BR-001", name: "Kantor Pusat", address: "Jl. Sudirman No. 1, Jakarta", phone: "021-555-0100", employees: 12, status: "Aktif" },
    { id: "BR-002", name: "Mirayya Sudirman", address: "Mall Sudirman Lt. G, Jakarta", phone: "021-555-0101", employees: 8, status: "Aktif" },
    { id: "BR-003", name: "Mirayya Kemang", address: "Jl. Kemang Raya No. 15, Jakarta", phone: "021-555-0102", employees: 10, status: "Aktif" },
    { id: "BR-004", name: "Mirayya PIK", address: "PIK Avenue Lt. 1, Jakarta", phone: "021-555-0103", employees: 9, status: "Aktif" },
    { id: "BR-005", name: "Mirayya Kelapa Gading", address: "MKG Lt. 2, Jakarta Utara", phone: "021-555-0104", employees: 11, status: "Aktif" },
    { id: "BR-006", name: "Mirayya Bintaro", address: "Bintaro Xchange Lt. G, Tangsel", phone: "021-555-0105", employees: 8, status: "Renovasi" },
  ];

  const [selectedCabang, setSelectedCabang] = React.useState<any>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = (branch: any) => {
    setSelectedCabang(branch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCabang(null), 300);
  };

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
                  <span className="text-slate-900">Data Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Cabang
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Cabang Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">5</div>
            <p className="text-xs text-slate-500 mt-1">Cabang operasional saat ini</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Karyawan Cabang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">46</div>
            <p className="text-xs text-slate-500 mt-1">Tidak termasuk pusat</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Daftar Cabang</CardTitle>
            <CardDescription>Detail alamat, kontak, dan alokasi karyawan.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama cabang..."
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
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <div key={branch.id} className="border-2 border-slate-200 rounded-lg p-5 hover:border-primary/40 transition-colors bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{branch.name}</h3>
                      <p className="text-xs text-slate-500">{branch.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-2">{branch.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span>{branch.employees} Karyawan dialokasikan</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    branch.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {branch.status}
                  </span>
                  <Button onClick={() => openModal(branch)} variant="outline" size="sm" className="text-xs h-8 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-primary hover:border-pink-200">
                    Lihat Detail
                  </Button>
                </div>
              </div>
            ))}
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
                    {selectedCabang.name.charAt(8) || 'C'}
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
