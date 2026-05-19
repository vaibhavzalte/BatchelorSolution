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
import { getListings, RoomVacancy } from "@/lib/api";

const DEFAULT_SEARCH: SearchState = { keyword: "", location: "Pune", filters: {} };

export default function VacanciesPage() {
  const [listings, setListings] = useState<RoomVacancy[]>([]);
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
      const data = await getListings("RoomVacancy", params);
      setListings(data as RoomVacancy[]);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load vacancies:", err);
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
        onSearch={(s) => { setSearch(s); }}
        currentSearch={search}
        filterOptions={FILTERS}
        categoryColor="bg-[var(--vacancy-primary)]"
        categoryLight="bg-[var(--vacancy-primary-light)]"
        categoryText="text-[var(--vacancy-primary)]"
        categoryLabel={MODULE_TITLE}
      />

      <ListingHeader
        loading={loading}
        count={listings.length}
        categoryLabel={MODULE_TITLE}
        categorySubtitle={MODULE_SUBTITLE}
        onPostClick={() => setIsModalOpen(true)}
        themeColorClass="bg-[var(--vacancy-primary)] hover:brightness-110"
      />

      {loading ? (
        <ListingGrid loading skeletonCount={6}>{null}</ListingGrid>
      ) : listings.length === 0 ? (
        <EmptyState
          title="No vacancies found"
          description="No vacant beds match your search. Try adjusting city or filters."
          onClearFilters={() => setSearch(DEFAULT_SEARCH)}
          colorClass="text-[var(--vacancy-primary)]"
        />
      ) : (
        <>
          <ListingGrid>
            {paginated.map((item) => (
              <ListingCard key={item.id} type="Vacancy" data={item} />
            ))}
          </ListingGrid>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            activeColorClass="bg-[var(--vacancy-primary)] text-white"
          />
        </>
      )}

      <CreateListing
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadListings}
        module="vacancy"
      />
    </div>
  );
}
