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
import { FILTERS, MODULE_TITLE, MODULE_SUBTITLE } from "./constants";
import { getListings, Mess } from "@/lib/api";

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "Pune", filters: {} };

export default function MessPage() {
  const [listings, setListings] = useState<Mess[]>([]);
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
      const data = await getListings("Mess", params);
      setListings(data as Mess[]);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load messes:", err);
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
        categoryColor="bg-[var(--mess-primary)]"
        categoryLight="bg-[var(--mess-primary-light)]"
        categoryText="text-[var(--mess-primary)]"
        categoryLabel={MODULE_TITLE}
      />

      <ListingHeader
        loading={loading}
        count={listings.length}
        categoryLabel={MODULE_TITLE}
        categorySubtitle={MODULE_SUBTITLE}
        onPostClick={() => setIsModalOpen(true)}
        themeColorClass="bg-[var(--mess-primary)] hover:brightness-110"
      />

      {loading ? (
        <ListingGrid loading skeletonCount={6}>{null}</ListingGrid>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No mess services found"
          description="No tiffin or mess listings match your area. Try adjusting your city."
          onClearFilters={() => setSearch(DEFAULT_SEARCH)}
          colorClass="text-[var(--mess-primary)]"
        />
      ) : (
        <>
          <ListingGrid>
            {paginated.map((item) => (
              <ListingCard key={item.id} type="Mess" data={item} />
            ))}
          </ListingGrid>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            activeColorClass="bg-[var(--mess-primary)] text-white"
          />
        </>
      )}

      <CreateListing
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadListings}
        module="mess"
      />
    </div>
  );
}
