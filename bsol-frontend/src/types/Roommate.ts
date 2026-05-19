import { Listing } from "./Listing";

export interface Roommate extends Listing {
  gender?: string;         // MALE | FEMALE | ANY
  occupation?: string;     // STUDENT | PROFESSIONAL | ANY
  rent?: number;
  deposit?: number;
  lookingFor?: string;
  roomType?: string;       // Single / Shared
  amenities?: string[];
  area?: string;
  address?: string;
}
