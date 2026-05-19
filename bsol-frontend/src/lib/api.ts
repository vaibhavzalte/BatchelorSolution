export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/uv-api/v1";
const MGMT_NAME = "listingManagment";
const ROOM_MGMT_NAME = "roomManagment";

function getMgmtName(type: ListingType): string {
  if (type === "Room" || type === "RoomVacancy") return ROOM_MGMT_NAME;
  return MGMT_NAME;
}

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

// ─── Types ────────────────────────────────────────────────────────────────────

export type ListingType = "Room" | "Mess" | "FoodStall" | "RoomVacancy" | "StudyRoom";

export interface RoomVacancy {
  id?: number;
  type?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status?: string;
  roomType?: string;        // Single / Double / Triple
  totalBeds: number;
  availableBeds: number;
  rent: number;
  deposit?: number;
  brokerage?: number;
  description?: string;
  attachedBathroom?: boolean;
  furnished?: boolean;
  amenities?: string[];     // WiFi, AC, Washing Machine
  availableFrom?: string;   // ISO date string
  preferredTenant?: string; // Male / Female / Any
  foodIncluded?: string;    // Yes / No / Optional
  updatedBy?: string;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  images?: string[];
  videos?: string[];
}

export interface Room {
  id?: number;
  title: string;
  description?: string;
  roomType: string;        // 1RK | 1BHK | 2BHK
  availableFor: string;    // BOYS | GIRLS | FAMILY
  furnished?: boolean;
  totalRooms?: number;
  availableRooms?: number;
  rent?: number;
  deposit?: number;
  maintenance?: number;
  brokerage?: number;
  wifi?: boolean;
  parking?: boolean;
  ac?: boolean;
  foodIncluded?: boolean;
  attachedBathroom?: boolean;
  address?: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  status?: string;
  createdBy?: string;
  images?: string[];
  videos?: string[];
  amenities?: string[];
  location?: string;
  googleMap?: string;
}


export interface Mess {
  id?: number;
  title: string;
  description?: string;
  foodType?: string;       // VEG | NON-VEG | BOTH
  mealType?: string;       // BREAKFAST | LUNCH | DINNER | ALL
  monthlyFee?: number;
  perMealFee?: number;
  homeDelivery?: boolean;
  diningArea?: boolean;
  address?: string;
  city?: string;
  area?: string;
  latitude?: number;
  longitude?: number;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  status?: string;
  createdBy?: string;
  images?: string[];
  videos?: string[];
}

export interface FoodStall {
  id?: number;
  stallName: string;
  ownerName?: string;
  contactNumber?: string;
  location?: string;
  foodType?: string;       // Veg | Non-Veg | Both
  rating?: number;
  isOpen?: boolean;
  description?: string;
  createdBy?: string;
  images?: string[];
  videos?: string[];
}

export type AnyListing = Room | Mess | FoodStall | RoomVacancy;

// ─── API calls ────────────────────────────────────────────────────────────────

export async function getListings(
  type: ListingType,
  params?: Record<string, string | number | boolean>
): Promise<AnyListing[]> {
  const url = new URL(`${BASE_URL}/${getMgmtName(type)}/${type}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  console.log(`[getListings] Calling API: ${url.toString()}`);

  const res = await fetch(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  
  console.log(`[getListings] Response Status: ${res.status} ${res.statusText}`);

  if (!res.ok) throw new Error(`Failed to fetch listings: ${res.statusText}`);
  const data = await res.json();
  console.log(`[getListings] Received ${data.length} items`);
  return data;
}

export async function createListing(
  type: ListingType,
  payload: AnyListing
): Promise<AnyListing> {
  // Payload cleanup and normalization for specific types
  const finalPayload = { ...payload };

  const res = await fetch(`${BASE_URL}/${getMgmtName(type)}/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(finalPayload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to create listing: ${errText}`);
  }
  return res.json();
}

// ─── Room listing with multipart/form-data ────────────────────────────────────

export interface RoomPayload {
  title: string;
  description: string;
  roomType: string;
  availableFor: string;
  totalRooms: number;
  availableRooms: number;
  rent: number;
  deposit: number;
  maintenance: number;
  brokerage: number;
  amenities: string[];
  address: string;
  area: string;
  city: string;
  location: string;
  googleMap: string;
  latitude: number | null;
  longitude: number | null;
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
}

export async function createRoomListing(
  type: string,
  payload: RoomPayload,
  imageFiles: File[]
): Promise<Room> {
  // Client-side image size guard (belt-and-suspenders after in-component check)
  const oversized = imageFiles.filter((f) => f.size > MAX_IMAGE_SIZE_BYTES);
  if (oversized.length > 0) {
    throw new Error(
      `These images exceed the 5 MB limit: ${oversized.map((f) => f.name).join(", ")}`
    );
  }

  const formData = new FormData();

  // Backend expects the JSON body as a part named "listing"
  formData.append(
    "listing",
    new Blob([JSON.stringify(payload)], { type: "application/json" })
  );

  // Attach image files under the "images" key
  imageFiles.forEach((file) => {
    formData.append("images", file);
  });

  const res = await fetch(`${BASE_URL}/${getMgmtName(type as ListingType)}/${type}`, {
    method: "POST",
    // Do NOT set Content-Type manually — browser sets it with the correct boundary
    body: formData,
  });

  if (!res.ok) {
    const errText = await res.text();
    // Log full server error to console; caller shows only a clean toast
    console.error("[createRoomListing] Server error:", errText);
    throw new Error("Could not publish the room listing. Please try again.");
  }

  return res.json();
}
