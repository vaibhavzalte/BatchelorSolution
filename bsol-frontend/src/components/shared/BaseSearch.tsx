"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, MapPin, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { INDIAN_CITIES, FilterOption } from "./SearchConstants";

export interface SearchState {
  keyword: string;
  location: string;
  filters: Record<string, string | number | boolean>;
}

interface BaseSearchProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
  filterOptions: FilterOption[];
  categoryColor: string;
  categoryLight: string;
  categoryText: string;
  categoryLabel: string;
  showAvailableFor?: boolean;
}

export default function BaseSearch({
  onSearch,
  currentSearch,
  filterOptions,
  categoryColor,
  categoryLight,
  categoryText,
  categoryLabel,
  showAvailableFor = true
}: BaseSearchProps) {
  const [city, setCity] = useState(currentSearch.location || "Pune");
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
  const [freshness, setFreshness] = useState((currentSearch.filters.freshness as string) || "1w");
  const [rentSort, setRentSort] = useState((currentSearch.filters.rentSort as string) || "");
  const [availableFor, setAvailableFor] = useState((currentSearch.filters.availableFor as string) || "");

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>(currentSearch.filters);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) setIsCityOpen(false);
      if (freshnessDropdownRef.current && !freshnessDropdownRef.current.contains(event.target as Node)) setIsFreshnessOpen(false);
      if (rentSortDropdownRef.current && !rentSortDropdownRef.current.contains(event.target as Node)) setIsRentSortOpen(false);
      if (availableForDropdownRef.current && !availableForDropdownRef.current.contains(event.target as Node)) setIsAvailableForOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = useCallback(() => {
    const combinedFilters = { ...filters };
    if (freshness) combinedFilters.freshness = freshness;
    if (rentSort) combinedFilters.rentSort = rentSort;
    if (availableFor && showAvailableFor) combinedFilters.availableFor = availableFor;

    onSearch({
      keyword: keyword.trim(),
      location: city.trim(),
      filters: combinedFilters
    });
  }, [keyword, city, freshness, rentSort, availableFor, filters, onSearch, showAvailableFor]);

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

  const activeFilterCount = Object.values(filters).filter(v => v !== "" && v !== false && v !== 0 && v !== freshness && v !== rentSort && v !== availableFor).length;

  return (
    <div className="w-full space-y-6">
      {/* Search Bar */}
      <div className="relative z-50 bg-white/20 backdrop-blur-xl p-2 flex flex-wrap lg:flex-nowrap items-center gap-3 rounded-[2rem] border border-white/30 shadow-2xl">
        {/* City Field */}
        <div className="flex-1 min-w-[140px] p-1 relative" ref={cityDropdownRef}>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">City</span>
          <div
            onClick={() => setIsCityOpen(!isCityOpen)}
            className="bg-white/60 border border-gray-200 rounded-2xl p-2 h-[48px] flex items-center justify-between cursor-pointer hover:bg-white transition-all shadow-sm"
          >
            <span className="text-sm font-bold text-gray-900 truncate ml-2">{city}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCityOpen ? "rotate-180" : ""}`} />
          </div>

          {isCityOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1001]">
              <div className="p-2 border-b border-gray-50 bg-gray-50/30">
                <input
                  autoFocus
                  placeholder="Search city..."
                  className="w-full px-3 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-900 outline-none"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                />
              </div>
              <div className="max-h-60 overflow-y-auto p-1">
                {INDIAN_CITIES.filter(c => c.toLowerCase().includes(cityQuery.toLowerCase())).map(c => (
                  <button
                    key={c}
                    onClick={() => {
                      setCity(c);
                      setIsCityOpen(false);
                      setCityQuery("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all ${city === c ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Locality Field */}
        <div className="flex-[1.5] min-w-[200px] p-1 flex flex-col group">
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest ml-2">Locality</span>
          <div className="bg-white/60 border border-gray-200 rounded-2xl p-2 h-[48px] flex items-center hover:bg-white transition-all shadow-sm">
            <MapPin className="w-4 h-4 text-gray-400 ml-2 mr-2" />
            <input
              type="text"
              placeholder="landmark or localities"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full bg-transparent border-none outline-none text-sm font-bold text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Freshness */}
        <div className="flex-1 min-w-[120px] p-1 flex flex-col group relative" ref={freshnessDropdownRef}>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">Freshness</span>
          <div 
            onClick={() => setIsFreshnessOpen(!isFreshnessOpen)}
            className="bg-white/60 border border-gray-200 rounded-2xl p-2 h-[48px] flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-sm"
          >
            <span className="text-xs font-bold text-gray-900">
              {freshness === "24h" ? "Past 24 hr" : freshness === "1d" ? "1 day" : freshness === "4d" ? "4 days" : freshness === "1w" ? "1 week" : "All Time"}
            </span>
            <ChevronDown className={`ml-2 w-3 h-3 text-gray-400 transition-transform ${isFreshnessOpen ? "rotate-180" : ""}`} />
          </div>
          {isFreshnessOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[1001]">
              <div className="p-1">
                {[{ label: "Past 24 hr", value: "24h" }, { label: "1 day", value: "1d" }, { label: "4 days", value: "4d" }, { label: "1 week", value: "1w" }, { label: "All Time", value: "" }].map(opt => (
                  <button key={opt.value} onClick={() => { setFreshness(opt.value); setIsFreshnessOpen(false); }} className={`w-full text-center px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${freshness === opt.value ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Rent Sort */}
        <div className="flex-1 min-w-[120px] p-1 flex flex-col group relative" ref={rentSortDropdownRef}>
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest text-center">Rent Sort</span>
          <div 
            onClick={() => setIsRentSortOpen(!isRentSortOpen)}
            className="bg-white/60 border border-gray-200 rounded-2xl p-2 h-[48px] flex items-center justify-center cursor-pointer hover:bg-white transition-all shadow-sm"
          >
            <span className="text-xs font-bold text-gray-900">
              {rentSort === "low-high" ? "Low to High" : rentSort === "high-low" ? "High to Low" : "Any Price"}
            </span>
            <ChevronDown className={`ml-2 w-3 h-3 text-gray-400 transition-transform ${isRentSortOpen ? "rotate-180" : ""}`} />
          </div>
          {isRentSortOpen && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[1001]">
              <div className="p-1">
                {[{ label: "Any Price", value: "" }, { label: "Low to High", value: "low-high" }, { label: "High to Low", value: "high-low" }].map(opt => (
                  <button key={opt.value} onClick={() => { setRentSort(opt.value); setIsRentSortOpen(false); }} className={`w-full text-center px-3 py-2 rounded-lg text-[11px] font-bold transition-all ${rentSort === opt.value ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* More Filters Toggle */}
        {filterOptions.length > 0 && (
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-1 h-[48px] w-[48px] rounded-2xl flex items-center justify-center transition-all ${showFilters ? "bg-gray-900 text-white" : "bg-white/60 hover:bg-white border border-gray-200 shadow-sm text-gray-600"}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-[48px] rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          FIND
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && filterOptions.length > 0 && (
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 ${categoryColor} rounded-2xl flex items-center justify-center shadow-lg`}>
                <SlidersHorizontal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-gray-900 tracking-widest uppercase">{categoryLabel} Filters</h3>
                <p className="text-[10px] font-bold text-gray-400 mt-0.5">Refine your search results</p>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => setFilters({})}
                className="text-[11px] font-black text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Clear All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filterOptions.map((opt) => {
              const value = filters[opt.key];
              if (opt.type === "select") {
                return (
                  <div key={opt.key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{opt.label}</label>
                    <div className="relative">
                      <select
                        value={(value as string) || ""}
                        onChange={(e) => e.target.value ? setFilter(opt.key, e.target.value) : clearFilter(opt.key)}
                        className={`w-full px-4 py-3 rounded-xl text-xs font-bold border-2 outline-none appearance-none transition-all ${value ? `${categoryLight} ${categoryText} border-current` : "bg-gray-50 border-gray-100 text-gray-500"}`}
                      >
                        <option value="">Any {opt.label}</option>
                        {opt.options?.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                );
              }
              if (opt.type === "range") {
                const numVal = (value as number) || opt.max!;
                return (
                  <div key={opt.key} className="space-y-4 col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{opt.label}</label>
                      <span className={`text-[11px] font-black ${categoryText}`}>
                        {numVal === opt.max ? "Any Price" : `≤ ₹${numVal.toLocaleString()}`}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={opt.min}
                      max={opt.max}
                      step={opt.step}
                      value={numVal}
                      onChange={(e) => Number(e.target.value) === opt.max ? clearFilter(opt.key) : setFilter(opt.key, Number(e.target.value))}
                      className={`w-full h-1.5 rounded-full accent-gray-900 cursor-pointer`}
                    />
                    <div className="flex justify-between text-[9px] font-black text-gray-300">
                      <span>₹{opt.min?.toLocaleString()}</span>
                      <span>₹{opt.max?.toLocaleString()}+</span>
                    </div>
                  </div>
                );
              }
              if (opt.type === "toggle") {
                const isOn = value === true;
                return (
                  <div key={opt.key} className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">{opt.label}</label>
                    <button
                      onClick={() => isOn ? clearFilter(opt.key) : setFilter(opt.key, true)}
                      className={`w-full py-3 rounded-xl text-[11px] font-black uppercase tracking-widest border-2 transition-all ${isOn ? `${categoryColor} text-white border-transparent shadow-lg` : "bg-gray-50 border-gray-100 text-gray-400"}`}
                    >
                      {isOn ? "✓ " : ""}{opt.label}
                    </button>
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSearch}
              className={`px-10 py-4 ${categoryColor} text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-3`}
            >
              <Search className="w-4 h-4" /> Apply & Show Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
