"use client";

import React from "react";
import SkeletonCard from "./SkeletonCard";

interface ListingGridProps {
  loading?: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
}

export default function ListingGrid({
  loading = false,
  skeletonCount = 6,
  children
}: ListingGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
      {children}
    </div>
  );
}
