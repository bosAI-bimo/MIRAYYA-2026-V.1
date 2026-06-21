import React, { forwardRef, useEffect, useState } from "react";
import { fetcher } from "@/lib/api";

export interface BranchSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
}

export const BranchSelector = forwardRef<HTMLSelectElement, BranchSelectorProps>(
  ({ className, ...props }, ref) => {
    const [branches, setBranches] = useState<{id: string, name: string}[]>([]);

    useEffect(() => {
      const loadBranches = async () => {
        try {
          const data = await fetcher("/admin/branches");
          if (Array.isArray(data)) {
            setBranches(data);
          } else if (data && Array.isArray(data.data)) {
            setBranches(data.data);
          }
        } catch (error) {
          console.error("Failed to load branches", error);
        }
      };
      loadBranches();
    }, []);

    return (
      <select 
        ref={ref}
        className={`px-4 py-2.5 border-2 border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white cursor-pointer w-full sm:w-auto min-w-[160px] shadow-sm transition-all ${className || ''}`}
        {...props}
      >
        <option value="all">Semua Cabang (Konsolidasi)</option>
        {branches.map(branch => (
          <option key={branch.id} value={branch.id}>
            {branch.name}
          </option>
        ))}
      </select>
    );
  }
);
BranchSelector.displayName = "BranchSelector";
