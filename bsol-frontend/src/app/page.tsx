"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import SearchFilter, { SearchState } from "@/components/SearchFilter";
import ListingCard from "@/components/ListingCard";
import CreateListingModal from "@/components/CreateListingModal";
import CreateRoomModal from "@/components/rooms/CreateRoomModal";
import { getListings, AnyListing, ListingType, Room, Mess, FoodStall, RoomVacancy } from "@/lib/api";
import { Plus, House, CookingPot, Utensils, Loader2, AlertCircle, RefreshCw, Search } from "lucide-react";
import { useCategory } from "@/contexts/CategoryContext";

// Mapping from category context IDs ➜ backend ListingType
const CATEGORY_TO_TYPE: Record<string, ListingType | null> = {
  all: null,
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

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "", filters: {} };

// ─── Client-side filter logic ──────────────────────────────────────────────────

function matchesSearch(item: TypedListing, search: SearchState): boolean {
  const { keyword, location, filters } = search;
  const d = item.data as Record<string, unknown>;

  // ── keyword match ──
  if (keyword) {
    const kw = keyword.toLowerCase();
    const searchableText = [
      d.title, d.description, d.stallName, d.location, d.area, d.city,
      d.address, d.ownerName, d.roomType, d.foodType, d.mealType
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    if (!searchableText.includes(kw)) return false;
  }

  // ── location match ──
  if (location) {
    const loc = location.toLowerCase();
    const locationText = [d.location, d.area, d.city, d.address]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!locationText.includes(loc)) return false;
  }

  // ── per-type filter match ──
  for (const [key, val] of Object.entries(filters)) {
    if (val === "" || val === undefined) continue;

    // Range filters (maxRent, maxMonthlyFee)
    if (key === "maxRent") {
      const rent = (d.rent as number | undefined) ?? 0;
      if (rent > (val as number)) return false;
      continue;
    }
    if (key === "maxMonthlyFee") {
      const fee = (d.monthlyFee as number | undefined) ?? 0;
      if (fee > (val as number)) return false;
      continue;
    }

    // Toggle / boolean filters
    if (val === true) {
      if (!d[key]) return false;
      continue;
    }

    // String/select filters
    if (typeof val === "string") {
      const fieldVal = (d[key] as string | undefined) ?? "";
      if (fieldVal.toLowerCase() !== val.toLowerCase()) return false;
    }
  }

  return true;
}

// ─── Main Page ────────────────────────────────────────────────────────────────

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

      // Build parameters for the API call
      const params: Record<string, any> = {
        ...search.filters,
        city: search.location,
        keyword: search.keyword,
      };

      // Default freshness for Rooms if not explicitly selected in the search filters
      // We check if it's missing entirely (e.g. on initial load)
      if (mappedType === "Room" && params.freshness === undefined) {
        params.freshness = "1w";
      }

      console.log(`[fetchListings] Fetching ${activeCategory} (${mappedType}) with params:`, params);

      if (mappedType !== null && mappedType !== undefined) {
        const items = await getListings(mappedType, params);
        setListings(items.map((d) => ({ type: mappedType, data: d })));
      } else if (activeCategory === "all") {
        const results = await Promise.allSettled(
          ALL_TYPES.map((t) => getListings(t, params))
        );
        const merged: TypedListing[] = [];
        ALL_TYPES.forEach((t, i) => {
          const r = results[i];
          if (r.status === "fulfilled") {
            r.value.forEach((d) => merged.push({ type: t, data: d }));
          }
        });
        setListings(merged);
      } else {
        setListings([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load listings");
    } finally {
      setLoading(false);
    }
  }, [activeCategory, search]);

  // Reset search when category changes
  useEffect(() => {
    setSearch(DEFAULT_SEARCH);
  }, [activeCategory]);

  // Refetch when category OR search state changes
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // No longer need client-side filtering as backend handles it
  const filteredListings = listings;

  const hasSearch =
    search.keyword !== "" ||
    search.location !== "" ||
    Object.keys(search.filters).length > 0;

  const mappedType = CATEGORY_TO_TYPE[activeCategory];
  const hasBackendType = mappedType !== null && mappedType !== undefined;
  const isAllCategory = activeCategory === "all";

  return (
    <>
      {/* Dedicated Room modal — only shown when in rooms category */}
      <CreateRoomModal
        isOpen={isModalOpen && activeCategory === "rooms"}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchListings}
      />
      {/* Generic modal for all other types */}
      <CreateListingModal
        isOpen={isModalOpen && activeCategory !== "rooms"}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchListings}
      />

      <div className="flex flex-col pb-24">
        <SearchFilter
          onSearch={(state) => setSearch(state)}
          currentSearch={search}
        />

        {/* ── Section Header ───────────────────────────────────────────── */}
        <main className="max-w-7xl mx-auto px-6 mt-4 w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                {loading
                  ? "Loading listings…"
                  : hasSearch
                    ? `${filteredListings.length} result${filteredListings.length !== 1 ? "s" : ""} found`
                    : filteredListings.length > 0
                      ? `${filteredListings.length} listing${filteredListings.length !== 1 ? "s" : ""}`
                      : "No listings yet"}
              </h1>
              <p className="text-sm text-gray-400 font-medium mt-0.5">
                {isAllCategory ? "All categories" : `Showing: ${activeCategory}`}
                {hasSearch && ` · Filtered`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Clear Search */}
              {hasSearch && (
                <button
                  id="clear-search-btn"
                  onClick={() => setSearch(DEFAULT_SEARCH)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-bold text-sm transition-all active:scale-95"
                >
                  Clear filters
                </button>
              )}
              {/* Post Listing CTA */}
              <button
                id="post-listing-btn"
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-sm shadow-lg hover:shadow-2xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Post Listing
              </button>
            </div>
          </div>

          {/* ── States ──────────────────────────────────────────────── */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
              </div>
              <p className="text-gray-400 font-semibold text-sm">Fetching listings from database…</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-black text-base">Could not connect to backend</p>
                <p className="text-gray-400 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={fetchListings}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          )}

          {/* No results after filtering */}
          {!loading && !error && listings.length > 0 && filteredListings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-black text-lg">No results match your filters</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                  Try adjusting your search keyword or removing some filters.
                </p>
              </div>
              <button
                onClick={() => setSearch(DEFAULT_SEARCH)}
                className="flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Clear filters
              </button>
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-6">
              <div className="flex gap-3">
                {[House, CookingPot, Utensils].map((Icon, i) => (
                  <div key={i} className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-gray-300" />
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-gray-800 font-black text-lg">No listings here yet</p>
                <p className="text-gray-400 text-sm mt-1 max-w-xs">
                  Be the first to post a room, mess, or food stall in this category.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 px-7 py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" /> Post First Listing
              </button>
            </div>
          )}

          {/* ── Listings Grid ──────────────────────────────────────────── */}
          {!loading && !error && filteredListings.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-16">
              {filteredListings.map((item, idx) => (
                <ListingCard key={idx} type={item.type} data={item.data} />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
