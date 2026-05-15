"use client";

import { useState } from "react";
import { 
  CookingPot, Utensils, MapPin, Phone, 
  Star, CheckCircle, IndianRupee, MessageCircle, User 
} from "lucide-react";
import { Mess } from "@/lib/api";
import { normalizeUrl } from "@/components/shared/utils";
import MediaGallery from "@/components/shared/MediaGallery";
import Badge from "@/components/shared/Badge";

interface MessCardProps {
  mess: Mess;
}

export default function MessCard({ mess }: MessCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const foodColors: Record<string, string> = {
    VEG: "bg-green-500/90 text-white",
    "NON-VEG": "bg-rose-500/90 text-white",
    BOTH: "bg-amber-500/90 text-white",
  };

  const images = mess.images || [];
  const videos = mess.videos || [];
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

      <div className="group relative bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 h-full">
        <div className="relative h-52 bg-gray-100 overflow-hidden rounded-2xl cursor-pointer" onClick={() => handleMediaClick(0)}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={mess.title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
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
        </div>

        <div className="p-6 flex flex-col gap-6 flex-1">
          <div>
            <div className="flex items-center gap-2 text-amber-600 mb-1.5">
              <Star className="w-4 h-4 fill-amber-50" />
              <span className="text-[10px] font-black uppercase tracking-widest">Popular Mess</span>
            </div>
            <h3 className="font-black text-gray-900 text-lg leading-tight line-clamp-1">
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

          <div className="px-5 py-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-lg shadow-amber-200/50 text-white relative overflow-hidden">
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

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:${mess.ownerContact}`}
                className="flex items-center justify-center gap-2 py-3 bg-gray-900 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
              <a
                href={`https://wa.me/${mess.ownerContact?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all active:scale-95"
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
