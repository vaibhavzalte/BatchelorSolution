"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export const CATEGORIES = [
  { id: "all", label: "Posts", hex: "#fff7ed", light: "bg-orange-50", color: "bg-orange-500" },
  { id: "vacancies", label: "Vacancies", hex: "#fff1f2", light: "bg-rose-50", color: "bg-rose-500" },
  { id: "roommate", label: "Roommate", hex: "#f5f3ff", light: "bg-violet-50", color: "bg-violet-500" },
  { id: "rooms", label: "Rooms", hex: "#eef2ff", light: "bg-indigo-50", color: "bg-indigo-500" },
  { id: "food", label: "Food", hex: "#fdf2f8", light: "bg-pink-50", color: "bg-pink-500" },
  { id: "mess", label: "Mess", hex: "#fffbeb", light: "bg-amber-50", color: "bg-amber-500" },
  { id: "study-rooms", label: "Study Rooms", hex: "#ecfdf5", light: "bg-emerald-50", color: "bg-emerald-500" }
];

interface CategoryContextType {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  activeCatData: typeof CATEGORIES[0] | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const activeCatData = CATEGORIES.find(cat => cat.id === activeCategory);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.transition = "background-color 1s cubic-bezier(0.4, 0, 0.2, 1)";
      document.body.style.backgroundColor = activeCatData?.hex || "#ffffff";
    }
  }, [activeCategory, activeCatData]);

  return (
    <CategoryContext.Provider value={{ activeCategory, setActiveCategory, activeCatData }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error("useCategory must be used within a CategoryProvider");
  }
  return context;
}
