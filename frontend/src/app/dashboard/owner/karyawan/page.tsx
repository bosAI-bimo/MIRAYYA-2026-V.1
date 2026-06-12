"use client";

import React, { useState } from "react";
import { Search, UserPlus, Filter, ShieldCheck, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const mockEmployees = [
  { id: "EMP-001", name: "Siti Rahma", role: "HR Manager", branch: "Head Office", email: "siti.hr@mirayya.com", status: "Aktif" },
  { id: "EMP-002", name: "Budi Santoso", role: "Kepala Toko", branch: "Cabang Utara", email: "budi.s@mirayya.com", status: "Aktif" },
  { id: "EMP-003", name: "Dina Mariana", role: "Beauty Advisor", branch: "Cabang Pusat", email: "dina.m@mirayya.com", status: "Aktif" },
  { id: "EMP-004", name: "Ahmad Fauzi", role: "Accounting", branch: "Head Office", email: "ahmad.f@mirayya.com", status: "Aktif" },
  { id: "EMP-005", name: "Rina Nose", role: "Beauty Advisor", branch: "Cabang Selatan", email: "rina.n@mirayya.com", status: "Aktif" },
  { id: "EMP-006", name: "Joko Anwar", role: "Kepala Toko", branch: "Cabang Timur", email: "joko.a@mirayya.com", status: "Cuti" },
  { id: "EMP-007", name: "Lestari", role: "Beauty Advisor", branch: "Cabang Barat", email: "lestari@mirayya.com", status: "Nonaktif" },
];

export default function OwnerKaryawanPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmployees = mockEmployees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.branch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Data Karyawan</h1>
          <p className="text-slate-500 mt-1">Akses penuh database karyawan Mirayya Cosmetics seluruh cabang.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-slate-600 border-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-[#B76E79] hover:bg-[#9A5A66] text-white">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </Button>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Cari berdasarkan nama, posisi, atau cabang..." 
              className="pl-9 w-full bg-white border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Nama & ID</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold mr-3 border border-slate-300">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{emp.name}</div>
                          <div className="text-xs text-slate-500">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-700">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-slate-400" />
                        {emp.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-700">
                        <MapPin className="w-4 h-4 mr-1.5 text-slate-400" />
                        {emp.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-slate-600">
                        <Mail className="w-4 h-4 mr-1.5 text-slate-400" />
                        {emp.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        emp.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 
                        emp.status === 'Cuti' ? 'bg-amber-100 text-amber-800' : 
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="outline" size="sm" className="h-8 text-[#B76E79] border-[#B76E79] hover:bg-[#F3D3D3] hover:text-[#9A5A66]">
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      Tidak ada karyawan yang cocok dengan pencarian &quot;{searchTerm}&quot;
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
