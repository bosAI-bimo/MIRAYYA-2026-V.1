"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Trash2, Send, ChevronRight } from "lucide-react";
import Link from "next/link";

import { fetcher } from "@/lib/api";

export default function OrderPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-slate-500">Memuat data...</div>}>
      <OrderPageContent />
    </React.Suspense>
  );
}

function OrderPageContent() {
  const searchParams = useSearchParams();
  const itemCode = searchParams.get("itemCode");
  const qtyParam = searchParams.get("qty");
  
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [orderItems, setOrderItems] = useState<{code: string, qty: number}[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetcher('/store/inventory').then(data => setInventoryData(data || []));
  }, []);

  useEffect(() => {
    if (inventoryData.length === 0) return;
    
    if (itemCode) {
      const item = inventoryData.find(i => i.code === itemCode);
      if (item) {
        const urlQty = qtyParam ? parseInt(qtyParam) : NaN;
        const suggestedQty = !isNaN(urlQty) ? urlQty : Math.max(1, item.minStock * 2 - item.stock);
        setOrderItems([{ code: item.code, qty: suggestedQty }]);
      } else {
        setOrderItems([{ code: "", qty: 1 }]);
      }
    } else {
      setOrderItems([{ code: "", qty: 1 }]);
    }
  }, [itemCode, qtyParam, inventoryData]);

  const handleAddItem = () => {
    setOrderItems([...orderItems, { code: "", qty: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  const handleItemChange = (index: number, field: 'code' | 'qty', value: string | number) => {
    const newItems = [...orderItems];
    newItems[index] = { ...newItems[index], [field]: value } as {code: string, qty: number};
    setOrderItems(newItems);
  };

  // Recommendations
  const fastMoving = inventoryData.filter(i => i.stock > 0 && i.stock <= i.minStock);
  const slowMoving = inventoryData.filter(i => i.stock > i.minStock * 2);

  const handleAddRecommendations = () => {
    const newItems = [...orderItems];
    fastMoving.forEach(item => {
      // Avoid duplicate
      if (!newItems.find(i => i.code === item.code)) {
        newItems.push({ code: item.code, qty: item.minStock * 2 - item.stock });
      }
    });
    setOrderItems(newItems.filter(i => i.code !== ""));
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0 || orderItems.some(i => i.code === "")) return;
    try {
      setIsSubmitting(true);
      
      const itemsToSubmit = orderItems.map(oi => {
        const product = inventoryData.find(p => p.code === oi.code);
        return {
          productCode: oi.code,
          productName: product ? product.name : oi.code,
          quantity: oi.qty,
          unitPrice: 100000, // Hardcoded price for now
          movementCategory: "FAST_MOVING"
        };
      });

      await fetcher('/store/orders', {
        method: 'POST',
        body: JSON.stringify({
          branchId: '11111111-1111-1111-1111-111111111111',
          createdBy: '00000000-0000-0000-0000-000000000000',
          totalAmount: itemsToSubmit.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0),
          items: itemsToSubmit
        })
      });
      alert("Pengajuan PO Berhasil Dikirim!");
      setOrderItems([{ code: "", qty: 1 }]);
      setNotes("");
    } catch(err: any) { alert("Error: " + err.message); }
    finally { setIsSubmitting(false); }
  };

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
                  <span className="text-slate-900">Pengajuan PO</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pengajuan PO Baru</h1>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Form PO */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Daftar Item Pesanan</CardTitle>
              <CardDescription>Tambahkan produk yang ingin dipesan untuk stok cabang.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Kolom */}
                <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 px-2">
                  <div className="col-span-7">Nama Produk</div>
                  <div className="col-span-3 text-center">Jumlah (Pcs)</div>
                  <div className="col-span-2 text-right">Aksi</div>
                </div>

                {/* Item List */}
                <div className="space-y-3">
                  {orderItems.map((orderItem, idx) => (
                    <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-3 md:p-2 md:bg-transparent rounded-lg border border-slate-100 md:border-none">
                      <div className="col-span-1 md:col-span-7">
                        <select 
                          value={orderItem.code}
                          onChange={(e) => handleItemChange(idx, 'code', e.target.value)}
                          className="w-full h-10 px-3 py-2 text-sm rounded-md border-2 border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="" disabled>-- Pilih Produk --</option>
                          {inventoryData.map(item => (
                            <option key={item.code} value={item.code}>
                              {item.name} ({item.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-3 flex items-center justify-center">
                        <Input 
                          type="number" 
                          value={orderItem.qty}
                          onChange={(e) => handleItemChange(idx, 'qty', parseInt(e.target.value) || 1)}
                          min={1}
                          className="w-full md:w-24 text-center border-slate-200" 
                        />
                      </div>
                      <div className="col-span-1 md:col-span-2 flex justify-end">
                        <Button 
                          variant="ghost" 
                          onClick={() => handleRemoveItem(idx)}
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 w-full md:w-auto"
                        >
                          <Trash2 className="w-4 h-4 md:mr-0 mr-2" />
                          <span className="md:hidden">Hapus</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {orderItems.length === 0 && (
                    <div className="text-center py-4 text-slate-500 text-sm">Belum ada produk yang ditambahkan.</div>
                  )}
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleAddItem}
                  className="w-full border-dashed border-slate-300 text-slate-600 hover:text-primary hover:border-primary bg-slate-50 mt-4"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Produk Lain
                </Button>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-sm rounded-md border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                    placeholder="Tuliskan catatan untuk Accounting jika ada..."
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-8"
                    onClick={handleSubmitOrder}
                    disabled={orderItems.length === 0 || orderItems.some(i => i.code === "") || isSubmitting}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? "Mengirim..." : "Kirim PO"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Rekomendasi AI */}
        <div className="space-y-6">
          <Card className="border-2 border-slate-200 shadow-sm border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-primary flex items-center">
                <Sparkles className="w-4 h-4 mr-2 fill-primary/20" />
                Rekomendasi Cerdas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Fast Moving (Butuh Restock)</h4>
                  <ul className="space-y-2">
                    {fastMoving.slice(0, 3).map((item, idx) => (
                      <li key={idx} className="text-sm flex justify-between items-center bg-white p-2 rounded border border-emerald-100">
                        <span className="font-medium text-slate-700 truncate mr-2" title={item.name}>{item.name}</span>
                        <span className="text-xs font-semibold text-rose-500 whitespace-nowrap">Sisa {item.stock}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleAddRecommendations}
                    className="w-full text-primary hover:bg-primary/10 mt-2 text-xs"
                  >
                    + Tambahkan Semua Ke Form
                  </Button>
                </div>
                
                <div className="pt-3 border-t border-primary/10">
                  <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Slow Moving (Jangan Restock)</h4>
                  <ul className="space-y-2">
                    {slowMoving.slice(0, 2).map((item, idx) => (
                      <li key={idx} className="text-sm flex justify-between items-center bg-white p-2 rounded border border-amber-100">
                        <span className="font-medium text-slate-700 truncate mr-2" title={item.name}>{item.name}</span>
                        <span className="text-xs font-semibold text-amber-600 whitespace-nowrap">Sisa {item.stock}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
