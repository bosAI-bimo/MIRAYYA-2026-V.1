import React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Trash2, Send } from "lucide-react";

export default function OrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pengajuan PO Baru</h1>
        <p className="text-slate-600 mt-1">Buat Purchase Order berdasarkan rekomendasi sistem atau manual.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Form PO */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-800">Daftar Item Pesanan</CardTitle>
              <CardDescription>Tambahkan produk yang ingin dipesan untuk stok cabang.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Header Kolom */}
                <div className="hidden md:grid grid-cols-12 gap-4 text-sm font-medium text-slate-500 px-2">
                  <div className="col-span-6">Nama Produk</div>
                  <div className="col-span-3 text-center">Jumlah (Pcs)</div>
                  <div className="col-span-2 text-right">Aksi</div>
                </div>

                {/* Item List */}
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-3 md:p-2 md:bg-transparent rounded-lg border border-slate-100 md:border-none">
                    <div className="col-span-1 md:col-span-6">
                      <select className="w-full h-10 px-3 py-2 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Mirayya Glow Serum (SKN-001)</option>
                        <option>Mirayya Hydrating Toner (SKN-002)</option>
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex items-center justify-center">
                      <Input type="number" defaultValue="20" className="w-full md:w-24 text-center border-slate-200" />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-end">
                      <Button variant="ghost" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 w-full md:w-auto">
                        <Trash2 className="w-4 h-4 md:mr-0 mr-2" />
                        <span className="md:hidden">Hapus</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-3 md:p-2 md:bg-transparent rounded-lg border border-slate-100 md:border-none">
                    <div className="col-span-1 md:col-span-6">
                      <select className="w-full h-10 px-3 py-2 text-sm rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Matte Lip Cream - Rose (MKP-001)</option>
                        <option>Mirayya Hydrating Toner (SKN-002)</option>
                      </select>
                    </div>
                    <div className="col-span-1 md:col-span-3 flex items-center justify-center">
                      <Input type="number" defaultValue="15" className="w-full md:w-24 text-center border-slate-200" />
                    </div>
                    <div className="col-span-1 md:col-span-2 flex justify-end">
                      <Button variant="ghost" className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 w-full md:w-auto">
                        <Trash2 className="w-4 h-4 md:mr-0 mr-2" />
                        <span className="md:hidden">Hapus</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full border-dashed border-slate-300 text-slate-600 hover:text-primary hover:border-primary bg-slate-50 mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Tambah Produk Lain
                </Button>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Catatan Tambahan (Opsional)</label>
                  <textarea 
                    className="w-full p-3 text-sm rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                    placeholder="Tuliskan catatan untuk Accounting jika ada..."
                  ></textarea>
                </div>

                <div className="flex justify-end pt-4">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8">
                    <Send className="w-4 h-4 mr-2" />
                    Kirim PO
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan: Rekomendasi AI */}
        <div className="space-y-6">
          <Card className="shadow-sm border-primary/20 bg-primary/5">
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
                    <li className="text-sm flex justify-between items-center bg-white p-2 rounded border border-emerald-100">
                      <span className="font-medium text-slate-700">Matte Lip Cream</span>
                      <span className="text-xs font-semibold text-rose-500">Sisa 5</span>
                    </li>
                    <li className="text-sm flex justify-between items-center bg-white p-2 rounded border border-emerald-100">
                      <span className="font-medium text-slate-700">Brightening Body Lotion</span>
                      <span className="text-xs font-semibold text-rose-500">Sisa 8</span>
                    </li>
                  </ul>
                  <Button variant="ghost" size="sm" className="w-full text-primary hover:bg-primary/10 mt-2 text-xs">
                    + Tambahkan Semua
                  </Button>
                </div>
                
                <div className="pt-3 border-t border-primary/10">
                  <h4 className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Slow Moving (Jangan Restock)</h4>
                  <ul className="space-y-2">
                    <li className="text-sm flex justify-between items-center bg-white p-2 rounded border border-amber-100">
                      <span className="font-medium text-slate-700">Glow Serum</span>
                      <span className="text-xs font-semibold text-amber-600">Sisa 45</span>
                    </li>
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
