"use client";

import React, { useState } from "react";
import {
  House, CookingPot, Utensils, MapPin, Phone, Wifi, Car, Wind,
  UtensilsCrossed, Bath, Star, CheckCircle, Users, IndianRupee,
  MessageCircle, ExternalLink, ShieldCheck, Heart, User, Play,
  Briefcase, Mail, BookOpen, Clock, Calendar, Check, Copy, Wallet, Receipt
} from "lucide-react";
import MediaGallery from "@/components/shared/MediaGallery";
import ImageCarousel from "@/components/common/ImageCarousel";

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${color}`}>
      {label}
    </span>
  );
}

// ─── Room Vacancy Card ────────────────────────────────────────────────────────
function RoomVacancyCard({ vacancy, onMediaClick }: { vacancy: any; onMediaClick: (index: number) => void }) {
  const [copiedContact, setCopiedContact] = useState(false);

  const hasAmenity = (name: string) => vacancy.amenities?.includes(name);
  const images = vacancy.images || [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-52 overflow-hidden rounded-2xl">
        <ImageCarousel 
          images={images} 
          fallbackIcon={<Users className="w-12 h-12 opacity-20" />} 
          onImageClick={onMediaClick} 
        />
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge label="Urgent Vacancy" color="bg-[var(--vacancy-primary)]/90 text-white border border-[var(--vacancy-primary)]/30" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        <div>
          <div className="flex items-center gap-2 text-[var(--vacancy-primary)] mb-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 fill-[var(--vacancy-primary-light)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Verified Vacancy</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
            {vacancy.description || "Premium Room Vacancy"}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--vacancy-primary)] bg-[var(--vacancy-primary-light)] px-3 py-1.5 rounded-xl border border-[var(--vacancy-primary)]/20">
              {vacancy.availableBeds} Seats Available
            </div>
            {vacancy.preferredTenant && (
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                • {vacancy.preferredTenant} Only
              </div>
            )}
          </div>
        </div>

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

        <div className="px-5 py-4 bg-gradient-to-r from-[var(--vacancy-primary)] to-[var(--vacancy-primary-hover)] rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Rent</span>
            </div>
            <p className="text-xl font-black">
              ₹{vacancy.rent?.toLocaleString() || 0}
              <span className="text-[10px] font-bold opacity-70 ml-1 uppercase">/ Mo</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-white shadow-sm">
                <User className="w-5 h-5 text-[var(--vacancy-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact</p>
                <p className="text-sm font-black text-gray-900">{vacancy.ownerContact || "N/A"}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(vacancy.ownerContact || "")}
              className="p-2.5 bg-gray-50 hover:bg-white rounded-xl transition-all border border-gray-100 shadow-sm"
            >
              {copiedContact ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-[var(--vacancy-primary)]" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${vacancy.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3.5 bg-gray-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${vacancy.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:-translate-y-0.5 transition-all active:scale-95 shadow-lg shadow-emerald-200"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Roommate Card ────────────────────────────────────────────────────────────
function RoommateCard({ roommate, onMediaClick }: { roommate: any; onMediaClick: (index: number) => void }) {
  const [copiedContact, setCopiedContact] = useState(false);
  const images = roommate.images || [];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-52 overflow-hidden rounded-2xl">
        <ImageCarousel 
          images={images} 
          fallbackIcon={<Users className="w-12 h-12 opacity-20" />} 
          onImageClick={onMediaClick} 
        />
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <Badge label={`Preferred: ${roommate.gender || "Any"}`} color="bg-[var(--roommate-primary)] text-white border border-white/20" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1">
        <div>
          <div className="flex items-center gap-2 text-[var(--roommate-primary)] mb-1.5 font-bold">
            <User className="w-4 h-4 fill-[var(--roommate-primary-light)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Looking for Roommate</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
            {roommate.title || "Roommate Needed"}
          </h3>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--roommate-primary)] bg-[var(--roommate-primary-light)] px-3 py-1.5 rounded-xl border border-[var(--roommate-primary)]/20">
              {roommate.occupation || "Student / Professional"}
            </div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              • {roommate.roomType || "Shared"} Room
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Neighborhood
          </h4>
          <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
            {[roommate.address, roommate.area, roommate.city].filter(Boolean).join(", ") || "Pune"}
          </p>
        </div>

        <div className="px-5 py-4 bg-gradient-to-r from-[var(--roommate-primary)] to-[var(--roommate-primary-hover)] rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Rent Share</span>
            </div>
            <p className="text-xl font-black">
              ₹{(roommate.rent || roommate.rentShare || 0).toLocaleString()}
              <span className="text-[10px] font-bold opacity-70 ml-1 uppercase">/ Mo</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-100">
                <User className="w-5 h-5 text-[var(--roommate-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Posted By</p>
                <p className="text-sm font-black text-gray-900">{roommate.ownerName || "Roommate Search"}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(roommate.ownerContact || "")}
              className="p-2.5 bg-gray-50 hover:bg-white rounded-xl transition-all border border-gray-100 shadow-sm"
            >
              {copiedContact ? (
                <Check className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-gray-400 hover:text-[var(--roommate-primary)]" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${roommate.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${roommate.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Food Stall Card ─────────────────────────────────────────────────────────
function FoodStallCard({ stall, onMediaClick }: { stall: any; onMediaClick: (index: number) => void }) {
  const images = stall.images || [];

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-52 overflow-hidden rounded-2xl">
        <ImageCarousel 
          images={images} 
          fallbackIcon={<Utensils className="w-12 h-12 opacity-20" />} 
          onImageClick={onMediaClick} 
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge label={stall.foodType || "Food Stall"} color="bg-[var(--food-primary)] text-white border border-white/20" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[var(--food-primary)] mb-1.5 font-bold">
            <Star className="w-4 h-4 fill-[var(--food-primary-light)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">{stall.rating || "New"} Rated</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
            {stall.stallName || stall.title}
          </h3>
          <div className="mt-4 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 px-3 py-2 bg-[var(--food-primary-light)] text-[var(--food-primary)] text-[11px] font-black rounded-lg border border-[var(--food-primary)]/20 uppercase tracking-widest shadow-sm w-full">
              <Star className="w-3.5 h-3.5 fill-current" /> Local Choice
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
              <User className="w-5 h-5 text-[var(--food-primary)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Person</p>
              <p className="text-sm font-black text-gray-900">{stall.contactNumber || stall.ownerContact || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${stall.contactNumber || stall.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${(stall.contactNumber || stall.ownerContact)?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Mess Card ──────────────────────────────────────────────────────────────
function MessCard({ mess, onMediaClick }: { mess: any; onMediaClick: (index: number) => void }) {
  const foodColors: Record<string, string> = {
    VEG: "bg-green-500/90 text-white border-green-400/30",
    "NON-VEG": "bg-rose-500/90 text-white border-rose-400/30",
    BOTH: "bg-[var(--mess-primary)]/90 text-white border-[var(--mess-primary)]/30",
  };
  const images = mess.images || [];

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-52 overflow-hidden rounded-2xl">
        <ImageCarousel 
          images={images} 
          fallbackIcon={<CookingPot className="w-12 h-12 opacity-20" />} 
          onImageClick={onMediaClick} 
        />
        <div className="absolute top-4 left-4 z-10">
          {mess.foodType && <Badge label={mess.foodType} color={`${foodColors[mess.foodType.toUpperCase()] || "bg-gray-100 text-gray-600"} border`} />}
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[var(--mess-primary)] mb-1.5 font-bold">
            <Star className="w-4 h-4 fill-[var(--mess-primary-light)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Popular Mess</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
            {mess.title}
          </h3>
          <div className="flex flex-col gap-2.5 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[var(--mess-primary)] bg-[var(--mess-primary-light)] rounded-lg border border-[var(--mess-primary)]/20 w-full shadow-sm">
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
            {[mess.area, mess.city].filter(Boolean).join(", ") || "Pune"}
          </p>
        </div>

        <div className="px-5 py-4 bg-gradient-to-r from-[var(--mess-primary)] to-[var(--mess-primary-hover)] rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Monthly Fee</span>
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
              <User className="w-5 h-5 text-[var(--mess-primary)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Owner</p>
              <p className="text-sm font-black text-gray-900">{mess.ownerContact}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${mess.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${mess.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Study Room Card ─────────────────────────────────────────────────────────
function StudyRoomCard({ studyRoom, onMediaClick }: { studyRoom: any; onMediaClick: (index: number) => void }) {
  const images = studyRoom.images || [];

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-52 overflow-hidden rounded-2xl">
        <ImageCarousel 
          images={images} 
          fallbackIcon={<BookOpen className="w-12 h-12 opacity-20" />} 
          onImageClick={onMediaClick} 
        />
        <div className="absolute top-4 left-4 z-10">
          <Badge label={studyRoom.timing || "24x7 Hours"} color="bg-[var(--study-primary)] text-white border border-white/20" />
        </div>
      </div>

      <div className="p-6 flex flex-col gap-6 flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 text-[var(--study-primary)] mb-1.5 font-bold">
            <BookOpen className="w-4 h-4 fill-[var(--study-primary-light)]" />
            <span className="text-[10px] font-black uppercase tracking-widest">Premium Study space</span>
          </div>
          <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
            {studyRoom.roomName || studyRoom.title}
          </h3>
          <div className="flex flex-col gap-2.5 mt-3">
            <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-bold text-[var(--study-primary)] bg-[var(--study-primary-light)] rounded-lg border border-[var(--study-primary)]/20 w-full shadow-sm">
              <Users className="w-3.5 h-3.5" /> Capacity: {studyRoom.capacity || 50} Seats
            </div>
            {studyRoom.hasWifi && (
              <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-black text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-100 w-full shadow-sm uppercase tracking-widest">
                <Wifi className="w-3.5 h-3.5 text-emerald-500" /> Free High-Speed WiFi
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" /> Neighborhood
          </h4>
          <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-1">
            {studyRoom.location || [studyRoom.area, studyRoom.city].filter(Boolean).join(", ") || "Pune"}
          </p>
        </div>

        <div className="px-5 py-4 bg-gradient-to-r from-[var(--study-primary)] to-[var(--study-primary-hover)] rounded-2xl shadow-lg text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 opacity-80">
              <IndianRupee className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">Membership</span>
            </div>
            <p className="text-xl font-black">
              ₹{(studyRoom.monthlyFee || studyRoom.rent || 0).toLocaleString()}
              <span className="text-[10px] font-bold opacity-70 ml-1 uppercase">/ Mo</span>
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100">
              <User className="w-5 h-5 text-[var(--study-primary)]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact space</p>
              <p className="text-sm font-black text-gray-900">{studyRoom.ownerContact || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <a
              href={`tel:${studyRoom.ownerContact}`}
              className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
            >
              <Phone className="w-3.5 h-3.5" /> Call
            </a>
            <a
              href={`https://wa.me/${studyRoom.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Room Card ───────────────────────────────────────────────────────────────
function RoomCard({ room, onMediaClick }: { room: any; onMediaClick: (index: number) => void }) {
  const amenicons = [
    { key: "wifi", Icon: Wifi, label: "WiFi", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { key: "parking", Icon: Car, label: "Parking", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { key: "ac", Icon: Wind, label: "AC", color: "bg-rose-50 text-rose-600 border-rose-100" },
    { key: "foodIncluded", Icon: UtensilsCrossed, label: "Food", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { key: "attachedBathroom", Icon: Bath, label: "Bath", color: "bg-sky-50 text-sky-600 border-sky-100" },
  ] as const;

  const images = room.images || [];

  return (
    <div className="flex flex-col h-full">
      <div className="relative h-56 overflow-hidden rounded-2xl">
        <ImageCarousel 
          images={images} 
          fallbackIcon={<House className="w-14 h-14 opacity-20" />} 
          onImageClick={onMediaClick} 
        />
      </div>

      <div className="p-6 flex border-1 border-gray-200 rounded-3xl flex-col gap-6 mt-5 flex-1">
        <div>
          <h3 className="font-black text-[var(--room-primary)] text-xl leading-tight">
            {room.title}
          </h3>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2 text-xs font-black text-gray-500">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <House className="w-4 h-4 text-[var(--room-primary)]" />
              </div>
              {room.roomType || "1 BHK"}
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-gray-500">
              <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                <Users className="w-4 h-4 text-[var(--room-primary)]" />
              </div>
              For {room.availableFor || "Any"}
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-black text-yellow-500 tracking-widest mb-4 flex items-center gap-2">
            Facilities
          </h4>
          <div className="flex flex-col gap-2.5">
            {amenicons.map(({ key, Icon, label, color }) =>
              room[key] ? (
                <div 
                  key={key} 
                  className={`flex items-center gap-3 px-4 py-2.5 ${color} rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-white shadow-sm w-full`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
              ) : null
            )}
            {room.amenities && room.amenities.slice(0, 3).map((am: string, i: number) => (
              <div 
                key={i} 
                className="flex items-center gap-3 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 border-white shadow-sm w-full"
              >
                <CheckCircle className="w-4 h-4 text-[var(--room-primary)] opacity-70" />
                {am}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-[var(--room-primary)] to-[var(--room-primary-hover)] rounded-2xl shadow-xl text-white relative overflow-hidden">
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
                className="flex items-center gap-1 text-[10px] font-black text-[var(--room-primary)] hover:text-[var(--room-primary-hover)] transition-colors uppercase tracking-widest pointer-events-auto"
              >
                Maps <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
          <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
            {[room.address, room.area, room.city].filter(Boolean).join(", ") || "Pune"}
          </p>
        </div>

        <div className="pt-6 border-t border-gray-100 flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <User className="w-6 h-6 text-[var(--room-primary)]" />
            </div>
            <div>
              <p className="text-xs font-black text-gray-900 tracking-widest">Contact</p>
              <p className="text-base font-black text-gray-900">{room.ownerContact || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <a
              href={`tel:${room.ownerContact}`}
              className="flex items-center justify-center gap-2 py-4 border-2 border-gray-900 text-gray-900 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all active:scale-95 shadow-lg shadow-gray-200"
            >
              <Phone className="w-4 h-4" /> Call Now
            </a>
            <a
              href={`https://wa.me/${room.ownerContact?.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-4 border-2 border-emerald-500 text-emerald-500 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-emerald-950 transition-all active:scale-95 shadow-lg shadow-emerald-200"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
interface ListingCardProps {
  type: string;
  data: any;
}

export default function ListingCard({ type, data }: ListingCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const images = data.images || [];
  const videos = data.videos || [];
  
  const allMedia = [
    ...images.map((url: string) => ({ url: url, type: "image" as const })),
    ...videos.map((url: string) => ({ url: url, type: "video" as const }))
  ];

  const handleMediaClick = (index: number) => {
    setInitialMediaIndex(index);
    setGalleryOpen(true);
  };

  const getBorderHoverClass = () => {
    switch (type.toLowerCase()) {
      case "room":
        return "hover:shadow-[var(--room-primary)]/10";
      case "roomvacancy":
      case "vacancy":
        return "hover:shadow-[var(--vacancy-primary)]/10";
      case "mess":
        return "hover:shadow-[var(--mess-primary)]/10";
      case "foodstall":
      case "food":
        return "hover:shadow-[var(--food-primary)]/10";
      case "roommate":
        return "hover:shadow-[var(--roommate-primary)]/10";
      case "studyroom":
      case "study-rooms":
        return "hover:shadow-[var(--study-primary)]/10";
      default:
        return "hover:shadow-indigo-500/10";
    }
  };

  return (
    <>
      <MediaGallery 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        media={allMedia} 
        initialIndex={initialMediaIndex} 
      />

      <div className={`group relative bg-[var(--card-bg)] p-2 rounded-[2rem] shadow-sm hover:shadow-2xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 h-full ${getBorderHoverClass()}`}>
        <div className="relative z-10 flex flex-col h-full flex-1">
          {type === "Room" && <RoomCard room={data} onMediaClick={handleMediaClick} />}
          {(type === "RoomVacancy" || type === "Vacancy") && <RoomVacancyCard vacancy={data} onMediaClick={handleMediaClick} />}
          {type === "Mess" && <MessCard mess={data} onMediaClick={handleMediaClick} />}
          {(type === "FoodStall" || type === "Food") && <FoodStallCard stall={data} onMediaClick={handleMediaClick} />}
          {type === "Roommate" && <RoommateCard roommate={data} onMediaClick={handleMediaClick} />}
          {(type === "StudyRoom" || type === "StudyRooms" || type === "study-rooms") && <StudyRoomCard studyRoom={data} onMediaClick={handleMediaClick} />}
        </div>
      </div>
    </>
  );
}
