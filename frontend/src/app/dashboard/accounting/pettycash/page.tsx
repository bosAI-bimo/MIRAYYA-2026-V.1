"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, X as XIcon, Loader2, Wallet, TrendingDown, TrendingUp, Receipt } from "lucide-react";
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

const pettyCashSchema = z.object({
  branchId: z.string().min(1, "Cabang wajib dipilih"),
  description: z.string().min(3, "Deskripsi minimal 3 karakter"),
  amount: z.string().min(1, "Jumlah wajib diisi").refine(val => parseFloat(val.replace(/\D/g, "")) > 0, "Jumlah harus > 0"),
});
type PettyCashFormValues = z.infer<typeof pettyCashSchema>;

export default function PettyCashPage() {
  const [data, setData] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBranch, setFilterBranch] = useState("all");
  const itemsPerPage = 10;

  const addForm = useForm<PettyCashFormValues>({
    resolver: zodResolver(pettyCashSchema),
    defaultValues: { branchId: "", description: "", amount: "" }
  });

  const editForm = useForm<PettyCashFormValues>({
    resolver: zodResolver(pettyCashSchema),
    defaultValues: { branchId: "", description: "", amount: "" }
  });

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(number);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [pettyCashRes, branchesRes] = await Promise.all([
        fetcher("/accounting/petty-cash"),
        fetcher("/admin/branches")
      ]);
      setBranches(branchesRes || []);
      
      const formatted = (pettyCashRes || []).map((pc: any) => {
        const branchObj = branchesRes?.find((b: any) => b.id === pc.branchId);
        return {
          id: pc.id,
          branchId: pc.branchId,
          branch: branchObj?.name || "Cabang Tidak Diketahui",
          description: pc.description,
          amount: parseFloat(pc.amount || "0"),
          date: pc.transactionDate ? new Date(pc.transactionDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-",
          rawDate: pc.transactionDate,
        };
      });
      setData(formatted);
    } catch (err: any) {
      toast.error("Gagal memuat data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleAdd = async (formData: PettyCashFormValues) => {
    try {
      await fetcher("/accounting/petty-cash", {
        method: "POST",
        body: JSON.stringify({
          branchId: formData.branchId,
          description: formData.description,
          amount: parseFloat(formData.amount.replace(/\D/g, "")),
        })
      });
      toast.success("Transaksi petty cash berhasil ditambahkan!");
      setIsAddDialogOpen(false);
      addForm.reset();
      loadData();
    } catch (err: any) {
      toast.error("Gagal menambah transaksi: " + err.message);
    }
  };

  const handleEditClick = (item: any) => {
    setSelectedItem(item);
    editForm.reset({
      branchId: item.branchId,
      description: item.description,
      amount: item.amount.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async (formData: PettyCashFormValues) => {
    if (!selectedItem) return;
    try {
      await fetcher(`/accounting/petty-cash/${selectedItem.id}`, {
        method: "PUT",
        body: JSON.stringify({
          description: formData.description,
          amount: parseFloat(formData.amount.replace(/\D/g, "")),
        })
      });
      toast.success("Transaksi berhasil diperbarui!");
      setIsEditDialogOpen(false);
      loadData();
    } catch (err: any) {
      toast.error("Gagal memperbarui transaksi: " + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) return;
    try {
      await fetcher(`/accounting/petty-cash/${id}`, { method: "DELETE" });
      toast.success("Transaksi berhasil dihapus!");
      loadData();
    } catch (err: any) {
      toast.error("Gagal menghapus transaksi: " + err.message);
    }
  };

  const filteredData = data.filter(item => {
    const matchSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.branch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBranch = filterBranch === "all" || item.branchId === filterBranch;
    return matchSearch && matchBranch;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Summary stats
  const totalPengeluaran = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalTransaksi = filteredData.length;
  const avgPerTransaksi = totalTransaksi > 0 ? totalPengeluaran / totalTransaksi : 0;

  if (loading) return <LoadingScreen />;

  const renderForm = (form: any, onSubmit: any, title: string, subtitle: string, isOpen: boolean, setIsOpen: (v: boolean) => void) => (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-50 overflow-hidden border border-slate-100 flex flex-col">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{subtitle}</p>
                </div>
                <button type="button" onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-5 overflow-y-auto max-h-[60vh]">
                <div className="space-y-2">
                  <Label htmlFor="pc-branchId" className="text-slate-600 font-medium">Cabang</Label>
                  <select id="pc-branchId" {...form.register("branchId")} className="w-full px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
                    <option value="" disabled>Pilih Cabang</option>
                    {branches.map((b: any) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  {form.formState.errors.branchId && <p className="text-xs text-rose-500">{form.formState.errors.branchId.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pc-description" className="text-slate-600 font-medium">Deskripsi</Label>
                  <Input id="pc-description" type="text" placeholder="Contoh: Beli tissue dan plastik" {...form.register("description")} className="w-full border-2 border-slate-200" />
                  {form.formState.errors.description && <p className="text-xs text-rose-500">{form.formState.errors.description.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pc-amount" className="text-slate-600 font-medium">Jumlah (Rp)</Label>
                  <Input id="pc-amount" type="text" placeholder="Contoh: 150000" {...form.register("amount")} className="w-full border-2 border-slate-200" />
                  {form.formState.errors.amount && <p className="text-xs text-rose-500">{form.formState.errors.amount.message}</p>}
                </div>
              </div>
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={form.formState.isSubmitting} className="flex-1 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100 font-bold h-12 rounded-xl">
                  Batal
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting} className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-xl">
                  {form.formState.isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <p className="text-slate-500">Kelola transaksi kas kecil seluruh cabang.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Pengeluaran</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(totalPengeluaran)}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Jumlah Transaksi</p>
              <p className="text-xl font-bold text-slate-800">{totalTransaksi}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
              <Wallet className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Rata-rata / Transaksi</p>
              <p className="text-xl font-bold text-slate-800">{formatRupiah(avgPerTransaksi)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Transaksi</CardTitle>
            <CardDescription>Daftar seluruh transaksi kas kecil.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari deskripsi / cabang..."
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
              {branches.map((b: any) => (
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
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Deskripsi</th>
                  <th className="px-6 py-4 font-medium">Jumlah</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length > 0 ? paginatedData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-600 max-w-[300px] truncate">{item.description}</td>
                    <td className="px-6 py-4 text-rose-600 font-bold">{formatRupiah(item.amount)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit" onClick={() => handleEditClick(item)}>
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Hapus" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      Tidak ada data transaksi petty cash ditemukan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
      {renderForm(addForm, handleAdd, "Tambah Transaksi", "Catat pengeluaran kas kecil baru.", isAddDialogOpen, setIsAddDialogOpen)}

      {/* Edit Modal */}
      {renderForm(editForm, handleUpdate, "Edit Transaksi", "Ubah data transaksi kas kecil.", isEditDialogOpen, setIsEditDialogOpen)}
    </div>
  );
}
