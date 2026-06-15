"use client";

import React, { useState } from "react";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingDown, Clock, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Receipt, ShoppingCart, DollarSign, Activity, Eye, FileText, Package, X as XIcon } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const budgetHistory = [
  { 
    id: "PO-202606-003", date: "10 Jun 2026", desc: "Restock Lipstick & Serum", amount: "- Rp 1.500.000", status: "Disetujui", type: "PO",
    items: [
      { name: "Mirayya Liptint Velvet 04", qty: 20, price: "Rp 50.000", total: "Rp 1.000.000" },
      { name: "Mirayya Glow Serum", qty: 5, price: "Rp 100.000", total: "Rp 500.000" }
    ]
  },
  { 
    id: "PC-202606-002", date: "08 Jun 2026", desc: "Petty Cash: Tisu & Sabun Cuci Tangan", amount: "- Rp 250.000", status: "Disetujui", type: "PC",
    items: [
      { name: "Tisu Wajah 250s", qty: 10, price: "Rp 15.000", total: "Rp 150.000" },
      { name: "Sabun Cuci Tangan 500ml", qty: 4, price: "Rp 25.000", total: "Rp 100.000" }
    ]
  },
  { 
    id: "PO-202606-001", date: "02 Jun 2026", desc: "Restock Toner (Bulk)", amount: "- Rp 2.000.000", status: "Disetujui", type: "PO",
    items: [
      { name: "Mirayya Hydrating Toner 150ml", qty: 25, price: "Rp 80.000", total: "Rp 2.000.000" }
    ]
  },
  { 
    id: "PC-202606-003", date: "11 Jun 2026", desc: "Petty Cash: ATK", amount: "- Rp 150.000", status: "Menunggu", type: "PC",
    items: [
      { name: "Kertas HVS A4", qty: 2, price: "Rp 50.000", total: "Rp 100.000" },
      { name: "Pulpen & Spidol", qty: 1, price: "Rp 50.000", total: "Rp 50.000" }
    ]
  },
  { id: "PO-202606-004", date: "12 Jun 2026", desc: "Restock Cushion & Foundation", amount: "- Rp 3.000.000", status: "Menunggu", type: "PO", items: [{ name: "Cushion", qty: 20, price: "Rp 100.000", total: "Rp 2.000.000" }, { name: "Foundation", qty: 10, price: "Rp 100.000", total: "Rp 1.000.000" }] },
  { id: "PC-202606-004", date: "13 Jun 2026", desc: "Petty Cash: Galon Air", amount: "- Rp 50.000", status: "Disetujui", type: "PC", items: [{ name: "Isi Ulang Galon", qty: 2, price: "Rp 25.000", total: "Rp 50.000" }] },
  { id: "PO-202606-005", date: "14 Jun 2026", desc: "Restock Skincare Bundle", amount: "- Rp 2.500.000", status: "Ditolak", type: "PO", items: [{ name: "Skincare Bundle Pack", qty: 10, price: "Rp 250.000", total: "Rp 2.500.000" }] },
  { id: "PC-202606-005", date: "15 Jun 2026", desc: "Petty Cash: Kopi & Gula", amount: "- Rp 80.000", status: "Disetujui", type: "PC", items: [{ name: "Kopi Bubuk", qty: 2, price: "Rp 25.000", total: "Rp 50.000" }, { name: "Gula Pasir 1kg", qty: 2, price: "Rp 15.000", total: "Rp 30.000" }] },
  { id: "PO-202606-006", date: "16 Jun 2026", desc: "Restock Body Lotion", amount: "- Rp 1.200.000", status: "Disetujui", type: "PO", items: [{ name: "Body Lotion 250ml", qty: 20, price: "Rp 60.000", total: "Rp 1.200.000" }] },
  { id: "PC-202606-006", date: "17 Jun 2026", desc: "Petty Cash: Pembersih Lantai", amount: "- Rp 60.000", status: "Disetujui", type: "PC", items: [{ name: "Pembersih Lantai", qty: 2, price: "Rp 30.000", total: "Rp 60.000" }] },
  { id: "PO-202606-007", date: "18 Jun 2026", desc: "Restock Lip Cream", amount: "- Rp 900.000", status: "Disetujui", type: "PO", items: [{ name: "Lip Cream 01", qty: 15, price: "Rp 60.000", total: "Rp 900.000" }] },
  { id: "PC-202606-007", date: "19 Jun 2026", desc: "Petty Cash: Listrik Prabayar", amount: "- Rp 500.000", status: "Menunggu", type: "PC", items: [{ name: "Token Listrik PLN", qty: 1, price: "Rp 500.000", total: "Rp 500.000" }] },
  { id: "PO-202606-008", date: "20 Jun 2026", desc: "Restock Masker Wajah", amount: "- Rp 400.000", status: "Disetujui", type: "PO", items: [{ name: "Sheet Mask Aloe Vera", qty: 40, price: "Rp 10.000", total: "Rp 400.000" }] },
  { id: "PC-202606-008", date: "21 Jun 2026", desc: "Petty Cash: Internet", amount: "- Rp 350.000", status: "Disetujui", type: "PC", items: [{ name: "Tagihan Internet Bulanan", qty: 1, price: "Rp 350.000", total: "Rp 350.000" }] },
  { id: "PO-202606-009", date: "22 Jun 2026", desc: "Restock Kapas Kecantikan", amount: "- Rp 150.000", status: "Disetujui", type: "PO", items: [{ name: "Kapas Wajah 50g", qty: 15, price: "Rp 10.000", total: "Rp 150.000" }] },
];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function BudgetingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 5;

  const filteredData = budgetHistory.filter(item => 
    filterStatus === "pending" ? item.status === "Menunggu" : item.status !== "Menunggu"
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

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

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
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
                <Link href="/dashboard/kepala-toko" className="hover:text-pink-600 transition-colors">Dashboard Kepala Toko</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Anggaran Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">Anggaran Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="space-y-8">
        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <Receipt className="w-5 h-5 mr-2 text-pink-600" />
            Anggaran Petty Cash
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <Card className="border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Anggaran PC</CardTitle>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="w-4 h-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{formatRupiah(2000000)}</div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Periode Juni 2026</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Terpakai (PC)</CardTitle>
                <div className="p-2 bg-amber-50 rounded-lg text-amber-600"><Activity className="w-4 h-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{formatRupiah(1440000)}</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '72%' }} />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">72% dari total anggaran</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Sisa Anggaran PC</CardTitle>
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Wallet className="w-4 h-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{formatRupiah(560000)}</div>
                <p className="text-xs text-blue-600 mt-1 font-medium">Tersedia untuk pengajuan</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-indigo-600" />
            Anggaran Purchase Order (PO)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <Card className="border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Total Anggaran PO</CardTitle>
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><DollarSign className="w-4 h-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-800">{formatRupiah(15000000)}</div>
                <p className="text-xs text-slate-500 mt-1 font-medium">Periode Juni 2026</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-rose-300 hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Terpakai (PO)</CardTitle>
                <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><Activity className="w-4 h-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">{formatRupiah(12500000)}</div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '83%' }} />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">83% dari total anggaran</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 h-full">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Sisa Anggaran PO</CardTitle>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><Wallet className="w-4 h-4" /></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-indigo-600">{formatRupiah(2500000)}</div>
                <p className="text-xs text-indigo-600 mt-1 font-medium">Tersedia untuk pengajuan</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="border-2 border-slate-200 lg:col-span-2">
          <CardHeader className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle className="text-base font-semibold text-slate-800">Riwayat Penggunaan Anggaran</CardTitle>
              <CardDescription>Daftar Purchase Order dan Petty Cash yang memotong anggaran.</CardDescription>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0 border border-slate-200">
              <button 
                onClick={() => handleFilterChange("pending")}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filterStatus === 'pending' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Menunggu
              </button>
              <button 
                onClick={() => handleFilterChange("completed")}
                className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${filterStatus === 'completed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Selesai
              </button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">ID Referensi</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Keterangan</th>
                    <th className="px-6 py-3 text-right">Nominal</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-800">{item.id}</td>
                      <td className="px-6 py-4 text-slate-600">{item.date}</td>
                      <td className="px-6 py-4 text-slate-600">{item.desc}</td>
                      <td className="px-6 py-4 font-bold text-right text-slate-700">{item.amount}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-pink-600 hover:text-pink-700 hover:bg-pink-50 rounded-full" onClick={() => openDetail(item)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-xl">
              <div className="text-sm text-slate-500">
                Menampilkan <span className="font-medium text-slate-700">{filteredData.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-medium text-slate-700">{filteredData.length}</span> data
              </div>
              <div className="flex items-center gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(1)} 
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-slate-200 bg-white"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0 border-slate-200 bg-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center justify-center text-sm font-bold px-3 text-slate-700">
                  {currentPage} / {totalPages}
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-slate-200 bg-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(totalPages)} 
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0 border-slate-200 bg-white"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog Custom Modal */}
      <AnimatePresence>
        {isDialogOpen && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsDialogOpen(false)}
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
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {selectedItem?.type === 'PO' ? <Package className="w-5 h-5 text-slate-400" /> : <FileText className="w-5 h-5 text-slate-400" />}
                    Detail {selectedItem?.type === 'PO' ? 'Purchase Order' : 'Petty Cash'}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedItem?.id} • <span className="text-slate-700 font-bold">{selectedItem?.date}</span></p>
                </div>
                <button 
                  onClick={() => setIsDialogOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Nominal</span>
                    <p className="text-2xl font-extrabold text-slate-900">{selectedItem?.amount}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                    <div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border inline-block ${
                        selectedItem?.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                        selectedItem?.status === 'Ditolak' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                        'bg-amber-100 text-amber-700 border-amber-200'
                      }`}>
                        {selectedItem?.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-slate-400" />
                    Rincian Item ({selectedItem?.items?.length || 0})
                  </h4>
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="px-4 py-3">Nama Item</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Harga</th>
                          <th className="px-4 py-3 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedItem?.items?.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800">{item.name}</p>
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-slate-600">{item.qty}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-700">{item.price}</td>
                            <td className="px-4 py-3 text-right font-bold text-slate-800">{item.total}</td>
                          </tr>
                        ))}
                        {(!selectedItem?.items || selectedItem.items.length === 0) && (
                          <tr>
                            <td colSpan={4} className="px-4 py-6 text-center text-slate-400 text-xs italic">Belum ada rincian item.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex justify-end">
                <Button onClick={() => setIsDialogOpen(false)} className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-8 h-12 rounded-xl shadow-sm transition-all cursor-pointer">
                  Tutup
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

