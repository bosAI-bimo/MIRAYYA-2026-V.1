import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Calculator, CheckCircle2, FileText, Filter } from "lucide-react";

export default function PayrollPage() {
  const payrollData = [
    { id: "PR-001", name: "Siti Rahma", role: "HR Manager", branch: "Pusat", baseSalary: "Rp 8.000.000", allowance: "Rp 1.000.000", deduction: "Rp 150.000", net: "Rp 8.850.000", status: "Generated" },
    { id: "PR-002", name: "Budi Santoso", role: "Accounting", branch: "Pusat", baseSalary: "Rp 7.500.000", allowance: "Rp 1.000.000", deduction: "Rp 0", net: "Rp 8.500.000", status: "Generated" },
    { id: "PR-003", name: "Anita Wijaya", role: "BA", branch: "Mirayya Sudirman", baseSalary: "Rp 4.500.000", allowance: "Rp 800.000", deduction: "Rp 50.000", net: "Rp 5.250.000", status: "Pending" },
    { id: "PR-004", name: "Rina Marlina", role: "Store Leader", branch: "Mirayya PIK", baseSalary: "Rp 5.500.000", allowance: "Rp 1.200.000", deduction: "Rp 0", net: "Rp 6.700.000", status: "Pending" },
    { id: "PR-005", name: "Dina Mariana", role: "BA", branch: "Mirayya Kelapa Gading", baseSalary: "Rp 4.500.000", allowance: "Rp 500.000", deduction: "Rp 250.000", net: "Rp 4.750.000", status: "Pending" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Payroll & Gaji</h1>
          <p className="text-slate-600 mt-1">Kelola perhitungan gaji, tunjangan, potongan, dan slip gaji.</p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Button variant="outline" className="border-slate-200 text-slate-600 flex-1 sm:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Rekap
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white flex-1 sm:flex-none">
            <Calculator className="w-4 h-4 mr-2" />
            Hitung Ulang
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pengeluaran Gaji (Estimasi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp 284.500.000</div>
            <p className="text-xs text-slate-500 mt-1">Periode Juni 2026</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Slip Gaji Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">12 / 58</div>
            <p className="text-xs text-slate-500 mt-1">Karyawan</p>
          </CardContent>
        </Card>
        
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Jadwal Penggajian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">25 Jun 2026</div>
            <p className="text-xs text-amber-600 font-medium mt-1">14 hari lagi</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bulan-ini" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="bulan-ini">Periode Bulan Ini</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bulan-ini" className="mt-4">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Daftar Payroll Juni 2026</CardTitle>
                <CardDescription>Berdasarkan data kehadiran 26 Mei - 25 Juni.</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama karyawan..."
                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary h-9 text-sm"
                  />
                </div>
                <Button variant="outline" size="icon" className="border-slate-200 text-slate-600 shrink-0 h-9 w-9">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Karyawan</th>
                      <th className="px-6 py-4">Gaji Pokok</th>
                      <th className="px-6 py-4 text-emerald-600">Tunjangan</th>
                      <th className="px-6 py-4 text-rose-600">Potongan</th>
                      <th className="px-6 py-4 font-semibold text-slate-800">Total Bersih</th>
                      <th className="px-6 py-4 text-center">Status Slip</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payrollData.map((pr) => (
                      <tr key={pr.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 whitespace-nowrap">{pr.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5 whitespace-nowrap">{pr.role} • {pr.branch}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{pr.baseSalary}</td>
                        <td className="px-6 py-4 text-emerald-600 whitespace-nowrap">+{pr.allowance}</td>
                        <td className="px-6 py-4 text-rose-600 whitespace-nowrap">-{pr.deduction}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{pr.net}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {pr.status === 'Generated' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Tersedia
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                              Belum Dibuat
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {pr.status === 'Generated' ? (
                            <Button variant="ghost" size="sm" className="text-primary hover:bg-rose-50 text-xs h-8">
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Unduh Slip
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-rose-50 text-xs h-8">
                              <FileText className="w-3.5 h-3.5 mr-1" />
                              Generate Slip
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="riwayat" className="mt-4">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Riwayat Payroll Belum Tersedia</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Sistem belum memiliki data riwayat payroll untuk periode sebelumnya. Data akan muncul di sini setelah payroll bulan ini diselesaikan.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
