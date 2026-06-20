"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Search, Eye, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, FileText, Download, Printer, Check, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { toast } from "sonner";

export default function POApprovalPage() {
  const [poData, setPoData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  React.useEffect(() => {
    fetchPOs();
  }, []);

  const fetchPOs = async () => {
    try {
      const data = await fetcher('/store/orders');
      const formattedData = (data || []).map((item: any) => ({
        id: item.id,
        branch: item.branchId || "Cabang",
        date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-',
        items: "-",
        total: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(item.totalAmount || 0),
        status: item.status === 'PENDING' ? 'Menunggu' : item.status === 'APPROVED' ? 'Disetujui' : 'Ditolak',
        details: []
      }));
      setPoData(formattedData);
    } catch (err) {
      console.error(err);
    }
  };
  const [filterStatus, setFilterStatus] = useState("pending");
  const itemsPerPage = 5;

  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [isPOModalOpen, setIsPOModalOpen] = useState(false);

  const openPOModal = (item: any) => {
    setSelectedPO(item);
    setIsPOModalOpen(true);
  };

  const closePOModal = () => {
    setIsPOModalOpen(false);
    setTimeout(() => setSelectedPO(null), 300);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetcher(`/store/orders/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus })
      });
      toast.success(`PO berhasil ${newStatus === 'APPROVED' ? 'disetujui' : 'ditolak'}`);
      closePOModal();
      fetchPOs();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengubah status PO");
    }
  };

  const filteredData = poData.filter(item => 
    filterStatus === "pending" ? item.status === "Menunggu" : item.status !== "Menunggu"
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };
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
                  <span className="text-slate-900">Purchase Order</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Persetujuan Purchase Order</h1>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <CardTitle className="text-lg font-semibold text-slate-800">Daftar Purchase Order</CardTitle>
            <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
              <button 
                onClick={() => handleFilterChange("pending")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'pending' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Menunggu
              </button>
              <button 
                onClick={() => handleFilterChange("completed")}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === 'completed' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Selesai
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari ID PO..." 
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
                  <th className="px-6 py-4 font-medium">ID PO</th>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Total Item</th>
                  <th className="px-6 py-4 font-medium">Total Harga</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-primary">{item.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 text-slate-600">{item.items}</td>
                    <td className="px-6 py-4 text-slate-800 font-medium">{item.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        item.status === 'Disetujui' ? 'bg-emerald-100 text-emerald-700' : 
                        item.status === 'Ditolak' ? 'bg-rose-100 text-rose-700' : 
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openPOModal(item)} className="h-8 w-8 p-0" title="Lihat Detail">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                        {item.status === 'Menunggu' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(item.id, 'APPROVED')} className="h-8 w-8 p-0 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600" title="Setujui">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(item.id, 'REJECTED')} className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Tolak">
                              <XCircle className="w-4 h-4 text-rose-500" />
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{filteredData.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-medium text-slate-700">{filteredData.length}</span> data
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

      {/* PO Review Modal */}
      <AnimatePresence>
        {isPOModalOpen && selectedPO && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closePOModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl relative z-50 overflow-hidden border border-slate-100 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Review Purchase Order</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedPO.id} • {selectedPO.branch}</p>
                </div>
                <button 
                  onClick={closePOModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Pengajuan</span>
                    <p className="text-2xl font-extrabold text-slate-900">{selectedPO.total}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</span>
                    <div><span className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                      selectedPO.status === 'Disetujui' ? 'text-emerald-700 bg-emerald-100 border-emerald-200' :
                      selectedPO.status === 'Ditolak' ? 'text-rose-700 bg-rose-100 border-rose-200' :
                      'text-amber-700 bg-amber-100 border-amber-200'
                    }`}>{selectedPO.status}</span></div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-slate-400" />
                    Rincian Item ({selectedPO.details?.length || selectedPO.items || 0})
                  </h4>
                  <div className="border-2 border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">Produk</th>
                          <th className="px-4 py-3 text-center">Qty</th>
                          <th className="px-4 py-3 text-right">Harga</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {selectedPO.details?.map((product: any, idx: number) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-800">{product.name}</p>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold mt-1 inline-block ${product.category === 'Fast Moving' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {product.category}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center font-medium text-slate-600">{product.qty}</td>
                            <td className="px-4 py-3 text-right font-medium text-slate-700">{product.price}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={3} className="px-4 py-8 text-center text-slate-500">Rincian item tidak tersedia untuk data ini.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Printer className="w-4 h-4 mr-2" /> Cetak PO
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Download className="w-4 h-4 mr-2" /> Unduh PDF
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              {selectedPO.status === 'Menunggu' && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                  <Button onClick={() => handleUpdateStatus(selectedPO.id, 'REJECTED')} className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 rounded-xl transition-all border-none cursor-pointer">
                    <XIcon className="w-5 h-5 mr-2" /> Tolak
                  </Button>
                  <Button onClick={() => handleUpdateStatus(selectedPO.id, 'APPROVED')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                    <Check className="w-5 h-5 mr-2" /> Setujui PO
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
