"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function BuatJurnalPage() {
  const router = useRouter();
  
  // State for form
  const [newEntryDate, setNewEntryDate] = useState("");
  const [newEntryRef, setNewEntryRef] = useState("");
  const [newEntryDesc, setNewEntryDesc] = useState("");
  
  const [entries, setEntries] = useState([
    { akun: "", debit: "", kredit: "" },
    { akun: "", debit: "", kredit: "" }
  ]);

  const totalDebitInput = entries.reduce((sum, e) => sum + (Number(e.debit) || 0), 0);
  const totalKreditInput = entries.reduce((sum, e) => sum + (Number(e.kredit) || 0), 0);
  const isBalanced = totalDebitInput === totalKreditInput && totalDebitInput > 0;

  const handleSave = () => {
    // In a real app, this would submit to API
    // For now, just navigate back
    router.push("/dashboard/accounting/laporan/jurnal-penyesuaian");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
                  <Link href="/dashboard/accounting/laporan" className="hover:text-pink-600 transition-colors">Laporan</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link href="/dashboard/accounting/laporan/jurnal-penyesuaian" className="hover:text-pink-600 transition-colors">Jurnal Penyesuaian</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Buat Baru</span>
                </div>
              </li>
            </ol>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/accounting/laporan/jurnal-penyesuaian">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Buat Jurnal Baru</h1>
          </div>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-6">
          <CardTitle className="text-xl text-slate-800">Informasi Jurnal</CardTitle>
          <CardDescription>
            Lengkapi informasi tanggal, referensi, dan rincian transaksi jurnal. Pastikan total debit dan kredit seimbang (balance).
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          {/* General Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tanggal Transaksi <span className="text-rose-500">*</span></label>
              <input 
                type="date" 
                value={newEntryDate} 
                onChange={e => setNewEntryDate(e.target.value)} 
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">No. Referensi / Bukti</label>
              <input 
                type="text" 
                value={newEntryRef} 
                onChange={e => setNewEntryRef(e.target.value)} 
                placeholder="Contoh: BM-001" 
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Keterangan Umum <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                value={newEntryDesc} 
                onChange={e => setNewEntryDesc(e.target.value)} 
                placeholder="Keterangan singkat jurnal..." 
                className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" 
              />
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Account Details */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Rincian Akun</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-primary border-primary/20 hover:bg-primary/5"
                onClick={() => setEntries([...entries, { akun: "", debit: "", kredit: "" }])}
              >
                + Tambah Baris
              </Button>
            </div>
            
            {/* Table Header (Visual) */}
            <div className="hidden md:flex gap-4 mb-2 px-2">
              <div className="flex-1 text-sm font-semibold text-slate-500">Nama Akun</div>
              <div className="w-48 text-sm font-semibold text-slate-500">Debit (Rp)</div>
              <div className="w-48 text-sm font-semibold text-slate-500">Kredit (Rp)</div>
              <div className="w-10"></div>
            </div>

            <div className="space-y-3">
              {entries.map((entry, idx) => (
                <div 
                  key={idx} 
                  className="flex flex-col md:flex-row gap-3 md:gap-4 animate-in slide-in-from-bottom-2 fade-in duration-300 items-start md:items-center bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-lg border border-slate-100 md:border-none"
                >
                  <div className="w-full md:flex-1">
                    <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Nama Akun</label>
                    <input 
                      type="text"
                      placeholder="Ketik nama akun..."
                      value={entry.akun} 
                      onChange={e => {
                        const newEntries = [...entries];
                        newEntries[idx].akun = e.target.value;
                        setEntries(newEntries);
                      }}
                      className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                  
                  <div className="flex w-full md:w-auto gap-3">
                    <div className="flex-1 md:w-48 relative">
                      <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Debit</label>
                      <span className="absolute left-3 top-[11px] text-slate-400 text-sm font-medium md:top-[11px] md:block hidden">Rp</span>
                      <span className="absolute left-3 top-8 text-slate-400 text-sm font-medium md:hidden">Rp</span>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={entry.debit}
                        onChange={e => {
                          const newEntries = [...entries];
                          newEntries[idx].debit = e.target.value;
                          if(e.target.value) newEntries[idx].kredit = "";
                          setEntries(newEntries);
                        }}
                        className="w-full pl-9 pr-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" 
                      />
                    </div>
                    
                    <div className="flex-1 md:w-48 relative">
                      <label className="text-xs font-medium text-slate-500 md:hidden mb-1 block">Kredit</label>
                      <span className="absolute left-3 top-[11px] text-slate-400 text-sm font-medium md:top-[11px] md:block hidden">Rp</span>
                      <span className="absolute left-3 top-8 text-slate-400 text-sm font-medium md:hidden">Rp</span>
                      <input 
                        type="number" 
                        placeholder="0" 
                        value={entry.kredit}
                        onChange={e => {
                          const newEntries = [...entries];
                          newEntries[idx].kredit = e.target.value;
                          if(e.target.value) newEntries[idx].debit = "";
                          setEntries(newEntries);
                        }}
                        className="w-full pl-9 pr-3 py-2.5 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all" 
                      />
                    </div>
                  </div>

                  <div className="w-full md:w-10 flex justify-end md:justify-center mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (entries.length > 2) {
                          const newEntries = [...entries];
                          newEntries.splice(idx, 1);
                          setEntries(newEntries);
                        }
                      }}
                      disabled={entries.length <= 2}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        
        {/* Footer with Balance & Submit */}
        <CardFooter className="bg-slate-50/80 border-t border-slate-100 p-6 flex flex-col sm:flex-row justify-between items-center gap-4 rounded-b-xl">
          <div className="flex items-center gap-6 bg-white px-4 py-3 rounded-lg border-2 border-slate-200 shadow-sm w-full sm:w-auto">
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total Debit</p>
              <p className={`text-lg font-bold ${totalDebitInput === totalKreditInput && totalDebitInput > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                Rp {totalDebitInput.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200"></div>
            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Total Kredit</p>
              <p className={`text-lg font-bold ${totalDebitInput === totalKreditInput && totalKreditInput > 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                Rp {totalKreditInput.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="h-10 w-px bg-slate-200 hidden sm:block"></div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
              <p className={`text-sm font-bold ${isBalanced ? 'text-emerald-600' : 'text-rose-500'}`}>
                {isBalanced ? 'Seimbang (Balance)' : 'Tidak Balance'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none border-2" onClick={() => router.push("/dashboard/accounting/laporan/jurnal-penyesuaian")}>
              Batal
            </Button>
            <Button 
              disabled={!isBalanced} 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white shadow-md shadow-primary/20"
              onClick={handleSave}
            >
              <Save className="w-4 h-4 mr-2" />
              Simpan Jurnal
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
