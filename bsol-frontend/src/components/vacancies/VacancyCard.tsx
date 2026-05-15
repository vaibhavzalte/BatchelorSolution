"use client";

import { useState } from "react";
import { 
  Users, MapPin, Phone, Wifi, Wind, 
  Bath, IndianRupee, MessageCircle, ShieldCheck, User 
} from "lucide-react";
import { RoomVacancy } from "@/lib/api";
import { normalizeUrl } from "@/components/shared/utils";
import MediaGallery from "@/components/shared/MediaGallery";
import Badge from "@/components/shared/Badge";

interface VacancyCardProps {
  vacancy: RoomVacancy;
}

export default function VacancyCard({ vacancy }: VacancyCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const hasAmenity = (name: string) => vacancy.amenities?.includes(name);
  const images = vacancy.images || [];
  const videos = vacancy.videos || [];
  const displayImages = images.slice(0, 2);

  const allMedia = [
    ...images.map((url: string) => ({ url: normalizeUrl(url), type: "image" as const })),
    ...videos.map((url: string) => ({ url: normalizeUrl(url), type: "video" as const }))
  ];

  const handleMediaClick = (index: number) => {
    setInitialMediaIndex(index);
    setGalleryOpen(true);
  };

  return (
    <>
      <MediaGallery 
        isOpen={galleryOpen} 
        onClose={() => setGalleryOpen(false)} 
        media={allMedia} 
        initialIndex={initialMediaIndex} 
      />

      <div className="group relative bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 h-full">
        <div className="relative h-52 bg-gray-100 flex gap-0.5 overflow-hidden rounded-2xl cursor-pointer" onClick={() => handleMediaClick(0)}>
          {displayImages.length > 0 ? (
            displayImages.map((img, i) => (
              <img
                key={i}
                src={normalizeUrl(img)}
                alt={`Image`}
                className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-700 hover:scale-110`}
              />
            ))
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300">
              <Users className="w-12 h-12 opacity-20" />
              <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">No Photos</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
          <div className="absolute top-4 left-4 flex gap-2">
            <Badge label="Urgent Vacancy" color="bg-emerald-500/90 text-white border border-emerald-400/30" />
          </div>
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 mb-1.5">
              <ShieldCheck className="w-4 h-4 fill-emerald-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">Verified Listing</span>
            </div>
            <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
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

          <div className="px-5 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-lg shadow-emerald-200/50 text-white relative overflow-hidden">
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
    </>
  );
}
