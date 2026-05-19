import { Listing } from "./Listing";

export interface Food extends Listing {
  stallName: string;
  contactNumber?: string;
  location?: string;
  foodType?: string;       // Veg / Non-Veg / Both
  rating?: number;
  isOpen?: boolean;
}
