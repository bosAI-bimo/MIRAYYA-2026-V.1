"use client";

import React, { useState } from "react";
import { Search, UserPlus, Filter, ShieldCheck, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Data Karyawan</h1>
          <p className="text-muted-foreground mt-1">Akses penuh database karyawan Mirayya Cosmetics seluruh cabang.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select className="px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background cursor-pointer w-full sm:w-auto min-w-[140px] text-muted-foreground">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <UserPlus className="w-4 h-4 mr-2" />
            Tambah Karyawan
          </Button>
        </div>
      </div>

      <Card className="border-border shadow-sm">
        <div className="p-4 border-b border-border bg-muted/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Cari berdasarkan nama, posisi, atau cabang..." 
              className="pl-9 w-full bg-background border-border"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted text-muted-foreground font-medium border-b border-border">
                <tr>
                  <th className="px-6 py-4">Nama & ID</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4">Kontak</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-9 h-9 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold mr-3 border border-border">
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{emp.name}</div>
                          <div className="text-xs text-muted-foreground">{emp.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-foreground">
                        <ShieldCheck className="w-4 h-4 mr-1.5 text-muted-foreground" />
                        {emp.role}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-foreground">
                        <MapPin className="w-4 h-4 mr-1.5 text-muted-foreground" />
                        {emp.branch}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-foreground">
                        <Mail className="w-4 h-4 mr-1.5 text-muted-foreground" />
                        {emp.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Badge variant={emp.status === 'Aktif' ? 'success' : emp.status === 'Cuti' ? 'warning' : 'outline'}>
                        {emp.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="outline" size="sm" className="h-8 text-primary border-primary hover:bg-primary/10 hover:text-primary">
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredEmployees.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
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
