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
import { FILTERS, MODULE_TITLE, MODULE_SUBTITLE, MOCK_ROOMMATES } from "./constants";
import { getListings } from "@/lib/api";

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "Pune", filters: {} };

export default function RoommatePage() {
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

      const vacancies = await getListings("RoomVacancy", params);
      // Map vacancies → roommate profile shape
      let mapped = vacancies.map((v: any) => ({
        id: v.id,
        title: v.description || "Looking for Roommate",
        gender: v.preferredTenant === "Male" ? "Boys" : v.preferredTenant === "Female" ? "Girls" : "Any",
        occupation: "Any",
        roomType: v.roomType || "Shared",
        rent: v.rent,
        address: v.location,
        city: v.city || search.location,
        ownerName: v.ownerName || "Advertiser",
        ownerContact: v.ownerContact,
        images: v.images || [],
        status: v.status || "active",
        feedType: "Roommate",
      }));

      // Filter by roommate-specific filters on the frontend
      const { gender, occupation, roomType } = search.filters;
      if (gender && gender !== "Any") mapped = mapped.filter((r) => r.gender === gender);
      if (roomType) mapped = mapped.filter((r) => r.roomType?.toLowerCase() === String(roomType).toLowerCase());

      // Fall back to mocks if no live data
      setListings(mapped.length > 0 ? mapped : MOCK_ROOMMATES);
      setCurrentPage(1);
    } catch {
      setListings(MOCK_ROOMMATES);
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
        categoryColor="bg-[var(--roommate-primary)]"
        categoryLight="bg-[var(--roommate-primary-light)]"
        categoryText="text-[var(--roommate-primary)]"
        categoryLabel={MODULE_TITLE}
      />

      <ListingHeader
        loading={loading}
        count={listings.length}
        categoryLabel={MODULE_TITLE}
        categorySubtitle={MODULE_SUBTITLE}
        onPostClick={() => setIsModalOpen(true)}
        themeColorClass="bg-[var(--roommate-primary)] hover:brightness-110"
      />

      {loading ? (
        <ListingGrid loading skeletonCount={6}>{null}</ListingGrid>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No roommates found"
          description="No roommate listings match your preferences. Try broadening your search."
          onClearFilters={() => setSearch(DEFAULT_SEARCH)}
          colorClass="text-[var(--roommate-primary)]"
        />
      ) : (
        <>
          <ListingGrid>
            {paginated.map((item) => (
              <ListingCard key={item.id} type="Roommate" data={item} />
            ))}
          </ListingGrid>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            activeColorClass="bg-[var(--roommate-primary)] text-white"
          />
        </>
      )}

      <CreateListing
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadListings}
        module="roommate"
      />
    </div>
  );
}
