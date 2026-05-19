import { Listing } from "./Listing";

export interface Vacancy extends Listing {
  roomType?: string;        // Single / Double / Triple
  totalBeds: number;
  availableBeds: number;
  rent: number;
  deposit?: number;
  brokerage?: number;
  attachedBathroom?: boolean;
  furnished?: boolean;
  amenities?: string[];     // WiFi, AC, Washing Machine
  availableFrom?: string;   // ISO date string
  preferredTenant?: string; // Male / Female / Any
  foodIncluded?: string;    // Yes / No / Optional
  location?: string;        // Address/Location name
}
