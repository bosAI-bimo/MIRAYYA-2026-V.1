"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { BranchSelector } from "./branch-selector";

interface GlobalFilterProps {
  onFilterChange: (branchId: string, period: string) => void;
  className?: string;
}

export function GlobalFilter({ onFilterChange, className }: GlobalFilterProps) {
  const { user, isLoading } = useAuth();
  
  const [branch, setBranch] = useState<string>("all");
  const [period, setPeriod] = useState<string>("this_month");

  // Allowed roles to see and change the filter
  const allowedRoles = ["owner", "HQ_Admin", "Regional_Manager", "hr", "accounting"];
  
  const isAllowedToFilter = user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (!isLoading && user) {
      if (!isAllowedToFilter) {
        // Enforce user branch and default period
        const userBranchId = user.branchId || "all";
        setBranch(userBranchId);
        // Automatically fetch with enforced filter
        onFilterChange(userBranchId, "this_month");
      } else {
        // Just trigger fetch with current state
        onFilterChange(branch, period);
      }
    }
  }, [user, isLoading, isAllowedToFilter, branch, period]);

  // Don't render anything if still loading or not allowed to filter
  if (isLoading || !isAllowedToFilter) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row gap-3 w-full md:w-auto ${className || ""}`}>
      <BranchSelector 
        value={branch} 
        onChange={(e) => setBranch(e.target.value)}
      />
      <select 
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
        className="px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[140px] shadow-sm transition-all"
      >
        <option value="this_month">Bulan Ini</option>
        <option value="last_month">Bulan Lalu</option>
        <option value="this_year">Tahun Ini</option>
      </select>
    </div>
  );
}
