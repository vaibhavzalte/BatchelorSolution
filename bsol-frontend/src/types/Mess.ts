import { Listing } from "./Listing";

export interface Mess extends Listing {
  foodType?: string;       // VEG | NON-VEG | BOTH
  mealType?: string;       // BREAKFAST | LUNCH | DINNER | ALL
  monthlyFee?: number;
  perMealFee?: number;
  homeDelivery?: boolean;
  diningArea?: boolean;
  address?: string;
  area?: string;
}
