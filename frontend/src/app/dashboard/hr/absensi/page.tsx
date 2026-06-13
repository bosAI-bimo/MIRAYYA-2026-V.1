"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Calendar, MapPin, Camera, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const attendanceData = [
  { id: "ATT-001", date: "11 Jun 2026", name: "Siti Rahma", branch: "Pusat", timeIn: "08:45", timeOut: "17:15", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-002", date: "11 Jun 2026", name: "Anita Wijaya", branch: "Mirayya Sudirman", timeIn: "08:50", timeOut: "-", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-003", date: "11 Jun 2026", name: "Rina Marlina", branch: "Mirayya PIK", timeIn: "09:15", timeOut: "-", status: "Terlambat", photoStatus: "Valid", gpsStatus: "Luar Area" },
  { id: "ATT-004", date: "11 Jun 2026", name: "Dina Mariana", branch: "Mirayya Kelapa Gading", timeIn: "-", timeOut: "-", status: "Cuti", photoStatus: "-", gpsStatus: "-" },
  { id: "ATT-005", date: "10 Jun 2026", name: "Budi Santoso", branch: "Pusat", timeIn: "08:55", timeOut: "17:05", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-006", date: "10 Jun 2026", name: "Anita Wijaya", branch: "Mirayya Sudirman", timeIn: "08:58", timeOut: "17:20", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-007", date: "10 Jun 2026", name: "Tono Mulyono", branch: "Mirayya Sudirman", timeIn: "08:50", timeOut: "17:10", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-008", date: "10 Jun 2026", name: "Agus Salim", branch: "Mirayya Kemang", timeIn: "09:05", timeOut: "17:00", status: "Terlambat", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-009", date: "10 Jun 2026", name: "Dewi Lestari", branch: "Mirayya PIK", timeIn: "08:40", timeOut: "17:30", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-010", date: "09 Jun 2026", name: "Siti Rahma", branch: "Pusat", timeIn: "08:55", timeOut: "17:15", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-011", date: "09 Jun 2026", name: "Budi Santoso", branch: "Pusat", timeIn: "-", timeOut: "-", status: "Cuti", photoStatus: "-", gpsStatus: "-" },
  { id: "ATT-012", date: "09 Jun 2026", name: "Fajar Siddiq", branch: "Pusat", timeIn: "08:45", timeOut: "17:00", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-013", date: "09 Jun 2026", name: "Gita Savitri", branch: "Mirayya Kelapa Gading", timeIn: "08:50", timeOut: "17:10", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-014", date: "08 Jun 2026", name: "Hadi Kusuma", branch: "Mirayya Bintaro", timeIn: "09:20", timeOut: "17:00", status: "Terlambat", photoStatus: "Valid", gpsStatus: "Valid" },
  { id: "ATT-015", date: "08 Jun 2026", name: "Intan Nuraini", branch: "Mirayya Sudirman", timeIn: "08:40", timeOut: "17:05", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
];

export default function AbsensiPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedAbsensi, setSelectedAbsensi] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (record: any) => {
    setSelectedAbsensi(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedAbsensi(null), 300);
  };

  const totalPages = Math.ceil(attendanceData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = attendanceData.slice(startIndex, startIndex + itemsPerPage);

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
                  <span className="text-slate-900">Riwayat Absensi</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Riwayat Absensi</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="text-slate-600 border-slate-200 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Laporan
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Log Kehadiran</CardTitle>
            <CardDescription>Menampilkan riwayat absensi terbaru.</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2">
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
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Nama Karyawan</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4 text-center">In / Out</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Verifikasi</th>
                  <th className="px-6 py-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{record.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">{record.name}</td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{record.branch}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-medium text-slate-700">{record.timeIn}</span>
                        <span className="text-slate-400">-</span>
                        <span className="font-medium text-slate-700">{record.timeOut}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        record.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        record.status === 'Terlambat' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.status !== 'Cuti' ? (
                        <div className="flex items-center space-x-3 text-xs">
                          <div className={`flex items-center ${record.photoStatus === 'Valid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <Camera className="w-3.5 h-3.5 mr-1" />
                            {record.photoStatus}
                          </div>
                          <div className={`flex items-center ${record.gpsStatus === 'Valid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {record.gpsStatus}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button onClick={() => openModal(record)} variant="ghost" size="sm" className="text-primary hover:bg-rose-50 hover:text-primary/90 text-xs h-8">
                        Lihat Bukti
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
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, attendanceData.length)}</span> dari <span className="font-medium text-slate-700">{attendanceData.length}</span> data
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

      {/* Modal Bukti Absensi */}
      <AnimatePresence>
        {isModalOpen && selectedAbsensi && (
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Detail Absensi</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedAbsensi.name} • {selectedAbsensi.date}</p>
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
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500">Cabang</p>
                    <p className="font-semibold text-slate-800">{selectedAbsensi.branch}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-xs text-slate-500">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        selectedAbsensi.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        selectedAbsensi.status === 'Terlambat' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {selectedAbsensi.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Check In</p>
                    <p className="font-bold text-slate-800">{selectedAbsensi.timeIn}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 mb-1">Check Out</p>
                    <p className="font-bold text-slate-800">{selectedAbsensi.timeOut}</p>
                  </div>
                </div>

                {selectedAbsensi.status !== 'Cuti' && (
                  <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-slate-200 border-dashed gap-3">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-700">Foto Bukti Kehadiran</p>
                      <p className="text-xs text-emerald-600 font-medium mt-1">Status GPS: {selectedAbsensi.gpsStatus}</p>
                    </div>
                    <Button variant="outline" className="mt-2 border-slate-200 text-slate-700 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 rounded-xl transition-all shadow-sm">
                      Lihat Foto Penuh
                    </Button>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80">
                <Button onClick={closeModal} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 rounded-xl shadow-sm transition-all cursor-pointer">
                  Tutup Detail
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
