import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Calendar, MapPin, Camera } from "lucide-react";

export default function AbsensiPage() {
  const attendance = [
    { id: "ATT-001", date: "11 Jun 2026", name: "Siti Rahma", branch: "Pusat", timeIn: "08:45", timeOut: "17:15", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
    { id: "ATT-002", date: "11 Jun 2026", name: "Anita Wijaya", branch: "Mirayya Sudirman", timeIn: "08:50", timeOut: "-", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
    { id: "ATT-003", date: "11 Jun 2026", name: "Rina Marlina", branch: "Mirayya PIK", timeIn: "09:15", timeOut: "-", status: "Terlambat", photoStatus: "Valid", gpsStatus: "Luar Area" },
    { id: "ATT-004", date: "11 Jun 2026", name: "Dina Mariana", branch: "Mirayya Kelapa Gading", timeIn: "-", timeOut: "-", status: "Cuti", photoStatus: "-", gpsStatus: "-" },
    { id: "ATT-005", date: "10 Jun 2026", name: "Budi Santoso", branch: "Pusat", timeIn: "08:55", timeOut: "17:05", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
    { id: "ATT-006", date: "10 Jun 2026", name: "Anita Wijaya", branch: "Mirayya Sudirman", timeIn: "08:58", timeOut: "17:20", status: "Hadir", photoStatus: "Valid", gpsStatus: "Valid" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Riwayat Absensi</h1>
          <p className="text-slate-600 mt-1">Pantau kehadiran harian, verifikasi selfie, dan lokasi GPS karyawan.</p>
        </div>
        <Button variant="outline" className="text-slate-600 border-slate-200 w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Ekspor Laporan
        </Button>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-800">Log Kehadiran</CardTitle>
            <CardDescription>Menampilkan riwayat absensi terbaru.</CardDescription>
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
            <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[140px]">
              <option value="all">Semua Cabang</option>
              <option value="sudirman">Mirayya Sudirman</option>
              <option value="kemang">Mirayya Kemang</option>
              <option value="pik">Mirayya PIK</option>
              <option value="kelapa_gading">Mirayya Kelapa Gading</option>
              <option value="bintaro">Mirayya Bintaro</option>
            </select>
            <select className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
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
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Nama Karyawan</th>
                  <th className="px-6 py-4">Cabang</th>
                  <th className="px-6 py-4 text-center">In / Out</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Verifikasi</th>
                  <th className="px-6 py-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{record.date}</td>
                    <td className="px-6 py-4 font-semibold text-slate-800 whitespace-nowrap">{record.name}</td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{record.branch}</td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-medium text-slate-700">{record.timeIn}</span>
                        <span className="text-slate-400">-</span>
                        <span className="font-medium text-slate-700">{record.timeOut}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                        record.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        record.status === 'Terlambat' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.status !== 'Cuti' ? (
                        <div className="flex items-center space-x-3 text-xs">
                          <div className={`flex items-center ${record.photoStatus === 'Valid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <Camera className="w-3.5 h-3.5 mr-1" />
                            {record.photoStatus}
                          </div>
                          <div className={`flex items-center ${record.gpsStatus === 'Valid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {record.gpsStatus}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-rose-50 hover:text-primary/90 text-xs h-8">
                        Lihat Bukti
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>Menampilkan 1-6 dari 124 data absensi</div>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" disabled className="h-8">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="h-8 bg-slate-50">1</Button>
              <Button variant="outline" size="sm" className="h-8">2</Button>
              <Button variant="outline" size="sm" className="h-8">...</Button>
              <Button variant="outline" size="sm" className="h-8">Selanjutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
