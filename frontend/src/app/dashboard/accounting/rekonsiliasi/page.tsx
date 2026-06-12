import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, CheckCircle, AlertTriangle, Building, CreditCard } from "lucide-react";

export default function RekonsiliasiBankPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Rekonsiliasi Bank</h1>
          <p className="text-slate-600 mt-1">Bandingkan saldo rekening bank dengan pencatatan sistem penjualan POS.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Rekonsiliasi Baru
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-sm border-slate-200 bg-emerald-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Saldo Bank (BCA, Mandiri, BNI)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 flex items-center">
              <Building className="w-6 h-6 mr-3 text-slate-400" />
              Rp 342.150.000
            </div>
            <p className="text-xs text-slate-500 mt-2">Terakhir diperbarui: 11 Jun 2026, 09:00</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-blue-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pencatatan Sistem (EDC & Transfer)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800 flex items-center">
              <CreditCard className="w-6 h-6 mr-3 text-slate-400" />
              Rp 342.150.000
            </div>
            <p className="text-xs text-slate-500 mt-2">Berdasarkan laporan EOD yang disetujui</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Rekonsiliasi</CardTitle>
            <CardDescription>Catatan pencocokan saldo per hari/minggu.</CardDescription>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari tanggal atau rekening..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Tanggal Rekonsiliasi</th>
                  <th className="px-6 py-4 font-medium">Rekening Bank</th>
                  <th className="px-6 py-4 font-medium">Saldo Bank</th>
                  <th className="px-6 py-4 font-medium">Pencatatan Sistem</th>
                  <th className="px-6 py-4 font-medium text-right">Selisih</th>
                  <th className="px-6 py-4 font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { date: "10 Jun 2026", account: "BCA - 123456789", bank: "Rp 125.500.000", system: "Rp 125.500.000", diff: "Rp 0", status: "match" },
                  { date: "10 Jun 2026", account: "Mandiri - 987654321", bank: "Rp 85.200.000", system: "Rp 85.200.000", diff: "Rp 0", status: "match" },
                  { date: "09 Jun 2026", account: "BCA - 123456789", bank: "Rp 110.000.000", system: "Rp 110.050.000", diff: "- Rp 50.000", status: "mismatch" },
                  { date: "08 Jun 2026", account: "BNI - 456123789", bank: "Rp 45.100.000", system: "Rp 45.100.000", diff: "Rp 0", status: "match" },
                  { date: "07 Jun 2026", account: "BCA - 123456789", bank: "Rp 98.400.000", system: "Rp 98.400.000", diff: "Rp 0", status: "match" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600">{item.date}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.account}</td>
                    <td className="px-6 py-4 text-slate-800">{item.bank}</td>
                    <td className="px-6 py-4 text-slate-800">{item.system}</td>
                    <td className={`px-6 py-4 text-right font-medium ${item.diff === 'Rp 0' ? 'text-slate-500' : 'text-rose-600'}`}>{item.diff}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {item.status === 'match' ? (
                          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <CheckCircle className="w-3.5 h-3.5 mr-1" /> Cocok
                          </div>
                        ) : (
                          <div className="flex items-center text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full text-xs font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Selisih
                          </div>
                        )}
                      </div>
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
