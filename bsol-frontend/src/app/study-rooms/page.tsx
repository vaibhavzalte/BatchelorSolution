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
import { FILTERS, MODULE_TITLE, MODULE_SUBTITLE, MOCK_STUDY_ROOMS } from "./constants";
import { getListings } from "@/lib/api";

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "Pune", filters: {} };

export default function StudyRoomsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState<SearchState>(DEFAULT_SEARCH);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const ITEMS_PER_PAGE = 6;

  const loadListings = async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = {};
      if (search.location) params.city = search.location;
      if (search.keyword) params.keyword = search.keyword;
      Object.entries(search.filters).forEach(([k, v]) => {
        if (v !== "" && v !== null && v !== undefined) params[k] = v;
      });

      const data = await getListings("StudyRoom", params);

      // Apply frontend-side timing/wifi filters if present
      let filtered = [...data];
      if (search.filters.timing) {
        filtered = filtered.filter((s: any) =>
          s.timing?.toLowerCase() === String(search.filters.timing).toLowerCase()
        );
      }
      if (search.filters.hasWifi) {
        filtered = filtered.filter((s: any) => s.hasWifi === true);
      }

      setListings(filtered.length > 0 ? filtered : MOCK_STUDY_ROOMS);
      setCurrentPage(1);
    } catch {
      setListings(MOCK_STUDY_ROOMS);
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
        filterOptions={FILTERS}
        categoryColor="bg-[var(--study-primary)]"
        categoryLight="bg-[var(--study-primary-light)]"
        categoryText="text-[var(--study-primary)]"
        categoryLabel={MODULE_TITLE}
      />

      <ListingHeader
        loading={loading}
        count={listings.length}
        categoryLabel={MODULE_TITLE}
        categorySubtitle={MODULE_SUBTITLE}
        onPostClick={() => setIsModalOpen(true)}
        themeColorClass="bg-[var(--study-primary)] hover:brightness-110"
      />

      {loading ? (
        <ListingGrid loading skeletonCount={6}>{null}</ListingGrid>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No study spaces found"
          description="No reading rooms or quiet desks match your search. Try removing filters."
          onClearFilters={() => setSearch(DEFAULT_SEARCH)}
          colorClass="text-[var(--study-primary)]"
        />
      ) : (
        <>
          <ListingGrid>
            {paginated.map((item) => (
              <ListingCard key={item.id} type="StudyRoom" data={item} />
            ))}
          </ListingGrid>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            activeColorClass="bg-[var(--study-primary)] text-white"
          />
        </>
      )}

      <CreateListing
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadListings}
        module="study-rooms"
      />
    </div>
  );
}
