import {
  Milestone, UserRound, UsersRound,
  House, Utensils, CookingPot, Library
} from "lucide-react";

export const INDIAN_CITIES = [
  "Pune", "Nashik", "Mumbai", "Nagpur", "Bangalore",
  "Hyderabad", "Delhi", "Chennai", "Kolkata", "Ahmedabad",
  "Surat", "Jaipur", "Lucknow", "Kanpur", "Indore",
  "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad",
  "Patna", "Vadodara"
];

export const CATEGORIES = [
  { id: "all", label: "Posts", icon: Milestone, color: "bg-orange-500", border: "border-orange-100", light: "bg-orange-50", hex: "#fff7ed", text: "text-orange-600" },
  { id: "vacancies", label: "Vacancies", icon: UserRound, color: "bg-rose-500", border: "border-rose-100", light: "bg-rose-50", hex: "#fff1f2", text: "text-rose-600" },
  { id: "roommate", label: "Roommate", icon: UsersRound, color: "bg-violet-500", border: "border-violet-100", light: "bg-violet-50", hex: "#f5f3ff", text: "text-violet-600" },
  { id: "rooms", label: "Rooms", icon: House, color: "bg-indigo-500", border: "border-indigo-100", light: "bg-indigo-50", hex: "#eef2ff", text: "text-indigo-600" },
  { id: "food", label: "Food", icon: Utensils, color: "bg-pink-500", border: "border-pink-100", light: "bg-pink-50", hex: "#fdf2f8", text: "text-pink-600" },
  { id: "mess", label: "Mess", icon: CookingPot, color: "bg-amber-500", border: "border-amber-100", light: "bg-amber-50", hex: "#fffbeb", text: "text-amber-600" },
  { id: "study-rooms", label: "Study Rooms", icon: Library, color: "bg-emerald-500", border: "border-emerald-100", light: "bg-emerald-50", hex: "#ecfdf5", text: "text-emerald-600" },
];

export interface FilterOption {
  key: string;
  label: string;
  type: "select" | "range" | "toggle";
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}
