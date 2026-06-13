"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, FileText, Download, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Image as ImageIcon, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const pettyCashData = [
  { date: "11 Jun 2026", branch: "Mirayya Sudirman", desc: "Beli galon air (4 buah)", by: "Sari (Store Leader)", amount: "Rp 80.000" },
  { date: "11 Jun 2026", branch: "Mirayya Sudirman", desc: "Tisu wajah & toilet", by: "Sari (Store Leader)", amount: "Rp 70.000" },
  { date: "10 Jun 2026", branch: "Mirayya Kemang", desc: "Ongkir GoSend antar barang", by: "Budi (Store Leader)", amount: "Rp 45.000" },
  { date: "09 Jun 2026", branch: "Mirayya PIK", desc: "Plastik sampah", by: "Rina (Store Leader)", amount: "Rp 35.000" },
  { date: "09 Jun 2026", branch: "Mirayya Kelapa Gading", desc: "Beli lampu LED pengganti", by: "Tomo (Store Leader)", amount: "Rp 120.000" },
  { date: "08 Jun 2026", branch: "Mirayya Bintaro", desc: "Beli spidol & lakban", by: "Nina (Store Leader)", amount: "Rp 55.000" },
  { date: "08 Jun 2026", branch: "Pusat", desc: "Beli materai 10rb (10 pcs)", by: "Anita (Admin)", amount: "Rp 100.000" },
  { date: "07 Jun 2026", branch: "Mirayya Sudirman", desc: "Beli kopi & gula", by: "Sari (Store Leader)", amount: "Rp 65.000" },
  { date: "06 Jun 2026", branch: "Mirayya Kemang", desc: "Pembersih lantai", by: "Budi (Store Leader)", amount: "Rp 40.000" },
  { date: "05 Jun 2026", branch: "Mirayya PIK", desc: "Cetak brosur promo", by: "Rina (Store Leader)", amount: "Rp 150.000" },
  { date: "05 Jun 2026", branch: "Pusat", desc: "Beli ATK", by: "Anita (Admin)", amount: "Rp 250.000" },
  { date: "04 Jun 2026", branch: "Mirayya Kelapa Gading", desc: "Beli sabun cuci tangan", by: "Tomo (Store Leader)", amount: "Rp 30.000" },
  { date: "03 Jun 2026", branch: "Mirayya Bintaro", desc: "Parkir tamu khusus", by: "Nina (Store Leader)", amount: "Rp 20.000" },
  { date: "02 Jun 2026", branch: "Mirayya Sudirman", desc: "Layanan servis AC", by: "Sari (Store Leader)", amount: "Rp 350.000" },
  { date: "01 Jun 2026", branch: "Pusat", desc: "Konsumsi meeting bulanan", by: "Anita (Admin)", amount: "Rp 450.000" },
];

export default function PettyCashPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedPettyCash, setSelectedPettyCash] = useState<any>(null);
  const [isPettyCashModalOpen, setIsPettyCashModalOpen] = useState(false);

  const openPettyCashModal = (item: any) => {
    setSelectedPettyCash(item);
    setIsPettyCashModalOpen(true);
  };

  const closePettyCashModal = () => {
    setIsPettyCashModalOpen(false);
    setTimeout(() => setSelectedPettyCash(null), 300);
  };

  const totalPages = Math.ceil(pettyCashData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = pettyCashData.slice(startIndex, startIndex + itemsPerPage);
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
                  <span className="text-slate-900">Petty Cash</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Petty Cash</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button variant="outline" className="border-primary text-primary hover:bg-secondary w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Ekspor PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Transaksi Petty Cash</CardTitle>
            <CardDescription>Menampilkan semua transaksi pengeluaran cabang.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari deskripsi..." 
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
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Deskripsi</th>
                  <th className="px-6 py-4 font-medium">Oleh</th>
                  <th className="px-6 py-4 font-medium text-right">Nominal</th>
                  <th className="px-6 py-4 font-medium text-center">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-800">{item.desc}</td>
                    <td className="px-6 py-4 text-slate-600">{item.by}</td>
                    <td className="px-6 py-4 text-right font-medium text-rose-600">- {item.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm" onClick={() => openPettyCashModal(item)} className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-secondary">
                        <FileText className="w-4 h-4" />
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
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, pettyCashData.length)}</span> dari <span className="font-medium text-slate-700">{pettyCashData.length}</span> data
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

      {/* Petty Cash Detail Modal */}
      <AnimatePresence>
        {isPettyCashModalOpen && selectedPettyCash && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closePettyCashModal}
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
                  <h3 className="text-xl font-bold text-slate-800">Detail Petty Cash</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedPettyCash.branch}</p>
                </div>
                <button 
                  onClick={closePettyCashModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start pb-4 border-b border-slate-100">
                  <div className="space-y-1 pr-4">
                    <h4 className="font-bold text-slate-800">{selectedPettyCash.desc}</h4>
                    <p className="text-xs text-slate-500">{selectedPettyCash.date} • Dilaporkan oleh {selectedPettyCash.by}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold text-rose-600 whitespace-nowrap">- {selectedPettyCash.amount}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-slate-200 border-dashed gap-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">Bukti Struk/Kuitansi</p>
                    <p className="text-xs text-slate-500 mt-1">1 foto terlampir</p>
                  </div>
                  <Button variant="outline" className="mt-2 border-slate-200 text-slate-700 hover:text-pink-600 hover:border-pink-200 hover:bg-pink-50 rounded-xl transition-all shadow-sm">
                    Lihat Foto Penuh
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80">
                <Button onClick={closePettyCashModal} className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold h-12 rounded-xl shadow-sm transition-all cursor-pointer">
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
