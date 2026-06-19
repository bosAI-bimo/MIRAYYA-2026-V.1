"use client";

import React, { useState, useMemo, useEffect } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Search, Filter, Download, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, Package, AlertTriangle, TrendingDown, ShoppingCart, TrendingUp, Skull, Zap } from "lucide-react";
import Link from "next/link";
import { fetcher } from "@/lib/api";

export default function InventoryPage() {
  const router = useRouter();
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetcher('/store/inventory').then(data => setInventoryData(data || []));
  }, []);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const itemsPerPage = 8;
  const [requestQty, setRequestQty] = useState<Record<string, number>>({});

  const handleQtyChange = (code: string, val: string) => {
    setRequestQty(prev => ({ ...prev, [code]: parseInt(val) || 1 }));
  };

  const getQtyForCode = (item: typeof inventoryData[0]) => {
    return requestQty[item.code] ?? Math.max(1, item.minStock * 2 - item.stock);
  };

  // Modal states
  const [selectedItem, setSelectedItem] = useState<typeof inventoryData[0] | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Formatting currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
  };

  // Status mapping based on stock vs minStock
  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: "Habis", variant: "destructive" as const };
    if (stock <= minStock) return { label: "Menipis", variant: "warning" as const };
    return { label: "Aman", variant: "success" as const };
  };

  // Filter & Search Logic
  const filteredData = useMemo(() => {
    return inventoryData.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = categoryFilter === "all" || item.category.toLowerCase() === categoryFilter.toLowerCase();
      
      let matchStock = true;
      if (stockFilter === "critical") {
        matchStock = item.stock <= item.minStock;
      } else if (stockFilter === "safe") {
        matchStock = item.stock > item.minStock;
      }
      
      return matchSearch && matchCategory && matchStock;
    });
  }, [searchQuery, categoryFilter, stockFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Summary Logic
  const totalProducts = inventoryData.length;
  const lowStockProducts = inventoryData.filter(i => i.stock > 0 && i.stock <= i.minStock).length;
  const outOfStockProducts = inventoryData.filter(i => i.stock === 0).length;
  const totalInventoryValue = inventoryData.reduce((acc, item) => acc + (item.hpp * item.stock), 0);

  // Analytics Logic
  const fastMovingItems = inventoryData.filter(i => i.movement === "fast");
  const slowMovingItems = inventoryData.filter(i => i.movement === "slow");
  const deadStockItems = inventoryData.filter(i => i.movement === "dead");
  const criticalStockItems = inventoryData.filter(i => i.stock <= i.minStock);

  // Reset to page 1 on filter/search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, stockFilter]);

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Varian</p>
              <h3 className="text-2xl font-bold text-slate-800">{totalProducts}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Stok Menipis</p>
              <h3 className="text-2xl font-bold text-slate-800">{lowStockProducts}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Stok Habis</p>
              <h3 className="text-2xl font-bold text-slate-800">{outOfStockProducts}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Nilai (HPP)</p>
              <h3 className="text-xl font-bold text-slate-800">{formatCurrency(totalInventoryValue)}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="daftar" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="daftar" className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm">Daftar Produk</TabsTrigger>
          <TabsTrigger value="analisis" className="px-6 py-2.5 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm">Analisis Pergerakan</TabsTrigger>
        </TabsList>

        <TabsContent value="daftar">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold text-slate-800">Daftar Produk</CardTitle>
                  <CardDescription>
                    Pantau ketersediaan stok produk di cabang. Perubahan master data dikelola oleh pusat.
                  </CardDescription>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-3 mt-4 md:mt-0">
                  <div className="relative w-full lg:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Cari nama / kode..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 h-10 w-full lg:w-[240px] bg-slate-50 border-slate-200 focus-visible:ring-primary"
                    />
                  </div>
                  <select 
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-10 px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full lg:w-auto min-w-[140px]"
                  >
                    <option value="all">Kategori (Semua)</option>
                    <option value="skincare">Skincare</option>
                    <option value="makeup">Makeup</option>
                    <option value="bodycare">Bodycare</option>
                  </select>
                  <select 
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="h-10 px-3 py-2 border-2 border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer w-full lg:w-auto min-w-[150px]"
                  >
                    <option value="all">Status (Semua)</option>
                    <option value="critical">Perlu Order</option>
                    <option value="safe">Stok Aman</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 bg-slate-50 border-b border-slate-200 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 font-medium">Kode</th>
                      <th className="px-4 py-3 font-medium">Nama Produk</th>
                      <th className="px-4 py-3 font-medium">Kategori</th>
                      <th className="px-4 py-3 font-medium text-center">Stok</th>
                      <th className="px-4 py-3 font-medium text-center">Batas Min.</th>
                      <th className="px-4 py-3 font-medium text-center">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {paginatedData.length > 0 ? (
                      paginatedData.map((item, i) => {
                        const status = getStockStatus(item.stock, item.minStock);
                        return (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-slate-500">{item.code}</td>
                            <td className="px-4 py-3 font-medium text-slate-800">{item.name}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-slate-600 bg-slate-50 font-normal">{item.category}</Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`font-semibold ${item.stock === 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                                {item.stock}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-slate-500">{item.minStock}</td>
                            <td className="px-4 py-3 text-center">
                              <Badge variant={status.variant} className="whitespace-nowrap">
                                {status.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={`text-xs ${status.variant === 'warning' || status.variant === 'destructive' ? 'text-pink-600 hover:text-pink-700 hover:bg-pink-50' : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'}`}
                                onClick={() => {
                                  if (status.variant === 'success') {
                                    setSelectedItem(item);
                                    setIsDetailOpen(true);
                                  } else {
                                    router.push(`/dashboard/kepala-toko/order?itemCode=${item.code}`);
                                  }
                                }}
                              >
                                {status.variant === 'success' ? 'Detail' : 'Request Restock'}
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                          Tidak ada produk yang ditemukan.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {filteredData.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                  <div className="text-sm text-slate-500">
                    Menampilkan <span className="font-medium text-slate-700">{startIndex + 1}</span> - <span className="font-medium text-slate-700">{Math.min(startIndex + itemsPerPage, filteredData.length)}</span> dari <span className="font-medium text-slate-700">{filteredData.length}</span> data
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
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analisis" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Kritis & Butuh PO */}
            <Card className="border-2 border-rose-200 shadow-sm bg-rose-50/20 md:col-span-2">
              <CardHeader className="pb-3 border-b border-rose-100">
                <CardTitle className="text-lg font-bold text-rose-700 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Kritis & Perlu Segera Diorder ({criticalStockItems.length})
                </CardTitle>
                <CardDescription className="text-rose-600/80">
                  Produk ini stoknya sudah mencapai batas minimum atau habis. Membutuhkan pengajuan PO segera.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-rose-100">
                  {criticalStockItems.length > 0 ? criticalStockItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-rose-50/50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-800">{item.name}</p>
                        <p className="text-sm text-slate-500">Kategori: {item.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-bold text-rose-600">Sisa: {item.stock}</p>
                          <p className="text-xs text-slate-500">Min: {item.minStock}</p>
                        </div>
                        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-rose-100 shadow-sm">
                          <span className="text-xs font-medium text-slate-500 ml-1">Qty:</span>
                          <Input 
                            type="number" 
                            min={1}
                            value={getQtyForCode(item)}
                            onChange={(e) => handleQtyChange(item.code, e.target.value)}
                            className="w-16 h-8 text-center text-sm px-1 border-slate-200 focus-visible:ring-rose-500 font-semibold"
                            title="Jumlah Order"
                          />
                          <Button 
                            size="sm" 
                            onClick={() => router.push(`/dashboard/kepala-toko/order?itemCode=${item.code}&qty=${getQtyForCode(item)}`)}
                            className="bg-rose-600 hover:bg-rose-700 text-white h-8"
                          >
                            Order
                          </Button>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-rose-500">Tidak ada stok kritis saat ini.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Fast Moving */}
            <Card className="border-2 border-emerald-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-emerald-100 bg-emerald-50/30">
                <CardTitle className="text-lg font-bold text-emerald-700 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Fast Moving
                </CardTitle>
                <CardDescription className="text-emerald-700/70">
                  Produk paling laris dengan perputaran stok sangat cepat.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                <div className="divide-y divide-emerald-100">
                  {fastMovingItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-emerald-50/30">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                        <p className="text-xs text-emerald-600 font-medium">Stok saat ini: {item.stock}</p>
                      </div>
                      <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none">Laris</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Slow Moving */}
            <Card className="border-2 border-amber-200 shadow-sm">
              <CardHeader className="pb-3 border-b border-amber-100 bg-amber-50/30">
                <CardTitle className="text-lg font-bold text-amber-700 flex items-center">
                  <TrendingDown className="w-5 h-5 mr-2" />
                  Slow Moving
                </CardTitle>
                <CardDescription className="text-amber-700/70">
                  Produk yang kurang diminati atau butuh dorongan promosi.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0 max-h-[300px] overflow-y-auto">
                <div className="divide-y divide-amber-100">
                  {slowMovingItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-amber-50/30">
                      <div>
                        <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                        <p className="text-xs text-amber-600 font-medium">Stok masih menumpuk: {item.stock}</p>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">Lambat</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dead Stock */}
            <Card className="border-2 border-slate-200 shadow-sm md:col-span-2">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/80">
                <CardTitle className="text-lg font-bold text-slate-700 flex items-center">
                  <Skull className="w-5 h-5 mr-2" />
                  Dead Stock
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Produk yang tidak terjual dalam waktu sangat lama. Perlu tindakan segera (Diskon / Retur ke Gudang).
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {deadStockItems.length > 0 ? deadStockItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 hover:bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-200 rounded-lg">
                          <Package className="w-4 h-4 text-slate-500" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                          <p className="text-xs text-slate-500 font-medium">Stok mati: {item.stock} Pcs</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="text-xs text-slate-600 border-slate-300">Buat Promo Bundling</Button>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-500">Bersih! Tidak ada produk berstatus Dead Stock.</div>
                  )}
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Produk</DialogTitle>
            <DialogDescription>
              Informasi lengkap terkait produk ini.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">Kode</span>
                <span className="col-span-3 font-semibold text-slate-800 text-sm">{selectedItem.code}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">Nama</span>
                <span className="col-span-3 text-slate-800 text-sm">{selectedItem.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">Kategori</span>
                <span className="col-span-3 text-slate-800 text-sm">{selectedItem.category}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">Stok</span>
                <span className="col-span-3 text-slate-800 text-sm">{selectedItem.stock} Pcs (Batas Min: {selectedItem.minStock})</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">HPP</span>
                <span className="col-span-3 text-slate-800 text-sm">{formatCurrency(selectedItem.hpp)}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">Harga Jual</span>
                <span className="col-span-3 text-slate-800 text-sm">{formatCurrency(selectedItem.sell)}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="font-medium text-slate-500 col-span-1 text-sm">Pergerakan</span>
                <span className="col-span-3 text-sm">
                  {selectedItem.movement === 'fast' && <Badge className="bg-emerald-100 text-emerald-700">Fast Moving</Badge>}
                  {selectedItem.movement === 'slow' && <Badge className="bg-amber-100 text-amber-700">Slow Moving</Badge>}
                  {selectedItem.movement === 'dead' && <Badge className="bg-slate-200 text-slate-700">Dead Stock</Badge>}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsDetailOpen(false)}>Tutup</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
