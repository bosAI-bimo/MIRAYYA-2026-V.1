import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, PieChart, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LaporanKeuanganPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Laporan Keuangan</h1>
          <p className="text-slate-600 mt-1">Laba-rugi, arus kas, dan penyesuaian jurnal keuangan per cabang.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
          <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer min-w-[140px]">
            <option value="all">Semua Cabang</option>
            <option value="sudirman">Mirayya Sudirman</option>
            <option value="kemang">Mirayya Kemang</option>
            <option value="pik">Mirayya PIK</option>
            <option value="kelapa_gading">Mirayya Kelapa Gading</option>
            <option value="bintaro">Mirayya Bintaro</option>
          </select>
          <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer min-w-[130px]">
            <option value="this_month">Bulan Ini</option>
            <option value="last_month">Bulan Lalu</option>
            <option value="this_year">Tahun Ini</option>
          </select>
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Konsolidasi
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200 hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-primary" />
              Laba Rugi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Laporan pendapatan, HPP, beban operasional, dan laba bersih.</p>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-primary h-8 p-0">Buka Laporan →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-primary" />
              Arus Kas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Laporan arus kas masuk dan keluar operasional cabang.</p>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-primary h-8 p-0">Buka Laporan →</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-slate-800 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Jurnal Penyesuaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">Entri jurnal manual untuk penyesuaian akhir bulan.</p>
            <div className="mt-4 flex justify-end">
              <Button variant="ghost" size="sm" className="text-primary h-8 p-0">Kelola Jurnal →</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border-slate-200 mt-6">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Ringkasan Laba Rugi (Juni 2026)</CardTitle>
            <CardDescription>Konsolidasi seluruh cabang.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            Pilih Periode
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Pendapatan Kotor</p>
                <p className="text-xl font-bold text-slate-800">Rp 450.200.000</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">HPP (Harga Pokok)</p>
                <p className="text-xl font-bold text-rose-600">- Rp 210.000.000</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-500 font-medium mb-1">Beban Operasional</p>
                <p className="text-xl font-bold text-rose-600">- Rp 115.700.000</p>
              </div>
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-primary font-medium mb-1">Laba Bersih</p>
                <p className="text-xl font-bold text-primary">Rp 124.500.000</p>
              </div>
            </div>

            <div className="w-full h-64 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center">
              <p className="text-slate-400 text-sm flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Grafik Laba Rugi akan ditampilkan di sini menggunakan Recharts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
