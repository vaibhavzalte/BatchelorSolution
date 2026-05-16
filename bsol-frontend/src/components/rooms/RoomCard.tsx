"use client";

import { useState } from "react";
import { 
  House, MapPin, Phone, Wifi, Car, Wind, 
  UtensilsCrossed, Bath, CheckCircle, IndianRupee, 
  MessageCircle, ExternalLink, User, Users 
} from "lucide-react";
import { Room } from "@/lib/api";
import { normalizeUrl } from "@/components/shared/utils";
import MediaGallery from "@/components/shared/MediaGallery";

interface RoomCardProps {
  room: Room;
}

export default function RoomCard({ room }: RoomCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initialMediaIndex, setInitialMediaIndex] = useState(0);

  const amenicons = [
    { key: "wifi", Icon: Wifi, label: "WiFi", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { key: "parking", Icon: Car, label: "Parking", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { key: "ac", Icon: Wind, label: "AC", color: "bg-rose-50 text-rose-600 border-rose-100" },
    { key: "foodIncluded", Icon: UtensilsCrossed, label: "Food", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    { key: "attachedBathroom", Icon: Bath, label: "Bath", color: "bg-sky-50 text-sky-600 border-sky-100" },
  ] as const;

  const images = room.images || [];
  const videos = room.videos || [];
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

      <div className="group relative bg-white p-2 rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 border border-gray-100 overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 h-full">
        <div className="relative h-56 bg-gray-400 flex gap-0.5 rounded-2xl overflow-hidden cursor-pointer" onClick={() => handleMediaClick(0)}>
          {displayImages.length > 0 ? (
            displayImages.map((img, i) => (
              <img
                key={i}
                src={normalizeUrl(img)}
                alt={`Image ${i + 1}`}
                className={`${displayImages.length === 1 ? "w-full" : "w-1/2"} h-full object-cover transition-transform duration-1000 hover:scale-110`}
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
          <div>
            <h3 className="font-black text-indigo-600 text-xl leading-tight">
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

          <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl shadow-xl shadow-indigo-200/50 text-white relative overflow-hidden">
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
                <MapPin className="w-3.5 h-3.5" /> Location
              </h4>
              {room.location && room.location.startsWith("http") && (
                <a
                  href={room.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest"
                >
                  Maps <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
            <p className="text-xs font-bold text-gray-600 leading-relaxed line-clamp-2">
              {[room.address, room.area, room.city].filter(Boolean).join(", ")}
            </p>
          </div>

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

            <div className="grid grid-cols-2 gap-4">
              <a
                href={`tel:${room.ownerContact}`}
                className="flex items-center justify-center gap-2 py-4 border-2 border-gray-900 text-gray-900 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-gray-900 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                <Phone className="w-4 h-4" /> Call Now
              </a>
              <a
                href={`https://wa.me/${room.ownerContact?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 border-2 border-emerald-500 text-emerald-500 rounded-[1.25rem] text-[11px] font-black uppercase tracking-widest hover:border-emerald-900 hover:scale-[1.02] transition-all active:scale-95 shadow-lg shadow-emerald-200"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


