"use client";

import React from "react";
import { Search, MapPin, Store, MoreVertical, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockBranches = [
  { id: "BR-01", name: "Cabang Pusat", address: "Jl. Sudirman No. 123, Jakarta", manager: "Andi Saputra", employees: 12, performance: 104, target: 120000000, omzet: 125000000 },
  { id: "BR-02", name: "Cabang Utara", address: "Mall Kelapa Gading, Lt 2", manager: "Budi Santoso", employees: 8, performance: 94, target: 90000000, omzet: 85000000 },
  { id: "BR-03", name: "Cabang Selatan", address: "Pondok Indah Mall, Lt 1", manager: "Citra Lestari", employees: 9, performance: 118, target: 80000000, omzet: 95000000 },
  { id: "BR-04", name: "Cabang Timur", address: "Jl. Pemuda No. 45, Jakarta", manager: "Dewi Purnamasari", employees: 10, performance: 104, target: 105000000, omzet: 110000000 },
  { id: "BR-05", name: "Cabang Barat", address: "Central Park Mall, Lt UG", manager: "Eko Pratama", employees: 7, performance: 93, target: 75000000, omzet: 70000000 },
  { id: "BR-06", name: "Cabang Baru", address: "AEON Mall BSD, Lt 1", manager: "Fina Wijaya", employees: 5, performance: 90, target: 50000000, omzet: 45000000 },
];

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export default function OwnerCabangPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Cabang</h1>
          <p className="text-slate-500 mt-1">Pantau performa dan detail informasi setiap cabang Mirayya.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari cabang..." 
              className="pl-9 w-full md:w-[250px] bg-white border-slate-200"
            />
          </div>
          <Button className="bg-[#B76E79] hover:bg-[#9A5A66] text-white">
            <Store className="w-4 h-4 mr-2" />
            Tambah Cabang
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama Cabang</th>
                  <th className="px-6 py-4">Kepala Toko</th>
                  <th className="px-6 py-4">Alamat</th>
                  <th className="px-6 py-4 text-center">Jumlah Karyawan</th>
                  <th className="px-6 py-4 text-right">Target & Omzet (Bulan Ini)</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockBranches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded bg-[#F3D3D3] text-[#B76E79] flex items-center justify-center font-bold mr-3">
                          {branch.name.charAt(7) || 'C'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{branch.name}</div>
                          <div className="text-xs text-slate-500">{branch.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">{branch.manager}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-start text-slate-600 max-w-[200px]">
                        <MapPin className="w-4 h-4 mr-1.5 mt-0.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate" title={branch.address}>{branch.address}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                        {branch.employees} orang
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="font-medium text-slate-800">{formatRupiah(branch.omzet)}</div>
                      <div className="text-xs mt-0.5 flex items-center justify-end">
                        <span className="text-slate-500 mr-2">Target: {formatRupiah(branch.target)}</span>
                        <span className={`font-bold ${branch.performance >= 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          ({branch.performance}%)
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 text-slate-600 border-slate-200 hover:bg-slate-100">
                          <ExternalLink className="w-4 h-4 mr-1.5" />
                          Detail
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
