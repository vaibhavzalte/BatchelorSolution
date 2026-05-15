"use client";

import BaseSearch, { SearchState } from "@/components/shared/BaseSearch";
import { FilterOption } from "@/components/shared/SearchConstants";

const VACANCY_FILTERS: FilterOption[] = [
  { key: "roomType", label: "Room Type", type: "select", options: ["Single", "Double", "Triple", "Shared"] },
  { key: "preferredTenant", label: "Preferred Tenant", type: "select", options: ["Male", "Female", "Any"] },
  { key: "maxRent", label: "Max Rent (₹)", type: "range", min: 0, max: 30000, step: 500 },
  { key: "furnished", label: "Furnished", type: "toggle" },
  { key: "attachedBathroom", label: "Attached Bath", type: "toggle" },
  { key: "foodIncluded", label: "Food Included", type: "select", options: ["Yes", "No", "Optional"] },
];

interface VacancySearchProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
}

export default function VacancySearch({ onSearch, currentSearch }: VacancySearchProps) {
  return (
    <BaseSearch
      onSearch={onSearch}
      currentSearch={currentSearch}
      filterOptions={VACANCY_FILTERS}
      categoryColor="bg-rose-500"
      categoryLight="bg-rose-50"
      categoryText="text-rose-600"
      categoryLabel="Vacancies"
    />
  );
}
