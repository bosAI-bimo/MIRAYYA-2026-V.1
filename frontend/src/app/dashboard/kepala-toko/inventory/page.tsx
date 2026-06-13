"use client";

import React, { useState } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Download, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react";
import Link from "next/link";

const inventoryData = [
  { code: "SKN-001", name: "Mirayya Glow Serum", category: "Skincare", hpp: "Rp 65.000", sell: "Rp 120.000", stock: 45, status: "ok" },
  { code: "SKN-002", name: "Mirayya Hydrating Toner", category: "Skincare", hpp: "Rp 45.000", sell: "Rp 85.000", stock: 12, status: "warning" },
  { code: "MKP-001", name: "Matte Lip Cream - Rose", category: "Makeup", hpp: "Rp 35.000", sell: "Rp 75.000", stock: 5, status: "danger" },
  { code: "MKP-002", name: "Flawless Cushion 01", category: "Makeup", hpp: "Rp 80.000", sell: "Rp 150.000", stock: 28, status: "ok" },
  { code: "MKP-003", name: "Flawless Cushion 02", category: "Makeup", hpp: "Rp 80.000", sell: "Rp 150.000", stock: 32, status: "ok" },
  { code: "BDY-001", name: "Brightening Body Lotion", category: "Bodycare", hpp: "Rp 50.000", sell: "Rp 95.000", stock: 8, status: "warning" },
  { code: "SKN-003", name: "Mirayya Acne Spot Treatment", category: "Skincare", hpp: "Rp 55.000", sell: "Rp 105.000", stock: 60, status: "ok" },
  { code: "MKP-004", name: "Lip Tint - Peach", category: "Makeup", hpp: "Rp 30.000", sell: "Rp 65.000", stock: 15, status: "warning" },
  { code: "MKP-005", name: "Lip Tint - Berry", category: "Makeup", hpp: "Rp 30.000", sell: "Rp 65.000", stock: 3, status: "danger" },
  { code: "BDY-002", name: "Exfoliating Body Scrub", category: "Bodycare", hpp: "Rp 60.000", sell: "Rp 110.000", stock: 40, status: "ok" },
  { code: "SKN-004", name: "Sunscreen SPF 50", category: "Skincare", hpp: "Rp 40.000", sell: "Rp 80.000", stock: 55, status: "ok" },
  { code: "SKN-005", name: "Gentle Facial Wash", category: "Skincare", hpp: "Rp 35.000", sell: "Rp 70.000", stock: 22, status: "ok" },
  { code: "MKP-006", name: "Mascara Waterproof", category: "Makeup", hpp: "Rp 45.000", sell: "Rp 90.000", stock: 10, status: "warning" },
  { code: "MKP-007", name: "Eyebrow Pencil - Brown", category: "Makeup", hpp: "Rp 25.000", sell: "Rp 50.000", stock: 75, status: "ok" },
  { code: "BDY-003", name: "Moisturizing Shower Gel", category: "Bodycare", hpp: "Rp 45.000", sell: "Rp 85.000", stock: 18, status: "warning" },
];

export default function InventoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(inventoryData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = inventoryData.slice(startIndex, startIndex + itemsPerPage);
  return (
    <div className="space-y-6">
      {/* Header / Navbar Separator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6 border-b border-slate-200 mb-6 lg:mb-8">
        <div className="space-y-1">
          <nav className="flex text-sm text-slate-500 font-medium mb-1" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2">
              <li className="inline-flex items-center">
                <Link href="/dashboard/kepala-toko" className="hover:text-pink-600 transition-colors">Dashboard Kepala Toko</Link>
              </li>
              <li>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="text-slate-900">Inventory Cabang</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Inventory Cabang</h1>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="text-slate-600 border-slate-200 w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <Card className="border-2 shadow-sm border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-slate-800 self-center">Daftar Produk</CardTitle>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Cari produk..."
                  className="pl-9 w-full md:w-[250px] bg-slate-50 border-slate-200 focus-visible:ring-primary"
                />
              </div>
              <select className="px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full sm:w-auto min-w-[130px]">
                <option value="all">Semua Kategori</option>
                <option value="skincare">Skincare</option>
                <option value="makeup">Makeup</option>
                <option value="bodycare">Bodycare</option>
              </select>
            </div>
          </div>
          <CardDescription>
            Menampilkan data harga dan stok secara real-time. Perubahan data master hanya dapat dilakukan melalui pusat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-medium rounded-tl-lg">Kode Produk</th>
                  <th className="px-4 py-3 font-medium">Nama Produk</th>
                  <th className="px-4 py-3 font-medium">Kategori</th>
                  <th className="px-4 py-3 font-medium text-right">HPP</th>
                  <th className="px-4 py-3 font-medium text-right">Harga Jual</th>
                  <th className="px-4 py-3 font-medium text-center rounded-tr-lg">Stok Tersedia</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-500">{item.code}</td>
                    <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                    <td className="px-4 py-3 text-slate-600">{item.category}</td>
                    <td className="px-4 py-3 text-right text-slate-600">{item.hpp}</td>
                    <td className="px-4 py-3 text-right text-slate-800 font-medium">{item.sell}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        item.status === 'ok' ? 'bg-emerald-100 text-emerald-700' : 
                        item.status === 'warning' ? 'bg-amber-100 text-amber-700' : 
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {item.stock} Pcs
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-6 px-6 py-4 border-t border-slate-100 bg-slate-50/50 rounded-b-lg">
            <div className="text-sm text-slate-500">
              Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, inventoryData.length)}</span> dari <span className="font-medium text-slate-700">{inventoryData.length}</span> data
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
    </div>
  );
}
