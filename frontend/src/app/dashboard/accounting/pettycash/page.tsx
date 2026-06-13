import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, FileText, Download, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PettyCashPage() {
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
                  <span className="text-slate-900">Petty Cash</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Petty Cash</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button variant="outline" className="border-primary text-primary hover:bg-secondary w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Ekspor PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Transaksi Petty Cash</CardTitle>
            <CardDescription>Menampilkan semua transaksi pengeluaran cabang.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari deskripsi..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full md:w-auto min-w-[140px]">
              <option value="all">Semua Cabang</option>
              <option value="sudirman">Mirayya Sudirman</option>
              <option value="kemang">Mirayya Kemang</option>
              <option value="pik">Mirayya PIK</option>
              <option value="kelapa_gading">Mirayya Kelapa Gading</option>
              <option value="bintaro">Mirayya Bintaro</option>
            </select>
            <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full md:w-auto min-w-[130px]">
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
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Deskripsi</th>
                  <th className="px-6 py-4 font-medium">Oleh</th>
                  <th className="px-6 py-4 font-medium text-right">Nominal</th>
                  <th className="px-6 py-4 font-medium text-center">Bukti</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { date: "11 Jun 2026", branch: "Mirayya Sudirman", desc: "Beli galon air (4 buah)", by: "Sari (Store Leader)", amount: "Rp 80.000" },
                  { date: "11 Jun 2026", branch: "Mirayya Sudirman", desc: "Tisu wajah & toilet", by: "Sari (Store Leader)", amount: "Rp 70.000" },
                  { date: "10 Jun 2026", branch: "Mirayya Kemang", desc: "Ongkir GoSend antar barang", by: "Budi (Store Leader)", amount: "Rp 45.000" },
                  { date: "09 Jun 2026", branch: "Mirayya PIK", desc: "Plastik sampah", by: "Rina (Store Leader)", amount: "Rp 35.000" },
                  { date: "09 Jun 2026", branch: "Mirayya Kelapa Gading", desc: "Beli lampu LED pengganti", by: "Tomo (Store Leader)", amount: "Rp 120.000" },
                  { date: "08 Jun 2026", branch: "Mirayya Bintaro", desc: "Beli spidol & lakban", by: "Nina (Store Leader)", amount: "Rp 55.000" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-800">{item.desc}</td>
                    <td className="px-6 py-4 text-slate-600">{item.by}</td>
                    <td className="px-6 py-4 text-right font-medium text-rose-600">- {item.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-primary hover:text-primary/80 hover:bg-secondary">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
