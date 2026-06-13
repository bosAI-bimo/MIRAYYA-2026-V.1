"use client";

import React, { useState } from "react";
import { Search, UserPlus, Filter, ShieldCheck, Mail, MapPin, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon, UserCircle, Briefcase, Key } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockEmployees = [
  { id: "EMP-001", name: "Siti Rahma", role: "HR Manager", branch: "Head Office", email: "siti.hr@mirayya.com", status: "Aktif" },
  { id: "EMP-002", name: "Budi Santoso", role: "Kepala Toko", branch: "Cabang Utara", email: "budi.s@mirayya.com", status: "Aktif" },
  { id: "EMP-003", name: "Dina Mariana", role: "Beauty Advisor", branch: "Cabang Pusat", email: "dina.m@mirayya.com", status: "Aktif" },
  { id: "EMP-004", name: "Ahmad Fauzi", role: "Accounting", branch: "Head Office", email: "ahmad.f@mirayya.com", status: "Aktif" },
  { id: "EMP-005", name: "Rina Nose", role: "Beauty Advisor", branch: "Cabang Selatan", email: "rina.n@mirayya.com", status: "Aktif" },
  { id: "EMP-006", name: "Joko Anwar", role: "Kepala Toko", branch: "Cabang Timur", email: "joko.a@mirayya.com", status: "Cuti" },
  { id: "EMP-007", name: "Lestari", role: "Beauty Advisor", branch: "Cabang Barat", email: "lestari@mirayya.com", status: "Nonaktif" },
  { id: "EMP-008", name: "Agus Supriyanto", role: "Kepala Toko", branch: "Cabang Pusat", email: "agus.s@mirayya.com", status: "Aktif" },
  { id: "EMP-009", name: "Nina Marlina", role: "Beauty Advisor", branch: "Cabang Utara", email: "nina.m@mirayya.com", status: "Aktif" },
  { id: "EMP-010", name: "Rizky Firmansyah", role: "Gudang", branch: "Head Office", email: "rizky.f@mirayya.com", status: "Aktif" },
  { id: "EMP-011", name: "Dewi Safitri", role: "Beauty Advisor", branch: "Cabang Selatan", email: "dewi.s@mirayya.com", status: "Aktif" },
  { id: "EMP-012", name: "Anton Hermawan", role: "Security", branch: "Cabang Timur", email: "anton.h@mirayya.com", status: "Aktif" },
  { id: "EMP-013", name: "Putri Rahayu", role: "Kasir", branch: "Cabang Barat", email: "putri.r@mirayya.com", status: "Cuti" },
  { id: "EMP-014", name: "Hendra Gunawan", role: "Accounting", branch: "Head Office", email: "hendra.g@mirayya.com", status: "Aktif" },
  { id: "EMP-015", name: "Siska Saraswati", role: "Beauty Advisor", branch: "Cabang Pusat", email: "siska.s@mirayya.com", status: "Aktif" },
];

export default function OwnerKaryawanPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (emp: any) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEmployee(null), 300);
  };

  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

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
                  <span className="text-slate-900">Data Karyawan</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Karyawan</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all text-slate-700">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-2.5 px-4 w-full sm:w-auto">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </Button>
        </div>
      </div>

      <Card className="border-2 border-slate-200 border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari berdasarkan nama, posisi, atau cabang..." 
              className="pl-9 w-full bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Nama & ID</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedData.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mr-3 border border-border">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{emp.name}</div>
                          <div className="text-xs text-muted-foreground">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-foreground">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-muted-foreground" />
                        {emp.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-foreground">
                        <MapPin className="w-4 h-4 mr-1.5 text-muted-foreground" />
                        {emp.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-foreground">
                        <Mail className="w-4 h-4 mr-1.5 text-muted-foreground" />
                        {emp.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={emp.status === 'Aktif' ? 'success' : emp.status === 'Cuti' ? 'warning' : 'outline'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button onClick={() => openModal(emp)} variant="outline" size="sm" className="h-8 text-primary border-primary hover:bg-primary/10 hover:text-primary">
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      Tidak ada karyawan yang cocok dengan pencarian &quot;{searchTerm}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredEmployees.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30 rounded-b-lg">
              <div className="text-sm text-muted-foreground">
                Menampilkan <span className="font-medium text-foreground">{startIndex + 1}</span> - <span className="font-medium text-foreground">{Math.min(startIndex + itemsPerPage, filteredEmployees.length)}</span> dari <span className="font-medium text-foreground">{filteredEmployees.length}</span> data
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
                
                <div className="flex items-center justify-center text-sm font-medium px-3 text-muted-foreground">
                  Halaman {currentPage} dari {totalPages}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Detail Karyawan */}
      <AnimatePresence>
        {isModalOpen && selectedEmployee && (
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
                  <h3 className="text-xl font-bold text-slate-800">Detail Karyawan</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedEmployee.id}</p>
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
                  <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-2xl border-2 border-slate-200">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">{selectedEmployee.name}</h2>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium mt-1 ${
                      selectedEmployee.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      selectedEmployee.status === 'Cuti' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center text-slate-500 mb-1.5">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Jabatan</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedEmployee.role}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center text-slate-500 mb-1.5">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Penempatan</span>
                    </div>
                    <p className="font-bold text-slate-800">{selectedEmployee.branch}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div>
                    <div className="flex items-center text-slate-500 mb-1">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-xs font-medium">Email Kantor</span>
                    </div>
                    <p className="font-medium text-slate-800 pl-6">{selectedEmployee.email}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800">
                    <Key className="w-4 h-4 mr-2" /> Reset Password
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200">
                    <UserCircle className="w-4 h-4 mr-2" /> Edit Profil
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
