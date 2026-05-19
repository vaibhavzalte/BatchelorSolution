"use client";

import { Search } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onClearFilters?: () => void;
  colorClass?: string;
}

export default function EmptyState({
  title = "No listings found",
  description = "Try adjusting your filters or search area to find more results.",
  onClearFilters,
  colorClass = "text-indigo-500"
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/40 backdrop-blur-md rounded-[3rem] border-2 border-dashed border-gray-200/50 shadow-sm max-w-4xl mx-auto w-full">
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
        <Search className={`w-8 h-8 ${colorClass}`} />
      </div>
      <div className="text-center px-4">
        <p className="text-gray-900 font-black text-xl tracking-tight">{title}</p>
        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto font-medium leading-relaxed">{description}</p>
      </div>
      {onClearFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 bg-gray-900 hover:bg-black text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-md active:scale-95"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
}
