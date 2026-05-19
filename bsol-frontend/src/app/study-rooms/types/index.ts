export interface StudyRoom {
  id?: number;
  roomName: string;
  location?: string;
  capacity?: number;
  availableSeats?: number;
  isAvailable?: boolean;
  hasWifi?: boolean;
  hasChargingPoints?: boolean;
  hasAC?: boolean;
  rules?: string;
  monthlyFee?: number;
  timing?: string;
  rating?: number;
  description?: string;
  images?: string[];
  videos?: string[];
}
