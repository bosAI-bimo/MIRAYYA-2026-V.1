import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export function SkeletonTable({ rows = 5, columns = 4 }: SkeletonTableProps) {
  return (
    <div className="w-full space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center space-x-4 pb-4 border-b">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-6 w-[20%]" />
        ))}
      </div>
      {/* Rows Skeleton */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4 py-2 border-b">
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={`${i}-${j}`} className="h-8 w-[20%]" />
          ))}
        </div>
      ))}
      <div className="flex justify-end pt-4">
         <Skeleton className="h-8 w-[100px]" />
      </div>
    </div>
  );
}
