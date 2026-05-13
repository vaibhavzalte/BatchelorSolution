"use client";

import {
  House, CookingPot, Utensils, MapPin, Phone, Wifi, Car, Wind,
  UtensilsCrossed, Bath, Star, CheckCircle, Users, IndianRupee,
  MessageCircle, ExternalLink, ShieldCheck, Heart, User
} from "lucide-react";
import { Room, Mess, FoodStall, RoomVacancy, ListingType } from "@/lib/api";
import Link from "next/link";

type AnyListing = Room | Mess | FoodStall | RoomVacancy;

interface ListingCardProps {
  type: ListingType;
  data: AnyListing;
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${color}`}>
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
      <div className="relative h-52 bg-gray-100 flex gap-0.5 overflow-hidden">
        {displayImages.length > 0 ? (
          displayImages.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:8080${img}`}
              alt={`Image`}
              className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-700 group-hover:scale-110`}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Users className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 left-4 flex gap-2">
          <Badge label="Urgent Vacancy" color="bg-emerald-500/90 text-white border border-emerald-400/30" />
        </div>

        <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 hover:text-white transition-all duration-300 pointer-events-auto z-20">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        {/* ── Title & Highlights ── */}
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
            <ShieldCheck className="w-4 h-4 fill-emerald-50" />
            <span className="text-[10px] font-black uppercase tracking-widest">Verified Listing</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
            {vacancy.description || "Premium Room Vacancy"}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100/50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {vacancy.availableBeds} Seats Available
            </div>
            {vacancy.preferredTenant && (
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                • {vacancy.preferredTenant} Only
              </div>
            )}
          </div>
        </div>

        {/* ── Vertical Facilities List ── */}
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            Key Features
          </h4>
          <div className="flex flex-col gap-2.5">
            {hasAmenity("WiFi") && (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl text-[11px] font-bold border border-indigo-100 shadow-sm w-full">
                <Wifi className="w-3.5 h-3.5" /> WiFi
              </div>
            )}
            {hasAmenity("AC") && (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-rose-50 text-rose-700 rounded-xl text-[11px] font-bold border border-rose-100 shadow-sm w-full">
                <Wind className="w-3.5 h-3.5" /> AC
              </div>
            )}
            {vacancy.attachedBathroom && (
              <div className="flex items-center gap-3 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-[11px] font-bold border border-emerald-100 shadow-sm w-full">
                <Bath className="w-3.5 h-3.5" /> Bath
              </div>
            )}
          </div>
        </div>

        {/* ── One-Liner Rent ── */}
        <div className="px-5 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-200/50 text-white relative overflow-hidden group/rent">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Starting</span>
            </div>
            <p className="text-xl font-black">
              ₹{vacancy.rent?.toLocaleString() || 0}
              <span className="text-[10px] font-bold opacity-70 ml-1 uppercase">/ Mo</span>
            </p>
          </div>
        </div>

        {/* ── Contact Section ── */}
        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner Contact</p>
              <p className="text-sm font-black text-gray-900">{vacancy.ownerContact}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pointer-events-auto relative z-20">
            <a
              href={`tel:${vacancy.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${vacancy.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-emerald-200"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
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
    { key: "wifi", Icon: Wifi, label: "WiFi", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { key: "parking", Icon: Car, label: "Parking", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { key: "ac", Icon: Wind, label: "AC", color: "bg-rose-50 text-rose-600 border-rose-100" },
    { key: "foodIncluded", Icon: UtensilsCrossed, label: "Food", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { key: "attachedBathroom", Icon: Bath, label: "Bath", color: "bg-sky-50 text-sky-600 border-sky-100" },
  ] as const;

  const images = room.images || [];
  const displayImages = images.slice(0, 2);

  return (
    <>
      {/* ── Image Header ── */}
      <div className="relative h-56 bg-gray-400 flex gap-0.5 rounded-2xl overflow-hidden">
        {displayImages.length > 0 ? (
          displayImages.map((img, i) => (
            <img
              key={i}
              src={`http://localhost:8080${img}`}
              alt={`Image ${i + 1}`}
              className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-1000 group-hover:scale-110`}
            />
          ))
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <House className="w-14 h-14 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}
      </div>

      <div className="p-6 flex border-1 border-gray-200 rounded-3xl flex-col gap-6 mt-5 flex-1">
        {/* ── Title & Configuration ── */}
        <div>
          <h3 className="font-black text-indigo-600 text-xl leading-tight group-hover:text-gray-900 transition-colors ">
            {room.title}
          </h3>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-xs font-black text-gray-500">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <House className="w-4 h-4 text-indigo-500" />
              </div>
              {room.roomType || "1 BHK"}
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-gray-500">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              For {room.availableFor || "Any"}
            </div>
          </div>
        </div>

        {/* ── Vertical Amenities List ── */}
        <div>
          <h4 className="text-sm font-black text-yellow-500 tracking-widest mb-4 flex items-center gap-2">
            Facilities
          </h4>
          <div className="flex flex-col gap-2.5">
            {amenicons.map(({ key, Icon, label, color }) =>
              room[key as keyof Room] ? (
                <div 
                  key={key} 
                  className={`flex items-center gap-3 px-4 py-2.5 ${color} rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-white shadow-sm w-full`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ) : null
            )}
            {/* Custom Amenities */}
            {room.amenities && room.amenities.slice(0, 3).map((am, i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-white shadow-sm w-full"
              >
                <CheckCircle className="w-4 h-4 text-indigo-400" />
                {am}
              </div>
            ))}
          </div>
        </div>

        {/* ── One-Liner Rent ── */}
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl shadow-indigo-200/50 text-white relative overflow-hidden group/rent">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl transition-transform duration-700 group-hover/rent:scale-150" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Rent</span>
            </div>
            <p className="text-xl font-black tracking-tight">
              ₹{room.rent?.toLocaleString() || 0}
              <span className="text-[10px] font-black opacity-70 ml-1 uppercase tracking-widest">/ Mo</span>
            </p>
          </div>
        </div>

        {/* ── Location Section ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" /> Neighborhood
            </h4>
            {room.location && room.location.startsWith("http") && (
              <a
                href={room.location}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest pointer-events-auto relative z-20"
                onClick={(e) => e.stopPropagation()}
              >
                Maps <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
          <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
            {[room.address, room.area, room.city].filter(Boolean).join(", ")}
          </p>
        </div>

        {/* ── Contact Section ── */}
        <div className="pt-6 border-t border-gray-100 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <User className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 tracking-widest">Contact</p>
              <p className="text-base font-black text-gray-900">{room.ownerContact}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pointer-events-auto relative z-20">
            <a
              href={`tel:${room.ownerContact}`}
              className="flex items-center justify-center gap-2 py-4 border-2 border-gray-900 text-gray-900 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-gray-900 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href={`https://wa.me/${room.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 border-2 border-emerald-500 text-emerald-500 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-emerald-900 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-emerald-200"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Mess Card ──────────────────────────────────────────────────────────────

function MessCard({ mess }: { mess: Mess }) {
  const foodColors: Record<string, string> = {
    VEG: "bg-green-500/90 text-white",
    "NON-VEG": "bg-rose-500/90 text-white",
    BOTH: "bg-amber-500/90 text-white",
  };

  const imageUrl = mess.images && mess.images.length > 0
    ? `http://localhost:8080${mess.images[0]}`
    : null;

  return (
    <>
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={mess.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <CookingPot className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 left-4">
          {mess.foodType && <Badge label={mess.foodType} color={`${foodColors[mess.foodType] || "bg-gray-100 text-gray-600"} border border-white/20`} />}
        </div>

        <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-all duration-300 pointer-events-auto z-20">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        <div>
          <div className="flex items-center gap-2 text-amber-600 mb-1.5">
            <Star className="w-4 h-4 fill-amber-50" />
            <span className="text-[10px] font-black uppercase tracking-widest">Popular Mess</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-amber-600 transition-colors line-clamp-1">
            {mess.title}
          </h3>
          <div className="flex flex-col gap-2.5 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-amber-700 bg-amber-50 rounded-lg border border-amber-100 w-full shadow-sm">
              <Utensils className="w-3.5 h-3.5" /> {mess.mealType || "All Meals"}
            </div>
            {mess.homeDelivery && (
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-black text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 w-full shadow-sm uppercase tracking-widest">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Delivery Available
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Location
          </h4>
          <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-1">
            {[mess.area, mess.city].filter(Boolean).join(", ")}
          </p>
        </div>

        {/* ── One-Liner Pricing ── */}
        <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-200/50 text-white relative overflow-hidden group/rent">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Monthly</span>
            </div>
            <p className="text-xl font-black">
              ₹{mess.monthlyFee?.toLocaleString() || 0}
              <span className="text-[10px] font-bold opacity-70 ml-1 uppercase">/ Mo</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Owner</p>
              <p className="text-sm font-black text-gray-900">{mess.ownerContact}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pointer-events-auto relative z-20">
            <a
              href={`tel:${mess.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${mess.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Food Stall Card ─────────────────────────────────────────────────────────

function FoodStallCard({ stall }: { stall: FoodStall }) {
  const imageUrl = (stall as any).images && (stall as any).images.length > 0
    ? `http://localhost:8080${(stall as any).images[0]}`
    : null;

  return (
    <>
      <div className="relative h-52 bg-gray-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={stall.stallName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
            <Utensils className="w-12 h-12 opacity-20" />
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-4 left-4">
          <Badge label={stall.foodType || "Food Stall"} color="bg-pink-500 text-white border border-white/20" />
        </div>

        <button className="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-rose-500 transition-all duration-300 pointer-events-auto z-20">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        <div>
          <div className="flex items-center gap-2 text-pink-600 mb-1.5">
            <Star className="w-4 h-4 fill-pink-50" />
            <span className="text-[10px] font-black uppercase tracking-widest">{stall.rating || "New"} Rated</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight group-hover:text-pink-600 transition-colors line-clamp-1">
            {stall.stallName}
          </h3>
          <div className="mt-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 text-pink-700 text-[11px] font-black rounded-lg border border-pink-100 uppercase tracking-widest shadow-sm w-full">
              <Star className="w-3.5 h-3.5 text-pink-500" /> Local Choice
            </div>
            {stall.isOpen && (
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-black text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 uppercase tracking-widest shadow-sm w-full">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Open Now
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Address
          </h4>
          <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
            {stall.location || "Location not available"}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Person</p>
              <p className="text-sm font-black text-gray-900">{stall.contactNumber || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pointer-events-auto relative z-20">
            <a
              href={`tel:${stall.contactNumber}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${stall.contactNumber?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

const PATH_MAPPING: Record<ListingType, string> = {
  "Room": "rooms",
  "RoomVacancy": "vacancies",
  "Mess": "mess",
  "FoodStall": "food"
};

export default function ListingCard({ type, data }: ListingCardProps) {
  const path = PATH_MAPPING[type] || "listings";
  const id = data.id;

  return (
    <div className="group relative bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full">
      {/* Primary Link Overlay (Z-index 0) */}
      <Link href={`/${path}/${id}`} className="absolute inset-0 z-0" aria-label={`View ${type} details`} />

      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        <div className="flex-1 flex flex-col">
          {type === "Room" && <RoomCard room={data as Room} />}
          {type === "RoomVacancy" && <RoomVacancyCard vacancy={data as RoomVacancy} />}
          {type === "Mess" && <MessCard mess={data as Mess} />}
          {type === "FoodStall" && <FoodStallCard stall={data as FoodStall} />}
        </div>
      </div>
    </div>
  );
}
