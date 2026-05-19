"use client";

import { useState, useEffect, useCallback } from "react";
import { useCategory } from "@/contexts/CategoryContext";
import {
  Search,
  MapPin,
  ChevronDown,
  Milestone,
  CookingPot,
  House,
  Utensils,
  UsersRound,
  UserRound,
  Library,
  SlidersHorizontal,
  X,
  Target,
} from "lucide-react";
import { useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const INDIAN_CITIES = [
  "Pune",
  "Nashik",
  "Mumbai",
  "Nagpur",
  "Bangalore",
  "Hyderabad",
  "Delhi",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
];

// ─── Category definitions ─────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: "all", label: "Posts", icon: Milestone, color: "bg-orange-500", border: "border-orange-100", light: "bg-orange-50", hex: "#fff7ed", text: "text-orange-600" },
  { id: "vacancies", label: "Vacancies", icon: UserRound, color: "bg-rose-500", border: "border-rose-100", light: "bg-rose-50", hex: "#fff1f2", text: "text-rose-600" },
  { id: "roommate", label: "Roommate", icon: UsersRound, color: "bg-violet-500", border: "border-violet-100", light: "bg-violet-50", hex: "#f5f3ff", text: "text-violet-600" },
  { id: "rooms", label: "Rooms", icon: House, color: "bg-indigo-500", border: "border-indigo-100", light: "bg-indigo-50", hex: "#eef2ff", text: "text-indigo-600" },
  { id: "food", label: "Food", icon: Utensils, color: "bg-pink-500", border: "border-pink-100", light: "bg-pink-50", hex: "#fdf2f8", text: "text-pink-600" },
  { id: "mess", label: "Mess", icon: CookingPot, color: "bg-amber-500", border: "border-amber-100", light: "bg-amber-50", hex: "#fffbeb", text: "text-amber-600" },
  { id: "study-rooms", label: "Study Rooms", icon: Library, color: "bg-emerald-500", border: "border-emerald-100", light: "bg-emerald-50", hex: "#ecfdf5", text: "text-emerald-600" },
];

// ─── Per-category filter definitions ─────────────────────────────────────────

export interface FilterOption {
  key: string;
  label: string;
  type: "select" | "range" | "toggle";
  options?: string[];      // for select
  min?: number;            // for range
  max?: number;
  step?: number;
}

const FILTERS_BY_CATEGORY: Record<string, FilterOption[]> = {
  all: [
    { key: "keyword", label: "Any keyword", type: "select", options: [] },
  ],
  rooms: [
    { key: "roomType", label: "Room Type", type: "select", options: ["1RK", "1BHK", "2BHK", "3BHK"] },
    { key: "availableFor", label: "Available For", type: "select", options: ["BOYS", "GIRLS", "FAMILY"] },
    { key: "maxRent", label: "Max Rent (₹)", type: "range", min: 0, max: 50000, step: 500 },
    { key: "furnished", label: "Furnished", type: "toggle" },
    { key: "wifi", label: "WiFi", type: "toggle" },
    { key: "parking", label: "Parking", type: "toggle" },
    { key: "ac", label: "AC", type: "toggle" },
  ],
  vacancies: [
    { key: "roomType", label: "Room Type", type: "select", options: ["Single", "Double", "Triple", "Shared"] },
    { key: "preferredTenant", label: "Preferred Tenant", type: "select", options: ["Male", "Female", "Any"] },
    { key: "maxRent", label: "Max Rent (₹)", type: "range", min: 0, max: 30000, step: 500 },
    { key: "furnished", label: "Furnished", type: "toggle" },
    { key: "attachedBathroom", label: "Attached Bath", type: "toggle" },
    { key: "foodIncluded", label: "Food Included", type: "select", options: ["Yes", "No", "Optional"] },
  ],
  mess: [
    { key: "foodType", label: "Food Type", type: "select", options: ["VEG", "NON-VEG", "BOTH"] },
    { key: "mealType", label: "Meal Type", type: "select", options: ["BREAKFAST", "LUNCH", "DINNER", "ALL"] },
    { key: "maxMonthlyFee", label: "Max Monthly Fee (₹)", type: "range", min: 0, max: 10000, step: 100 },
    { key: "homeDelivery", label: "Home Delivery", type: "toggle" },
  ],
  food: [
    { key: "foodType", label: "Food Type", type: "select", options: ["Veg", "Non-Veg", "Both"] },
  ],
  roommate: [],
  "study-rooms": [],
};

// ─── Export types for page.tsx ────────────────────────────────────────────────

export interface SearchState {
  keyword: string;
  location: string;
  filters: Record<string, string | number | boolean>;
}

interface SearchFilterProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchFilter({ onSearch, currentSearch }: SearchFilterProps) {
  const { activeCategory, setActiveCategory } = useCategory();

  // Local state for the new layout
  const [city, setCity] = useState("Pune");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const freshnessDropdownRef = useRef<HTMLDivElement>(null);
  const rentSortDropdownRef = useRef<HTMLDivElement>(null);
  const availableForDropdownRef = useRef<HTMLDivElement>(null);

  const [isFreshnessOpen, setIsFreshnessOpen] = useState(false);
  const [isRentSortOpen, setIsRentSortOpen] = useState(false);
  const [isAvailableForOpen, setIsAvailableForOpen] = useState(false);

  const [keyword, setKeyword] = useState(currentSearch.keyword);
  const [freshness, setFreshness] = useState("1w");
  const [rentSort, setRentSort] = useState("");
  const [availableFor, setAvailableFor] = useState("");

  const [useLocation, setUseLocation] = useState(false);
  const [distance, setDistance] = useState("10km");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>(currentSearch.filters);

  // Click outside to close city dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
      if (freshnessDropdownRef.current && !freshnessDropdownRef.current.contains(event.target as Node)) {
        setIsFreshnessOpen(false);
      }
      if (rentSortDropdownRef.current && !rentSortDropdownRef.current.contains(event.target as Node)) {
        setIsRentSortOpen(false);
      }
      if (availableForDropdownRef.current && !availableForDropdownRef.current.contains(event.target as Node)) {
        setIsAvailableForOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset local filter state when category changes
  useEffect(() => {
    setFilters({});
    setKeyword("");
    setFreshness("1w");
    setRentSort("");
    setAvailableFor("");
    setDistance("10km");
    setUseLocation(false);
    setShowFilters(false);
  }, [activeCategory]);

  const categoryFilters = FILTERS_BY_CATEGORY[activeCategory] ?? [];
  const activeFilterDefs = categoryFilters.filter(f => f.type !== "select" || (f.options && f.options.length > 0));
  const hasFilters = activeFilterDefs.length > 0;
  const activeFilterCount = Object.values(filters).filter(v => v !== "" && v !== false && v !== 0).length;

  const setFilter = (key: string, value: string | number | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilter = (key: string) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleSearch = useCallback(() => {
    const combinedFilters = { ...filters };
    if (freshness) combinedFilters.freshness = freshness;
    if (rentSort) combinedFilters.rentSort = rentSort;
    if (availableFor) combinedFilters.availableFor = availableFor;

    if (useLocation) {
      combinedFilters.distance = distance;
      combinedFilters.useGeo = true;
    }

    onSearch({
      keyword: keyword.trim(),
      location: city.trim(),
      filters: combinedFilters
    });
  }, [keyword, city, freshness, rentSort, availableFor, distance, useLocation, filters, onSearch]);

  // Live search on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const activeCat = CATEGORIES.find(c => c.id === activeCategory);

  return (
    <div className={`w-full pt-24 pb-8 transition-all duration-1000 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-6 space-y-10">

        {/* 1. Category Grid */}
        <div className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`category-tab-${cat.id}`}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative flex flex-col items-center justify-center p-6 h-36 rounded-[2rem] transition-all duration-300 cursor-pointer ${isActive
                    ? `${cat.color} text-white shadow-xl scale-105 z-10`
                    : `bg-white ${cat.text} border-2 border-transparent hover:${cat.border} hover:${cat.light} shadow-sm`
                    }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-3 transition-transform duration-500 ${isActive ? "bg-white/20 scale-110" : `${cat.light} ${cat.text} group-hover:scale-110`
                    }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[12px] font-black tracking-tight  transition-colors duration-300 ${isActive ? "text-white" : "text-gray-900 group-hover:text-gray-900"
                    }`}>
                    {cat.label}
                  </span>
                  {isActive && (
                    <div className="absolute -bottom-1 w-8 h-1 bg-white/50 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Main Search Bar (Transparent & Compact) */}
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/20 backdrop-blur-xl p-2 flex flex-wrap lg:flex-nowrap items-center gap-3">

            {/* City Field */}
            <div className="flex-1 min-w-[140px] p-1 relative" ref={cityDropdownRef}>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest">City</span>
              <div
                onClick={() => setIsCityOpen(!isCityOpen)}
                className="bg-white/40 border border-black rounded-xl p-2 h-[44px] flex flex-col justify-center cursor-pointer hover:bg-white/60 transition-all"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-gray-900 truncate text-center">{city}</span>
                  <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isCityOpen ? "rotate-180" : ""}`} />
                </div>
              </div>

              {isCityOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 border-b border-gray-50 bg-gray-50/30">
                    <input
                      autoFocus
                      placeholder="Search city..."
                      className="w-full px-3 py-1.5 bg-white/50 border border-gray-100 rounded-lg text-xs font-bold text-gray-900 outline-none"
                      value={cityQuery}
                      onChange={(e) => setCityQuery(e.target.value)}
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
                    {INDIAN_CITIES.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).map(c => (
                      <button
                        key={c}
                        onClick={() => {
                          setCity(c);
                          setIsCityOpen(false);
                          setCityQuery("");
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${city === c ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50/50"}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Localities Field */}
            <div className="flex-[1.5] min-w-[200px] p-1 flex flex-col group">
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest group-focus-within:text-indigo-500 text-center">Locality</span>
              <div className="bg-white/40 border border-black rounded-xl p-2 h-[44px] flex items-center relative hover:bg-white/60 transition-all">
                <input
                  type="text"
                  placeholder="landmark or localities"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal text-center"
                />
              </div>
            </div>

            {/* Freshness Field */}
            <div className="flex-1 min-w-[120px] p-1 flex flex-col group relative" ref={freshnessDropdownRef}>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest text-center">Freshness</span>
              <div
                onClick={() => setIsFreshnessOpen(!isFreshnessOpen)}
                className="bg-white/40 border border-black rounded-xl p-2 h-[44px] flex items-center justify-center relative hover:bg-white/60 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-900 truncate">
                  {freshness === "24h" ? "Past 24 hr" : freshness === "1d" ? "1 day" : freshness === "4d" ? "4 days" : freshness === "1w" ? "1 week" : "All Time"}
                </span>
                <ChevronDown className={`ml-2 w-3 h-3 text-gray-400 transition-transform ${isFreshnessOpen ? "rotate-180" : ""}`} />
              </div>

              {isFreshnessOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    {[
                      { label: "Past 24 hr", value: "24h" },
                      { label: "1 day", value: "1d" },
                      { label: "4 days", value: "4d" },
                      { label: "1 week", value: "1w" },
                      { label: "All Time", value: "" }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setFreshness(opt.value);
                          setIsFreshnessOpen(false);
                        }}
                        className={`w-full text-center px-3 py-2 rounded-lg text-xs font-bold transition-all ${freshness === opt.value ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50/50"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Price Sort Field */}
            <div className="flex-1 min-w-[120px] p-1 flex flex-col group relative" ref={rentSortDropdownRef}>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest text-center">Rent Sort</span>
              <div
                onClick={() => setIsRentSortOpen(!isRentSortOpen)}
                className="bg-white/40 border border-black rounded-xl p-2 h-[44px] flex items-center justify-center relative hover:bg-white/60 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-900 truncate">
                  {rentSort === "low-high" ? "Low to High" : rentSort === "high-low" ? "High to Low" : "Any Price"}
                </span>
                <ChevronDown className={`ml-2 w-3 h-3 text-gray-400 transition-transform ${isRentSortOpen ? "rotate-180" : ""}`} />
              </div>

              {isRentSortOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    {[
                      { label: "Any Price", value: "" },
                      { label: "Low to High", value: "low-high" },
                      { label: "High to Low", value: "high-low" }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setRentSort(opt.value);
                          setIsRentSortOpen(false);
                        }}
                        className={`w-full text-center px-3 py-2 rounded-lg text-xs font-bold transition-all ${rentSort === opt.value ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50/50"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Available For Field */}
            <div className="flex-1 min-w-[120px] p-1 flex flex-col group relative" ref={availableForDropdownRef}>
              <span className="text-sm font-black text-indigo-600 uppercase tracking-widest text-center">Available For</span>
              <div
                onClick={() => setIsAvailableForOpen(!isAvailableForOpen)}
                className="bg-white/40 border border-black rounded-xl p-2 h-[44px] flex items-center justify-center relative hover:bg-white/60 transition-all cursor-pointer"
              >
                <span className="text-sm font-bold text-gray-900 truncate">
                  {availableFor || "Any"}
                </span>
                <ChevronDown className={`ml-2 w-3 h-3 text-gray-400 transition-transform ${isAvailableForOpen ? "rotate-180" : ""}`} />
              </div>

              {isAvailableForOpen && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001] animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-1">
                    {[
                      { label: "Any", value: "" },
                      { label: "Boys", value: "Boys" },
                      { label: "Girls", value: "Girls" },
                      { label: "Family", value: "Family" }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setAvailableFor(opt.value);
                          setIsAvailableForOpen(false);
                        }}
                        className={`w-full text-center px-3 py-2 rounded-lg text-xs font-bold transition-all ${availableFor === opt.value ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50/50"}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Search Button Container */}
            <div className="p-1 flex flex-col">
              {/* Phantom label for alignment */}
              <span className="text-sm font-black opacity-0 uppercase tracking-widest">Search</span>
              <button
                onClick={handleSearch}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-[44px] rounded-xl font-black text-sm tracking-widest transition-all shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                FIND
              </button>
            </div>
          </div>
        </div>

        {/* 3. Dynamic Filter Panel */}
        {showFilters && hasFilters && (
          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl p-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${activeCat?.color || "bg-gray-900"} rounded-xl flex items-center justify-center`}>
                  <SlidersHorizontal className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-black text-gray-900  tracking-widest">
                  {activeCat?.label} Filters
                </span>
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] font-black rounded-full">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters({})}
                  className="text-[11px] font-black text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {activeFilterDefs.map((filterDef) => {
                const value = filters[filterDef.key];

                if (filterDef.type === "select" && filterDef.options) {
                  return (
                    <div key={filterDef.key} className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black  tracking-widest text-gray-400">
                        {filterDef.label}
                      </label>
                      <div className="relative">
                        <select
                          id={`filter-${filterDef.key}`}
                          value={(value as string) || ""}
                          onChange={(e) =>
                            e.target.value ? setFilter(filterDef.key, e.target.value) : clearFilter(filterDef.key)
                          }
                          className={`w-full px-3 py-2.5 rounded-xl text-[13px] font-bold border-2 outline-none appearance-none cursor-pointer transition-all ${value
                            ? `${activeCat?.light || "bg-gray-50"} ${activeCat?.text || "text-gray-900"} border-current`
                            : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
                            }`}
                        >
                          <option value="">Any</option>
                          {filterDef.options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  );
                }

                if (filterDef.type === "range") {
                  const numVal = (value as number) || filterDef.max!;
                  return (
                    <div key={filterDef.key} className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-[10px] font-black  tracking-widest text-gray-400 flex items-center justify-between">
                        <span>{filterDef.label}</span>
                        <span className={`${activeCat?.text || "text-gray-900"} font-black`}>
                          {numVal === filterDef.max ? "Any" : `≤ ₹${numVal.toLocaleString()}`}
                        </span>
                      </label>
                      <input
                        id={`filter-${filterDef.key}`}
                        type="range"
                        min={filterDef.min}
                        max={filterDef.max}
                        step={filterDef.step}
                        value={numVal}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (v === filterDef.max) clearFilter(filterDef.key);
                          else setFilter(filterDef.key, v);
                        }}
                        className="w-full accent-gray-900 cursor-pointer h-2 rounded-full"
                      />
                      <div className="flex justify-between text-[10px] text-gray-300 font-bold">
                        <span>₹{filterDef.min?.toLocaleString()}</span>
                        <span>₹{filterDef.max?.toLocaleString()}+</span>
                      </div>
                    </div>
                  );
                }

                if (filterDef.type === "toggle") {
                  const isOn = value === true;
                  return (
                    <div key={filterDef.key} className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-black  tracking-widest text-gray-400">
                        {filterDef.label}
                      </label>
                      <button
                        id={`filter-${filterDef.key}`}
                        type="button"
                        onClick={() => isOn ? clearFilter(filterDef.key) : setFilter(filterDef.key, true)}
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-black  tracking-wider border-2 transition-all ${isOn
                          ? `${activeCat?.color || "bg-gray-900"} text-white border-transparent shadow-md`
                          : "bg-gray-50 text-gray-400 border-gray-100 hover:border-gray-200"
                          }`}
                      >
                        {isOn ? "✓ " : ""}{filterDef.label}
                      </button>
                    </div>
                  );
                }

                return null;
              })}
            </div>

            {/* Apply Button */}
            <div className="mt-6 flex justify-end">
              <button
                id="apply-filters-btn"
                type="button"
                onClick={handleSearch}
                className={`px-8 py-3 ${activeCat?.color || "bg-gray-900"} text-white rounded-2xl text-sm font-black  tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2`}
              >
                <Search className="w-4 h-4" />
                Apply Filters & Search
              </button>
            </div>
          </div>
        )}

        {/* Active filter chips (always visible summary) */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 pb-2 animate-in fade-in duration-200">
            {Object.entries(filters).map(([key, val]) => {
              if (val === "" || val === false || val === undefined) return null;
              const def = activeFilterDefs.find(d => d.key === key);
              const label = def?.label || key;
              const display = def?.type === "range" ? `≤ ₹${(val as number).toLocaleString()}` : String(val);
              return (
                <span
                  key={key}
                  className={`flex items-center gap-2 px-3 py-1.5 ${activeCat?.light || "bg-gray-50"} ${activeCat?.text || "text-gray-900"} rounded-full text-[11px] font-black border border-current/20`}
                >
                  {label}: <strong>{display}</strong>
                  <button
                    type="button"
                    onClick={() => { clearFilter(key); handleSearch(); }}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
