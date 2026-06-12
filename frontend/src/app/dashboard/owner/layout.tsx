"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  BrainCircuit,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/ui/page-transition";

const sidebarLinks = [
  {
    name: "Dashboard",
    href: "/dashboard/owner",
    icon: LayoutDashboard,
  },
  {
    name: "Data Cabang",
    href: "/dashboard/owner/cabang",
    icon: Store,
  },
  {
    name: "Data Karyawan",
    href: "/dashboard/owner/karyawan",
    icon: Users,
  },
  {
    name: "AI Insights",
    href: "/dashboard/owner/ai-insights",
    icon: BrainCircuit,
  },
];

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white text-slate-800 border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-sm ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-pink-700 tracking-tight">Mirayya</span>
          </div>
          <button 
            className="lg:hidden text-slate-500 hover:text-pink-700"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-pink-600 mb-4 px-2 uppercase tracking-wider">
            Owner Navigation
          </p>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard/owner");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? "bg-pink-600 text-white font-semibold shadow-sm" 
                      : "text-slate-600 hover:bg-pink-50 hover:text-pink-700"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center space-x-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold overflow-hidden border border-pink-200">
              OW
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">Ibu Owner</p>
              <p className="text-xs text-slate-500">Business Owner</p>
            </div>
          </div>
          <Link href="/login" className="w-full">
            <Button variant="outline" className="w-full justify-start text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900 bg-white">
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header for Mobile */}
        <header className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-200">
          <span className="text-xl font-bold text-slate-800">Mirayya</span>
          <button 
            className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-md"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}
