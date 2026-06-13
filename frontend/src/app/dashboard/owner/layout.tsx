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
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/ui/page-transition";

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard/owner", icon: LayoutDashboard },
  { name: "Data Cabang", href: "/dashboard/owner/cabang", icon: Store },
  { name: "Data Karyawan", href: "/dashboard/owner/karyawan", icon: Users },
  { name: "AI Insights", href: "/dashboard/owner/ai-insights", icon: BrainCircuit },
];

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop Sidebar Overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 hidden xl:block"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] bg-white/95 backdrop-blur-xl text-slate-800 border border-slate-200/60 rounded-3xl flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[120%] xl:translate-x-0"
        } ${isCollapsed ? "w-64 xl:w-20 xl:shadow-sm" : "w-64 xl:shadow-2xl"} shadow-xl`}
      >
        <div className={`flex items-center justify-between ${isCollapsed ? "xl:justify-center" : "xl:justify-between"} h-20 p-6 border-b border-slate-100 relative shrink-0`}>
          <div className={`flex items-center space-x-2 ${isCollapsed ? "xl:hidden" : ""}`}>
            <img src="/logo.png" alt="Mirayya" className="h-16 w-auto object-contain scale-[1.35] transform origin-left drop-shadow-sm" />
          </div>
          <div className={`hidden items-center justify-center ${isCollapsed ? "xl:flex" : ""}`}>
              <img src="/logo.png" alt="M" className="w-16 h-auto object-contain scale-125 drop-shadow-sm" />
            </div>
          <button 
            className="xl:hidden text-slate-500 hover:text-pink-700 absolute right-4"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
          
          {/* Collapse Toggle Button - Desktop Only */}
          <button
            className="hidden xl:flex absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-pink-700 hover:bg-slate-50 z-50 shadow-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          <p className={`text-xs font-semibold text-pink-600 mb-4 px-2 uppercase tracking-wider ${isCollapsed ? "xl:hidden" : ""}`}>
            Owner Navigation
          </p>
          <div className={`hidden h-4 mb-4 ${isCollapsed ? "xl:block" : ""}`} />
          <nav className="space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== "/dashboard/owner");
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  title={isCollapsed ? link.name : undefined}
                  className={`flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
                    isCollapsed ? "xl:justify-center xl:space-x-0 xl:px-0" : ""
                  } ${
                    isActive 
                      ? "bg-pink-600 text-white font-medium shadow-sm" 
                      : "text-slate-600 hover:bg-pink-50 hover:text-pink-700 font-medium"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <link.icon className={`w-5 h-5 shrink-0 ${isCollapsed ? "xl:mx-auto" : ""}`} />
                  <span className={`font-medium whitespace-nowrap ${isCollapsed ? "xl:hidden" : ""}`}>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center space-x-3 mb-4 px-2 ${isCollapsed ? "xl:justify-center xl:space-x-0 xl:px-0" : ""}`}>
            <div className="w-10 h-10 shrink-0 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold border border-pink-200 overflow-hidden">
              OW
            </div>
            <div className={`min-w-0 ${isCollapsed ? "xl:hidden" : ""}`}>
              <p className="text-sm font-medium text-slate-800 truncate">Ibu Owner</p>
              <p className="text-xs text-slate-500 truncate">Business Owner</p>
            </div>
          </div>
          <Link href="/login" className="w-full block">
            <Button variant="outline" className={`w-full justify-start text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 bg-white cursor-pointer transition-colors ${isCollapsed ? "xl:justify-center xl:px-0" : ""}`} title={isCollapsed ? "Keluar" : undefined}>
              <LogOut className={`w-4 h-4 mr-2 shrink-0 ${isCollapsed ? "xl:mr-0" : ""}`} />
              <span className={`${isCollapsed ? "xl:hidden" : ""}`}>Keluar</span>
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out xl:pl-28">
        {/* Top Header for Mobile */}
        <header className="xl:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border border-slate-200/60 sticky top-4 mx-4 rounded-2xl z-30 shadow-sm mb-4">
          <img src="/logo.png" alt="Mirayya" className="h-14 w-auto object-contain scale-[1.35] transform origin-left drop-shadow-sm" />
          <button 
            className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 p-4 md:p-6 lg:p-8 pt-4 lg:pt-8 max-w-7xl w-full mx-auto">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
    </div>
  );
}



