"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Download, Calculator, CheckCircle2, FileText, Filter, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Eye, Calendar, Clock, Edit, Save, AlertCircle, Users, Check, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";

const formatRupiah = (number: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};



export default function PayrollPage() {
  const [payrollData, setPayrollData] = useState<any[]>([]);
  const [dbPayrollData, setDbPayrollData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [payrollHistoryData, setPayrollHistoryData] = useState<any[]>([]);

  // Pengaturan Payroll
  const [payrollPeriod, setPayrollPeriod] = useState("2026-06");
  const [payrollDate, setPayrollDate] = useState("2026-06-25");
  const [isCalculating, setIsCalculating] = useState(false);

  const fetchPayroll = async () => {
    try {
      // Fetch employees for current month generation
      const empRes = await fetcher('/hr/employees?limit=100');
      const employees = empRes.data || [];
      
      // Fetch actual generated payrolls
      const data = await fetcher('/hr/payroll');
      setDbPayrollData(data || []);
      
      const generatedMap = new Map();
      if (data && data.length > 0) {
        data.forEach((item: any) => {
          generatedMap.set(item.userId, item);
        });

        const historyMap: Record<string, any> = {};
        data.forEach((item: any) => {
          const p = item.period || 'Unknown Period';
          if (!historyMap[p]) {
            historyMap[p] = {
              id: `PH-${p}`,
              period: p,
              date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('id-ID') : '25 Jun 2026',
              totalEmployees: 0,
              totalAmount: 0,
              status: "Selesai"
            };
          }
          historyMap[p].totalEmployees += 1;
          historyMap[p].totalAmount += Number(item.netSalary);
        });
        
        const historyList = Object.values(historyMap).map((h: any) => ({
          ...h,
          totalAmount: formatRupiah(h.totalAmount)
        }));
        setPayrollHistoryData(historyList);
      }

      // Merge employees with generated payroll
      const formattedData = employees.map((emp: any) => {
        const generated = generatedMap.get(emp.id);
        if (generated) {
          return {
            id: emp.id,
            payrollId: generated.id,
            name: emp.name,
            role: emp.role || "Staff",
            branch: emp.branch || "Pusat",
            baseSalary: Number(generated.baseSalary) || 0,
            allowance: Number(generated.allowances) || 0,
            deduction: Number(generated.deductions) || 0,
            net: Number(generated.netSalary) || 0,
            status: "Generated",
            attendance: { hadir: 20, alpa: 0, cuti: 0, telat: 0 }
          };
        } else {
          return {
            id: emp.id,
            name: emp.name,
            role: emp.role || "Staff",
            branch: emp.branch || "Pusat",
            baseSalary: 3000000, // Default assumption
            allowance: 500000,
            deduction: 0,
            net: 3500000,
            status: "Pending",
            attendance: { hadir: 20, alpa: 0, cuti: 0, telat: 0 }
          };
        }
      });
      setPayrollData(formattedData);
    } catch(err: any) { 
      console.error(err);
      toast.error("Gagal memuat data payroll: " + err.message);
    }
  };

  React.useEffect(() => {
    fetchPayroll();
  }, []);

  const totalPages = Math.ceil(payrollData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = payrollData.slice(startIndex, startIndex + itemsPerPage);

  // States for Editing Modal
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    baseSalary: 0,
    allowance: 0,
    deduction: 0
  });

  const handleOpenEdit = (employee: any) => {
    setSelectedEmployee(employee);
    setEditForm({
      baseSalary: employee.baseSalary,
      allowance: employee.allowance,
      deduction: employee.deduction
    });
    setIsEditModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    // allow typing raw numbers
    const valueStr = e.target.value.replace(/[^0-9]/g, "");
    const value = valueStr ? parseInt(valueStr) : 0;
    setEditForm({
      ...editForm,
      [field]: value
    });
  };

  const calculateNet = () => {
    return editForm.baseSalary + editForm.allowance - editForm.deduction;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveEdit = async () => {
    try {
      setIsSubmitting(true);
      const net = calculateNet();
      
      // Post to backend
      await fetcher('/hr/payroll', {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedEmployee.id,
          period: '2026-06',
          baseSalary: editForm.baseSalary,
          allowances: editForm.allowance,
          deductions: editForm.deduction,
          netSalary: net,
          slipPdfUrl: null
        })
      });

      const updatedData = payrollData.map(emp => {
        if (emp.id === selectedEmployee.id) {
          return {
            ...emp,
            baseSalary: editForm.baseSalary,
            allowance: editForm.allowance,
            deduction: editForm.deduction,
            net: net,
            status: "Generated" // Auto generated after review
          };
        }
        return emp;
      });
      setPayrollData(updatedData);
      setIsEditModalOpen(false);
      toast.success('Slip gaji berhasil di-generate!');
      fetchPayroll();
    } catch(err: any) { toast.error("Error: " + err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleHitungUlang = async () => {
    try {
      setIsCalculating(true);
      // Simulate fetching latest attendance and calculating payroll
      let updatedCount = 0;
      for (const emp of payrollData) {
        if (emp.status === "Pending") {
          const net = emp.baseSalary + emp.allowance - emp.deduction;
          await fetcher('/hr/payroll', {
            method: 'POST',
            body: JSON.stringify({
              userId: emp.id,
              period: payrollPeriod,
              baseSalary: emp.baseSalary,
              allowances: emp.allowance,
              deductions: emp.deduction,
              netSalary: net,
              slipPdfUrl: null
            })
          });
          updatedCount++;
        }
      }
      
      if (updatedCount > 0) {
        toast.success(`Berhasil menghitung ulang ${updatedCount} karyawan!`);
        fetchPayroll();
      } else {
        toast.info("Semua gaji karyawan sudah terhitung untuk periode ini.");
      }
    } catch(err: any) {
      toast.error("Gagal menghitung ulang: " + err.message);
    } finally {
      setIsCalculating(false);
    }
  };

  const totalEstimated = payrollData.reduce((acc, curr) => acc + curr.net, 0);
  const generatedCount = payrollData.filter(p => p.status === 'Generated').length;

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/hr" className="hover:text-pink-600 transition-colors">Dashboard HR</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Payroll & Gaji</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Payroll & Gaji</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="border-slate-200 text-slate-600 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Ekspor Rekap
          </Button>
          <Button 
            disabled={isCalculating}
            onClick={handleHitungUlang} 
            className="bg-primary hover:bg-primary/90 text-white w-full sm:w-auto"
          >
            {isCalculating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calculator className="w-4 h-4 mr-2" />}
            Hitung Ulang
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pengeluaran Gaji (Estimasi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{formatRupiah(totalEstimated)}</div>
            <p className="text-xs text-slate-500 mt-1">Periode Juni 2026</p>
            <p className="text-xs text-slate-500 mt-1">Periode {payrollPeriod}</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Slip Gaji Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{generatedCount} / {payrollData.length}</div>
            <p className="text-xs text-slate-500 mt-1">Karyawan</p>
          </CardContent>
        </Card>
        
        <Card className="border-2 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Pengaturan Payroll</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 mt-1">
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Periode</Label>
                <input 
                  type="month" 
                  value={payrollPeriod}
                  onChange={(e) => setPayrollPeriod(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-pink-500" 
                />
              </div>
              <div>
                <Label className="text-xs text-slate-500 mb-1 block">Tanggal Gajian</Label>
                <input 
                  type="date" 
                  value={payrollDate}
                  onChange={(e) => setPayrollDate(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-pink-500" 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bulan-ini" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="bulan-ini">Periode Bulan Ini</TabsTrigger>
          <TabsTrigger value="riwayat">Riwayat Payroll</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bulan-ini" className="mt-4">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Daftar Payroll Juni 2026</CardTitle>
                <CardDescription>Berdasarkan data kehadiran 26 Mei - 25 Juni.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Cari nama karyawan..."
                    className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary h-9 text-sm"
                  />
                </div>
                <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[140px]">
                  <option value="all">Semua Cabang</option>
                  <option value="sudirman">Mirayya Sudirman</option>
                  <option value="kemang">Mirayya Kemang</option>
                  <option value="pik">Mirayya PIK</option>
                  <option value="kelapa_gading">Mirayya Kelapa Gading</option>
                  <option value="bintaro">Mirayya Bintaro</option>
                </select>
                <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
                  <option value="this_month">Bulan Ini</option>
                  <option value="last_month">Bulan Lalu</option>
                  <option value="this_year">Tahun Ini</option>
                </select>
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
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedData.map((pr) => (
                      <tr key={pr.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 whitespace-nowrap">{pr.name}</div>
                          <div className="text-slate-500 text-xs mt-0.5 whitespace-nowrap">{pr.role} • {pr.branch}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{formatRupiah(pr.baseSalary)}</td>
                        <td className="px-6 py-4 text-emerald-600 whitespace-nowrap">+{formatRupiah(pr.allowance)}</td>
                        <td className="px-6 py-4 text-rose-600 whitespace-nowrap">-{formatRupiah(pr.deduction)}</td>
                        <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">{formatRupiah(pr.net)}</td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {pr.status === 'Generated' ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              Generated
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700">
                              <AlertCircle className="w-3.5 h-3.5 mr-1" />
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          {pr.status === 'Generated' ? (
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleOpenEdit(pr)} className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 text-xs h-8">
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-primary hover:bg-rose-50 text-xs h-8">
                                <Download className="w-3.5 h-3.5 mr-1" />
                                Slip
                              </Button>
                            </div>
                          ) : (
                            <Button onClick={() => handleOpenEdit(pr)} variant="outline" size="sm" className="border-primary text-primary hover:bg-rose-50 text-xs h-8">
                              <Eye className="w-3.5 h-3.5 mr-1" />
                              Review & Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
                <div className="text-sm text-slate-500">
                  Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, payrollData.length)}</span> dari <span className="font-medium text-slate-700">{payrollData.length}</span> data
                </div>
                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(1)} 
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  <div className="flex items-center justify-center text-sm font-medium px-3 text-slate-600">
                    Halaman {currentPage} dari {totalPages}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(totalPages)} 
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Riwayat Tab */}
        <TabsContent value="riwayat" className="mt-4">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Payroll</CardTitle>
                <CardDescription>Data rekapitulasi penggajian bulan-bulan sebelumnya.</CardDescription>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari periode..."
                  className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-primary h-9 text-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4">Periode</th>
                      <th className="px-6 py-4">Tanggal Eksekusi</th>
                      <th className="px-6 py-4">Total Karyawan</th>
                      <th className="px-6 py-4">Total Pengeluaran</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payrollHistoryData.map((history) => (
                      <tr key={history.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800 flex items-center whitespace-nowrap">
                            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                            {history.period}
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5 ml-6 whitespace-nowrap">{history.id}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-slate-400" />
                          {history.date}
                        </td>
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                          {history.totalEmployees} Orang
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-800 whitespace-nowrap">
                          {history.totalAmount}
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200 border">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            {history.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Dialog>
                            {/* @ts-ignore */}
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-primary hover:bg-rose-50 text-xs h-8">
                                <Eye className="w-3.5 h-3.5 mr-1" />
                                Lihat Detail
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto bg-white text-left">
                              <DialogHeader>
                                <DialogTitle>Detail Payroll - {history.period}</DialogTitle>
                                <DialogDescription>
                                  Ringkasan data penggajian karyawan untuk periode {history.period}.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 my-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Tanggal Eksekusi</p>
                                    <p className="font-semibold text-slate-800">{history.date}</p>
                                  </div>
                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <p className="text-xs text-slate-500 mb-1">Total Karyawan</p>
                                    <p className="font-semibold text-slate-800">{history.totalEmployees} Orang</p>
                                  </div>
                                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 col-span-2 flex justify-between items-center">
                                    <div>
                                      <p className="text-xs text-slate-500 mb-1">Total Pengeluaran (Gaji Bersih)</p>
                                      <p className="font-bold text-xl text-slate-800">{history.totalAmount}</p>
                                    </div>
                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">{history.status}</Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-semibold text-slate-800 mb-3 mt-5">Rekap Per Cabang</h4>
                                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                      <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                          <th className="px-4 py-3 text-left font-medium text-slate-600">Cabang</th>
                                          <th className="px-4 py-3 text-right font-medium text-slate-600">Jumlah Karyawan</th>
                                          <th className="px-4 py-3 text-right font-medium text-slate-600">Total Gaji</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-slate-100">
                                        <tr className="hover:bg-slate-50/50">
                                          <td className="px-4 py-3 text-slate-800">Pusat</td>
                                          <td className="px-4 py-3 text-right text-slate-600">12</td>
                                          <td className="px-4 py-3 text-right font-medium text-slate-800">Rp 75.000.000</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50">
                                          <td className="px-4 py-3 text-slate-800">Mirayya Sudirman</td>
                                          <td className="px-4 py-3 text-right text-slate-600">10</td>
                                          <td className="px-4 py-3 text-right font-medium text-slate-800">Rp 48.500.000</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50">
                                          <td className="px-4 py-3 text-slate-800">Mirayya Kemang</td>
                                          <td className="px-4 py-3 text-right text-slate-600">9</td>
                                          <td className="px-4 py-3 text-right font-medium text-slate-800">Rp 42.000.000</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50/50">
                                          <td className="px-4 py-3 text-slate-800">Lainnya (3 Cabang)</td>
                                          <td className="px-4 py-3 text-right text-slate-600">27</td>
                                          <td className="px-4 py-3 text-right font-medium text-slate-800">Rp 117.000.000</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 mt-6">
                                <Button variant="outline" className="text-slate-600">
                                  <Download className="w-4 h-4 mr-2" />
                                  Unduh Rekap Laporan
                                </Button>
                                <Button className="bg-primary hover:bg-primary/90 text-white">
                                  <FileText className="w-4 h-4 mr-2" />
                                  Lihat Slip Karyawan
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit / Review Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader className="pb-4 border-b border-slate-100">
            <DialogTitle className="text-xl">Review & Edit Payroll</DialogTitle>
            <DialogDescription>
              Tinjau catatan kehadiran dan sesuaikan komponen gaji untuk {selectedEmployee?.name}.
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="py-4 space-y-6">
              {/* Profile Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{selectedEmployee.name}</h3>
                  <p className="text-slate-500 text-sm">{selectedEmployee.role} • {selectedEmployee.branch}</p>
                </div>
                <Badge variant="outline" className="bg-slate-50">
                  {selectedEmployee.id}
                </Badge>
              </div>

              {/* Attendance Summary Cards */}
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Ringkasan Kehadiran (26 Mei - 25 Jun)</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Hadir</p>
                    <p className="text-xl font-bold text-emerald-700">{selectedEmployee.attendance.hadir} <span className="text-xs font-normal">Hr</span></p>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-rose-600 font-medium mb-1">Alpa</p>
                    <p className="text-xl font-bold text-rose-700">{selectedEmployee.attendance.alpa} <span className="text-xs font-normal">Hr</span></p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                    <p className="text-xs text-amber-600 font-medium mb-1">Cuti</p>
                    <p className="text-xl font-bold text-amber-700">{selectedEmployee.attendance.cuti} <span className="text-xs font-normal">Hr</span></p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                    <p className="text-xs text-slate-600 font-medium mb-1">Telat</p>
                    <p className="text-xl font-bold text-slate-700">{selectedEmployee.attendance.telat} <span className="text-xs font-normal">x</span></p>
                  </div>
                </div>
              </div>

              {/* Editable Form */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center">
                  <Calculator className="w-4 h-4 mr-2 text-slate-400" />
                  Kalkulator Komponen Gaji
                </h4>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <Label className="col-span-4 text-slate-600">Gaji Pokok</Label>
                    <div className="col-span-8 relative">
                      <span className="absolute left-3 top-2.5 text-sm font-medium text-slate-400">Rp</span>
                      <Input 
                        value={new Intl.NumberFormat("id-ID").format(editForm.baseSalary)} 
                        onChange={(e) => handleFormChange(e, 'baseSalary')}
                        className="pl-9 font-medium text-slate-800 focus-visible:ring-primary"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <Label className="col-span-4 text-slate-600">Tunjangan (+)</Label>
                    <div className="col-span-8 relative">
                      <span className="absolute left-3 top-2.5 text-sm font-medium text-emerald-500">Rp</span>
                      <Input 
                        value={new Intl.NumberFormat("id-ID").format(editForm.allowance)} 
                        onChange={(e) => handleFormChange(e, 'allowance')}
                        className="pl-9 font-medium text-emerald-700 border-emerald-200 focus-visible:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-4 items-center">
                    <Label className="col-span-4 text-slate-600">Potongan (-)</Label>
                    <div className="col-span-8 relative">
                      <span className="absolute left-3 top-2.5 text-sm font-medium text-rose-500">Rp</span>
                      <Input 
                        value={new Intl.NumberFormat("id-ID").format(editForm.deduction)} 
                        onChange={(e) => handleFormChange(e, 'deduction')}
                        className="pl-9 font-medium text-rose-700 border-rose-200 focus-visible:ring-rose-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Result */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary/80 mb-1">Total Bersih (Estimasi)</p>
                  <p className="text-xs text-slate-500">Jumlah yang akan ditransfer ke karyawan</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{formatRupiah(calculateNet())}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 pt-4 mt-2 sm:justify-between">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>Batal</Button>
            <Button onClick={handleSaveEdit} disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Menyimpan..." : "Simpan & Generate Slip"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
