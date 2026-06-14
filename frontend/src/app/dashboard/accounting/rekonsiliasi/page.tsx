"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, AlertTriangle, Building, CreditCard, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon, FileSpreadsheet, RefreshCw } from "lucide-react";
import Link from "next/link";

const rekonsiliasiData = [
  { date: "10 Jun 2026", account: "BCA - 123456789", bank: "Rp 125.500.000", system: "Rp 125.500.000", diff: "Rp 0", status: "match" },
  { date: "10 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 85.200.000", system: "Rp 85.200.000", diff: "Rp 0", status: "match" },
  { date: "09 Jun 2026", account: "BCA - 123456789", bank: "Rp 110.000.000", system: "Rp 110.050.000", diff: "- Rp 50.000", status: "mismatch" },
  { date: "08 Jun 2026", account: "BNI - 456123789", bank: "Rp 45.100.000", system: "Rp 45.100.000", diff: "Rp 0", status: "match" },
  { date: "07 Jun 2026", account: "BCA - 123456789", bank: "Rp 98.400.000", system: "Rp 98.400.000", diff: "Rp 0", status: "match" },
  { date: "06 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 70.000.000", system: "Rp 70.000.000", diff: "Rp 0", status: "match" },
  { date: "05 Jun 2026", account: "BCA - 123456789", bank: "Rp 85.000.000", system: "Rp 84.500.000", diff: "+ Rp 500.000", status: "mismatch" },
  { date: "04 Jun 2026", account: "BNI - 456123789", bank: "Rp 30.500.000", system: "Rp 30.500.000", diff: "Rp 0", status: "match" },
  { date: "03 Jun 2026", account: "BCA - 123456789", bank: "Rp 75.200.000", system: "Rp 75.200.000", diff: "Rp 0", status: "match" },
  { date: "02 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 60.100.000", system: "Rp 60.100.000", diff: "Rp 0", status: "match" },
  { date: "01 Jun 2026", account: "BCA - 123456789", bank: "Rp 50.000.000", system: "Rp 50.000.000", diff: "Rp 0", status: "match" },
  { date: "31 May 2026", account: "BNI - 456123789", bank: "Rp 25.000.000", system: "Rp 25.100.000", diff: "- Rp 100.000", status: "mismatch" },
  { date: "30 May 2026", account: "BCA - 123456789", bank: "Rp 45.000.000", system: "Rp 45.000.000", diff: "Rp 0", status: "match" },
  { date: "29 May 2026", account: "Mandiri - 987654321", bank: "Rp 35.500.000", system: "Rp 35.500.000", diff: "Rp 0", status: "match" },
  { date: "28 May 2026", account: "BCA - 123456789", bank: "Rp 40.200.000", system: "Rp 40.200.000", diff: "Rp 0", status: "match" },
];

export default function RekonsiliasiBankPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [isRekonsiliasiModalOpen, setIsRekonsiliasiModalOpen] = useState(false);
  const closeRekonsiliasiModal = () => setIsRekonsiliasiModalOpen(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  
  const openDetailModal = (item: any) => {
    setSelectedDetail(item);
    setIsDetailModalOpen(true);
  };
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const totalPages = Math.ceil(rekonsiliasiData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = rekonsiliasiData.slice(startIndex, startIndex + itemsPerPage);
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
                  <span className="text-slate-900">Rekonsiliasi Bank</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Rekonsiliasi Bank</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto cursor-pointer"
            onClick={() => setIsRekonsiliasiModalOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Rekonsiliasi Baru
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2 shadow-sm border-slate-200 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Saldo Bank (BCA, Mandiri, BNI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 flex items-center">
              <Building className="w-6 h-6 mr-3 text-slate-400" />
              Rp 342.150.000
            </div>
            <p className="text-xs text-slate-500 mt-2">Terakhir diperbarui: 11 Jun 2026, 09:00</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pencatatan Sistem (EDC & Transfer)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-slate-400" />
              Rp 342.150.000
            </div>
            <p className="text-xs text-slate-500 mt-2">Berdasarkan laporan EOD yang disetujui</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Rekonsiliasi</CardTitle>
            <CardDescription>Catatan pencocokan saldo per hari/minggu.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari rekening..." 
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
                  <th className="px-6 py-4 font-medium">Tanggal Rekonsiliasi</th>
                  <th className="px-6 py-4 font-medium">Rekening Bank</th>
                  <th className="px-6 py-4 font-medium">Saldo Bank</th>
                  <th className="px-6 py-4 font-medium">Pencatatan Sistem</th>
                  <th className="px-6 py-4 font-medium text-right">Selisih</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.account}</td>
                    <td className="px-6 py-4 text-slate-800">{item.bank}</td>
                    <td className="px-6 py-4 text-slate-800">{item.system}</td>
                    <td className={`px-6 py-4 text-right font-medium ${item.diff === 'Rp 0' ? 'text-slate-500' : 'text-rose-600'}`}>{item.diff}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {item.status === 'match' ? (
                          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Cocok
                          </div>
                        ) : (
                          <div className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Selisih
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" onClick={() => openDetailModal(item)} className="text-blue-600 font-semibold hover:bg-blue-50 cursor-pointer">
                        Lihat Detail
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
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, rekonsiliasiData.length)}</span> dari <span className="font-medium text-slate-700">{rekonsiliasiData.length}</span> data
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

      {/* Rekonsiliasi Modal */}
      <AnimatePresence>
        {isRekonsiliasiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeRekonsiliasiModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Mulai Rekonsiliasi Bank</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Bandingkan mutasi bank dengan sistem POS</p>
                </div>
                <button 
                  onClick={closeRekonsiliasiModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Pilih Cabang</label>
                    <select className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer shadow-sm transition-all">
                      <option value="">-- Pilih Cabang --</option>
                      <option value="sudirman">Mirayya Sudirman</option>
                      <option value="kemang">Mirayya Kemang</option>
                      <option value="pik">Mirayya PIK</option>
                      <option value="kelapa_gading">Mirayya Kelapa Gading</option>
                      <option value="bintaro">Mirayya Bintaro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Tanggal Rekonsiliasi</label>
                    <input type="date" className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer shadow-sm transition-all" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold text-slate-700 mb-2 block">Unggah Mutasi Bank (CSV/Excel)</label>
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-pink-500 shadow-sm mb-3 transition-colors">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Klik untuk mengunggah file</p>
                    <p className="text-xs text-slate-500 mt-1">Maks. 5MB</p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={closeRekonsiliasiModal} className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold h-12 rounded-xl transition-all cursor-pointer">
                  Batal
                </Button>
                <Button onClick={closeRekonsiliasiModal} className="flex-1 w-full bg-pink-600 hover:bg-pink-700 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <RefreshCw className="w-5 h-5 mr-2" /> Proses Data
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Rekonsiliasi Modal */}
      <AnimatePresence>
        {isDetailModalOpen && selectedDetail && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeDetailModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Detail Rekonsiliasi</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedDetail.date}</p>
                </div>
                <button 
                  onClick={closeDetailModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Rekening</span>
                    <p className="font-bold text-slate-900">{selectedDetail.account}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                    <div>
                      {selectedDetail.status === 'match' ? (
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 inline-flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" /> Cocok
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-200 inline-flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Selisih
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Saldo Mutasi Bank</span>
                    <span className="font-bold text-slate-900">{selectedDetail.bank}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Pencatatan Sistem (POS)</span>
                    <span className="font-bold text-slate-900">{selectedDetail.system}</span>
                  </div>
                  <div className={`flex justify-between items-center p-4 rounded-xl border ${selectedDetail.status === 'match' ? 'bg-slate-50 border-slate-200' : 'bg-rose-50 border-rose-100'}`}>
                    <span className={`font-bold ${selectedDetail.status === 'match' ? 'text-slate-700' : 'text-rose-800'}`}>Selisih</span>
                    <span className={`font-extrabold text-lg ${selectedDetail.status === 'match' ? 'text-slate-900' : 'text-rose-600'}`}>{selectedDetail.diff}</span>
                  </div>
                </div>

                {selectedDetail.status === 'mismatch' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-amber-800">Tindakan Diperlukan</p>
                      <p className="text-xs text-amber-700 mt-1">Ditemukan selisih sebesar {selectedDetail.diff}. Silakan periksa kembali mutasi bank atau lakukan penyesuaian jurnal.</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button onClick={closeDetailModal} variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-100 font-bold h-12 rounded-xl transition-all cursor-pointer">
                  Tutup
                </Button>
                {selectedDetail.status === 'mismatch' && (
                  <Link href="/dashboard/accounting/laporan/jurnal-penyesuaian/buat" className="flex-1 w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                      Buat Jurnal Penyesuaian
                    </Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
