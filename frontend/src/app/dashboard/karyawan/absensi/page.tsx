"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, Clock, Filter, Search, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";



export default function AbsensiKaryawan() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<"idle" | "capturing" | "success">("idle");
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLemburModalOpen, setIsLemburModalOpen] = useState(false);
  const itemsPerPage = 5;

  const fetchHistory = async () => {
    try {
      const data = await fetcher('/hr/attendance-log');
      // For Karyawan dashboard, we should filter by their userId, 
      // but we will show all or a mocked subset for now since auth isn't fully wired.
      setHistoryData(data || []);
    } catch(err) { console.error(err); }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const totalPages = Math.max(1, Math.ceil(historyData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = historyData.slice(startIndex, startIndex + itemsPerPage);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    setCheckInStatus("capturing");
    
    try {
      // Simulate capturing photo and GPS delay
      await new Promise(r => setTimeout(r, 1000));

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

      await fetcher('/hr/attendance', {
        method: 'POST',
        body: JSON.stringify({
          attendanceDate: dateStr,
          timeIn: timeStr,
          locationGps: '-6.200000, 106.816666'
        })
      });

      setCheckInStatus("success");
      fetchHistory(); // refresh data
      setTimeout(() => {
        setIsCheckingIn(false);
        setCheckInStatus("idle");
      }, 2000);
    } catch(err: any) {
      alert("Gagal Check-In: " + err.message);
      setIsCheckingIn(false);
      setCheckInStatus("idle");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
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
                  <span className="text-slate-900">Absensi Harian</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Absensi Harian</h1>
        </div>
        <div className="flex sm:justify-end mt-4 md:mt-0">
          <Button onClick={() => setIsLemburModalOpen(true)} className="bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajukan Lembur
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Form Check In / Check Out */}
        <Card className="border-2 border-slate-200">
          <CardHeader>
            <CardTitle>Mulai Sif Anda</CardTitle>
            <CardDescription>Pastikan wajah Anda terlihat jelas dan lokasi aktif</CardDescription>
          </CardHeader>
          <CardContent>
            {isCheckingIn && checkInStatus === "capturing" ? (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300">
                <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
                <p className="text-slate-600 font-medium text-center">
                  Mengambil lokasi GPS dan foto selfie...
                </p>
              </div>
            ) : isCheckingIn && checkInStatus === "success" ? (
              <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p className="text-emerald-700 font-medium text-center text-lg">
                  Check-In Berhasil!
                </p>
                <p className="text-emerald-600 text-sm mt-1">08:00 WIB • Mirayya Pusat</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm">Lokasi saat ini: <strong className="text-slate-800">Mirayya Pusat (Akurasi: 5m)</strong></span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-32 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white"
                    onClick={handleCheckIn}
                  >
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Camera className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">Check-In</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-32 rounded-2xl flex flex-col items-center justify-center gap-3 border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                    disabled
                  >
                    <div className="w-12 h-12 bg-slate-200/50 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">Check-Out</span>
                  </Button>
                </div>
                <p className="text-xs text-center text-slate-500 font-medium">
                  Check-out hanya bisa dilakukan setelah Anda check-in.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Tambahan */}
        <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white border-none shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Informasi Sif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Jadwal Hari Ini</p>
              <p className="text-lg font-medium text-slate-800">08:00 - 16:00 WIB</p>
            </div>
            <div className="w-full h-px bg-slate-200"></div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">Total Jam Kerja Bulan Ini</p>
              <p className="text-lg font-medium text-slate-800">144 Jam</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Riwayat Absensi */}
      <Card className="border-2 border-slate-200">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Riwayat Absensi</CardTitle>
            <CardDescription>Data kehadiran Anda bulan ini</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari tanggal..." 
                className="flex h-9 w-full rounded-[calc(var(--radius)-2px)] border border-border bg-background pl-9 pr-3 py-2 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              />
            </div>
            <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
              <option value="this_month">Bulan Ini</option>
              <option value="last_month">Bulan Lalu</option>
              <option value="this_year">Tahun Ini</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-600 uppercase bg-slate-100 rounded-md">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-md">Tanggal</th>
                  <th className="px-4 py-3 font-semibold">Check-In</th>
                  <th className="px-4 py-3 font-semibold">Check-Out</th>
                  <th className="px-4 py-3 font-semibold">Durasi</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-md text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.attendanceDate || row.date}</td>
                    <td className="px-4 py-3 text-slate-600">{row.timeIn || row.in || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.timeOut || row.out || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.duration || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        (row.status === 'Tepat Waktu' || row.timeIn) ? 'bg-emerald-100 text-emerald-700' : 
                        row.status === 'Terlambat' ? 'bg-rose-100 text-rose-700' : 
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {row.status || 'Hadir'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-primary hover:bg-primary/10" 
                        title="Lihat Detail"
                        onClick={() => {
                          setSelectedRecord({
                            date: row.attendanceDate || row.date,
                            in: row.timeIn || row.in || '-',
                            out: row.timeOut || row.out || '-',
                            duration: row.duration || '-',
                            status: row.status || 'Hadir'
                          });
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-md mt-4">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, historyData.length)}</span> dari <span className="font-medium text-slate-700">{historyData.length}</span> data
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

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Absensi</DialogTitle>
            <DialogDescription>
              Informasi lengkap kehadiran Anda pada tanggal tersebut.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">Tanggal</span>
                <span className="text-base font-semibold text-slate-800">{selectedRecord.date}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Check-In</span>
                  <span className="text-base text-slate-800">{selectedRecord.in}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Check-Out</span>
                  <span className="text-base text-slate-800">{selectedRecord.out}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">Durasi Kerja</span>
                <span className="text-base text-slate-800">{selectedRecord.duration}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">Status</span>
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    selectedRecord.status === 'Tepat Waktu' ? 'bg-emerald-100 text-emerald-700' : 
                    selectedRecord.status === 'Terlambat' ? 'bg-rose-100 text-rose-700' : 
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedRecord.status}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Pengajuan Lembur */}
      <Dialog open={isLemburModalOpen} onOpenChange={setIsLemburModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Pengajuan Lembur</DialogTitle>
            <DialogDescription>
              Isi form di bawah ini untuk mengajukan jadwal lembur.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tanggal-lembur">Tanggal Lembur</Label>
              <Input id="tanggal-lembur" type="date" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="jam-mulai">Jam Mulai</Label>
                <Input id="jam-mulai" type="time" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="jam-selesai">Jam Selesai</Label>
                <Input id="jam-selesai" type="time" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan / Alasan</Label>
              <textarea 
                id="keterangan" 
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Jelaskan alasan lembur dan pekerjaan yang dilakukan..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsLemburModalOpen(false)}>Batal</Button>
            <Button onClick={() => {
              // Simulasi submit
              setIsLemburModalOpen(false);
            }}>Kirim Pengajuan</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
