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
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isAlokasiModalOpen, setIsAlokasiModalOpen] = React.useState(false);
  const [isNonaktifModalOpen, setIsNonaktifModalOpen] = React.useState(false);

  const openModal = (branch: any) => {
    setSelectedCabang(branch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedCabang(null), 300);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const openEditModal = () => { setIsModalOpen(false); setTimeout(() => setIsEditModalOpen(true), 300); };
  const closeEditModal = () => { setIsEditModalOpen(false); setTimeout(() => setSelectedCabang(null), 300); };

  const openAlokasiModal = () => { setIsModalOpen(false); setTimeout(() => setIsAlokasiModalOpen(true), 300); };
  const closeAlokasiModal = () => { setIsAlokasiModalOpen(false); setTimeout(() => setSelectedCabang(null), 300); };

  const openNonaktifModal = () => { setIsModalOpen(false); setTimeout(() => setIsNonaktifModalOpen(true), 300); };
  const closeNonaktifModal = () => { setIsNonaktifModalOpen(false); setTimeout(() => setSelectedCabang(null), 300); };

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
          <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
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
              <div className="p-6 space-y-6 overflow-y-auto">
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
                  <Button onClick={openEditModal} variant="outline" className="flex-col h-auto py-3 gap-2 border-slate-200 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200">
                    <Edit className="w-4 h-4" />
                    <span className="text-xs">Edit Info</span>
                  </Button>
                  <Button onClick={openAlokasiModal} variant="outline" className="flex-col h-auto py-3 gap-2 border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                    <UserPlus className="w-4 h-4" />
                    <span className="text-xs">Alokasi HR</span>
                  </Button>
                  <Button onClick={openNonaktifModal} variant="outline" className="flex-col h-auto py-3 gap-2 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                    <Power className="w-4 h-4" />
                    <span className="text-xs">Nonaktifkan</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Tambah Cabang */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeAddModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Tambah Cabang Baru</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Masukkan detail informasi cabang baru</p>
                </div>
                <button 
                  onClick={closeAddModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nama Cabang</label>
                  <Input placeholder="Contoh: Mirayya Blok M" className="border-slate-200 focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nomor Telepon</label>
                  <Input placeholder="Contoh: 021-1234567" className="border-slate-200 focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                  <textarea 
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                    placeholder="Masukkan alamat lengkap cabang"
                  ></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                    <option value="Aktif">Aktif</option>
                    <option value="Renovasi">Renovasi</option>
                    <option value="Tutup">Tutup Sementara</option>
                  </select>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button variant="outline" onClick={closeAddModal} className="border-slate-200 text-slate-600 hover:bg-slate-100">
                  Batal
                </Button>
                <Button onClick={closeAddModal} className="bg-primary hover:bg-primary/90 text-white">
                  Simpan Cabang
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Edit Cabang */}
      <AnimatePresence>
        {isEditModalOpen && selectedCabang && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeEditModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Edit Info Cabang</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedCabang.id}</p>
                </div>
                <button 
                  onClick={closeEditModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nama Cabang</label>
                  <Input defaultValue={selectedCabang.name} className="border-slate-200 focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Nomor Telepon</label>
                  <Input defaultValue={selectedCabang.phone} className="border-slate-200 focus-visible:ring-primary" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
                  <textarea 
                    className="w-full min-h-[100px] px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                    defaultValue={selectedCabang.address}
                  ></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button variant="outline" onClick={closeEditModal} className="border-slate-200 text-slate-600 hover:bg-slate-100">
                  Batal
                </Button>
                <Button onClick={closeEditModal} className="bg-primary hover:bg-primary/90 text-white">
                  Simpan Perubahan
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Alokasi HR */}
      <AnimatePresence>
        {isAlokasiModalOpen && selectedCabang && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeAlokasiModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-50 overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Alokasi HR Cabang</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedCabang.name}</p>
                </div>
                <button 
                  onClick={closeAlokasiModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="text-xs text-emerald-600 font-medium">Total Karyawan Dialokasikan</p>
                      <p className="font-bold text-emerald-800">{selectedCabang.employees} Orang</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full">
                    <Plus className="w-4 h-4 mr-1" /> Tambah
                  </Button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-800">Daftar Karyawan</h4>
                  <div className="border border-slate-200 rounded-xl divide-y divide-slate-100">
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-slate-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-medium text-xs">
                            {idx === 0 ? 'SL' : 'ST'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{idx === 0 ? 'Andi Saputra' : idx === 1 ? 'Budi Santoso' : 'Citra Lestari'}</p>
                            <p className="text-xs text-slate-500">{idx === 0 ? 'Store Leader' : 'Staff Toko'}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-pink-600 h-8 text-xs">Mutasi</Button>
                      </div>
                    ))}
                    <div className="p-3 text-center">
                      <Button variant="link" size="sm" className="text-pink-600 text-xs">Lihat Semua ({selectedCabang.employees})</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button variant="outline" onClick={closeAlokasiModal} className="border-slate-200 text-slate-600 hover:bg-slate-100">
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Nonaktifkan */}
      <AnimatePresence>
        {isNonaktifModalOpen && selectedCabang && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeNonaktifModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-rose-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Power className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-rose-800">Ubah Status Cabang</h3>
                    <p className="text-xs font-medium text-rose-600 mt-0.5">{selectedCabang.name}</p>
                  </div>
                </div>
                <button 
                  onClick={closeNonaktifModal}
                  className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center hover:bg-rose-200 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Anda akan mengubah status operasional cabang <strong>{selectedCabang.name}</strong>. Silakan pilih status baru dan isi alasannya.
                </p>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Status Baru</label>
                  <select className="w-full px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white">
                    <option value="Renovasi">Renovasi (Tutup Sementara)</option>
                    <option value="Tutup">Tutup Permanen</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Alasan / Keterangan</label>
                  <textarea 
                    className="w-full min-h-[80px] px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50 bg-white"
                    placeholder="Contoh: Sedang renovasi perbaikan atap"
                  ></textarea>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                <Button variant="outline" onClick={closeNonaktifModal} className="border-slate-200 text-slate-600 hover:bg-slate-100">
                  Batal
                </Button>
                <Button onClick={closeNonaktifModal} className="bg-rose-600 hover:bg-rose-700 text-white">
                  Konfirmasi Status
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
