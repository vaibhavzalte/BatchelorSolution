"use client";

import BaseSearch, { SearchState } from "@/components/shared/BaseSearch";
import { FilterOption } from "@/components/shared/SearchConstants";

const FOOD_FILTERS: FilterOption[] = [
  { key: "foodType", label: "Food Type", type: "select", options: ["Veg", "Non-Veg", "Both"] },
];

interface FoodSearchProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
}

export default function FoodSearch({ onSearch, currentSearch }: FoodSearchProps) {
  return (
    <BaseSearch
      onSearch={onSearch}
      currentSearch={currentSearch}
      filterOptions={FOOD_FILTERS}
      categoryColor="bg-pink-500"
      categoryLight="bg-pink-50"
      categoryText="text-pink-600"
      categoryLabel="Food"
      showAvailableFor={false}
    />
  );
}
