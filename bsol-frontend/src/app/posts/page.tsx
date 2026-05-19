"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/common/SearchBar";
import { SearchState } from "@/components/shared/BaseSearch";
import ListingHeader from "@/components/common/ListingHeader";
import ListingGrid from "@/components/common/ListingGrid";
import ListingCard from "@/components/common/ListingCard";
import Pagination from "@/components/common/Pagination";
import CreateListing from "@/components/common/CreateListing";
import EmptyState from "@/components/common/EmptyState";
import { MODULE_TITLE, MODULE_SUBTITLE } from "./constants";
import { getListings } from "@/lib/api";
import { MOCK_ROOMMATES } from "@/app/roommate/constants";
import { MOCK_STUDY_ROOMS } from "@/app/study-rooms/constants";

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "Pune", filters: {} };

const ALL_TYPES = [
  { type: "Room",       feedType: "Room" },
  { type: "RoomVacancy", feedType: "Vacancy" },
  { type: "Mess",       feedType: "Mess" },
  { type: "FoodStall",  feedType: "FoodStall" },
  { type: "StudyRoom",  feedType: "StudyRoom" },
] as const;

export default function PostsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<"room" | "vacancy" | "roommate" | "food" | "mess" | "study-rooms">("room");
  const ITEMS_PER_PAGE = 9;

  const loadListings = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (search.location) params.city = search.location;
      if (search.keyword) params.keyword = search.keyword;

      const results = await Promise.allSettled(
        ALL_TYPES.map(({ type }) => getListings(type as any, params))
      );

      const combined: any[] = [];
      ALL_TYPES.forEach(({ feedType }, idx) => {
        const result = results[idx];
        if (result.status === "fulfilled") {
          result.value.forEach((item) => combined.push({ ...item, feedType }));
        }
      });

      // Interleave by type index for visual variety
      const byType: Record<string, any[]> = {};
      combined.forEach((item) => {
        if (!byType[item.feedType]) byType[item.feedType] = [];
        byType[item.feedType].push(item);
      });
      const maxLen = Math.max(...Object.values(byType).map((a) => a.length), 0);
      const interleaved: any[] = [];
      for (let i = 0; i < maxLen; i++) {
        Object.values(byType).forEach((arr) => { if (arr[i]) interleaved.push(arr[i]); });
      }

      // Append mocks if empty
      if (interleaved.length === 0) {
        MOCK_ROOMMATES.forEach((r) => interleaved.push({ ...r, feedType: "Roommate" }));
        MOCK_STUDY_ROOMS.forEach((s) => interleaved.push({ ...s, feedType: "StudyRoom" }));
      }

      setListings(interleaved);
      setCurrentPage(1);
    } catch (err) {
      console.error("Posts feed failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadListings(); }, [search]);

  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const paginated = listings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      <SearchBar
        onSearch={setSearch}
        currentSearch={search}
        filterOptions={[]}
        categoryColor="bg-orange-500"
        categoryLight="bg-orange-50"
        categoryText="text-orange-600"
        categoryLabel={MODULE_TITLE}
      />

      <ListingHeader
        loading={loading}
        count={listings.length}
        categoryLabel={MODULE_TITLE}
        categorySubtitle={MODULE_SUBTITLE}
        onPostClick={() => setIsModalOpen(true)}
        themeColorClass="bg-orange-500 hover:bg-orange-600"
      />

      {loading ? (
        <ListingGrid loading skeletonCount={9}>{null}</ListingGrid>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Be the first to post a listing on Bachelor Solution!"
          onClearFilters={() => setSearch(DEFAULT_SEARCH)}
          colorClass="text-orange-500"
        />
      ) : (
        <>
          <ListingGrid>
            {paginated.map((item, idx) => (
              <ListingCard key={`${item.feedType}-${item.id ?? idx}`} type={item.feedType} data={item} />
            ))}
          </ListingGrid>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            activeColorClass="bg-orange-500 text-white"
          />
        </>
      )}

      {/* Quick-select module before posting */}
      <div className="flex flex-wrap gap-2 justify-center">
        {(["room","vacancy","roommate","food","mess","study-rooms"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setActiveModule(m)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
              activeModule === m
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-400 border-gray-100 hover:border-gray-300"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <CreateListing
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadListings}
        module={activeModule}
      />
    </div>
  );
}
