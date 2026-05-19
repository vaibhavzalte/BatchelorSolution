import { Listing } from "./Listing";

export interface StudyRoom extends Listing {
  seatType?: string;       // AC | NON-AC | CABIN | DESK
  timing?: string;         // 24x7 | DAY | NIGHT
  monthlyFee?: number;
  amenities?: string[];
  address?: string;
  area?: string;
  wifi?: boolean;
}
