"use client";

import { MapPin, Users, Star, Calendar, Clock, Bookmark, Share2 } from "lucide-react";
import Image from "next/image";

interface EventCardProps {
  image: string;
  date: string;
  title: string;
  host: string;
  attendees: number;
  rating: number;
  price?: string;
  isWaitlist?: boolean;
  isOnline?: boolean;
}

export default function EventCard({
  image,
  date,
  title,
  host,
  attendees,
  rating,
  price,
  isWaitlist,
  isOnline,
}: EventCardProps) {
  return (
    <div className="group flex flex-col gap-3 cursor-pointer">
      {/* Image Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden shadow-sm">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {price && (
            <span className="bg-white/95 backdrop-blur shadow-sm text-gray-900 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider">
              {price}
            </span>
          )}
          {isWaitlist && (
            <span className="bg-amber-400 text-gray-900 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3 h-3" /> Waitlist
            </span>
          )}
        </div>

        {/* Action Button */}
        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-white hover:text-primary shadow-lg border border-white/30">
          <Bookmark className="w-4 h-4 fill-current" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 px-1">
        <div className="flex items-center gap-2 text-primary font-bold text-[11px] uppercase tracking-widest">
          {date}
          {isOnline && (
            <span className="flex items-center gap-1 text-gray-400">
               • <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Online
            </span>
          )}
        </div>
        
        <h3 className="text-base font-bold text-gray-900 leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
          <span>by {host}</span>
          <div className="flex items-center gap-1 text-amber-500">
            <span>•</span>
            <span>{rating}</span>
            <Star className="w-3 h-3 fill-current" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="avatar" />
              </div>
            ))}
          </div>
          <span className="text-[12px] font-bold text-gray-500">
            {attendees} attendees
          </span>
        </div>
      </div>
    </div>
  );
}
