"use client";

import { useState, useEffect, useCallback } from "react";
import { useCategory } from "@/contexts/CategoryContext";
import { getListings, AnyListing, ListingType } from "@/lib/api";
import { Plus, Loader2, AlertCircle, RefreshCw, Search, House, CookingPot, Utensils } from "lucide-react";

// Shared Components
import CategoryTabs from "@/components/shared/CategoryTabs";
import PostsSearch from "@/components/shared/PostsSearch";
import { SearchState } from "@/components/shared/BaseSearch";

// Room Components
import RoomCard from "@/components/rooms/RoomCard";
import RoomSearch from "@/components/rooms/RoomSearch";
import CreateRoomModal from "@/components/rooms/CreateRoomModal";

// Vacancy Components
import VacancyCard from "@/components/vacancies/VacancyCard";
import VacancySearch from "@/components/vacancies/VacancySearch";

// Mess Components
import MessCard from "@/components/mess/MessCard";
import MessSearch from "@/components/mess/MessSearch";

// Food Components
import FoodCard from "@/components/food/FoodCard";
import FoodSearch from "@/components/food/FoodSearch";

// Other Components
import CreateListingModal from "@/components/CreateListingModal";

const CATEGORY_TO_TYPE: Record<string, ListingType | null> = {
  all: "Room", // Default type for the "Posts" category
  rooms: "Room",
  mess: "Mess",
  food: "FoodStall",
  vacancies: "RoomVacancy",
  roommate: null,
  "study-rooms": null,
};

const ALL_TYPES: ListingType[] = ["Room", "Mess", "FoodStall", "RoomVacancy"];

interface TypedListing {
  type: ListingType;
  data: AnyListing;
}

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "Pune", filters: { freshness: "1w" } };

export default function Home() {
  const { activeCategory } = useCategory();
  const [listings, setListings] = useState<TypedListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const mappedType = CATEGORY_TO_TYPE[activeCategory];
      const params: Record<string, any> = {
        ...search.filters,
        city: search.location,
        keyword: search.keyword,
      };

      if (mappedType) {
        const items = await getListings(mappedType, params);
        setListings(items.map((d) => ({ type: mappedType, data: d })));
      } else {
        setListings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  useEffect(() => {
    setSearch(DEFAULT_SEARCH);
  }, [activeCategory]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const renderSearchComponent = () => {
    const props = { onSearch: setSearch, currentSearch: search };
    switch (activeCategory) {
      case "rooms": return <RoomSearch {...props} />;
      case "vacancies": return <VacancySearch {...props} />;
      case "mess": return <MessSearch {...props} />;
      case "food": return <FoodSearch {...props} />;
      default: return <PostsSearch {...props} />;
    }
  };

  const renderListingCard = (item: TypedListing, idx: number) => {
    switch (item.type) {
      case "Room": return <RoomCard key={idx} room={item.data as any} />;
      case "RoomVacancy": return <VacancyCard key={idx} vacancy={item.data as any} />;
      case "Mess": return <MessCard key={idx} mess={item.data as any} />;
      case "FoodStall": return <FoodCard key={idx} stall={item.data as any} />;
      default: return null;
    }
  };

  const hasSearch = search.keyword !== "" || Object.keys(search.filters).length > 1; // >1 because freshness is default

  return (
    <>
      <CreateRoomModal
        isOpen={isModalOpen && activeCategory === "rooms"}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchListings}
      />
      <CreateListingModal
        isOpen={isModalOpen && activeCategory !== "rooms"}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchListings}
      />

      <div className="flex flex-col pb-24 pt-20">
        <CategoryTabs />
        
        <div className="max-w-7xl mx-auto px-6 w-full mb-8 relative z-50">
          {renderSearchComponent()}
        </div>

        <main className="max-w-7xl mx-auto px-6 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {loading ? "Searching..." : `${listings.length} Results Found`}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5 uppercase tracking-widest">
                {activeCategory === "all" ? "Latest Listings" : `Category: ${activeCategory}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Post Listing
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Fetching listings...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <AlertCircle className="w-12 h-12 text-red-400" />
              <div className="text-center">
                <p className="text-gray-900 font-black text-lg">Backend Unreachable</p>
                <p className="text-gray-400 text-sm mt-1">{error}</p>
              </div>
              <button onClick={fetchListings} className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-bold transition-all"><RefreshCw className="w-4 h-4" /> Retry</button>
            </div>
          ) : listings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6 bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
               <Search className="w-12 h-12 text-gray-200" />
               <div className="text-center">
                 <p className="text-gray-900 font-black text-xl">No listings found</p>
                 <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">Try adjusting your filters or search area to find more results.</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {listings.map((item, idx) => renderListingCard(item, idx))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
