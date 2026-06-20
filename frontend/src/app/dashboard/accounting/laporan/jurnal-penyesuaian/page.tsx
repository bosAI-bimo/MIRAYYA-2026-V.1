"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, FileText, PlusCircle, Filter, Calendar, Eye } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data structure format, populated via fetcher
import { fetcher } from "@/lib/api";

// Helper to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

export default function JurnalPenyesuaianPage() {
  const [branch, setBranch] = useState("all");
  const [period, setPeriod] = useState("this_month");
  
  // Filter state
  const [showFilter, setShowFilter] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Detail Modal state
  const [selectedJurnalId, setSelectedJurnalId] = useState<string | null>(null);
  
  const [initialJurnalData, setInitialJurnalData] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchJournals = async () => {
      try {
        const data = await fetcher('/accounting/journal-entries');
        if (data && data.length > 0) {
          const formatted = data.flatMap((item: any) => [
            {
              id: item.id.substring(0, 8), // Short UUID for display grouping
              tanggal: item.entryDate,
              akun: item.debitAccount,
              ref: "-",
              debit: Number(item.amount),
              kredit: 0,
              keterangan: item.description
            },
            {
              id: item.id.substring(0, 8),
              tanggal: item.entryDate,
              akun: item.creditAccount,
              ref: "-",
              debit: 0,
              kredit: Number(item.amount),
              keterangan: item.description
            }
          ]);
          setInitialJurnalData(formatted);
        }
      } catch (e) { console.error(e); }
    };
    fetchJournals();
  }, []);

  // Apply filters
  const filteredData = initialJurnalData.filter(item => {
    if (startDate && new Date(item.tanggal) < new Date(startDate)) return false;
    if (endDate && new Date(item.tanggal) > new Date(endDate)) return false;
    return true;
  });

  const totalDebit = filteredData.reduce((sum, item) => sum + item.debit, 0);
  const totalKredit = filteredData.reduce((sum, item) => sum + item.kredit, 0);
  const totalTransaksi = new Set(filteredData.map(item => item.id)).size;

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/accounting" className="hover:text-pink-600 transition-colors">Accounting</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link href="/dashboard/accounting/laporan" className="hover:text-pink-600 transition-colors">Laporan Keuangan</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Jurnal Penyesuaian</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Jurnal Penyesuaian</h1>
          <p className="text-slate-500">Pencatatan penyesuaian akhir periode untuk memastikan akurasi laporan keuangan.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <select 
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer min-w-[140px] w-full sm:w-auto"
          >
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer min-w-[130px]"
          >
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
          
          <Link href="/dashboard/accounting/laporan/jurnal-penyesuaian/buat">
            <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
              <PlusCircle className="w-4 h-4 mr-2" />
              Entri Jurnal Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Entri (Filter)</p>
                <p className="text-2xl font-bold text-slate-800">{totalTransaksi} Transaksi</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <FileText className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Debit</p>
                <p className="text-2xl font-bold text-primary">Rp {totalDebit.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <span className="font-bold text-lg">D</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Kredit</p>
                <p className="text-2xl font-bold text-rose-600">Rp {totalKredit.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <span className="font-bold text-lg">K</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table Statement */}
      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle className="text-lg font-semibold text-slate-800">
                Daftar Jurnal Penyesuaian
              </CardTitle>
              <CardDescription>
                {startDate && endDate ? `Periode: ${formatDate(startDate)} s/d ${formatDate(endDate)}` : "Semua jurnal pada periode terpilih."}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={showFilter ? "secondary" : "outline"} 
                size="sm" 
                className="flex items-center"
                onClick={() => setShowFilter(!showFilter)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilter ? "Tutup Filter" : "Filter Waktu"}
              </Button>
              <Button variant="outline" size="sm" className="flex items-center">
                <Download className="w-4 h-4 mr-2" />
                Ekspor
              </Button>
            </div>
          </div>
          
          {/* Filter Panel */}
          {showFilter && (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-col sm:flex-row gap-4 items-end animate-in slide-in-from-top-2 fade-in duration-200">
              <div className="space-y-1.5 w-full sm:w-auto">
                <label className="text-xs font-medium text-slate-600">Dari Tanggal</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full sm:w-48 pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-1.5 w-full sm:w-auto">
                <label className="text-xs font-medium text-slate-600">Sampai Tanggal</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full sm:w-48 pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">No. Jurnal</TableHead>
                  <TableHead className="font-semibold text-slate-700">Tanggal</TableHead>
                  <TableHead className="font-semibold text-slate-700">Akun</TableHead>
                  <TableHead className="font-semibold text-slate-700">Ref</TableHead>
                  <TableHead className="font-semibold text-slate-700">Keterangan</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Debit (Rp)</TableHead>
                  <TableHead className="text-right font-semibold text-slate-700">Kredit (Rp)</TableHead>
                  <TableHead className="text-center font-semibold text-slate-700 w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? filteredData.map((item, index) => {
                  const isCredit = item.kredit > 0;
                  const showHeader = index === 0 || item.id !== filteredData[index - 1].id;
                  const isLastOfGroup = index === filteredData.length - 1 || item.id !== filteredData[index + 1].id;
                  
                  return (
                    <TableRow key={index} className={isLastOfGroup && index !== filteredData.length - 1 ? "border-b-2 border-b-slate-200" : ""}>
                      <TableCell className="font-medium text-slate-700">
                        {showHeader ? item.id : ""}
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {showHeader ? formatDate(item.tanggal) : ""}
                      </TableCell>
                      <TableCell className={`${isCredit ? "pl-8 text-slate-600" : "font-medium text-slate-800"}`}>
                        {item.akun}
                      </TableCell>
                      <TableCell className="text-slate-500">{item.ref}</TableCell>
                      <TableCell className="text-slate-500 italic max-w-[200px] truncate" title={item.keterangan}>
                        {item.keterangan}
                      </TableCell>
                      <TableCell className="text-right text-slate-800">
                        {item.debit > 0 ? item.debit.toLocaleString('id-ID') : "-"}
                      </TableCell>
                      <TableCell className="text-right text-slate-800">
                        {item.kredit > 0 ? item.kredit.toLocaleString('id-ID') : "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {showHeader && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:bg-primary/10 h-8 px-2"
                            onClick={() => setSelectedJurnalId(item.id)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Detail
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                }) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                      Tidak ada data jurnal pada rentang waktu tersebut.
                    </TableCell>
                  </TableRow>
                )}
                {/* Total Row */}
                {filteredData.length > 0 && (
                  <TableRow className="bg-slate-50 hover:bg-slate-50 border-t-2 border-slate-300">
                    <TableCell colSpan={5} className="font-bold text-slate-800 text-right">TOTAL (FILTERED)</TableCell>
                    <TableCell className="text-right font-bold text-primary">
                      {totalDebit.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-right font-bold text-rose-600">
                      {totalKredit.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Jurnal Modal */}
      <Dialog open={!!selectedJurnalId} onOpenChange={(open) => !open && setSelectedJurnalId(null)}>
        <DialogContent className="sm:max-w-2xl bg-white p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">Detail Jurnal Penyesuaian</DialogTitle>
            <DialogDescription>
              Informasi lengkap rincian transaksi jurnal untuk referensi Anda.
            </DialogDescription>
          </DialogHeader>

          {selectedJurnalId && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">No. Jurnal</p>
                  <p className="text-sm font-bold text-slate-800">{selectedJurnalId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">Tanggal</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {formatDate(initialJurnalData.find(j => j.id === selectedJurnalId)?.tanggal || "")}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-500 mb-1">Keterangan Umum</p>
                  <p className="text-sm font-semibold text-slate-800">
                    {initialJurnalData.find(j => j.id === selectedJurnalId)?.keterangan || "-"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b pb-2">Rincian Transaksi</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-700">Akun</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Debit</TableHead>
                        <TableHead className="font-semibold text-slate-700 text-right">Kredit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {initialJurnalData
                        .filter(item => item.id === selectedJurnalId)
                        .map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className={`${item.kredit > 0 ? "pl-8 text-slate-600" : "font-medium text-slate-800"}`}>
                              {item.akun}
                            </TableCell>
                            <TableCell className="text-right text-slate-800">
                              {item.debit > 0 ? `Rp ${item.debit.toLocaleString('id-ID')}` : "-"}
                            </TableCell>
                            <TableCell className="text-right text-slate-800">
                              {item.kredit > 0 ? `Rp ${item.kredit.toLocaleString('id-ID')}` : "-"}
                            </TableCell>
                          </TableRow>
                      ))}
                      <TableRow className="bg-slate-50 border-t-2 border-slate-300">
                        <TableCell className="font-bold text-slate-800 text-right">Total</TableCell>
                        <TableCell className="text-right font-bold text-primary">
                          Rp {initialJurnalData.filter(i => i.id === selectedJurnalId).reduce((s, i) => s + i.debit, 0).toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell className="text-right font-bold text-rose-600">
                          Rp {initialJurnalData.filter(i => i.id === selectedJurnalId).reduce((s, i) => s + i.kredit, 0).toLocaleString('id-ID')}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={() => setSelectedJurnalId(null)}>Tutup</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
