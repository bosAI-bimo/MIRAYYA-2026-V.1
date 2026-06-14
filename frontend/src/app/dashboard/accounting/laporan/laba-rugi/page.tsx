"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data for the chart
const monthlyData = [
  { name: "Jan", Pendapatan: 400000000, HPP: 200000000, Beban: 100000000 },
  { name: "Feb", Pendapatan: 300000000, HPP: 150000000, Beban: 90000000 },
  { name: "Mar", Pendapatan: 450000000, HPP: 210000000, Beban: 110000000 },
  { name: "Apr", Pendapatan: 380000000, HPP: 180000000, Beban: 95000000 },
  { name: "Mei", Pendapatan: 420000000, HPP: 200000000, Beban: 105000000 },
  { name: "Jun", Pendapatan: 450200000, HPP: 210000000, Beban: 115700000 },
];

export default function LabaRugiPage() {
  const [branch, setBranch] = useState("all");
  const [period, setPeriod] = useState("this_month");

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/accounting" className="hover:text-pink-600 transition-colors">Accounting</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <Link href="/dashboard/accounting/laporan" className="hover:text-pink-600 transition-colors">Laporan Keuangan</Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Laba Rugi</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Laporan Laba Rugi</h1>
          <p className="text-slate-500">Analisis komprehensif pendapatan, HPP, dan beban operasional.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <select 
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer min-w-[140px] w-full sm:w-auto"
          >
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <select 
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer min-w-[130px]"
          >
            <option value="this_month">Bulan Ini (Juni 2026)</option>
            <option value="last_month">Bulan Lalu (Mei 2026)</option>
            <option value="this_year">Tahun Ini (2026)</option>
          </select>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Ekspor PDF/Excel
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Pendapatan Kotor</p>
                <p className="text-2xl font-bold text-slate-800">Rp 450.200.000</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">+8% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total HPP</p>
                <p className="text-2xl font-bold text-rose-600">Rp 210.000.000</p>
              </div>
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-rose-600 mt-2 font-medium">+5% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Beban Operasional</p>
                <p className="text-2xl font-bold text-rose-600">Rp 115.700.000</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">+10% dari bulan lalu</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-primary font-medium mb-1">Laba Bersih</p>
                <p className="text-2xl font-bold text-primary">Rp 124.500.000</p>
              </div>
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-primary mt-2 font-medium">+12% dari bulan lalu</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart and Detail Layout */}
      <div className="grid grid-cols-1 gap-6">
        
        {/* Chart */}
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Tren Laba Rugi 6 Bulan Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b'}}
                    tickFormatter={(value) => `Rp ${value / 1000000}Jt`}
                  />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, undefined]}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="Pendapatan" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="HPP" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="Beban" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Table Statement */}
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-lg font-semibold text-slate-800">
              Rincian Laba Rugi
            </CardTitle>
            <CardDescription>
              Periode: Juni 2026
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableBody>
                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-800" colSpan={2}>PENDAPATAN</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Pendapatan Penjualan</TableCell>
                    <TableCell className="text-right font-medium">Rp 450.200.000</TableCell>
                  </TableRow>
                  <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-t-2 border-emerald-100">
                    <TableCell className="font-bold text-emerald-800">Total Pendapatan Kotor</TableCell>
                    <TableCell className="text-right font-bold text-emerald-800">Rp 450.200.000</TableCell>
                  </TableRow>

                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-800" colSpan={2}>HARGA POKOK PENJUALAN (HPP)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Biaya Bahan Baku</TableCell>
                    <TableCell className="text-right font-medium">Rp 150.000.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Biaya Tenaga Kerja Langsung</TableCell>
                    <TableCell className="text-right font-medium">Rp 40.000.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Biaya Overhead Pabrik</TableCell>
                    <TableCell className="text-right font-medium">Rp 20.000.000</TableCell>
                  </TableRow>
                  <TableRow className="bg-rose-50/50 hover:bg-rose-50/50 border-t-2 border-rose-100">
                    <TableCell className="font-bold text-rose-800">Total HPP</TableCell>
                    <TableCell className="text-right font-bold text-rose-800">(Rp 210.000.000)</TableCell>
                  </TableRow>

                  <TableRow className="bg-primary/5 hover:bg-primary/5 border-t-2 border-primary/20">
                    <TableCell className="font-bold text-primary">LABA KOTOR</TableCell>
                    <TableCell className="text-right font-bold text-primary">Rp 240.200.000</TableCell>
                  </TableRow>

                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-800" colSpan={2}>BEBAN OPERASIONAL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Beban Gaji & Tunjangan</TableCell>
                    <TableCell className="text-right font-medium">Rp 65.000.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Beban Pemasaran</TableCell>
                    <TableCell className="text-right font-medium">Rp 25.000.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Beban Utilitas & Sewa</TableCell>
                    <TableCell className="text-right font-medium">Rp 15.000.000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Beban Penyusutan</TableCell>
                    <TableCell className="text-right font-medium">Rp 10.700.000</TableCell>
                  </TableRow>
                  <TableRow className="bg-rose-50/50 hover:bg-rose-50/50 border-t-2 border-rose-100">
                    <TableCell className="font-bold text-rose-800">Total Beban Operasional</TableCell>
                    <TableCell className="text-right font-bold text-rose-800">(Rp 115.700.000)</TableCell>
                  </TableRow>

                  <TableRow className="bg-primary hover:bg-primary/90 text-white border-t-2 border-primary/50">
                    <TableCell className="font-bold">LABA BERSIH</TableCell>
                    <TableCell className="text-right font-bold">Rp 124.500.000</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
