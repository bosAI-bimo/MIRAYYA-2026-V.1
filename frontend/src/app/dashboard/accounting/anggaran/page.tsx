import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function BudgetPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Anggaran Cabang</h1>
          <p className="text-slate-600 mt-1">Kelola dan pantau penggunaan anggaran operasional per cabang.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Buat Anggaran Baru
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Anggaran Juni 2026</CardTitle>
            <CardDescription>Pemantauan realisasi anggaran bulan berjalan.</CardDescription>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari cabang..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-md text-sm w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Cabang</th>
                  <th className="px-6 py-4 font-medium">Total Anggaran</th>
                  <th className="px-6 py-4 font-medium">Terpakai</th>
                  <th className="px-6 py-4 font-medium">Sisa Anggaran</th>
                  <th className="px-6 py-4 font-medium">Status Pemakaian</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { branch: "Mirayya Sudirman", budget: "Rp 15.000.000", used: "Rp 12.500.000", sisa: "Rp 2.500.000", percentage: 83, status: "warning" },
                  { branch: "Mirayya Kemang", budget: "Rp 10.000.000", used: "Rp 4.200.000", sisa: "Rp 5.800.000", percentage: 42, status: "safe" },
                  { branch: "Mirayya PIK", budget: "Rp 12.000.000", used: "Rp 11.500.000", sisa: "Rp 500.000", percentage: 95, status: "danger" },
                  { branch: "Mirayya Kelapa Gading", budget: "Rp 10.000.000", used: "Rp 5.500.000", sisa: "Rp 4.500.000", percentage: 55, status: "safe" },
                  { branch: "Mirayya Bintaro", budget: "Rp 8.000.000", used: "Rp 7.800.000", sisa: "Rp 200.000", percentage: 97, status: "danger" },
                ].map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">{item.branch}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.budget}</td>
                    <td className="px-6 py-4 text-slate-600">{item.used}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.sisa}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              item.status === 'danger' ? 'bg-rose-500' : 
                              item.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-xs font-medium ${
                          item.status === 'danger' ? 'text-rose-600' : 
                          item.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                        }`}>{item.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="Edit Anggaran">
                          <Edit2 className="w-4 h-4 text-slate-600" />
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0 border-rose-200 hover:bg-rose-50 hover:text-rose-600" title="Hapus">
                          <Trash2 className="w-4 h-4 text-rose-500" />
                        </Button>
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
