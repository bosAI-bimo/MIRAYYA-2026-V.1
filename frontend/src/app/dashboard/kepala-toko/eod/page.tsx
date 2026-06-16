"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UploadCloud, CheckCircle2, FileCheck, ChevronRight, Wallet, Receipt } from "lucide-react";
import Link from "next/link";

import { fetcher } from "@/lib/api";

export default function EODPage() {
  const [eodData, setEodData] = React.useState({
    totalOmzet: '',
    cashAmount: '',
    edcAmount: '',
    qrisAmount: ''
  });
  
  const [pettyCash, setPettyCash] = React.useState({
    amount: '',
    description: ''
  });

  const [isSubmittingEod, setIsSubmittingEod] = React.useState(false);
  const [isSubmittingPc, setIsSubmittingPc] = React.useState(false);

  const handleSubmitEod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingEod(true);
      await fetcher('/store/eod-reports', {
        method: 'POST',
        body: JSON.stringify({
          branchId: '11111111-1111-1111-1111-111111111111', // Will be replaced by real auth branch
          reportDate: new Date().toISOString(),
          totalOmzet: parseFloat(eodData.totalOmzet) || 0,
          cashAmount: parseFloat(eodData.cashAmount) || 0,
          edcAmount: parseFloat(eodData.edcAmount) || 0,
          qrisAmount: parseFloat(eodData.qrisAmount) || 0,
          pettyCashUsed: 0,
          evidencePhotos: [],
          submittedBy: '00000000-0000-0000-0000-000000000000'
        })
      });
      alert('Laporan EOD berhasil dikirim!');
      setEodData({ totalOmzet: '', cashAmount: '', edcAmount: '', qrisAmount: '' });
    } catch(err: any) { alert("Error: " + err.message); }
    finally { setIsSubmittingEod(false); }
  };

  const handleSubmitPettyCash = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmittingPc(true);
      await fetcher('/store/petty-cash', {
        method: 'POST',
        body: JSON.stringify({
          branchId: '11111111-1111-1111-1111-111111111111',
          amount: parseFloat(pettyCash.amount) || 0,
          description: pettyCash.description,
          recordedBy: '00000000-0000-0000-0000-000000000000'
        })
      });
      alert('Penggunaan Petty Cash berhasil dicatat!');
      setPettyCash({ amount: '', description: '' });
    } catch(err: any) { alert("Error: " + err.message); }
    finally { setIsSubmittingPc(false); }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
                  <span className="text-slate-900">Laporan EOD</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Laporan End of Day (EOD)</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <select className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all">
            <option value="today">Hari Ini</option>
            <option value="yesterday">Kemarin</option>
            <option value="7days">7 Hari Terakhir</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="eod" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="eod" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Laporan Omzet
          </TabsTrigger>
          <TabsTrigger value="petty-cash" className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Petty Cash
          </TabsTrigger>
        </TabsList>

        <TabsContent value="eod">
          <form className="space-y-6">
            <Card className="border-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Ringkasan Omzet Hari Ini</CardTitle>
                <CardDescription>Masukkan total pendapatan berdasarkan metode pembayaran.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Total Omzet Keseluruhan</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
                      <Input type="number" className="pl-10" placeholder="0" value={eodData.totalOmzet} onChange={e => setEodData({...eodData, totalOmzet: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 my-4 pt-4">
                  <h4 className="text-sm font-semibold text-slate-800 mb-3">Rincian Pembayaran</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Tunai (Cash)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
                        <Input type="number" className="pl-10" placeholder="0" value={eodData.cashAmount} onChange={e => setEodData({...eodData, cashAmount: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Mesin EDC (Debit/Kredit)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
                        <Input type="number" className="pl-10" placeholder="0" value={eodData.edcAmount} onChange={e => setEodData({...eodData, edcAmount: e.target.value})} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">QRIS / Transfer</label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
                        <Input type="number" className="pl-10" placeholder="0" value={eodData.qrisAmount} onChange={e => setEodData({...eodData, qrisAmount: e.target.value})} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Bukti Foto</CardTitle>
                <CardDescription>Unggah foto struk settlement EDC atau bukti transfer setor tunai.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-1">Klik untuk unggah atau seret file ke sini</p>
                  <p className="text-xs text-slate-500">Mendukung format JPG, PNG (Maks. 5MB)</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-end p-4 rounded-b-lg">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8" onClick={handleSubmitEod} disabled={isSubmittingEod}>
                  <FileCheck className="w-4 h-4 mr-2" />
                  {isSubmittingEod ? "Mengirim..." : "Kirim Laporan EOD"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="petty-cash">
          <form className="space-y-6">
            <Card className="border-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Penggunaan Kas Kecil (Petty Cash)</CardTitle>
                <CardDescription>Masukkan detail penggunaan uang kas kecil hari ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Nominal Terpakai</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-500">Rp</span>
                      <Input type="number" className="pl-10" placeholder="0" value={pettyCash.amount} onChange={e => setPettyCash({...pettyCash, amount: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Keterangan</label>
                    <Input type="text" placeholder="Contoh: Beli air mineral galon" value={pettyCash.description} onChange={e => setPettyCash({...pettyCash, description: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800">Bukti Nota</CardTitle>
                <CardDescription>Unggah foto nota pengeluaran petty cash.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <UploadCloud className="w-10 h-10 text-slate-400 mb-4" />
                  <p className="text-sm font-medium text-slate-700 mb-1">Klik untuk unggah atau seret file ke sini</p>
                  <p className="text-xs text-slate-500">Mendukung format JPG, PNG (Maks. 5MB)</p>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 border-t border-slate-100 flex justify-end p-4 rounded-b-lg">
                <Button className="bg-primary hover:bg-primary/90 text-white px-8" onClick={handleSubmitPettyCash} disabled={isSubmittingPc}>
                  <FileCheck className="w-4 h-4 mr-2" />
                  {isSubmittingPc ? "Mengirim..." : "Kirim Laporan Petty Cash"}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
