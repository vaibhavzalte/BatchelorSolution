"use client";

import { useState } from "react";
import { 
  Utensils, MapPin, Phone, 
  Star, MessageCircle, User 
} from "lucide-react";
import { FoodStall } from "@/lib/api";
import { normalizeUrl } from "@/components/shared/utils";
import MediaGallery from "@/components/shared/MediaGallery";
import Badge from "@/components/shared/Badge";

interface FoodCardProps {
  stall: FoodStall;
}

export default function FoodCard({ stall }: FoodCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const images = (stall as any).images || [];
  const videos = (stall as any).videos || [];
  const imageUrl = images.length > 0 ? normalizeUrl(images[0]) : null;

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

      <div className="group relative bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-pink-500/10 border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 h-full">
        <div className="relative h-52 bg-gray-100 overflow-hidden rounded-2xl cursor-pointer" onClick={() => handleMediaClick(0)}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={stall.stallName}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1">
          <div>
            <div className="flex items-center gap-2 text-pink-600 mb-1.5">
              <Star className="w-4 h-4 fill-pink-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">{stall.rating || "New"} Rated</span>
            </div>
            <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
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

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${stall.contactNumber}`}
                className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${stall.contactNumber?.replace(/\D/g, "")}`}
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
    </>
  );
}
