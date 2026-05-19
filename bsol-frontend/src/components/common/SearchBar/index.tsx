"use client";

import React from "react";
import BaseSearch, { SearchState } from "@/components/shared/BaseSearch";
import { FilterOption } from "@/components/shared/SearchConstants";

interface SearchBarProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
  filterOptions: FilterOption[];
  categoryColor: string;
  categoryLight: string;
  categoryText: string;
  categoryLabel: string;
  showAvailableFor?: boolean;
}

export default function SearchBar({
  onSearch,
  currentSearch,
  filterOptions,
  categoryColor,
  categoryLight,
  categoryText,
  categoryLabel,
  showAvailableFor = false
}: SearchBarProps) {
  return (
    <BaseSearch
      onSearch={onSearch}
      currentSearch={currentSearch}
      filterOptions={filterOptions}
      categoryColor={categoryColor}
      categoryLight={categoryLight}
      categoryText={categoryText}
      categoryLabel={categoryLabel}
      showAvailableFor={showAvailableFor}
    />
  );
}
export type { SearchState };
