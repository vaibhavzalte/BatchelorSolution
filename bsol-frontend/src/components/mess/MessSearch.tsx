"use client";

import BaseSearch, { SearchState } from "@/components/shared/BaseSearch";
import { FilterOption } from "@/components/shared/SearchConstants";

const MESS_FILTERS: FilterOption[] = [
  { key: "foodType", label: "Food Type", type: "select", options: ["VEG", "NON-VEG", "BOTH"] },
  { key: "mealType", label: "Meal Type", type: "select", options: ["BREAKFAST", "LUNCH", "DINNER", "ALL"] },
  { key: "maxMonthlyFee", label: "Max Monthly Fee (₹)", type: "range", min: 0, max: 10000, step: 100 },
  { key: "homeDelivery", label: "Home Delivery", type: "toggle" },
];

interface MessSearchProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
}

export default function MessSearch({ onSearch, currentSearch }: MessSearchProps) {
  return (
    <BaseSearch
      onSearch={onSearch}
      currentSearch={currentSearch}
      filterOptions={MESS_FILTERS}
      categoryColor="bg-amber-500"
      categoryLight="bg-amber-50"
      categoryText="text-amber-600"
      categoryLabel="Mess"
      showAvailableFor={false}
    />
  );
}
