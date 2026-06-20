"use client";

import React, { useState } from "react";
import { 
  Settings, 
  KeyRound, 
  Users, 
  ShieldAlert, 
  Save, 
  Search, 
  RefreshCcw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Dummy data for users
const mockUsers = [
  { id: "1", name: "Ibu Owner", email: "owner@mirayya.com", role: "owner", status: "active" },
  { id: "2", name: "Siti Rahma", email: "hr@mirayya.com", role: "hr", status: "active" },
  { id: "3", name: "Budi Santoso", email: "accounting@mirayya.com", role: "accounting", status: "active" },
  { id: "4", name: "Ahmad Store", email: "store@mirayya.com", role: "kepala-toko", status: "active" },
  { id: "5", name: "Jane Doe", email: "karyawan@mirayya.com", role: "karyawan", status: "inactive" },
];

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-pink-600" />
            Pengaturan Global
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola konfigurasi sistem dan manajemen akses pengguna.
          </p>
        </div>
        <Button className="bg-pink-600 hover:bg-pink-700 text-white shadow-sm">
          <Save className="w-4 h-4 mr-2" />
          Simpan Perubahan
        </Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 p-1 bg-slate-100 rounded-xl">
          <TabsTrigger value="users" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm transition-all">
            <Users className="w-4 h-4 mr-2" />
            Manajemen Pengguna
          </TabsTrigger>
          <TabsTrigger value="system" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-pink-600 data-[state=active]:shadow-sm transition-all">
            <Settings className="w-4 h-4 mr-2" />
            Sistem
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6">
          <Card className="border-slate-200/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50/50 pb-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">Daftar Pengguna</CardTitle>
                  <CardDescription>Kelola akses dan reset kata sandi pengguna.</CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Cari pengguna..."
                    className="pl-9 bg-white border-slate-200 focus-visible:ring-pink-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-medium">Nama Pengguna</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Peran (Role)</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-800">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 capitalize">
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Badge 
                            variant="outline" 
                            className={
                              user.status === 'active' 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }
                          >
                            {user.status === 'active' ? 'Aktif' : 'Non-aktif'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-amber-600 border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                            onClick={() => alert(`Reset password untuk ${user.name}?`)}
                          >
                            <KeyRound className="w-3.5 h-3.5 mr-1.5" />
                            Reset Password
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                          Pengguna tidak ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-indigo-500" />
                  Keamanan & Sesi
                </CardTitle>
                <CardDescription>Konfigurasi kebijakan kata sandi dan sesi login.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Batas Waktu Sesi (Jam)</label>
                  <Input type="number" defaultValue="24" className="bg-white" />
                  <p className="text-xs text-slate-500">Pengguna akan logout otomatis setelah waktu ini.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Panjang Minimal Kata Sandi</label>
                  <Input type="number" defaultValue="8" className="bg-white" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-sm">
              <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 text-sky-500" />
                  Sinkronisasi Data
                </CardTitle>
                <CardDescription>Pengaturan penjadwalan proses latar belakang.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Jadwal Sinkronisasi EOD</label>
                  <select className="flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 disabled:cursor-not-allowed disabled:opacity-50">
                    <option>Harian - 23:00</option>
                    <option>Harian - 00:00</option>
                    <option>Manual</option>
                  </select>
                </div>
                <Button variant="outline" className="w-full mt-2 text-sky-600 border-sky-200 hover:bg-sky-50">
                  Jalankan Sinkronisasi Sekarang
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
