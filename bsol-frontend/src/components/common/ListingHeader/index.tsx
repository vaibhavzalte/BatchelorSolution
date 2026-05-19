"use client";

import React from "react";
import { Plus } from "lucide-react";

interface ListingHeaderProps {
  loading: boolean;
  count: number;
  categoryLabel: string;
  categorySubtitle: string;
  onPostClick: () => void;
  postButtonText?: string;
  themeColorClass?: string;
}

export default function ListingHeader({
  loading,
  count,
  categoryLabel,
  categorySubtitle,
  onPostClick,
  postButtonText = "Post Listing",
  themeColorClass = "bg-gray-900 hover:bg-black"
}: ListingHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {loading ? "Searching..." : `${count} Results Found`}
        </h1>
        <p className="text-sm text-gray-400 font-medium mt-0.5 uppercase tracking-widest">
          {categorySubtitle}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onPostClick}
          className={`flex items-center gap-2 px-6 py-3 text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95 ${themeColorClass}`}
        >
          <Plus className="w-4 h-4" />
          {postButtonText}
        </button>
      </div>
    </div>
  );
}
