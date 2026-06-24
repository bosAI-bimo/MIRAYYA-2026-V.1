"use client";

import React, { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Calendar, FileText, ChevronRight, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const overtimeSchema = z.object({
  date: z.string().min(1, "Tanggal wajib diisi"),
  startTime: z.string().min(1, "Waktu mulai wajib diisi"),
  endTime: z.string().min(1, "Waktu selesai wajib diisi"),
  reason: z.string().min(5, "Alasan minimal 5 karakter"),
});

type OvertimeFormValues = z.infer<typeof overtimeSchema>;

export default function KaryawanLembur() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<OvertimeFormValues>({
    resolver: zodResolver(overtimeSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      startTime: "16:00",
      endTime: "18:00",
      reason: ""
    }
  });

  const loadData = () => {
    setLoading(true);
    fetcher('/employee/overtime')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (values: OvertimeFormValues) => {
    try {
      await fetcher('/employee/overtime', {
        method: 'POST',
        body: JSON.stringify(values)
      });
      toast.success("Pengajuan lembur berhasil dikirim");
      form.reset({
        date: new Date().toISOString().split('T')[0],
        startTime: "16:00",
        endTime: "18:00",
        reason: ""
      });
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengajukan lembur");
    }
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/karyawan" className="hover:text-pink-600 transition-colors">Dashboard Karyawan</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Lembur</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pengajuan Lembur</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Form Lembur</CardTitle>
              <CardDescription>Isi detail pengajuan lembur Anda.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Tanggal</label>
                  <Input type="date" {...form.register("date")} />
                  {form.formState.errors.date && <p className="text-xs text-rose-500">{form.formState.errors.date.message}</p>}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Mulai</label>
                    <Input type="time" {...form.register("startTime")} />
                    {form.formState.errors.startTime && <p className="text-xs text-rose-500">{form.formState.errors.startTime.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Selesai</label>
                    <Input type="time" {...form.register("endTime")} />
                    {form.formState.errors.endTime && <p className="text-xs text-rose-500">{form.formState.errors.endTime.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Alasan</label>
                  <textarea 
                    className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Contoh: Stock opname akhir bulan" 
                    {...form.register("reason")} 
                  />
                  {form.formState.errors.reason && <p className="text-xs text-rose-500">{form.formState.errors.reason.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Mengirim..." : "Kirim Pengajuan"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="border-2 shadow-sm border-slate-200 h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Riwayat Pengajuan</CardTitle>
              <CardDescription>Daftar lembur yang pernah Anda ajukan.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingScreen />
              ) : data.length === 0 ? (
                <div className="text-center p-8 text-slate-500">Belum ada riwayat pengajuan lembur.</div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {data.map((item: any, i: number) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors gap-4">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg shrink-0 ${
                          item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                          item.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          {item.status === 'APPROVED' ? <CheckCircle2 className="w-5 h-5" /> :
                           item.status === 'REJECTED' ? <XCircle className="w-5 h-5" /> :
                           <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{new Date(item.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          <div className="flex items-center text-xs text-slate-500 space-x-3 mt-1.5 font-medium">
                            <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {item.startTime} - {item.endTime}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-2">{item.reason}</p>
                        </div>
                      </div>
                      <div className="shrink-0 w-full sm:w-auto text-right">
                        <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                          item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                          item.status === 'REJECTED' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                          'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {item.status === 'APPROVED' ? 'Disetujui' : item.status === 'REJECTED' ? 'Ditolak' : 'Menunggu Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
