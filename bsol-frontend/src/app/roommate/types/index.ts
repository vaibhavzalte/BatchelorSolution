export interface Roommate {
  id: number;
  title: string;
  gender: "Boys" | "Girls" | "Any";
  occupation: "Student" | "Professional" | "Any";
  roomType: "Single" | "Shared";
  rent: number;
  rentShare?: number;
  deposit?: number;
  address?: string;
  area?: string;
  city: string;
  ownerName: string;
  ownerContact: string;
  images?: string[];
  status?: string;
}
