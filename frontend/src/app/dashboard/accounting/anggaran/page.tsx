"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/ui/loading-screen";

const budgetSchema = z.object({
  branchId: z.string().min(1, "Cabang wajib dipilih"),
  month: z.string().min(1, "Bulan wajib diisi"),
  pettyCashBudget: z.string().min(1, "Wajib diisi").refine(val => parseInt(val.replace(/\D/g, "")) >= 0, "Harus >= 0"),
  shoppingBudget: z.string().min(1, "Wajib diisi").refine(val => parseInt(val.replace(/\D/g, "")) >= 0, "Harus >= 0"),
  targetAchievement: z.string().min(1, "Wajib diisi").refine(val => parseInt(val.replace(/\D/g, "")) >= 0, "Harus >= 0"),
});
type BudgetFormValues = z.infer<typeof budgetSchema>;

export default function BudgetPage() {
  const [data, setData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const itemsPerPage = 5;

  const addForm = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { branchId: "", month: "2026-06", pettyCashBudget: "", shoppingBudget: "", targetAchievement: "" }
  });

  const editForm = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: { branchId: "", month: "", pettyCashBudget: "", shoppingBudget: "", targetAchievement: "" }
  });

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, branchesRes] = await Promise.all([
        fetcher("/accounting/budgets"),
        fetcher("/admin/branches")
      ]);
      setBranches(branchesRes || []);
      
      const formattedBudgets = (budgetsRes || []).map((b: any) => {
        const branchObj = branchesRes?.find((br: any) => br.id === b.branchId);
        const pettyCashBudget = parseFloat(b.pettyCashBudget || "0");
        const shoppingBudget = parseFloat(b.shoppingBudget || "0");
        const targetAchievement = parseFloat(b.targetAchievement || "0");

        return {
          id: b.id,
          branchId: b.branchId,
          branch: branchObj?.name || "Cabang Tidak Diketahui",
          pettyCash: formatRupiah(pettyCashBudget),
          shopping: formatRupiah(shoppingBudget),
          target: formatRupiah(targetAchievement),
          pettyCashValue: pettyCashBudget,
          shoppingValue: shoppingBudget,
          targetValue: targetAchievement,
          month: b.month
        };
      });
      setData(formattedBudgets);
    } catch (err: any) {
      toast.error("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBudget = async (formData: BudgetFormValues) => {
    try {
      await fetcher('/accounting/budgets', {
        method: 'POST',
        body: JSON.stringify({
          branchId: formData.branchId,
          month: formData.month,
          pettyCashBudget: parseFloat(formData.pettyCashBudget.replace(/\D/g, "")),
          shoppingBudget: parseFloat(formData.shoppingBudget.replace(/\D/g, "")),
          targetAchievement: parseFloat(formData.targetAchievement.replace(/\D/g, ""))
        })
      });
      toast.success("Anggaran berhasil ditambahkan!");
      setIsAddDialogOpen(false);
      addForm.reset();
      loadData();
    } catch(err: any) {
      toast.error("Gagal menambah anggaran: " + err.message);
    }
  };

  const handleEditClick = (item: any) => {
    setSelectedBudget(item);
    editForm.reset({
      branchId: item.branchId,
      month: item.month,
      pettyCashBudget: item.pettyCashValue.toString(),
      shoppingBudget: item.shoppingValue.toString(),
      targetAchievement: item.targetValue.toString()
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateBudget = async (formData: BudgetFormValues) => {
    if (!selectedBudget) return;
    try {
      await fetcher(`/accounting/budgets/${selectedBudget.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          branchId: formData.branchId,
          month: formData.month,
          pettyCashBudget: parseFloat(formData.pettyCashBudget.replace(/\D/g, "")),
          shoppingBudget: parseFloat(formData.shoppingBudget.replace(/\D/g, "")),
          targetAchievement: parseFloat(formData.targetAchievement.replace(/\D/g, ""))
        })
      });
      toast.success("Anggaran berhasil diperbarui!");
      setIsEditDialogOpen(false);
      loadData();
    } catch(err: any) {
      toast.error("Gagal memperbarui anggaran: " + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Apakah Anda yakin ingin menghapus anggaran ini?")) return;
    try {
      await fetcher(`/accounting/budgets/${id}`, { method: 'DELETE' });
      toast.success("Anggaran berhasil dihapus!");
      loadData();
    } catch(err: any) {
      toast.error("Gagal menghapus anggaran: " + err.message);
    }
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = filterBranch === "all" || item.branchId === filterBranch;
    return matchSearch && matchBranch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return <LoadingScreen />;
  }

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
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
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
                  <th className="px-6 py-4 font-medium">Target Pencapaian</th>
                  <th className="px-6 py-4 font-medium">Anggaran Belanja</th>
                  <th className="px-6 py-4 font-medium">Anggaran Petty Cash</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length > 0 ? paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-600">{item.month}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-emerald-600 font-bold">{item.target}</td>
                    <td className="px-6 py-4 text-slate-600">{item.shopping}</td>
                    <td className="px-6 py-4 text-slate-600">{item.pettyCash}</td>
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
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="h-8 w-8 p-0">
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center text-sm font-medium px-3 text-slate-600">
                  Halaman {currentPage} dari {totalPages}
                </div>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsAddDialogOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col">
              <form onSubmit={addForm.handleSubmit(handleAddBudget)}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Buat Anggaran Baru</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Tambahkan alokasi anggaran baru untuk cabang.</p>
                  </div>
                  <button type="button" onClick={() => setIsAddDialogOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-2">
                    <Label htmlFor="branchId" className="text-slate-600 font-medium">Cabang</Label>
                    <select id="branchId" {...addForm.register("branchId")} className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                      <option value="" disabled>Pilih Cabang</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    {addForm.formState.errors.branchId && <p className="text-xs text-rose-500">{addForm.formState.errors.branchId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="month" className="text-slate-600 font-medium">Bulan</Label>
                    <Input id="month" type="month" {...addForm.register("month")} className="w-full border-2 border-slate-200" />
                    {addForm.formState.errors.month && <p className="text-xs text-rose-500">{addForm.formState.errors.month.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pettyCashBudget" className="text-slate-600 font-medium">Anggaran Petty Cash (Rp)</Label>
                    <Input id="pettyCashBudget" type="text" placeholder="Contoh: 5000000" {...addForm.register("pettyCashBudget")} className="w-full border-2 border-slate-200" />
                    {addForm.formState.errors.pettyCashBudget && <p className="text-xs text-rose-500">{addForm.formState.errors.pettyCashBudget.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shoppingBudget" className="text-slate-600 font-medium">Anggaran Belanja (Rp)</Label>
                    <Input id="shoppingBudget" type="text" placeholder="Contoh: 15000000" {...addForm.register("shoppingBudget")} className="w-full border-2 border-slate-200" />
                    {addForm.formState.errors.shoppingBudget && <p className="text-xs text-rose-500">{addForm.formState.errors.shoppingBudget.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetAchievement" className="text-slate-600 font-medium">Target Pencapaian (Rp)</Label>
                    <Input id="targetAchievement" type="text" placeholder="Contoh: 50000000" {...addForm.register("targetAchievement")} className="w-full border-2 border-slate-200" />
                    {addForm.formState.errors.targetAchievement && <p className="text-xs text-rose-500">{addForm.formState.errors.targetAchievement.message}</p>}
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={addForm.formState.isSubmitting} className="flex-1 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-bold h-12 rounded-xl">
                    Batal
                  </Button>
                  <Button type="submit" disabled={addForm.formState.isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
                    {addForm.formState.isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Anggaran"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditDialogOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEditDialogOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col">
              <form onSubmit={editForm.handleSubmit(handleUpdateBudget)}>
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">Edit Anggaran</h3>
                    <p className="text-sm font-medium text-slate-500 mt-1">Ubah data anggaran cabang.</p>
                  </div>
                  <button type="button" onClick={() => setIsEditDialogOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors">
                    <XIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                  <div className="space-y-2">
                    <Label htmlFor="edit-branchId" className="text-slate-600 font-medium">Cabang</Label>
                    <select id="edit-branchId" {...editForm.register("branchId")} className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer">
                      <option value="" disabled>Pilih Cabang</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    {editForm.formState.errors.branchId && <p className="text-xs text-rose-500">{editForm.formState.errors.branchId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-month" className="text-slate-600 font-medium">Bulan</Label>
                    <Input id="edit-month" type="month" {...editForm.register("month")} className="w-full border-2 border-slate-200" />
                    {editForm.formState.errors.month && <p className="text-xs text-rose-500">{editForm.formState.errors.month.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-pettyCashBudget" className="text-slate-600 font-medium">Anggaran Petty Cash (Rp)</Label>
                    <Input id="edit-pettyCashBudget" type="text" placeholder="Contoh: 5000000" {...editForm.register("pettyCashBudget")} className="w-full border-2 border-slate-200" />
                    {editForm.formState.errors.pettyCashBudget && <p className="text-xs text-rose-500">{editForm.formState.errors.pettyCashBudget.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-shoppingBudget" className="text-slate-600 font-medium">Anggaran Belanja (Rp)</Label>
                    <Input id="edit-shoppingBudget" type="text" placeholder="Contoh: 15000000" {...editForm.register("shoppingBudget")} className="w-full border-2 border-slate-200" />
                    {editForm.formState.errors.shoppingBudget && <p className="text-xs text-rose-500">{editForm.formState.errors.shoppingBudget.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-targetAchievement" className="text-slate-600 font-medium">Target Pencapaian (Rp)</Label>
                    <Input id="edit-targetAchievement" type="text" placeholder="Contoh: 50000000" {...editForm.register("targetAchievement")} className="w-full border-2 border-slate-200" />
                    {editForm.formState.errors.targetAchievement && <p className="text-xs text-rose-500">{editForm.formState.errors.targetAchievement.message}</p>}
                  </div>
                </div>
                <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                  <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={editForm.formState.isSubmitting} className="flex-1 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-bold h-12 rounded-xl cursor-pointer">
                    Batal
                  </Button>
                  <Button type="submit" disabled={editForm.formState.isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl shadow-sm cursor-pointer disabled:opacity-50">
                    {editForm.formState.isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Perubahan"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
