import { FilterOption } from "@/components/shared/SearchConstants";

export const VACANCY_FILTERS: FilterOption[] = [
  { key: "roomType", label: "Room Type", type: "select", options: ["Single", "Double", "Triple"] },
  { key: "preferredTenant", label: "Preferred Tenant", type: "select", options: ["Male", "Female", "Any"] },
  { key: "foodIncluded", label: "Food Included", type: "select", options: ["Yes", "No", "Optional"] }
];

export const FOOD_FILTERS: FilterOption[] = [
  { key: "foodType", label: "Veg / Non-Veg", type: "select", options: ["Veg", "Non-Veg", "Both"] },
  { key: "isOpen", label: "Open Now", type: "toggle" }
];

export const ROOMMATE_FILTERS: FilterOption[] = [
  { key: "gender", label: "Gender", type: "select", options: ["Boys", "Girls", "Any"] },
  { key: "occupation", label: "Occupation", type: "select", options: ["Student", "Professional", "Any"] },
  { key: "roomType", label: "Room Type", type: "select", options: ["Single", "Shared"] }
];

export const ROOM_FILTERS: FilterOption[] = [
  { key: "roomType", label: "Room Type", type: "select", options: ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Entire Flat"] },
  { key: "availableFor", label: "Available For", type: "select", options: ["Boys", "Girls", "Family", "Any"] }
];

export const MESS_FILTERS: FilterOption[] = [
  { key: "foodType", label: "Veg / Non-Veg", type: "select", options: ["VEG", "NON-VEG", "BOTH"] },
  { key: "mealType", label: "Meal Type", type: "select", options: ["BREAKFAST", "LUNCH", "DINNER", "ALL"] },
  { key: "homeDelivery", label: "Home Delivery", type: "toggle" }
];

export const STUDY_ROOM_FILTERS: FilterOption[] = [
  { key: "seatType", label: "Seat Type", type: "select", options: ["AC", "NON-AC", "CABIN", "DESK"] },
  { key: "timing", label: "Timing", type: "select", options: ["24x7", "DAY", "NIGHT"] },
  { key: "hasWifi", label: "WiFi Available", type: "toggle" }
];

export const ALL_FILTERS: Record<string, FilterOption[]> = {
  rooms: ROOM_FILTERS,
  vacancies: VACANCY_FILTERS,
  food: FOOD_FILTERS,
  mess: MESS_FILTERS,
  roommate: ROOMMATE_FILTERS,
  "study-rooms": STUDY_ROOM_FILTERS,
  posts: []
};
