"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNavigationForRole, type NavItem } from "@/config/navigation";
import { useAuth } from "@/contexts/AuthContext";

// ──────────────────────────────────────────────
// Sub-komponen: Accordion menu item
// ──────────────────────────────────────────────
function SidebarNavItem({
  item,
  pathname,
  isCollapsed,
  onNavigate,
}: {
  item: NavItem;
  pathname: string;
  isCollapsed: boolean;
  onNavigate: () => void;
}) {
  // Cek apakah menu ini atau salah satu child-nya sedang aktif
  const isChildActive = item.children?.some(
    (child) =>
      pathname === child.href ||
      (pathname.startsWith(child.href) && child.href !== item.href)
  );
  const isSelfActive = pathname === item.href;
  const isActive = isSelfActive || isChildActive;

  const [isOpen, setIsOpen] = useState(isActive || false);

  // Sync dropdown state ketika navigasi berubah
  useEffect(() => {
    if (isActive) setIsOpen(true);
  }, [isActive]);

  const hasChildren = item.children && item.children.length > 0;

  // Ketika collapsed di desktop, hanya tampilkan icon tanpa dropdown
  if (isCollapsed) {
    return (
      <Link
        href={item.href}
        title={item.title}
        className={`flex items-center justify-center py-2.5 text-sm rounded-lg transition-all duration-200 ${
          isActive
            ? "bg-pink-600 text-white font-medium shadow-sm"
            : "text-slate-600 hover:bg-pink-50 hover:text-pink-700 font-medium"
        }`}
        onClick={onNavigate}
      >
        <item.icon className="w-5 h-5 mx-auto" />
      </Link>
    );
  }

  return (
    <div>
      {/* Parent menu item */}
      <div className="flex items-center">
        <Link
          href={item.href}
          className={`flex-1 flex items-center space-x-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 ${
            isSelfActive && !hasChildren
              ? "bg-pink-600 text-white font-medium shadow-sm"
              : isSelfActive && hasChildren
              ? "bg-pink-50 text-pink-700 font-semibold"
              : isChildActive
              ? "bg-pink-50/60 text-pink-700 font-semibold"
              : "text-slate-600 hover:bg-pink-50 hover:text-pink-700 font-medium"
          }`}
          onClick={onNavigate}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <span className="font-medium whitespace-nowrap flex-1">
            {item.title}
          </span>
        </Link>

        {/* Dropdown toggle */}
        {hasChildren && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`p-1.5 rounded-md transition-all duration-200 shrink-0 ml-0.5 ${
              isActive
                ? "text-pink-600 hover:bg-pink-100"
                : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            }`}
            aria-label={isOpen ? "Tutup sub-menu" : "Buka sub-menu"}
          >
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        )}
      </div>

      {/* Children / Sub-menu (dropdown accordion) */}
      {hasChildren && (
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0"
          }`}
        >
          <div className="ml-4 pl-3 border-l-2 border-pink-100 space-y-0.5">
            {item.children!.map((child) => {
              const isChildSelfActive =
                pathname === child.href ||
                (pathname.startsWith(child.href) &&
                  child.href !== item.href);

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  className={`flex items-center space-x-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                    isChildSelfActive
                      ? "bg-pink-600 text-white font-medium shadow-sm"
                      : "text-slate-500 hover:bg-pink-50 hover:text-pink-700 font-medium"
                  }`}
                  onClick={onNavigate}
                >
                  <child.icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{child.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Komponen Utama: DashboardSidebar
// ──────────────────────────────────────────────
export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const { user, logout } = useAuth();
  const navigation = user ? getNavigationForRole(user.role) : [];

  const closeMobileSidebar = () => setIsSidebarOpen(false);

  // Group navigasi berdasarkan sectionLabel
  let currentSection = "";

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 xl:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Sidebar Overlay (ketika expanded) */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 hidden xl:block"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* ═══ SIDEBAR ═══ */}
      <aside
        className={`fixed top-4 left-4 z-50 h-[calc(100vh-2rem)] bg-white/95 backdrop-blur-xl text-slate-800 border border-slate-200/60 rounded-3xl flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-[120%] xl:translate-x-0"
        } ${
          isCollapsed
            ? "w-64 xl:w-20 xl:shadow-sm"
            : "w-64 xl:shadow-2xl"
        } shadow-xl`}
      >
        {/* ─── Logo ─── */}
        <div
          className={`flex items-center justify-between ${
            isCollapsed ? "xl:justify-center" : "xl:justify-between"
          } h-20 p-6 border-b border-slate-100 relative shrink-0`}
        >
          <div
            className={`flex items-center space-x-2 ${
              isCollapsed ? "xl:hidden" : ""
            }`}
          >
            <img
              src="/logo.png"
              alt="Mirayya"
              className="h-16 w-auto object-contain scale-[1.35] transform origin-left drop-shadow-sm"
            />
          </div>
          <div
            className={`hidden items-center justify-center ${
              isCollapsed ? "xl:flex" : ""
            }`}
          >
            <img
              src="/logo.png"
              alt="M"
              className="w-16 h-auto object-contain scale-125 drop-shadow-sm"
            />
          </div>
          <button
            className="xl:hidden text-slate-500 hover:text-pink-700 absolute right-4"
            onClick={closeMobileSidebar}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Collapse Toggle - Desktop Only */}
          <button
            className="hidden xl:flex absolute -right-3 top-7 bg-white border-2 border-slate-200 rounded-full p-1 text-slate-500 hover:text-pink-700 hover:bg-slate-50 z-50 shadow-sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* ─── Navigation ─── */}
        <div className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          <nav className="space-y-1">
            {navigation.map((item) => {
              // Render section label jika berbeda dari sebelumnya
              const showSectionLabel =
                item.sectionLabel && item.sectionLabel !== currentSection;
              if (item.sectionLabel) currentSection = item.sectionLabel;

              return (
                <React.Fragment key={item.href}>
                  {showSectionLabel && (
                    <p
                      className={`text-[10px] font-bold text-pink-500/80 mb-2 px-2 uppercase tracking-[0.15em] ${
                        isCollapsed ? "xl:hidden" : ""
                      } ${item !== navigation[0] ? "pt-4" : "pt-1"}`}
                    >
                      {item.sectionLabel}
                    </p>
                  )}
                  {/* Spacer untuk collapsed mode ketika ada section baru */}
                  {showSectionLabel && isCollapsed && (
                    <div className={`hidden xl:block ${item !== navigation[0] ? "pt-3" : "pt-1"}`}>
                      <div className="h-px bg-slate-100 mx-2" />
                    </div>
                  )}
                  <SidebarNavItem
                    item={item}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    onNavigate={closeMobileSidebar}
                  />
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* ─── User Info & Logout ─── */}
        <div className="p-4 border-t border-slate-100">
          <div
            className={`flex items-center space-x-3 mb-4 px-2 ${
              isCollapsed ? "xl:justify-center xl:space-x-0 xl:px-0" : ""
            }`}
          >
            <div className="w-10 h-10 shrink-0 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold border border-pink-200 overflow-hidden text-sm uppercase">
              {user ? user.name.substring(0, 2) : "MR"}
            </div>
            <div className={`min-w-0 ${isCollapsed ? "xl:hidden" : ""}`}>
              <p className="text-sm font-medium text-slate-800 truncate">
                {user ? user.name : "Guest"}
              </p>
              <p className="text-xs text-slate-500 truncate capitalize">
                {user ? user.role : "Guest"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => logout()}
            className={`w-full justify-start text-slate-600 border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 bg-white cursor-pointer transition-colors ${
              isCollapsed ? "xl:justify-center xl:px-0" : ""
            }`}
            title={isCollapsed ? "Keluar" : undefined}
          >
            <LogOut
              className={`w-4 h-4 mr-2 shrink-0 ${
                isCollapsed ? "xl:mr-0" : ""
              }`}
            />
            <span className={`${isCollapsed ? "xl:hidden" : ""}`}>
              Keluar
            </span>
          </Button>
        </div>
      </aside>

      {/* ═══ MOBILE TOP HEADER ═══ */}
      <header className="xl:hidden flex items-center justify-between p-4 bg-white/90 backdrop-blur-md border-2 border-slate-200/60 sticky top-4 mx-4 rounded-2xl z-30 shadow-sm mb-4">
        <img
          src="/logo.png"
          alt="Mirayya"
          className="h-14 w-auto object-contain scale-[1.35] transform origin-left drop-shadow-sm"
        />
        <button
          className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          onClick={() => setIsSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>
    </>
  );
}
