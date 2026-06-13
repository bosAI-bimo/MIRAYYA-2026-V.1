import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Search, Eye, Filter } from "lucide-react";

export default function POApprovalPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Persetujuan Purchase Order</h1>
          <p className="text-slate-600 mt-1">Review dan setujui pengajuan pesanan stok barang dari cabang.</p>
        </div>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-slate-800">Daftar Purchase Order</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari ID PO..." 
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
                {[
                  { id: "PO-2606-042", branch: "Mirayya Kelapa Gading", date: "11 Jun 2026", items: 45, total: "Rp 4.500.000", status: "Menunggu" },
                  { id: "PO-2606-043", branch: "Mirayya Sudirman", date: "11 Jun 2026", items: 20, total: "Rp 2.100.000", status: "Menunggu" },
                  { id: "PO-2606-040", branch: "Mirayya PIK", date: "10 Jun 2026", items: 120, total: "Rp 15.500.000", status: "Disetujui" },
                  { id: "PO-2606-039", branch: "Mirayya Kemang", date: "09 Jun 2026", items: 15, total: "Rp 1.800.000", status: "Disetujui" },
                  { id: "PO-2606-038", branch: "Mirayya Bintaro", date: "08 Jun 2026", items: 5, total: "Rp 850.000", status: "Ditolak" },
                ].map((item, i) => (
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
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Lihat Detail">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </Button>
                        {item.status === 'Menunggu' && (
                          <>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600" title="Setujui">
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </Button>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Tolak">
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
        </CardContent>
      </Card>
    </div>
  );
}
