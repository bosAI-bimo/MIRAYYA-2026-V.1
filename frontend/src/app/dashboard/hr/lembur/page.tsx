"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, CheckCircle2, XCircle, Clock, Building2, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HRLembur() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  const loadData = () => {
    setLoading(true);
    fetcher('/hr/overtime?limit=50')
      .then(res => setData(res.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApproveReject = async (id: string, status: string) => {
    try {
      await fetcher(`/hr/overtime/${id}/approve`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      toast.success(`Pengajuan lembur ${status === 'APPROVED' ? 'disetujui' : 'ditolak'}`);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengupdate status");
    }
  };

  const pendingRequests = data.filter(d => d.status === "PENDING");
  const processedRequests = data.filter(d => d.status !== "PENDING");

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

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
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
                  <span className="text-slate-900">Persetujuan Lembur</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Persetujuan Lembur</h1>
          <p className="text-slate-500 font-medium">Review dan proses pengajuan lembur karyawan.</p>
        </div>
      </div>

      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex my-6 bg-slate-100/80 p-1.5 rounded-2xl md:rounded-full w-full overflow-x-auto no-scrollbar border-2 border-slate-200/50 shadow-inner max-w-[400px]">
            <TabsList className="bg-transparent p-0 flex gap-1 lg:gap-2 min-w-max h-auto w-full">
              <TabsTrigger 
                value="pending" 
                className="w-full rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer"
              >
                Menunggu Review ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger 
                value="processed" 
                className="w-full rounded-xl md:rounded-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm px-4 py-2.5 text-slate-500 hover:text-slate-700 transition-all font-semibold text-sm cursor-pointer"
              >
                Riwayat
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pending" className="mt-6">
            <Card className="border-2 shadow-sm border-slate-200">
              <CardContent className="p-0">
                {loading ? (
                  <LoadingScreen />
                ) : pendingRequests.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-medium">Tidak ada pengajuan lembur yang perlu direview.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {pendingRequests.map((item, i) => (
                      <div key={i} className="p-6 hover:bg-slate-50 transition-colors group">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <User className="w-5 h-5 text-slate-400" />
                              <span className="font-bold text-slate-800 text-lg">{item.userName}</span>
                              <span className="text-sm font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md flex items-center">
                                <Building2 className="w-3 h-3 mr-1" /> {item.branchName || "Pusat"}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                              <div>
                                <p className="text-xs text-slate-500 font-medium mb-1">Tanggal Lembur</p>
                                <p className="font-bold text-slate-700">
                                  {new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 font-medium mb-1">Waktu</p>
                                <p className="font-bold text-slate-700 flex items-center">
                                  <Clock className="w-4 h-4 mr-1.5 text-primary" />
                                  {item.startTime} - {item.endTime}
                                </p>
                              </div>
                              <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                                <p className="text-xs text-slate-500 font-medium mb-1">Alasan / Keterangan</p>
                                <p className="text-sm text-slate-700 italic">"{item.reason}"</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex md:flex-col gap-3 shrink-0">
                            <Button 
                              onClick={() => handleApproveReject(item.id, 'APPROVED')}
                              className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 w-full md:w-32 shadow-sm"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-2" /> Setujui
                            </Button>
                            <Button 
                              onClick={() => handleApproveReject(item.id, 'REJECTED')}
                              variant="outline"
                              className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 w-full md:w-32 shadow-sm"
                            >
                              <XCircle className="w-4 h-4 mr-2" /> Tolak
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processed" className="mt-6">
            <Card className="border-2 shadow-sm border-slate-200">
              <CardContent className="p-0">
                {loading ? (
                  <LoadingScreen />
                ) : processedRequests.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 font-medium">Belum ada riwayat pengajuan lembur.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-6 py-4">Karyawan</th>
                          <th className="px-6 py-4">Tanggal & Waktu</th>
                          <th className="px-6 py-4">Alasan</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {processedRequests.map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <p className="font-bold text-slate-800">{item.userName}</p>
                              <p className="text-xs text-slate-500">{item.branchName || "Pusat"}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="font-medium text-slate-700">{item.date}</p>
                              <p className="text-xs text-slate-500">{item.startTime} - {item.endTime}</p>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm text-slate-600 max-w-[250px] truncate" title={item.reason}>{item.reason}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                'bg-rose-100 text-rose-700 border border-rose-200'
                              }`}>
                                {item.status === 'APPROVED' ? 'Disetujui' : 'Ditolak'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
