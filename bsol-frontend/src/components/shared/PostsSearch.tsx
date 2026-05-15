"use client";

import BaseSearch, { SearchState } from "@/components/shared/BaseSearch";

interface PostsSearchProps {
  onSearch: (state: SearchState) => void;
  currentSearch: SearchState;
}

export default function PostsSearch({ onSearch, currentSearch }: PostsSearchProps) {
  return (
    <BaseSearch
      onSearch={onSearch}
      currentSearch={currentSearch}
      filterOptions={[]}
      categoryColor="bg-orange-500"
      categoryLight="bg-orange-50"
      categoryText="text-orange-600"
      categoryLabel="All Posts"
      showAvailableFor={false}
    />
  );
}
