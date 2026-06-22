"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Search, Eye, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Download, Printer, Check, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { GlobalFilter } from "@/components/ui/global-filter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams, useRouter } from "next/navigation";

function EODApprovalContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get("tab") === "pettycash" ? "pettycash" : "eod";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("pending");
  const [branchFilter, setBranchFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("this_month");
  const itemsPerPage = 10;

  const [eodData, setEodData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pettyCashData, setPettyCashData] = useState<any[]>([
    { id: "PC-001", branch: "Mirayya Sudirman", date: "10 Jun 2026", desc: "Beli Tinta Printer", amount: "Rp 150.000", by: "Andi" },
    { id: "PC-002", branch: "Mirayya Kemang", date: "09 Jun 2026", desc: "Galon Air & Kopi", amount: "Rp 85.000", by: "Budi" },
    { id: "PC-003", branch: "Mirayya PIK", date: "08 Jun 2026", desc: "Plastik Kemasan", amount: "Rp 200.000", by: "Citra" },
  ]);

  const loadData = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        branchId: branchFilter,
        status: filterStatus
      });
      const res = await fetcher(`/accounting/eod-reports?${queryParams.toString()}`);
      if (res && res.data) {
        setEodData(res.data.map((d: any) => ({
          id: d.id,
          branch: d.branchName,
          date: new Date(d.reportDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          omzet: `Rp ${Number(d.totalOmzet).toLocaleString('id-ID')}`,
          cash: `Rp ${Number(d.cashAmount).toLocaleString('id-ID')}`,
          edc: `Rp ${Number(d.edcAmount).toLocaleString('id-ID')}`,
          qris: `Rp ${Number(d.qrisAmount).toLocaleString('id-ID')}`,
          pettyCash: `Rp ${Number(d.pettyCashUsed).toLocaleString('id-ID')}`,
          setoranBersih: `Rp ${Number(d.cashAmount - d.pettyCashUsed).toLocaleString('id-ID')}`,
          status: d.status === 'PENDING' ? 'Menunggu' : d.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'
        })));
        setTotalPages(res.metadata?.totalPages || 1);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [currentPage, filterStatus, branchFilter]);

  const handleApproveReject = async (id: string, status: string) => {
    try {
      await fetcher(`/accounting/eod-reports/${id}/approve`, {
        method: "PUT",
        body: JSON.stringify({ status })
      });
      loadData();
      setIsReviewModalOpen(false);
    } catch (e) {
      console.error(e);
      alert("Failed to update status");
    }
  };

  const [selectedEOD, setSelectedEOD] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const openReviewModal = (item: any) => {
    setSelectedEOD(item);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setTimeout(() => setSelectedEOD(null), 300);
  };
  
  const paginatedData = eodData;
  const startIndex = (currentPage - 1) * itemsPerPage;

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
                  <span className="text-slate-900">Persetujuan EOD</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Persetujuan EOD</h1>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => {
        setActiveTab(val);
        router.push(val === "pettycash" ? "/dashboard/accounting/eod?tab=pettycash" : "/dashboard/accounting/eod");
      }} className="w-full">
        <div className="flex my-6 bg-slate-100/80 p-1.5 rounded-2xl md:rounded-full w-full overflow-x-auto no-scrollbar border-2 border-slate-200/50 shadow-inner">
          <TabsList className="bg-transparent p-0 flex gap-1 lg:gap-2 min-w-max h-auto">
            <TabsTrigger 
              value="eod" 
              className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
            >
              Persetujuan EOD
            </TabsTrigger>
            <TabsTrigger 
              value="pettycash" 
              className="rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-pink-700 data-[state=active]:shadow-sm px-4 lg:px-6 py-2.5 lg:py-3 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm lg:text-base cursor-pointer"
            >
              Riwayat Petty Cash
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="eod" className="mt-6 focus-visible:outline-none">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <CardTitle className="text-lg font-semibold text-slate-800">Daftar Laporan EOD</CardTitle>
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
                    placeholder="Cari cabang..." 
                    className="pl-9 pr-4 py-2 border-2 border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <GlobalFilter 
                  onFilterChange={(branchId, period) => {
                    setBranchFilter(branchId);
                    setDateFilter(period);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">Cabang</th>
                      <th className="px-6 py-4 font-medium">Tanggal Laporan</th>
                      <th className="px-6 py-4 font-medium">Total Omzet</th>
                      <th className="px-6 py-4 font-medium">Petty Cash</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                        <td className="px-6 py-4 text-slate-600">{item.date}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">{item.omzet}</td>
                        <td className="px-6 py-4 text-slate-600">{item.petty}</td>
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
                            <Button variant="outline" size="sm" onClick={() => openReviewModal(item)} className="h-8 w-8 p-0" title="Lihat Detail">
                              <Eye className="w-4 h-4 text-slate-600" />
                            </Button>
                            {item.status === 'Menunggu' && (
                              <>
                                <Button variant="outline" size="sm" onClick={() => handleApproveReject(item.id, 'APPROVED')} className="h-8 w-8 p-0 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600" title="Setujui">
                                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => handleApproveReject(item.id, 'REJECTED')} className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Tolak">
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
                  Menampilkan <span className="font-medium text-slate-700">{eodData.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-medium text-slate-700">{startIndex + eodData.length}</span> data
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
        </TabsContent>

        <TabsContent value="pettycash" className="mt-6 focus-visible:outline-none">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col xl:flex-row justify-between xl:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Transaksi Petty Cash</CardTitle>
                <CardDescription>Pencatatan pengeluaran kas kecil dari setiap cabang.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari transaksi..." 
                    className="pl-9 pr-4 py-2 border-2 border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <GlobalFilter 
                  onFilterChange={(branchId, period) => {
                    console.log("Filter petty cash:", branchId, period);
                  }}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                    <tr>
                      <th className="px-6 py-4 font-medium">ID Transaksi</th>
                      <th className="px-6 py-4 font-medium">Cabang</th>
                      <th className="px-6 py-4 font-medium">Tanggal</th>
                      <th className="px-6 py-4 font-medium">Keterangan</th>
                      <th className="px-6 py-4 font-medium text-right">Nominal</th>
                      <th className="px-6 py-4 font-medium">Dilaporkan Oleh</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pettyCashData.map((item, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">{item.id}</td>
                        <td className="px-6 py-4 text-slate-600">{item.branch}</td>
                        <td className="px-6 py-4 text-slate-600">{item.date}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium">{item.desc}</td>
                        <td className="px-6 py-4 text-rose-600 font-bold text-right">- {item.amount}</td>
                        <td className="px-6 py-4 text-slate-600">{item.by}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && selectedEOD && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeReviewModal}
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
                  <h3 className="text-xl font-bold text-slate-800">Review EOD</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">{selectedEOD.branch} • {selectedEOD.date}</p>
                </div>
                <button 
                  onClick={closeReviewModal}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 border-dashed">
                    <span className="text-sm font-bold text-slate-700">Total Omzet</span>
                    <span className="text-lg font-extrabold text-slate-900">{selectedEOD.omzet}</span>
                  </div>
                  
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">Tunai (Cash)</span>
                      <span className="text-sm font-bold text-slate-700">{selectedEOD.cash || 'Rp 0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">EDC</span>
                      <span className="text-sm font-bold text-slate-700">{selectedEOD.edc || 'Rp 0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-500">QRIS</span>
                      <span className="text-sm font-bold text-slate-700">{selectedEOD.qris || 'Rp 0'}</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-slate-200 my-2"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Pengeluaran Petty Cash</span>
                    <span className="text-sm font-bold text-rose-600">- {selectedEOD.pettyCash || selectedEOD.petty}</span>
                  </div>
                  
                  <div className="w-full h-px bg-slate-200 my-2"></div>

                  <div className="flex justify-between items-center bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <span className="text-sm font-bold text-emerald-800">Setoran Bersih (Cash - Petty Cash)</span>
                    <span className="text-lg font-extrabold text-emerald-600">{selectedEOD.setoranBersih || 'Rp 0'}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-pink-600 hover:bg-pink-50 hover:border-pink-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Printer className="w-4 h-4 mr-2" /> Cetak
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 font-semibold h-11 rounded-xl transition-all cursor-pointer">
                    <Download className="w-4 h-4 mr-2" /> Unduh PDF
                  </Button>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/80 flex flex-col sm:flex-row gap-3">
                <Button onClick={() => handleApproveReject(selectedEOD.id, 'REJECTED')} className="flex-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold h-12 rounded-xl transition-all border-none cursor-pointer">
                  <XIcon className="w-5 h-5 mr-2" /> Tolak
                </Button>
                <Button onClick={() => handleApproveReject(selectedEOD.id, 'APPROVED')} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <Check className="w-5 h-5 mr-2" /> Setujui EOD
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function EODApprovalPage() {
  return (
    <Suspense fallback={<div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <EODApprovalContent />
    </Suspense>
  );
}
