import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Filter, Plus, FileText, Download } from "lucide-react";

export default function PettyCashPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Petty Cash</h1>
          <p className="text-slate-600 mt-1">Pemantauan transaksi kas kecil dari seluruh cabang.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-primary text-primary hover:bg-secondary">
            <Download className="w-4 h-4 mr-2" />
            Ekspor PDF
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white">
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
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari deskripsi atau cabang..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Bulan Ini
            </Button>
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
