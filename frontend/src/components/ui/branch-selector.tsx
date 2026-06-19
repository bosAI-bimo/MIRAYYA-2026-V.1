import React, { forwardRef } from "react";

export interface BranchSelectorProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  // Di masa depan bisa ditambahkan props role untuk filter cabang otomatis
}

export const BranchSelector = forwardRef<HTMLSelectElement, BranchSelectorProps>(
  ({ className, ...props }, ref) => {
    // Mock data, in real app this might come from AuthContext or an API
    const branches = [
      { id: "pusat", label: "Pusat" },
      { id: "sudirman", label: "Mirayya Sudirman" },
      { id: "kemang", label: "Mirayya Kemang" },
      { id: "pik", label: "Mirayya PIK" },
      { id: "kelapa_gading", label: "Mirayya Kelapa Gading" },
      { id: "bintaro", label: "Mirayya Bintaro" },
    ];

    return (
      <select 
        ref={ref}
        className={`w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white cursor-pointer ${className || ''}`}
        {...props}
      >
        <option value="">Pilih Cabang...</option>
        {branches.map(branch => (
          <option key={branch.id} value={branch.label}>
            {branch.label}
          </option>
        ))}
      </select>
    );
  }
);
BranchSelector.displayName = "BranchSelector";
