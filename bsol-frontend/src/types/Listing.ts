export interface Listing {
  id?: number;
  type: string;
  subType?: string;
  city: string;
  title: string;
  description: string;
  images: string[];
  videos?: string[];
  latitude?: number;
  longitude?: number;
  status: string;
  ownerName?: string;
  ownerContact?: string;
  ownerEmail?: string;
  createdBy?: string;
}
