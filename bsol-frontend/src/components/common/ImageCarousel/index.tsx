"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { normalizeUrl } from "@/components/shared/utils";

interface ImageCarouselProps {
  images?: string[];
  fallbackIcon?: React.ReactNode;
  onImageClick?: (index: number) => void;
}

export default function ImageCarousel({
  images = [],
  fallbackIcon,
  onImageClick
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const hasImages = images && images.length > 0;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasImages) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  if (!hasImages) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-300 bg-gray-50/50">
        {fallbackIcon || <ImageIcon className="w-14 h-14 opacity-20" />}
        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">No Photos</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full group/carousel overflow-hidden">
      {/* Slides */}
      <div 
        className="w-full h-full flex transition-transform duration-500 ease-out cursor-pointer"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onClick={() => onImageClick?.(currentIndex)}
      >
        {images.map((img, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <img
              src={normalizeUrl(img)}
              alt={`Listing Image ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center border border-gray-100 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 pointer-events-auto"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-800 flex items-center justify-center border border-gray-100 shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 pointer-events-auto"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Indicators/Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => handleDotClick(e, index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
