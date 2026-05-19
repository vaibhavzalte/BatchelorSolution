"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

export const CATEGORIES = [
  { id: "all", label: "Posts", hex: "#fff7ed", light: "bg-orange-50", color: "bg-orange-500" },
  { id: "rooms", label: "Rooms", hex: "#eff6ff", light: "bg-blue-50", color: "bg-blue-600" },
  { id: "vacancies", label: "Vacancies", hex: "#fff1f2", light: "bg-rose-50", color: "bg-rose-600" },
  { id: "roommate", label: "Roommate", hex: "#f5f3ff", light: "bg-violet-50", color: "bg-violet-600" },
  { id: "food", label: "Food", hex: "#fdf2f8", light: "bg-pink-50", color: "bg-pink-600" },
  { id: "mess", label: "Mess", hex: "#fff7ed", light: "bg-orange-50", color: "bg-orange-600" },
  { id: "study-rooms", label: "Study Rooms", hex: "#ecfdf5", light: "bg-emerald-50", color: "bg-emerald-600" },
  { id: "posts", label: "All Posts", hex: "#fff7ed", light: "bg-orange-50", color: "bg-orange-500" },
];

interface CategoryContextType {
  activeCategory: string;
  setActiveCategory: (id: string) => void;
  activeCatData: typeof CATEGORIES[0] | undefined;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Sync initial state from URL
  const getInitialCategory = () => {
    const path = pathname.split("/").filter(Boolean).pop(); // Get last segment if it's a category
    const validCat = CATEGORIES.find(c => c.id === path);
    return validCat ? validCat.id : "all";
  };

  const [activeCategory, setActiveCategoryState] = useState(getInitialCategory);

  const setActiveCategory = (id: string) => {
    setActiveCategoryState(id);
    if (id === "all") {
      router.push("/");
    } else {
      router.push(`/${id}`);
    }
  };

  // Sync state when URL changes (back/forward button)
  useEffect(() => {
    const currentPath = pathname === "/" ? "all" : pathname.split("/").filter(Boolean).pop() || "all";
    if (CATEGORIES.find(c => c.id === currentPath)) {
      setActiveCategoryState(currentPath);
    }
  }, [pathname]);

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
