"use client";

import React, { useState, useRef, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Camera, MapPin, Clock, Filter, Search, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Eye, Plus, Loader2, X as XIcon } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";
import Webcam from "react-webcam";
import { toast } from "sonner";

export default function AbsensiKaryawan() {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLemburModalOpen, setIsLemburModalOpen] = useState(false);
  const [searchDate, setSearchDate] = useState<DateRange | undefined>(undefined);
  
  // Overtime Form State
  const [lemburDate, setLemburDate] = useState("");
  const [lemburStartTime, setLemburStartTime] = useState("");
  const [lemburEndTime, setLemburEndTime] = useState("");
  const [lemburReason, setLemburReason] = useState("");
  const [isSubmittingLembur, setIsSubmittingLembur] = useState(false);

  const itemsPerPage = 5;

  const webcamRef = useRef<Webcam>(null);

  const fetchHistory = async () => {
    try {
      const data = await fetcher('/employee/attendance/my-records');
      setHistoryData(data || []);
    } catch(err) { console.error(err); }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistoryData = historyData.filter(row => {
    if (!searchDate?.from) return true;
    try {
      const rowDate = new Date(row.attendanceDate);
      rowDate.setHours(0, 0, 0, 0);
      const fromDate = new Date(searchDate.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (searchDate.to) {
        const toDate = new Date(searchDate.to);
        toDate.setHours(23, 59, 59, 999);
        return rowDate >= fromDate && rowDate <= toDate;
      }
      return rowDate.getTime() === fromDate.getTime();
    } catch (e) {
      return true;
    }
  });

  const totalPages = Math.max(1, Math.ceil(filteredHistoryData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredHistoryData.slice(startIndex, startIndex + itemsPerPage);

  const getLocation = () => {
    return new Promise<{lat: number, lng: number}>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation tidak didukung oleh browser Anda"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error("Gagal mendapatkan lokasi. Pastikan izin lokasi diberikan."));
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const startCheckIn = async () => {
    try {
      setLocationError("");
      const loc = await getLocation();
      setLocation(loc);
      setShowWebcam(true);
    } catch (err: any) {
      setLocationError(err.message);
      toast.error(err.message);
    }
  };

  const confirmCheckIn = async () => {
    if (!webcamRef.current || !location) return;
    const imageSrc = webcamRef.current.getScreenshot();
    
    if (!imageSrc) {
      toast.error("Gagal mengambil foto");
      return;
    }

    setIsCheckingIn(true);
    try {
      await fetcher('/employee/attendance/check-in', {
        method: 'POST',
        body: JSON.stringify({
          selfieBase64: imageSrc,
          latitude: location.lat,
          longitude: location.lng,
        })
      });

      toast.success("Check-In Berhasil!");
      setShowWebcam(false);
      fetchHistory();
    } catch(err: any) {
      toast.error(err.message || "Gagal melakukan check-in");
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if(!confirm("Anda yakin ingin Check-Out sekarang?")) return;
    setIsCheckingOut(true);
    try {
      await fetcher('/employee/attendance/check-out', {
        method: 'POST'
      });
      toast.success("Check-Out Berhasil!");
      fetchHistory();
    } catch(err: any) {
      toast.error(err.message || "Gagal melakukan check-out");
    } finally {
      setIsCheckingOut(false);
    }
  };

  const submitLembur = async () => {
    if (!lemburDate || !lemburStartTime || !lemburEndTime || !lemburReason) {
      toast.error("Semua field wajib diisi");
      return;
    }
    
    setIsSubmittingLembur(true);
    try {
      await fetcher('/employee/overtime', {
        method: 'POST',
        body: JSON.stringify({
          date: lemburDate,
          startTime: lemburStartTime,
          endTime: lemburEndTime,
          reason: lemburReason
        })
      });
      toast.success("Pengajuan lembur berhasil dikirim!");
      setIsLemburModalOpen(false);
      setLemburDate("");
      setLemburStartTime("");
      setLemburEndTime("");
      setLemburReason("");
    } catch (err: any) {
      toast.error("Gagal mengajukan lembur: " + err.message);
    } finally {
      setIsSubmittingLembur(false);
    }
  };

  // Determine if user has checked in today
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayRecord = historyData.find(r => r.attendanceDate === todayDateStr);
  const hasCheckedInToday = !!todayRecord;
  const hasCheckedOutToday = todayRecord && !!todayRecord.timeOut;

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
            {showWebcam ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="relative w-full max-w-sm rounded-lg overflow-hidden border-2 border-primary">
                    {/* @ts-expect-error React 19 JSX issue with Webcam */}
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      videoConstraints={{ facingMode: "user" }}
                    />
                 </div>
                 <p className="text-sm text-slate-500">
                   Lokasi: {location?.lat.toFixed(5)}, {location?.lng.toFixed(5)}
                 </p>
                 <div className="flex gap-2">
                   <Button variant="outline" onClick={() => setShowWebcam(false)} disabled={isCheckingIn}>Batal</Button>
                   <Button onClick={confirmCheckIn} disabled={isCheckingIn}>
                     {isCheckingIn ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Camera className="w-4 h-4 mr-2" />}
                     Ambil Foto & Check-In
                   </Button>
                 </div>
               </div>
            ) : hasCheckedInToday && !hasCheckedOutToday ? (
              <div className="flex flex-col items-center justify-center p-8 bg-emerald-50 rounded-lg border-2 border-emerald-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p className="text-emerald-700 font-medium text-center text-lg">
                  Anda sudah Check-In!
                </p>
                <p className="text-emerald-600 text-sm mt-1">{todayRecord.timeIn} WIB</p>
                <div className="mt-6 w-full">
                  <Button 
                    className="w-full h-14 rounded-xl flex items-center justify-center gap-3 bg-gradient-to-br from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white"
                    onClick={handleCheckOut}
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : <Clock className="w-5 h-5" />}
                    <span className="font-semibold text-lg">Check-Out Sekarang</span>
                  </Button>
                </div>
              </div>
            ) : hasCheckedOutToday ? (
              <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-lg border-2 border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <p className="text-slate-700 font-medium text-center text-lg">
                  Sif Anda Hari Ini Telah Selesai
                </p>
                <p className="text-slate-500 text-sm mt-1">Check-Out: {todayRecord.timeOut} WIB</p>
              </div>
            ) : (
              <div className="space-y-6">
                {locationError && (
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-md text-sm">
                    {locationError}
                  </div>
                )}
                <div className="flex items-center space-x-3 text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-100">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm">Siap untuk mulai? Akses kamera dan GPS dibutuhkan.</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="h-32 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-primary to-primary/80 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white"
                    onClick={startCheckIn}
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
            <div className="flex items-center gap-2 w-full sm:w-64">
              <DatePicker 
                date={searchDate} 
                setDate={(date) => { setSearchDate(date); setCurrentPage(1); }} 
                placeholder="Pilih tanggal..."
                className="w-full"
              />
              {searchDate && (
                <Button variant="ghost" size="icon" onClick={() => { setSearchDate(undefined); setCurrentPage(1); }} className="h-10 w-10 shrink-0 text-slate-500 hover:text-rose-500 bg-slate-50 border border-slate-200">
                  <XIcon className="h-4 w-4" />
                </Button>
              )}
            </div>
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
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold rounded-tr-md text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-800">{row.attendanceDate}</td>
                    <td className="px-4 py-3 text-slate-600">{row.timeIn || '-'}</td>
                    <td className="px-4 py-3 text-slate-600">{row.timeOut || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        row.status === 'Tepat Waktu' ? 'bg-emerald-100 text-emerald-700' : 
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
                          setSelectedRecord(row);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">Belum ada riwayat absensi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {filteredHistoryData.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-md mt-4">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, filteredHistoryData.length)}</span> dari <span className="font-medium text-slate-700">{filteredHistoryData.length}</span> data
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="h-8 w-8 p-0">
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 w-8 p-0">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center justify-center text-sm font-medium px-3 text-slate-600">
                Halaman {currentPage} dari {totalPages}
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="h-8 w-8 p-0">
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Absensi</DialogTitle>
            <DialogDescription>
              Informasi lengkap kehadiran Anda.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="grid gap-4 py-4">
              {selectedRecord.selfieUrl && (
                <div className="flex justify-center mb-4">
                   <img src={selectedRecord.selfieUrl} alt="Selfie" className="w-32 h-32 object-cover rounded-full border-4 border-primary/20" />
                </div>
              )}
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">Tanggal</span>
                <span className="text-base font-semibold text-slate-800">{selectedRecord.attendanceDate}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Check-In</span>
                  <span className="text-base text-slate-800">{selectedRecord.timeIn || '-'}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-500">Check-Out</span>
                  <span className="text-base text-slate-800">{selectedRecord.timeOut || '-'}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">Lokasi GPS</span>
                <span className="text-sm text-slate-800 break-all">{selectedRecord.locationGps}</span>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Tanggal Lembur</Label>
              <Input 
                type="date" 
                value={lemburDate}
                onChange={(e) => setLemburDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Jam Mulai</Label>
                <Input 
                  type="time" 
                  value={lemburStartTime}
                  onChange={(e) => setLemburStartTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Jam Selesai</Label>
                <Input 
                  type="time" 
                  value={lemburEndTime}
                  onChange={(e) => setLemburEndTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Alasan / Keterangan</Label>
              <Input 
                type="text" 
                placeholder="Contoh: Stok opname akhir bulan" 
                value={lemburReason}
                onChange={(e) => setLemburReason(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsLemburModalOpen(false)}>Batal</Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white" 
              onClick={submitLembur}
              disabled={isSubmittingLembur}
            >
              {isSubmittingLembur ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mengirim...
                </>
              ) : "Kirim Pengajuan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
