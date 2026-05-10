"use client";

import { House, CookingPot, Utensils, MapPin, Phone, Wifi, Car, Wind, UtensilsCrossed, Bath, Star, CheckCircle, Users, IndianRupee } from "lucide-react";
import { Room, Mess, FoodStall, RoomVacancy, ListingType } from "@/lib/api";
import Link from "next/link";

type AnyListing = Room | Mess | FoodStall | RoomVacancy;

interface ListingCardProps {
  type: ListingType;
  data: AnyListing;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

// ─── Room Vacancy Card ────────────────────────────────────────────────────────

function RoomVacancyCard({ vacancy }: { vacancy: RoomVacancy }) {
  const primaryColor = "bg-emerald-500";
  const bgColor = "bg-emerald-50";

  const hasAmenity = (name: string) => vacancy.amenities?.includes(name);

  const images = vacancy.images || [];
  const displayImages = images.slice(0, 2);

  return (
    <>
      {/* ── Image Header (Grid) ── */}
      <div className="relative h-48 bg-gray-100 flex gap-0.5 overflow-hidden">
        {displayImages.length > 0 ? (
          displayImages.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:8080${img}`}
              alt={`Image`}
              className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-500 group-hover:scale-110`}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Users className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge label="Urgent Vacancy" color="bg-emerald-600 text-white shadow-lg" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        {/* ── Title & Highlights ── */}
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Star className="w-4 h-4 fill-current animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest">Limited Seats Left</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors">
            {vacancy.description || "Room Vacancy Available"}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
              {vacancy.availableBeds} Seats Available
            </div>
            {vacancy.preferredTenant && (
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                For {vacancy.preferredTenant}
              </div>
            )}
          </div>
        </div>

        {/* ── Facilities ── */}
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Facilities provided:
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {hasAmenity("WiFi") && (
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Wifi className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                High-speed WiFi
              </div>
            )}
            {hasAmenity("AC") && (
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Wind className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                AC / Ventilation
              </div>
            )}
            {vacancy.attachedBathroom && (
              <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Bath className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                Attached Bathroom
              </div>
            )}
          </div>
        </div>

        {/* ── Pricing ── */}
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <IndianRupee className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Price per head</span>
          </div>
          <p className="text-2xl font-black text-emerald-700">
            ₹{vacancy.rent?.toLocaleString() || 0}
            <span className="text-sm font-bold opacity-60 ml-1">per bed</span>
          </p>
        </div>

        {/* ── Location & Contact ── */}
        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Address:
            </h4>
            <p className="text-xs font-bold text-gray-600">
              {vacancy.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pointer-events-auto relative z-20">
            <a
              href={`tel:${vacancy.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${vacancy.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Room Card (Full) ─────────────────────────────────────────────────────────

function RoomCard({ room }: { room: Room }) {
  const amenicons = [
    { key: "wifi", Icon: Wifi, label: "Superfast WiFi" },
    { key: "parking", Icon: Car, label: "Parking Available" },
    { key: "ac", Icon: Wind, label: "Air Conditioned" },
    { key: "foodIncluded", Icon: UtensilsCrossed, label: "Food/Mess Included" },
    { key: "attachedBathroom", Icon: Bath, label: "Attached Bathroom" },
  ] as const;

  const images = room.images || [];
  const displayImages = images.slice(0, 2);

  return (
    <>
      {/* ── Image Header (Grid) ── */}
      <div className="relative h-48 bg-gray-100 flex gap-0.5 overflow-hidden">
        {displayImages.length > 0 ? (
          displayImages.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:8080${img}`}
              alt={`${room.title} ${i}`}
              className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-500 group-hover:scale-110`}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <House className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge label="Room / Flat" color="bg-indigo-600 text-white shadow-lg" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        {/* ── Title & Status ── */}
        <div>
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-widest">Available Now</span>
          </div>
          <h3 className="font-black text-gray-900 text-xl leading-tight group-hover:text-indigo-600 transition-colors">
            {room.title}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <House className="w-3.5 h-3.5 text-indigo-400" />
              {room.roomType || "1 BHK"}
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              For {room.availableFor || "Any"}
            </div>
          </div>
        </div>

        {/* ── Facilities List ── */}
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Facilities you get:
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {amenicons.map(({ key, Icon, label }) =>
              room[key as keyof Room] ? (
                <div key={key} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  {label}
                </div>
              ) : null
            )}
            {/* Show up to 2 custom amenities if they exist */}
            {room.amenities && room.amenities.slice(0, 3).map((am, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <span className="capitalize">{am}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rent & Location ── */}
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <IndianRupee className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Monthly Rent</span>
            </div>
            <p className="text-2xl font-black text-indigo-700">
              ₹{room.rent?.toLocaleString() || 0}
              <span className="text-sm font-bold opacity-60 ml-1">per month</span>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Location:
            </h4>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              {[room.address, room.area, room.city].filter(Boolean).join(", ")}
            </p>
            {room.location && room.location.startsWith("http") && (
              <a
                href={room.location}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-[11px] font-black text-indigo-600 hover:underline mt-1 pointer-events-auto relative z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <MapPin className="w-3 h-3" /> View on Google Maps
              </a>
            )}
          </div>
        </div>

        {/* ── Contact Actions ── */}
        <div className="grid grid-cols-2 gap-3 mt-auto pt-6 border-t border-gray-100 pointer-events-auto relative z-20">
          <a
            href={`tel:${room.ownerContact}`}
            className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
          <a
            href={`https://wa.me/${room.ownerContact?.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95"
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-3.5 h-3.5" /> WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

// ─── Mess Card ──────────────────────────────────────────────────────────────

function MessCard({ mess }: { mess: Mess }) {
  const foodColors: Record<string, string> = {
    VEG: "bg-green-100 text-green-700",
    "NON-VEG": "bg-red-100 text-red-700",
    BOTH: "bg-amber-100 text-amber-700",
  };

  const imageUrl = mess.images && mess.images.length > 0
    ? `http://localhost:8080${mess.images[0]}`
    : null;

  return (
    <>
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={mess.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <CookingPot className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          {mess.foodType && <Badge label={mess.foodType} color={`${foodColors[mess.foodType] || "bg-gray-100 text-gray-600"} backdrop-blur shadow-sm`} />}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-amber-600 transition-colors">
          {mess.title}
        </h3>

        {(mess.area || mess.city) && (
          <div className="flex items-center gap-1 text-gray-400 text-xs font-bold mt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {[mess.area, mess.city].filter(Boolean).join(", ")}
          </div>
        )}

        <div className="flex gap-4 mt-auto pt-4 border-t border-gray-50">
          {mess.monthlyFee && (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly</p>
              <p className="text-xl font-black text-amber-600">₹{mess.monthlyFee.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Food Stall Card ─────────────────────────────────────────────────────────

function FoodStallCard({ stall }: { stall: FoodStall }) {
  // FoodStall model might need an images field update too if it has images
  // For now we use a placeholder or check if it exists
  const data = stall as any;
  const imageUrl = data.images && data.images.length > 0
    ? `http://localhost:8080${data.images[0]}`
    : null;

  return (
    <>
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={stall.stallName}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Utensils className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <h3 className="font-black text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-pink-600 transition-colors">
          {stall.stallName}
        </h3>

        {stall.location && (
          <div className="flex items-center gap-1 text-gray-400 text-xs font-bold mt-1">
            <MapPin className="w-3.5 h-3.5 text-pink-400" />
            {stall.location}
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

const PATH_MAPPING: Record<ListingType, string> = {
  "Room": "rooms",
  "room-vacancy": "vacancies",
  "Mess": "mess",
  "food-stall": "food"
};

export default function ListingCard({ type, data }: ListingCardProps) {
  const path = PATH_MAPPING[type] || "listings";
  const id = data.id;

  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full">
      {/* Primary Link Overlay (Z-index 0) */}
      <Link href={`/${path}/${id}`} className="absolute inset-0 z-0" aria-label={`View ${type} details`} />

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex-1 flex flex-col">
          {type === "Room" && <RoomCard room={data as Room} />}
          {type === "room-vacancy" && <RoomVacancyCard vacancy={data as RoomVacancy} />}
          {type === "Mess" && <MessCard mess={data as Mess} />}
          {type === "food-stall" && <FoodStallCard stall={data as FoodStall} />}
        </div>
      </div>
    </div>
  );
}
