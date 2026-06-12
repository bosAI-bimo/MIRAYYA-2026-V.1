import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, TrendingDown, Clock } from "lucide-react";

export default function BudgetingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Anggaran Cabang</h1>
        <p className="text-slate-600 mt-1">Pantau penggunaan anggaran operasional cabang bulan ini.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <Wallet className="w-4 h-4 mr-2 text-slate-400" />
              Total Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">Rp 5.000.000</div>
            <p className="text-xs text-slate-500 mt-1">Periode Juni 2026</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600 flex items-center">
              <TrendingDown className="w-4 h-4 mr-2 text-slate-400" />
              Terpakai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-rose-600">Rp 3.750.000</div>
            <div className="flex items-center mt-1">
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
                <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">75% dari total anggaran</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-primary flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Sisa Anggaran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">Rp 1.250.000</div>
            <p className="text-xs text-primary/70 mt-1">Tersedia untuk pengajuan</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Penggunaan Anggaran</CardTitle>
          <CardDescription>Daftar Purchase Order yang memotong anggaran bulan ini.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">ID Referensi</th>
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Keterangan</th>
                  <th className="px-4 py-3 font-medium text-right">Nominal</th>
                  <th className="px-4 py-3 font-medium rounded-tr-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">PO-202606-003</td>
                  <td className="px-4 py-3 text-slate-600">10 Jun 2026</td>
                  <td className="px-4 py-3 text-slate-600">Restock Lipstick & Serum</td>
                  <td className="px-4 py-3 font-medium text-right text-rose-600">- Rp 1.500.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Disetujui</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">PC-202606-002</td>
                  <td className="px-4 py-3 text-slate-600">08 Jun 2026</td>
                  <td className="px-4 py-3 text-slate-600">Petty Cash: Tisu & Sabun Cuci Tangan</td>
                  <td className="px-4 py-3 font-medium text-right text-rose-600">- Rp 250.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Disetujui</span>
                  </td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">PO-202606-001</td>
                  <td className="px-4 py-3 text-slate-600">02 Jun 2026</td>
                  <td className="px-4 py-3 text-slate-600">Restock Toner (Bulk)</td>
                  <td className="px-4 py-3 font-medium text-right text-rose-600">- Rp 2.000.000</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Disetujui</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
