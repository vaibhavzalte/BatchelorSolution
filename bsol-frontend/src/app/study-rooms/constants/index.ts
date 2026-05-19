import { STUDY_ROOM_FILTERS } from "@/components/common/ListingFilters";

export const FILTERS = STUDY_ROOM_FILTERS;

export const MODULE_TITLE = "Study Rooms";
export const MODULE_SUBTITLE = "Find quiet libraries and co-working spaces near your university";

export const MOCK_STUDY_ROOMS = [
  {
    id: 9801,
    roomName: "Apex Reading Hall & Study Space",
    location: "Kothrud, Near MIT College Campus",
    capacity: 60,
    availableSeats: 12,
    isAvailable: true,
    hasWifi: true,
    hasChargingPoints: true,
    hasAC: true,
    monthlyFee: 1200,
    timing: "24x7",
    rating: 4.8,
    description: "Centrally located library with individual cabins, power backups, and quiet reading zones.",
    images: [],
    status: "active"
  },
  {
    id: 9802,
    roomName: "Zenith Reading Room",
    location: "Dnyaneshwar Paduka Chowk, FC Road",
    capacity: 45,
    availableSeats: 8,
    isAvailable: true,
    hasWifi: true,
    hasChargingPoints: true,
    hasAC: true,
    monthlyFee: 1500,
    timing: "DAY",
    rating: 4.6,
    description: "Quiet library perfect for competitive exam prep. Drinking water, AC, and high-speed fiber internet.",
    images: [],
    status: "active"
  }
];
