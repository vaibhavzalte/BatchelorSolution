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
} from "lucide-react";

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
  const [keyword, setKeyword] = useState(currentSearch.keyword);
  const [location, setLocation] = useState(currentSearch.location);
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>(currentSearch.filters);
  const [showFilters, setShowFilters] = useState(false);

  // Reset local filter state when category changes
  useEffect(() => {
    setFilters({});
    setKeyword("");
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
    // Clean filters: remove falsy values except meaningful zeros/false
    const clean: Record<string, string | number | boolean> = {};
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== "" && v !== undefined) clean[k] = v;
    });
    onSearch({ keyword: keyword.trim(), location: location.trim(), filters: clean });
  }, [keyword, location, filters, onSearch]);

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
                  <span className={`text-[12px] font-black tracking-tight uppercase transition-colors duration-300 ${isActive ? "text-white" : "text-gray-900 group-hover:text-gray-900"
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

        {/* 2. Main Search Bar */}
        <div className="flex items-center justify-center pb-2">
          <div className="w-full flex flex-col lg:flex-row items-center bg-white/80 backdrop-blur-2xl border-2 border-white lg:rounded-full rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] focus-within:border-primary/40 transition-all p-3 lg:h-24 gap-3 lg:gap-0">

            {/* Keyword Input */}
            <div className="flex-[1.5] w-full flex items-center px-8 lg:border-r border-gray-100 min-w-0 group/field">
              <div className="w-12 h-12 bg-gray-50 group-focus-within/field:bg-primary/10 rounded-2xl flex items-center justify-center mr-4 transition-colors">
                <Search className="w-6 h-6 text-gray-400 group-focus-within/field:text-primary transition-colors" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">
                  {activeCategory === "rooms" ? "Search by title, area, city..." :
                    activeCategory === "vacancies" ? "Search by location, description..." :
                      activeCategory === "mess" ? "Search by mess name, area..." :
                        activeCategory === "food" ? "Search by stall name, location..." :
                          "What are you looking for?"}
                </span>
                <input
                  id="search-keyword-input"
                  type="text"
                  placeholder={
                    activeCategory === "rooms" ? "e.g. 1BHK near college..." :
                      activeCategory === "vacancies" ? "e.g. Double room for male..." :
                        activeCategory === "mess" ? "e.g. Veg mess near campus..." :
                          "Search rooms, mess, roommates..."
                  }
                  className="w-full bg-transparent outline-none text-base font-bold text-gray-900 placeholder:text-gray-300"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="flex-1 w-full flex items-center px-8 lg:border-r border-gray-100 min-w-0 group/field">
              <div className="w-12 h-12 bg-gray-50 group-focus-within/field:bg-secondary/10 rounded-2xl flex items-center justify-center mr-4 transition-colors">
                <MapPin className="w-6 h-6 text-gray-400 group-focus-within/field:text-secondary transition-colors" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Location</span>
                <input
                  id="search-location-input"
                  type="text"
                  placeholder="Area, City..."
                  className="w-full bg-transparent outline-none text-base font-bold text-gray-900 placeholder:text-gray-300"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>

            {/* Filter Toggle (if category has filters) */}
            {hasFilters && (
              <div className="hidden lg:flex items-center px-4">
                <button
                  id="toggle-filters-btn"
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`relative flex items-center gap-2 px-5 py-3 rounded-2xl text-[13px] font-black transition-all border-2 ${showFilters
                      ? `${activeCat?.color || "bg-gray-900"} text-white border-transparent`
                      : "bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-900"
                    }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Search Button */}
            <div className="px-3">
              <button
                id="search-submit-btn"
                type="button"
                onClick={handleSearch}
                className="h-16 lg:h-18 px-10 bg-gray-900 hover:bg-black text-white rounded-[2rem] flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 font-bold text-lg gap-3 group"
              >
                <Search className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span>Find Now</span>
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
                <span className="text-sm font-black text-gray-900 uppercase tracking-widest">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-between">
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        {filterDef.label}
                      </label>
                      <button
                        id={`filter-${filterDef.key}`}
                        type="button"
                        onClick={() => isOn ? clearFilter(filterDef.key) : setFilter(filterDef.key, true)}
                        className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 transition-all ${isOn
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
                className={`px-8 py-3 ${activeCat?.color || "bg-gray-900"} text-white rounded-2xl text-sm font-black uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2`}
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

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
