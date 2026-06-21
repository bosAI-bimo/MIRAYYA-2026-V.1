"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, ChevronRight, BarChart3, TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import Link from "next/link";
import { GlobalFilter } from "@/components/ui/global-filter";
import { downloadFile } from "@/lib/export";
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
// Mock data for the chart
const monthlyData = [
  { name: "Jan", Pendapatan: 400000000, HPP: 200000000, Beban: 100000000 },
  { name: "Feb", Pendapatan: 300000000, HPP: 150000000, Beban: 90000000 },
  { name: "Mar", Pendapatan: 450000000, HPP: 210000000, Beban: 110000000 },
  { name: "Apr", Pendapatan: 380000000, HPP: 180000000, Beban: 95000000 },
  { name: "Mei", Pendapatan: 420000000, HPP: 200000000, Beban: 105000000 },
  { name: "Jun", Pendapatan: 450200000, HPP: 210000000, Beban: 115700000 },
];

import { fetcher } from "@/lib/api";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number || 0);
};

export default function LabaRugiPage() {
  const [branch, setBranch] = useState("all");
  const [period, setPeriod] = useState("this_month");
  
  const [data, setData] = useState({
    revenue: 0,
    cogs: 0,
    grossProfit: 0,
    operatingExpenses: 0,
    netProfit: 0
  });

  React.useEffect(() => {
    const fetchData = async () => {
      let monthStr = '2026-06';
      if (period === 'last_month') {
        monthStr = '2026-05';
      }

      try {
        const res = await fetcher(`/accounting/profit-loss?month=${monthStr}&branchId=${branch}`);
        if (res) setData(res);
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, [branch, period]);

  const handleExport = async () => {
    let monthStr = '2026-06';
    if (period === 'last_month') monthStr = '2026-05';
    const url = `http://localhost:5000/api/accounting/export/profit-loss?month=${monthStr}&branchId=${branch}`;
    await downloadFile(url, `Laporan-Laba-Rugi-${monthStr}.csv`);
  };

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
          <GlobalFilter 
            onFilterChange={(newBranch, newPeriod) => {
              setBranch(newBranch);
              setPeriod(newPeriod);
            }} 
          />
          <Button onClick={handleExport} className="bg-primary hover:bg-primary/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Ekspor CSV
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
                <p className="text-2xl font-bold text-slate-800">{formatRupiah(data.revenue)}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 font-medium">Berdasarkan EOD Approved</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total HPP</p>
                <p className="text-2xl font-bold text-rose-600">{formatRupiah(data.cogs)}</p>
              </div>
              <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                <TrendingDown className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-rose-600 mt-2 font-medium">Estimasi 40% dari Revenue</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-slate-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 font-medium mb-1">Beban Operasional</p>
                <p className="text-2xl font-bold text-rose-600">{formatRupiah(data.operatingExpenses)}</p>
              </div>
              <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">Berdasarkan Petty Cash</p>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-primary font-medium mb-1">Laba Bersih</p>
                <p className="text-2xl font-bold text-primary">{formatRupiah(data.netProfit)}</p>
              </div>
              <div className="p-2 bg-primary/20 rounded-lg text-primary">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-primary mt-2 font-medium">Gross Profit - Opex</p>
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
                    formatter={(value: any) => [`Rp ${(value as number).toLocaleString('id-ID')}`, undefined]}
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
                    <TableCell className="text-right font-medium">{formatRupiah(data.revenue)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-emerald-50/50 hover:bg-emerald-50/50 border-t-2 border-emerald-100">
                    <TableCell className="font-bold text-emerald-800">Total Pendapatan Kotor</TableCell>
                    <TableCell className="text-right font-bold text-emerald-800">{formatRupiah(data.revenue)}</TableCell>
                  </TableRow>

                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-800" colSpan={2}>HARGA POKOK PENJUALAN (HPP)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Biaya Bahan Baku dll (Estimasi Total)</TableCell>
                    <TableCell className="text-right font-medium">{formatRupiah(data.cogs)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-rose-50/50 hover:bg-rose-50/50 border-t-2 border-rose-100">
                    <TableCell className="font-bold text-rose-800">Total HPP</TableCell>
                    <TableCell className="text-right font-bold text-rose-800">({formatRupiah(data.cogs)})</TableCell>
                  </TableRow>

                  <TableRow className="bg-primary/5 hover:bg-primary/5 border-t-2 border-primary/20">
                    <TableCell className="font-bold text-primary">LABA KOTOR</TableCell>
                    <TableCell className="text-right font-bold text-primary">{formatRupiah(data.grossProfit)}</TableCell>
                  </TableRow>

                  <TableRow className="bg-slate-50 hover:bg-slate-50">
                    <TableCell className="font-semibold text-slate-800" colSpan={2}>BEBAN OPERASIONAL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="pl-6 text-slate-600">Total Pengeluaran Kas (Petty Cash)</TableCell>
                    <TableCell className="text-right font-medium">{formatRupiah(data.operatingExpenses)}</TableCell>
                  </TableRow>
                  <TableRow className="bg-rose-50/50 hover:bg-rose-50/50 border-t-2 border-rose-100">
                    <TableCell className="font-bold text-rose-800">Total Beban Operasional</TableCell>
                    <TableCell className="text-right font-bold text-rose-800">({formatRupiah(data.operatingExpenses)})</TableCell>
                  </TableRow>

                  <TableRow className="bg-primary hover:bg-primary/90 text-white border-t-2 border-primary/50">
                    <TableCell className="font-bold">LABA BERSIH</TableCell>
                    <TableCell className="text-right font-bold">{formatRupiah(data.netProfit)}</TableCell>
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
