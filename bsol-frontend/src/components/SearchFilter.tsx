"use client";

import { useState } from "react";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Star, 
  Building2, 
  Zap, 
  Utensils, 
  Music, 
  Heart, 
  Compass, 
  Briefcase, 
  Laptop, 
  Globe, 
  Gamepad2,
  ArrowRight
} from "lucide-react";

const SECONDARY_FILTERS = [
  { id: "any-day", label: "Any day" },
  { id: "any-type", label: "Any type" },
  { id: "distance", label: "Within 30 kilometers" },
];

const CATEGORIES = [
  { id: "all", label: "All posts", icon: Star, color: "bg-orange-500/10 text-orange-600" },
  { id: "rooms", label: "New Rooms", icon: Building2, color: "bg-indigo-500/10 text-indigo-600" },
  { id: "vacancies", label: "Vacancies", icon: Utensils, color: "bg-rose-500/10 text-rose-600" },
  { id: "food", label: "Food Stops", icon: Music, color: "bg-pink-500/10 text-pink-600" },
  { id: "travel", label: "Travel", icon: Compass, color: "bg-blue-500/10 text-blue-600" },
  { id: "business", label: "Business", icon: Briefcase, color: "bg-amber-500/10 text-amber-600" },
  { id: "tech", label: "Technology", icon: Laptop, color: "bg-cyan-500/10 text-cyan-600" },
  { id: "social", label: "Social", icon: Zap, color: "bg-yellow-500/10 text-yellow-600" },
  { id: "language", label: "Language", icon: Globe, color: "bg-emerald-500/10 text-emerald-600" },
  { id: "games", label: "Games", icon: Gamepad2, color: "bg-violet-500/10 text-violet-600" },
];

export default function SearchFilter() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Pune, IN");

  return (
    <div className="w-full bg-white pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-6 space-y-12">
        
        {/* 1. Horizontal Categories (Secondary Tabs) */}
        <div className="relative group overflow-hidden">
          <div className="flex items-center gap-10 overflow-x-auto no-scrollbar scroll-smooth pb-4 pr-12">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex flex-col items-center gap-3 transition-all shrink-0 ${
                    isActive ? "scale-105" : "hover:scale-105"
                  }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20" 
                      : `${cat.color} hover:bg-white border border-transparent`
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-center">
                    <span className={`text-[11px] font-bold tracking-tight uppercase ${
                      isActive ? "text-primary" : "text-gray-400"
                    }`}>
                      {cat.label}
                    </span>
                    {isActive && <div className="w-1 h-1 bg-primary rounded-full mt-1" />}
                  </div>
                </button>
              );
            })}
          </div>

          <button className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-200 rounded-full items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-105 z-10 translate-x-1/2 hidden group-hover:flex">
            <ArrowRight className="w-5 h-5 text-gray-400" />
          </button>
          <div className="absolute right-0 top-0 bottom-4 w-24 bg-linear-to-l from-white via-white/80 to-transparent pointer-events-none" />
        </div>

        {/* 2. Combined Search Bar with Inline Filters */}
        <div className="flex items-center justify-center">
          <div className="w-full flex flex-col lg:flex-row items-center bg-white border-2 border-gray-100 lg:rounded-full rounded-3xl shadow-sm focus-within:border-primary/20 focus-within:shadow-md transition-all p-2 lg:h-16 gap-2 lg:gap-0">
            
            {/* Search Input */}
            <div className="flex-[1.5] w-full flex items-center px-4 lg:border-r border-gray-100 min-w-0">
              <Search className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-gray-400"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            {/* Location Input */}
            <div className="flex-1 w-full flex items-center px-4 lg:border-r border-gray-100 min-w-0">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Location"
                className="w-full bg-transparent outline-none text-sm font-semibold placeholder:text-gray-400"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* Inline Filters */}
            <div className="hidden xl:flex items-center flex-1 gap-2 px-4 border-r border-gray-100">
              {SECONDARY_FILTERS.map((f) => (
                <button 
                  key={f.id} 
                  className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-gray-50 rounded-lg text-[12px] font-bold text-gray-500 whitespace-nowrap transition-colors"
                >
                  {f.label} <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>

            {/* Search Button */}
            <div className="px-2">
              <button className="h-12 lg:h-12 px-8 bg-gray-900 hover:bg-black text-white rounded-full flex items-center justify-center transition-all shadow-sm font-bold text-sm gap-2">
                <Search className="w-4 h-4" />
                <span>Find</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
