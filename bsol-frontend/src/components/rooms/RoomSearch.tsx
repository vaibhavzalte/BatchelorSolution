"use client";

import BaseSearch, { SearchState } from "@/components/shared/BaseSearch";
import { FilterOption } from "@/components/shared/SearchConstants";

const ROOM_FILTERS: FilterOption[] = [
  { key: "roomType", label: "Room Type", type: "select", options: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Entire Flat"]},
  { key: "availableFor", label: "Available For", type: "select", options: ["Boys", "Girls", "Family", "Any"] },
  // { key: "maxRent", label: "Max Rent (₹)", type: "range", min: 0, max: 50000, step: 500 },
  // { key: "furnished", label: "Furnished", type: "toggle" },
  // { key: "wifi", label: "WiFi", type: "toggle" },
  // { key: "parking", label: "Parking", type: "toggle" },
  // { key: "ac", label: "AC", type: "toggle" },
];

interface RoomSearchProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
}

export default function RoomSearch({ onSearch, currentSearch }: RoomSearchProps) {
  return (
    <BaseSearch
      onSearch={onSearch}
      currentSearch={currentSearch}
      filterOptions={ROOM_FILTERS}
      categoryColor="bg-indigo-500"
      categoryLight="bg-indigo-50"
      categoryText="text-indigo-600"
      categoryLabel="Rooms"
    />
  );
}
