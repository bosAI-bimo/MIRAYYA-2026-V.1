"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Search, Plus, MoreHorizontal, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Users, UserCheck, UserMinus, UserX, ArrowUpRight, ArrowDownRight, Eye, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

const employees = [
  { id: "EMP-001", name: "Siti Rahma", email: "siti.hr@mirayya.com", phone: "0812-1111-2222", role: "HR Manager", branch: "Pusat", status: "Aktif" },
  { id: "EMP-002", name: "Budi Santoso", email: "budi.acc@mirayya.com", phone: "0812-2222-3333", role: "Accounting", branch: "Pusat", status: "Aktif" },
  { id: "EMP-003", name: "Anita Wijaya", email: "anita.ba@mirayya.com", phone: "0813-3333-4444", role: "BA", branch: "Mirayya Sudirman", status: "Aktif" },
  { id: "EMP-004", name: "Rina Marlina", email: "rina.sl@mirayya.com", phone: "0856-4444-5555", role: "Store Leader", branch: "Mirayya PIK", status: "Aktif" },
  { id: "EMP-005", name: "Dina Mariana", email: "dina.ba@mirayya.com", phone: "0812-5555-6666", role: "BA", branch: "Mirayya Kelapa Gading", status: "Cuti" },
  { id: "EMP-006", name: "Sari Indah", email: "sari.ba@mirayya.com", phone: "0811-6666-7777", role: "BA", branch: "Mirayya Kemang", status: "Nonaktif" },
  { id: "EMP-007", name: "Tono Mulyono", email: "tono@mirayya.com", phone: "0812-7777-8888", role: "Security", branch: "Mirayya Sudirman", status: "Aktif" },
  { id: "EMP-008", name: "Agus Salim", email: "agus@mirayya.com", phone: "0815-8888-9999", role: "Store Leader", branch: "Mirayya Kemang", status: "Aktif" },
  { id: "EMP-009", name: "Dewi Lestari", email: "dewi.l@mirayya.com", phone: "0813-9999-0000", role: "BA", branch: "Mirayya PIK", status: "Aktif" },
  { id: "EMP-010", name: "Fajar Siddiq", email: "fajar@mirayya.com", phone: "0812-0000-1111", role: "Gudang", branch: "Pusat", status: "Aktif" },
  { id: "EMP-011", name: "Gita Savitri", email: "gita@mirayya.com", phone: "0857-1234-5678", role: "BA", branch: "Mirayya Kelapa Gading", status: "Aktif" },
  { id: "EMP-012", name: "Hadi Kusuma", email: "hadi@mirayya.com", phone: "0812-8765-4321", role: "Kasir", branch: "Mirayya Bintaro", status: "Aktif" },
  { id: "EMP-013", name: "Intan Nuraini", email: "intan@mirayya.com", phone: "0811-2345-6789", role: "BA", branch: "Mirayya Sudirman", status: "Cuti" },
  { id: "EMP-014", name: "Joko Supriyanto", email: "joko@mirayya.com", phone: "0813-9876-5432", role: "Security", branch: "Mirayya PIK", status: "Aktif" },
  { id: "EMP-015", name: "Kirana Larasati", email: "kirana@mirayya.com", phone: "0812-5432-1987", role: "Store Leader", branch: "Mirayya Bintaro", status: "Aktif" },
];

export default function KaryawanPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      // Make sure we only close if the click is outside the dropdown container
      if (target && target.closest && target.closest('.dropdown-container')) return;
      setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const totalPages = Math.ceil(employees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = employees.slice(startIndex, startIndex + itemsPerPage);

  const totalKaryawan = employees.length;
  const aktifKaryawan = employees.filter(e => e.status === "Aktif").length;
  const cutiKaryawan = employees.filter(e => e.status === "Cuti").length;
  const nonaktifKaryawan = employees.filter(e => e.status === "Nonaktif").length;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="space-y-6 lg:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
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
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Data Karyawan</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button 
            className="bg-pink-600 hover:bg-pink-700 text-white w-full sm:w-auto shadow-sm transition-all"
            onClick={() => setAddModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Karyawan</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Users className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{totalKaryawan}</div>
              <p className="text-xs text-slate-500 mt-1 font-medium">Di seluruh cabang</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Karyawan Aktif</CardTitle>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><UserCheck className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{aktifKaryawan}</div>
              <p className="text-xs text-emerald-600 flex items-center mt-1 font-medium">
                <ArrowUpRight className="w-3 h-3 mr-1" /> {(aktifKaryawan / totalKaryawan * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Sedang Cuti</CardTitle>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><UserMinus className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{cutiKaryawan}</div>
              <p className="text-xs text-amber-600 mt-1 font-medium flex items-center">
                <ArrowDownRight className="w-3 h-3 mr-1" /> {(cutiKaryawan / totalKaryawan * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="h-full">
          <Card className="border-2 border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Nonaktif</CardTitle>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><UserX className="w-4 h-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{nonaktifKaryawan}</div>
              <p className="text-xs text-rose-500 mt-1 font-medium flex items-center">
                {(nonaktifKaryawan / totalKaryawan * 100).toFixed(1)}% dari total
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
      <Card className="border-2 shadow-sm border-slate-200 hover:border-pink-200 hover:shadow-md transition-all duration-300">
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
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-pink-500 focus-visible:ring-offset-0 focus-visible:border-pink-500 h-10 rounded-xl"
              />
            </div>
            <select className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[160px] shadow-sm transition-all">
              <option value="all">Semua Cabang</option>
              <option value="sudirman">Mirayya Sudirman</option>
              <option value="kemang">Mirayya Kemang</option>
              <option value="pik">Mirayya PIK</option>
              <option value="kelapa_gading">Mirayya Kelapa Gading</option>
              <option value="bintaro">Mirayya Bintaro</option>
            </select>
            <select className="px-4 py-2 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
              <option value="this_month">Bulan Ini</option>
              <option value="last_month">Bulan Lalu</option>
              <option value="this_year">Tahun Ini</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full overflow-x-auto md:overflow-visible pb-16">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID Karyawan</th>
                  <th className="px-6 py-4">Nama & Email</th>
                  <th className="px-6 py-4">No. HP</th>
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
                    <td className="px-6 py-4 text-slate-600 font-medium">
                      {emp.phone}
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
                    <td className="px-6 py-4 text-right relative dropdown-container">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-slate-500 hover:text-pink-600 hover:bg-pink-50"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveDropdown(prev => prev === emp.id ? null : emp.id);
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4 pointer-events-none" />
                      </Button>

                      {/* Dropdown Menu */}
                      {activeDropdown === emp.id && (
                        <div className="absolute right-6 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-[999] text-left overflow-hidden">
                          <button 
                            className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-pink-600 flex items-center transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedEmployee(emp);
                              setDetailModalOpen(true);
                              setActiveDropdown(null);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-2" /> Lihat Detail
                          </button>
                          <button 
                            className="w-full px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-pink-600 flex items-center transition-colors"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedEmployee(emp);
                              setEditModalOpen(true);
                              setActiveDropdown(null);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" /> Edit Karyawan
                          </button>
                          <div className="h-px bg-slate-100 my-1 mx-2" />
                          <button className="w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 flex items-center transition-colors">
                            <Trash2 className="w-4 h-4 mr-2" /> Nonaktifkan
                          </button>
                        </div>
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
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, employees.length)}</span> dari <span className="font-medium text-slate-700">{employees.length}</span> data
            </div>
            <div className="flex items-center gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(1)} 
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100"
              >
                <ChevronsLeft className="h-4 w-4 text-slate-600" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100"
              >
                <ChevronLeft className="h-4 w-4 text-slate-600" />
              </Button>
              
              <div className="flex items-center justify-center text-sm font-medium px-3 text-slate-600 bg-white border border-slate-200 rounded-md h-8">
                Halaman {currentPage} dari {totalPages}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100"
              >
                <ChevronRight className="h-4 w-4 text-slate-600" />
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(totalPages)} 
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 border-slate-200 hover:bg-slate-100"
              >
                <ChevronsRight className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* Detail Modal */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-800">Detail Karyawan</DialogTitle>
            <DialogDescription className="text-slate-500">
              Informasi lengkap tentang karyawan.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-6 py-4">
              <div className="flex items-center space-x-4 mb-2">
                <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center text-2xl font-bold shadow-sm">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-800">{selectedEmployee.name}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedEmployee.id}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <span className="text-left text-sm font-medium text-slate-500 col-span-1">Email</span>
                    <span className="col-span-3 text-sm font-bold text-slate-800">{selectedEmployee.email}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <span className="text-left text-sm font-medium text-slate-500 col-span-1">No. HP</span>
                    <span className="col-span-3 text-sm font-bold text-slate-800">{selectedEmployee.phone}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <span className="text-left text-sm font-medium text-slate-500 col-span-1">Role</span>
                    <span className="col-span-3 text-sm font-bold text-slate-800">{selectedEmployee.role}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4 mb-4">
                    <span className="text-left text-sm font-medium text-slate-500 col-span-1">Cabang</span>
                    <span className="col-span-3 text-sm font-bold text-slate-800">{selectedEmployee.branch}</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <span className="text-left text-sm font-medium text-slate-500 col-span-1">Status</span>
                    <span className="col-span-3 text-sm font-bold text-slate-800">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            selectedEmployee.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            selectedEmployee.status === 'Cuti' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}>
                        {selectedEmployee.status}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end border-t border-slate-100 pt-4 mt-2">
            <Button onClick={() => setDetailModalOpen(false)} className="bg-slate-800 hover:bg-slate-900 text-white font-semibold">Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-6 max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl font-bold text-slate-800">Edit Karyawan</DialogTitle>
            <DialogDescription className="text-slate-500">
              Perbarui data informasi karyawan di sini. Klik simpan saat selesai.
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid gap-4 py-2 mt-2 overflow-y-auto pr-1 flex-grow scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-slate-700 font-semibold">
                  Nama Lengkap
                </Label>
                <Input id="name" defaultValue={selectedEmployee.name} className="focus-visible:ring-pink-500 border-slate-300 font-medium h-10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-slate-700 font-semibold">
                  Alamat Email
                </Label>
                <Input id="email" type="email" defaultValue={selectedEmployee.email} className="focus-visible:ring-pink-500 border-slate-300 font-medium h-10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="text-slate-700 font-semibold">
                  Nomor HP
                </Label>
                <Input id="phone" type="tel" defaultValue={selectedEmployee.phone} className="focus-visible:ring-pink-500 border-slate-300 font-medium h-10" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="text-slate-700 font-semibold">
                  Role (Peran)
                </Label>
                <select id="role" defaultValue={selectedEmployee.role} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 font-medium text-slate-800 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-transparent">
                  <option value="HR Manager">HR Manager</option>
                  <option value="Accounting">Accounting</option>
                  <option value="BA">BA</option>
                  <option value="Store Leader">Store Leader</option>
                  <option value="Security">Security</option>
                  <option value="Gudang">Gudang</option>
                  <option value="Kasir">Kasir</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="branch" className="text-slate-700 font-semibold">
                  Penempatan Cabang
                </Label>
                <select id="branch" defaultValue={selectedEmployee.branch} className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 font-medium text-slate-800 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-transparent">
                  <option value="Pusat">Pusat</option>
                  <option value="Mirayya Sudirman">Mirayya Sudirman</option>
                  <option value="Mirayya PIK">Mirayya PIK</option>
                  <option value="Mirayya Kelapa Gading">Mirayya Kelapa Gading</option>
                  <option value="Mirayya Kemang">Mirayya Kemang</option>
                  <option value="Mirayya Bintaro">Mirayya Bintaro</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter className="sm:justify-end gap-2 border-t border-slate-100 pt-5 mt-2 shrink-0">
            <Button variant="outline" onClick={() => setEditModalOpen(false)} className="font-semibold">Batal</Button>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold" onClick={() => setEditModalOpen(false)}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Modal */}
      <Dialog open={addModalOpen} onOpenChange={setAddModalOpen}>
        <DialogContent className="sm:max-w-[450px] p-6 max-h-[90vh] flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-xl font-bold text-slate-800">Tambah Karyawan</DialogTitle>
            <DialogDescription className="text-slate-500">
              Isi data lengkap karyawan baru di bawah ini.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 mt-2 overflow-y-auto pr-1 flex-grow scrollbar-thin scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
            <div className="grid gap-2">
              <Label htmlFor="add-name" className="text-slate-700 font-semibold">
                Nama Lengkap
              </Label>
              <Input id="add-name" placeholder="Masukkan nama karyawan" className="focus-visible:ring-pink-500 border-slate-300 font-medium h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-email" className="text-slate-700 font-semibold">
                Alamat Email
              </Label>
              <Input id="add-email" type="email" placeholder="contoh@mirayya.com" className="focus-visible:ring-pink-500 border-slate-300 font-medium h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-phone" className="text-slate-700 font-semibold">
                Nomor HP
              </Label>
              <Input id="add-phone" type="tel" placeholder="08xx-xxxx-xxxx" className="focus-visible:ring-pink-500 border-slate-300 font-medium h-10" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-role" className="text-slate-700 font-semibold">
                Role (Peran)
              </Label>
              <select id="add-role" defaultValue="BA" className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 font-medium text-slate-800 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-transparent">
                <option value="HR Manager">HR Manager</option>
                <option value="Accounting">Accounting</option>
                <option value="BA">BA</option>
                <option value="Store Leader">Store Leader</option>
                <option value="Security">Security</option>
                <option value="Gudang">Gudang</option>
                <option value="Kasir">Kasir</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-branch" className="text-slate-700 font-semibold">
                Penempatan Cabang
              </Label>
              <select id="add-branch" defaultValue="Pusat" className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 font-medium text-slate-800 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:border-transparent">
                <option value="Pusat">Pusat</option>
                <option value="Mirayya Sudirman">Mirayya Sudirman</option>
                <option value="Mirayya PIK">Mirayya PIK</option>
                <option value="Mirayya Kelapa Gading">Mirayya Kelapa Gading</option>
                <option value="Mirayya Kemang">Mirayya Kemang</option>
                <option value="Mirayya Bintaro">Mirayya Bintaro</option>
              </select>
            </div>
          </div>
          <DialogFooter className="sm:justify-end gap-2 border-t border-slate-100 pt-5 mt-2 shrink-0">
            <Button variant="outline" onClick={() => setAddModalOpen(false)} className="font-semibold">Batal</Button>
            <Button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold" onClick={() => setAddModalOpen(false)}>Simpan Data</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
