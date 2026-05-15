"use client";

import { useCategory } from "@/contexts/CategoryContext";
import { CATEGORIES } from "./SearchConstants";

export default function CategoryTabs() {
  const { activeCategory, setActiveCategory } = useCategory();

  return (
    <div className="w-full py-8">
      <div className="max-w-7xl mx-auto px-6">
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
                <span className={`text-[12px] font-black tracking-tight transition-colors duration-300 ${isActive ? "text-white" : "text-gray-900 group-hover:text-gray-900"
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
    </div>
  );
}
