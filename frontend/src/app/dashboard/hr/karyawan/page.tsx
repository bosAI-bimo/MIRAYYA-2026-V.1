import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Filter } from "lucide-react";

export default function KaryawanPage() {
  const employees = [
    { id: "EMP-001", name: "Siti Rahma", email: "siti.hr@mirayya.com", role: "HR Manager", branch: "Pusat", status: "Aktif" },
    { id: "EMP-002", name: "Budi Santoso", email: "budi.acc@mirayya.com", role: "Accounting", branch: "Pusat", status: "Aktif" },
    { id: "EMP-003", name: "Anita Wijaya", email: "anita.ba@mirayya.com", role: "BA", branch: "Mirayya Sudirman", status: "Aktif" },
    { id: "EMP-004", name: "Rina Marlina", email: "rina.sl@mirayya.com", role: "Store Leader", branch: "Mirayya PIK", status: "Aktif" },
    { id: "EMP-005", name: "Dina Mariana", email: "dina.ba@mirayya.com", role: "BA", branch: "Mirayya Kelapa Gading", status: "Cuti" },
    { id: "EMP-006", name: "Sari Indah", email: "sari.ba@mirayya.com", role: "BA", branch: "Mirayya Kemang", status: "Nonaktif" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Karyawan</h1>
          <p className="text-slate-600 mt-1">Kelola data, role, dan penempatan cabang karyawan.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Karyawan
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Daftar Karyawan</CardTitle>
            <CardDescription>Semua karyawan aktif dan nonaktif di seluruh cabang.</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama atau ID..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
              />
            </div>
            <Button variant="outline" size="icon" className="border-slate-200 text-slate-600 shrink-0">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">ID Karyawan</th>
                  <th className="px-6 py-4">Nama & Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 font-medium">{emp.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">{emp.name}</div>
                      <div className="text-slate-500 text-xs mt-0.5">{emp.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{emp.branch}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        emp.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        emp.status === 'Cuti' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-primary hover:bg-rose-50">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>Menampilkan 1-6 dari 58 karyawan</div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled className="h-8">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="h-8 bg-slate-50">1</Button>
              <Button variant="outline" size="sm" className="h-8">2</Button>
              <Button variant="outline" size="sm" className="h-8">3</Button>
              <Button variant="outline" size="sm" className="h-8">Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
