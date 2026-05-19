import { AnyListing } from "@/lib/api";

export type Post = AnyListing & {
  listingTypeLabel: string;
};
