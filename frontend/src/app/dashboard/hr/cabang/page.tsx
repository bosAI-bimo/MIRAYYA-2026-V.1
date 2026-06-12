import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, MapPin, MoreHorizontal, Phone, Users } from "lucide-react";

export default function CabangPage() {
  const branches = [
    { id: "BR-001", name: "Kantor Pusat", address: "Jl. Sudirman No. 1, Jakarta", phone: "021-555-0100", employees: 12, status: "Aktif" },
    { id: "BR-002", name: "Mirayya Sudirman", address: "Mall Sudirman Lt. G, Jakarta", phone: "021-555-0101", employees: 8, status: "Aktif" },
    { id: "BR-003", name: "Mirayya Kemang", address: "Jl. Kemang Raya No. 15, Jakarta", phone: "021-555-0102", employees: 10, status: "Aktif" },
    { id: "BR-004", name: "Mirayya PIK", address: "PIK Avenue Lt. 1, Jakarta", phone: "021-555-0103", employees: 9, status: "Aktif" },
    { id: "BR-005", name: "Mirayya Kelapa Gading", address: "MKG Lt. 2, Jakarta Utara", phone: "021-555-0104", employees: 11, status: "Aktif" },
    { id: "BR-006", name: "Mirayya Bintaro", address: "Bintaro Xchange Lt. G, Tangsel", phone: "021-555-0105", employees: 8, status: "Renovasi" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Data Cabang</h1>
          <p className="text-slate-600 mt-1">Kelola informasi cabang dan lokasi operasional.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Cabang
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Cabang Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">5</div>
            <p className="text-xs text-slate-500 mt-1">Cabang operasional saat ini</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Karyawan Cabang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">46</div>
            <p className="text-xs text-slate-500 mt-1">Tidak termasuk pusat</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Daftar Cabang</CardTitle>
            <CardDescription>Detail alamat, kontak, dan alokasi karyawan.</CardDescription>
          </div>
          <div className="flex items-center">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari nama cabang..."
                className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <div key={branch.id} className="border border-slate-200 rounded-lg p-5 hover:border-primary/40 transition-colors bg-white">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-primary">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">{branch.name}</h3>
                      <p className="text-xs text-slate-500">{branch.id}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-start text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 text-slate-400 shrink-0" />
                    <span className="line-clamp-2">{branch.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span>{branch.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <Users className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span>{branch.employees} Karyawan dialokasikan</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    branch.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {branch.status}
                  </span>
                  <Button variant="outline" size="sm" className="text-xs h-8 border-slate-200 text-slate-600">
                    Lihat Detail
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
