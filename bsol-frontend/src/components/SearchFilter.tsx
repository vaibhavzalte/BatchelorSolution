"use client";

import { useState } from "react";
import { useCategory } from "@/contexts/CategoryContext";
import { 
  Search, 
  MapPin, 
  ChevronDown, 
  Milestone,
  CookingPot,
  House,
  Utensils, 
  ArrowRight,
  UsersRound,
  UserRound,
  Library
} from "lucide-react";

const SECONDARY_FILTERS = [
  { id: "any-day", label: "Any day" },
  { id: "any-type", label: "Any type" },
  { id: "distance", label: "Within 30 kilometers" },
];

const CATEGORIES = [
  { id: "all", label: "Posts", icon: Milestone, color: "bg-orange-500", border: "border-orange-100", light: "bg-orange-50", hex: "#fff7ed", text: "text-orange-600" },
  { id: "vacancies", label: "Vacancies", icon: UserRound, color: "bg-rose-500", border: "border-rose-100", light: "bg-rose-50", hex: "#fff1f2", text: "text-rose-600" },
  { id: "roommate", label: "Roommate", icon: UsersRound, color: "bg-violet-500", border: "border-violet-100", light: "bg-violet-50", hex: "#f5f3ff", text: "text-violet-600" },
  { id: "rooms", label: "Rooms", icon: House, color: "bg-indigo-500", border: "border-indigo-100", light: "bg-indigo-50", hex: "#eef2ff", text: "text-indigo-600" },
  { id: "food", label: "Food", icon: Utensils, color: "bg-pink-500", border: "border-pink-100", light: "bg-pink-50", hex: "#fdf2f8", text: "text-pink-600" },
  { id: "mess", label: "Mess", icon: CookingPot, color: "bg-amber-500", border: "border-amber-100", light: "bg-amber-50", hex: "#fffbeb", text: "text-amber-600" },
  { id: "study-rooms", label: "Study Rooms", icon: Library, color: "bg-emerald-500", border: "border-emerald-100", light: "bg-emerald-50", hex: "#ecfdf5", text: "text-emerald-600" }
];

export default function SearchFilter() {
  const { activeCategory, setActiveCategory, activeCatData } = useCategory();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("Pune, IN");

  return (
    <div className={`w-full pt-24 pb-16 transition-all duration-1000 ease-in-out`}>
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* 1. Category Grid (Non-scrolling Bento Design) */}
        <div className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`group relative flex flex-col items-center justify-center p-6 h-36 rounded-[2rem] transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? `${cat.color} text-white shadow-xl scale-105 z-10 shadow-primary/20` 
                      : `bg-white ${cat.text} border-2 border-transparent hover:${cat.border} hover:${cat.light} shadow-sm`
                  }`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-2xl mb-3 transition-transform duration-500 ${
                    isActive ? "bg-white/20 scale-110" : `${cat.light} ${cat.text} group-hover:scale-110`
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className={`text-[12px] font-black tracking-tight uppercase transition-colors duration-300 ${
                    isActive ? "text-white" : "text-gray-900 group-hover:text-gray-900"
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

        {/* 2. Combined Search Bar with Inline Filters */}
        <div className="flex items-center justify-center pb-10">
          <div className="w-full flex flex-col lg:flex-row items-center bg-white/80 backdrop-blur-2xl border-2 border-white lg:rounded-full rounded-[2.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.1)] focus-within:border-primary/40 focus-within:shadow-primary/10 transition-all p-3 lg:h-24 gap-3 lg:gap-0">
            
            {/* Search Input */}
            <div className="flex-[1.5] w-full flex items-center px-8 lg:border-r border-gray-100 min-w-0 group/field">
              <div className="w-12 h-12 bg-gray-50 group-focus-within/field:bg-primary/10 rounded-2xl flex items-center justify-center mr-4 transition-colors">
                <Search className="w-6 h-6 text-gray-400 group-focus-within/field:text-primary transition-colors" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">What are you looking for?</span>
                <input
                  type="text"
                  placeholder="Search rooms, mess, roommates..."
                  className="w-full bg-transparent outline-none text-base font-bold text-gray-900 placeholder:text-gray-300"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Location Input */}
            <div className="flex-1 w-full flex items-center px-8 lg:border-r border-gray-100 min-w-0 group/field">
              <div className="w-12 h-12 bg-gray-50 group-focus-within/field:bg-secondary/10 rounded-2xl flex items-center justify-center mr-4 transition-colors">
                <MapPin className="w-6 h-6 text-gray-400 group-focus-within/field:text-secondary transition-colors" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Where?</span>
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full bg-transparent outline-none text-base font-bold text-gray-900 placeholder:text-gray-300"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Inline Filters */}
            <div className="hidden xl:flex items-center flex-1 gap-3 px-8">
              {SECONDARY_FILTERS.map((f) => (
                <button 
                  key={f.id} 
                  className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 rounded-2xl text-[13px] font-black text-gray-500 whitespace-nowrap transition-all hover:text-gray-900 border border-transparent hover:border-gray-100"
                >
                  {f.label} <ChevronDown className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* Search Button */}
            <div className="px-3">
              <button className="h-16 lg:h-18 px-10 bg-gray-900 hover:bg-black text-white rounded-[2rem] flex items-center justify-center transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 font-bold text-lg gap-3 group">
                <Search className="w-5 h-5 group-hover:scale-125 transition-transform" />
                <span>Find Now</span>
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
