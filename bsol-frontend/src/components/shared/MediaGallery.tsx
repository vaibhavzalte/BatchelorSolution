"use client";

import { X, ChevronLeft, ChevronRight, Maximize2, Play, Pause } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

interface MediaGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  media: { url: string; type: "image" | "video" }[];
  initialIndex?: number;
}

export default function MediaGallery({ isOpen, onClose, media, initialIndex = 0 }: MediaGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  }, [media.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length);
  }, [media.length]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev]);

  if (!isOpen || media.length === 0) return null;

  const currentMedia = media[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl transition-all duration-500 animate-in fade-in">
      {/* ── Close Button ── */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 z-[110] active:scale-95"
      >
        <X className="w-6 h-6" />
      </button>

      {/* ── Main Content ── */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        {currentMedia.type === "image" ? (
          <img
            src={currentMedia.url}
            alt={`Media ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300"
          />
        ) : (
          <div className="relative max-w-full max-h-full flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentMedia.url}
              className="max-w-full max-h-full rounded-lg"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-all opacity-0 hover:opacity-100 group"
            >
              {isPlaying ? (
                <Pause className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
              ) : (
                <Play className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
              )}
            </button>
          </div>
        )}

        {/* ── Navigation ── */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 active:scale-90"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-6 p-4 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all duration-300 active:scale-90"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </>
        )}

        {/* ── Counter ── */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white font-black text-sm tracking-widest uppercase">
          {currentIndex + 1} / {media.length}
        </div>
      </div>

      {/* ── Thumbnails (Optional) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-[80vw] pb-2 hidden md:flex">
        {media.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
              currentIndex === idx ? "border-white scale-110 shadow-lg" : "border-transparent opacity-50 hover:opacity-100"
            }`}
          >
            {item.type === "image" ? (
              <img src={item.url} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Play className="w-6 h-6 text-white opacity-50" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
