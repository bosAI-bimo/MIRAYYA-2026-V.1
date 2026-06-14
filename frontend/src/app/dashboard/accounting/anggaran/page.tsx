"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const initialAnggaranData = [
  { id: 1, branch: "Mirayya Sudirman", budget: "Rp 15.000.000", budgetValue: 15000000, used: "Rp 12.500.000", sisa: "Rp 2.500.000", percentage: 83, status: "warning", month: "2026-06" },
  { id: 2, branch: "Mirayya Kemang", budget: "Rp 10.000.000", budgetValue: 10000000, used: "Rp 4.200.000", sisa: "Rp 5.800.000", percentage: 42, status: "safe", month: "2026-06" },
  { id: 3, branch: "Mirayya PIK", budget: "Rp 12.000.000", budgetValue: 12000000, used: "Rp 11.500.000", sisa: "Rp 500.000", percentage: 95, status: "danger", month: "2026-06" },
  { id: 4, branch: "Mirayya Kelapa Gading", budget: "Rp 10.000.000", budgetValue: 10000000, used: "Rp 5.500.000", sisa: "Rp 4.500.000", percentage: 55, status: "safe", month: "2026-06" },
  { id: 5, branch: "Mirayya Bintaro", budget: "Rp 8.000.000", budgetValue: 8000000, used: "Rp 7.800.000", sisa: "Rp 200.000", percentage: 97, status: "danger", month: "2026-06" },
  { id: 6, branch: "Pusat (Operasional)", budget: "Rp 50.000.000", budgetValue: 50000000, used: "Rp 20.000.000", sisa: "Rp 30.000.000", percentage: 40, status: "safe", month: "2026-06" },
  { id: 7, branch: "Pusat (Marketing)", budget: "Rp 30.000.000", budgetValue: 30000000, used: "Rp 25.000.000", sisa: "Rp 5.000.000", percentage: 83, status: "warning", month: "2026-06" },
  { id: 8, branch: "Mirayya Sudirman (Promosi)", budget: "Rp 5.000.000", budgetValue: 5000000, used: "Rp 4.900.000", sisa: "Rp 100.000", percentage: 98, status: "danger", month: "2026-06" },
  { id: 9, branch: "Mirayya Kemang (Maintenance)", budget: "Rp 3.000.000", budgetValue: 3000000, used: "Rp 1.000.000", sisa: "Rp 2.000.000", percentage: 33, status: "safe", month: "2026-06" },
  { id: 10, branch: "Pusat (IT)", budget: "Rp 15.000.000", budgetValue: 15000000, used: "Rp 10.000.000", sisa: "Rp 5.000.000", percentage: 66, status: "warning", month: "2026-06" },
];

export default function BudgetPage() {
  const [data, setData] = useState(initialAnggaranData);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editBudget, setEditBudget] = useState({
    id: 0,
    branch: "",
    month: "",
    amount: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const itemsPerPage = 5;

  const [newBudget, setNewBudget] = useState({
    branch: "",
    month: "2026-06",
    amount: ""
  });

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
  };

  const handleAddBudget = () => {
    if (!newBudget.branch || !newBudget.amount || !newBudget.month) return;
    const budgetValue = parseInt(newBudget.amount.replace(/\D/g, ""), 10);
    const newEntry = {
      id: Date.now(),
      branch: newBudget.branch,
      budget: formatRupiah(budgetValue),
      budgetValue: budgetValue,
      used: formatRupiah(0),
      sisa: formatRupiah(budgetValue),
      percentage: 0,
      status: "safe",
      month: newBudget.month
    };
    setData([newEntry, ...data]);
    setIsAddDialogOpen(false);
    setNewBudget({ branch: "", month: "2026-06", amount: "" });
  };

  const handleEditClick = (item: any) => {
    setEditBudget({
      id: item.id,
      branch: item.branch,
      month: item.month,
      amount: item.budgetValue.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBudget = () => {
    if (!editBudget.branch || !editBudget.amount || !editBudget.month) return;
    const budgetValue = parseInt(editBudget.amount.toString().replace(/\D/g, ""), 10);
    
    setData(data.map(item => {
      if (item.id === editBudget.id) {
        const usedValue = parseInt(item.used.replace(/\D/g, ""), 10) || 0;
        const sisaValue = budgetValue - usedValue;
        const percentage = budgetValue > 0 ? Math.round((usedValue / budgetValue) * 100) : 0;
        let status = "safe";
        if (percentage >= 90) status = "danger";
        else if (percentage >= 75) status = "warning";

        return {
          ...item,
          branch: editBudget.branch,
          month: editBudget.month,
          budget: formatRupiah(budgetValue),
          budgetValue: budgetValue,
          sisa: formatRupiah(sisaValue),
          percentage: percentage,
          status: status
        };
      }
      return item;
    }));
    
    setIsEditDialogOpen(false);
  };

  const handleDelete = (id: number) => {
    if(confirm("Apakah Anda yakin ingin menghapus anggaran ini?")) {
      setData(data.filter(item => item.id !== id));
    }
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = filterBranch === "all" || item.branch.toLowerCase().includes(filterBranch.replace("_", " ").toLowerCase());
    return matchSearch && matchBranch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

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
                  <span className="text-slate-900">Anggaran Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Anggaran Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-sm"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Buat Anggaran Baru
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Daftar Anggaran</CardTitle>
            <CardDescription>Pemantauan realisasi anggaran bulan berjalan.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari cabang..." 
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-9 pr-4 py-2 border-2 border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select 
              className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full md:w-auto min-w-[140px]"
              value={filterBranch}
              onChange={(e) => { setFilterBranch(e.target.value); setCurrentPage(1); }}
            >
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
                  <th className="px-6 py-4 font-medium">Bulan</th>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Total Anggaran</th>
                  <th className="px-6 py-4 font-medium">Terpakai</th>
                  <th className="px-6 py-4 font-medium">Sisa Anggaran</th>
                  <th className="px-6 py-4 font-medium">Status Pemakaian</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length > 0 ? paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-600">{item.month}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.budget}</td>
                    <td className="px-6 py-4 text-slate-600">{item.used}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.sisa}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === 'danger' ? 'bg-rose-500' : 
                              item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          item.status === 'danger' ? 'text-rose-600' : 
                          item.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          title="Edit Anggaran"
                          onClick={() => handleEditClick(item)}
                        >
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" 
                          title="Hapus"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada data anggaran ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
              <div className="text-sm text-slate-500">
                Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-medium text-slate-700">{filteredData.length}</span> data
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
          )}
        </CardContent>
      </Card>

      {/* Custom Modal for Buat Anggaran Baru */}
      <AnimatePresence>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddDialogOpen(false)}
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
                  <h3 className="text-xl font-bold text-slate-800">Buat Anggaran Baru</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Tambahkan alokasi anggaran baru untuk cabang.</p>
                </div>
                <button 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-slate-600 font-medium">Cabang</Label>
                  <select 
                    id="branch"
                    value={newBudget.branch} 
                    onChange={(e) => setNewBudget({ ...newBudget, branch: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer"
                  >
                    <option value="" disabled>Pilih Cabang</option>
                    <option value="Mirayya Sudirman">Mirayya Sudirman</option>
                    <option value="Mirayya Kemang">Mirayya Kemang</option>
                    <option value="Mirayya PIK">Mirayya PIK</option>
                    <option value="Mirayya Kelapa Gading">Mirayya Kelapa Gading</option>
                    <option value="Mirayya Bintaro">Mirayya Bintaro</option>
                    <option value="Pusat (Operasional)">Pusat (Operasional)</option>
                    <option value="Pusat (Marketing)">Pusat (Marketing)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-slate-600 font-medium">Bulan</Label>
                  <Input
                    id="month"
                    type="month"
                    value={newBudget.month}
                    onChange={(e) => setNewBudget({ ...newBudget, month: e.target.value })}
                    className="w-full border-2 border-slate-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-slate-600 font-medium">Total Anggaran (Rp)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Contoh: 15000000"
                    value={newBudget.amount}
                    onChange={(e) => setNewBudget({ ...newBudget, amount: e.target.value })}
                    className="w-full border-2 border-slate-200"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddDialogOpen(false)}
                  className="flex-1 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-bold h-12 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleAddBudget} 
                  disabled={!newBudget.branch || !newBudget.amount || !newBudget.month}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  Simpan Anggaran
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Modal for Edit Anggaran */}
      <AnimatePresence>
        {isEditDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsEditDialogOpen(false)}
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
                  <h3 className="text-xl font-bold text-slate-800">Edit Anggaran</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">Ubah data anggaran cabang.</p>
                </div>
                <button 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <Label htmlFor="edit-branch" className="text-slate-600 font-medium">Cabang</Label>
                  <select 
                    id="edit-branch"
                    value={editBudget.branch} 
                    onChange={(e) => setEditBudget({ ...editBudget, branch: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer"
                  >
                    <option value="" disabled>Pilih Cabang</option>
                    <option value="Mirayya Sudirman">Mirayya Sudirman</option>
                    <option value="Mirayya Kemang">Mirayya Kemang</option>
                    <option value="Mirayya PIK">Mirayya PIK</option>
                    <option value="Mirayya Kelapa Gading">Mirayya Kelapa Gading</option>
                    <option value="Mirayya Bintaro">Mirayya Bintaro</option>
                    <option value="Pusat (Operasional)">Pusat (Operasional)</option>
                    <option value="Pusat (Marketing)">Pusat (Marketing)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-month" className="text-slate-600 font-medium">Bulan</Label>
                  <Input
                    id="edit-month"
                    type="month"
                    value={editBudget.month}
                    onChange={(e) => setEditBudget({ ...editBudget, month: e.target.value })}
                    className="w-full border-2 border-slate-200"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-amount" className="text-slate-600 font-medium">Total Anggaran (Rp)</Label>
                  <Input
                    id="edit-amount"
                    type="number"
                    placeholder="Contoh: 15000000"
                    value={editBudget.amount}
                    onChange={(e) => setEditBudget({ ...editBudget, amount: e.target.value })}
                    className="w-full border-2 border-slate-200"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                  className="flex-1 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-bold h-12 rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </Button>
                <Button 
                  onClick={handleUpdateBudget} 
                  disabled={!editBudget.branch || !editBudget.amount || !editBudget.month}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
