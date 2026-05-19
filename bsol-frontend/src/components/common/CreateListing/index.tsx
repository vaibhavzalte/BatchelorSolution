"use client";

import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  X, House, CookingPot, Utensils, CheckCircle2, AlertCircle,
  Loader2, MapPin, ImageIcon, Trash2, User, Phone, Mail,
  IndianRupee, BedDouble, Info, Plus, Check, Search, ChevronDown,
  BookOpen, Clock, Calendar, ShieldCheck, Users, Wind, Bath
} from "lucide-react";
import { createRoomListing, createListing } from "@/lib/api";
import { INDIAN_CITIES } from "@/components/shared/SearchConstants";

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("../../LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
        <p className="text-xs font-bold text-gray-400">Loading Map...</p>
      </div>
    </div>
  ),
});

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGES = 6;

interface ImageFile {
  file: File;
  previewUrl: string;
  error?: string;
}

// ─── Theme Configurations ───────────────────────────────────────────────────
interface ThemeConfig {
  label: string;
  color: string;
  light: string;
  text: string;
  icon: React.ReactNode;
}

const THEMES: Record<string, ThemeConfig> = {
  room: { label: "Room / Flat", color: "bg-[var(--room-primary)]", light: "bg-[var(--room-primary-light)]", text: "text-[var(--room-primary)]", icon: <House className="w-5 h-5" /> },
  vacancy: { label: "Vacancy", color: "bg-[var(--vacancy-primary)]", light: "bg-[var(--vacancy-primary-light)]", text: "text-[var(--vacancy-primary)]", icon: <Users className="w-5 h-5" /> },
  roommate: { label: "Roommate", color: "bg-[var(--roommate-primary)]", light: "bg-[var(--roommate-primary-light)]", text: "text-[var(--roommate-primary)]", icon: <User className="w-5 h-5" /> },
  food: { label: "Food Stall", color: "bg-[var(--food-primary)]", light: "bg-[var(--food-primary-light)]", text: "text-[var(--food-primary)]", icon: <Utensils className="w-5 h-5" /> },
  mess: { label: "Mess", color: "bg-[var(--mess-primary)]", light: "bg-[var(--mess-primary-light)]", text: "text-[var(--mess-primary)]", icon: <CookingPot className="w-5 h-5" /> },
  "study-rooms": { label: "Study Room", color: "bg-[var(--study-primary)]", light: "bg-[var(--study-primary-light)]", text: "text-[var(--study-primary)]", icon: <BookOpen className="w-5 h-5" /> }
};

// ─── Shared Sub-Components ──────────────────────────────────────────────────
function Field({
  label,
  children,
  required,
  hint,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
        {required && <span className="text-rose-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1 mt-0.5">
          <Info className="w-3 h-3 text-gray-400" /> {hint}
        </p>
      )}
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  color = "bg-indigo-50",
  iconColor = "text-indigo-500",
}: {
  icon: React.ReactNode;
  title: string;
  color?: string;
  iconColor?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <span className={iconColor}>{icon}</span>
      </div>
      <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">{title}</h3>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300 shadow-sm";
const selectCls = inputCls + " cursor-pointer appearance-none";

// ─── Image Uploader ───────────────────────────────────────────────────────────
function ImageUploader({
  images,
  onChange,
  themeColor = "text-indigo-500 bg-indigo-50/40 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300"
}: {
  images: ImageFile[];
  onChange: (imgs: ImageFile[]) => void;
  themeColor?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newImages: ImageFile[] = [];
    Array.from(files).forEach((file) => {
      if (images.length + newImages.length >= MAX_IMAGES) return;
      const sizeMB = file.size / (1024 * 1024);
      const error = sizeMB > MAX_IMAGE_SIZE_MB ? `File too large (${sizeMB.toFixed(1)} MB > 5 MB)` : undefined;
      const previewUrl = URL.createObjectURL(file);
      newImages.push({ file, previewUrl, error });
    });
    onChange([...images, ...newImages]);
  };

  const removeImage = (idx: number) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const hasError = images.some((i) => i.error);

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
        className={`relative flex flex-col items-center justify-center gap-3 h-36 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
          images.length >= MAX_IMAGES
            ? "border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed"
            : `hover:brightness-95 ${themeColor}`
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={images.length >= MAX_IMAGES}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-gray-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">
            {images.length >= MAX_IMAGES ? "Max images reached" : "Click or drag & drop photos"}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Up to {MAX_IMAGES} images · Max 5 MB each · JPG, PNG, WEBP
          </p>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden aspect-video bg-gray-100 group ${
                img.error ? "ring-2 ring-red-400" : ""
              }`}
            >
              <img
                src={img.previewUrl}
                alt={`Preview ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {img.error && (
                <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center p-2">
                  <p className="text-white text-[10px] font-bold text-center">{img.error}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 pointer-events-auto z-20"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </button>
              <div className="absolute bottom-1.5 left-1.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                {(img.file.size / (1024 * 1024)).toFixed(1)} MB
              </div>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <p className="text-[11px] text-red-500 font-bold flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Remove oversized images before posting.
        </p>
      )}
    </div>
  );
}

// ─── Main Modal Component ───────────────────────────────────────────────────
interface CreateListingProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  module: "room" | "vacancy" | "roommate" | "food" | "mess" | "study-rooms";
}

export default function CreateListing({
  isOpen,
  onClose,
  onSuccess,
  module
}: CreateListingProps) {
  const theme = THEMES[module] || THEMES.room;

  // Form states
  const [form, setForm] = useState<Record<string, any>>({});
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  // Dropdowns/Pickers
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [cityQuery, setCityQuery] = useState("");
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const set = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  // Dynamic values reset on open
  useEffect(() => {
    if (isOpen) {
      setForm({
        city: "Pune",
        amenities: [],
        type: module === "vacancy" ? "RoomVacancy" : module === "food" ? "FoodStall" : module === "study-rooms" ? "StudyRoom" : module.charAt(0).toUpperCase() + module.slice(1)
      });
      setImages([]);
      setStatus("idle");
      setErrorMsg("");
      setToast(null);
    }
  }, [isOpen, module]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const clickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  if (!isOpen) return null;

  // Toggle helpers
  const toggleAmenity = (name: string) => {
    const current = form.amenities || [];
    if (current.includes(name)) {
      set("amenities", current.filter((a: string) => a !== name));
    } else {
      set("amenities", [...current, name]);
    }
  };

  const validate = (): string | null => {
    // Standard owner info
    if (!form.ownerContact?.trim()) return "Owner contact phone number is required.";
    if (!/^\d{10}$/.test(form.ownerContact)) return "Contact phone number must be exactly 10 digits.";
    if (!form.address?.trim()) return "Address/Locality details are required.";

    // Module specific validation
    if (module === "room") {
      if (!form.title?.trim()) return "Room listing title is required.";
      if (!form.roomType) return "Room/Flat configuration is required.";
      if (!form.rent || Number(form.rent) <= 0) return "Rent price must be greater than zero.";
    }

    if (module === "vacancy") {
      if (!form.description?.trim()) return "Short vacancy description is required.";
      if (!form.roomType) return "Room configuration type is required.";
      if (!form.availableBeds || Number(form.availableBeds) <= 0) return "Available seats must be 1 or more.";
      if (!form.rent || Number(form.rent) <= 0) return "Rent share must be greater than zero.";
    }

    if (module === "roommate") {
      if (!form.title?.trim()) return "Title / Headline is required.";
      if (!form.gender) return "Preferred roommate gender is required.";
      if (!form.occupation) return "Preferred roommate occupation is required.";
      if (!form.rentShare || Number(form.rentShare) <= 0) return "Rent share must be greater than zero.";
    }

    if (module === "food") {
      if (!form.stallName?.trim()) return "Food Stall Name is required.";
      if (!form.foodType) return "Vegetarian classification type is required.";
    }

    if (module === "mess") {
      if (!form.title?.trim()) return "Mess business name is required.";
      if (!form.monthlyFee || Number(form.monthlyFee) <= 0) return "Monthly food charges must be greater than zero.";
      if (!form.foodType) return "Food Veg/Non-Veg type is required.";
    }

    if (module === "study-rooms") {
      if (!form.roomName?.trim()) return "Silent Study Space Name is required.";
      if (!form.capacity || Number(form.capacity) <= 0) return "Total student seat capacity is required.";
      if (!form.monthlyFee || Number(form.monthlyFee) <= 0) return "Monthly study room fee must be greater than zero.";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valErr = validate();
    if (valErr) {
      setStatus("error");
      setErrorMsg(valErr);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    const finalForm = { ...form };
    if (!finalForm.googleMap && finalForm.latitude && finalForm.longitude) {
      finalForm.googleMap = `https://www.google.com/maps?q=${finalForm.latitude},${finalForm.longitude}`;
    }

    // Map frontend module keys → exact backend ListingType enum values
    const MODULE_TO_API_TYPE: Record<string, string> = {
      "room":        "Room",
      "vacancy":     "RoomVacancy",   // ROOM_VACANCY("RoomVacancy")
      "roommate":    "RoomVacancy",   // Roommates are posted as RoomVacancy
      "food":        "FoodStall",     // FOOD_STALL("FoodStall")
      "mess":        "Mess",
      "study-rooms": "StudyRoom",     // STUDY_ROOM("StudyRoom")
    };
    const apiType = MODULE_TO_API_TYPE[module] ?? "Room";

    try {
      await createRoomListing(apiType, finalForm as any, images.map((i) => i.file));
      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
      }, 1500);
    } catch (err: any) {
      console.error("[CreateListing] Submit failed:", err);
      setStatus("idle");
      setToast(err.message || "Failed to publish listing. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-300" onClick={onClose} />

      {/* Floating Toast */}
      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4 duration-300 max-w-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className={`${theme.color} px-10 py-8 text-white flex items-center justify-between shrink-0 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Bachelor Solution</p>
            <h2 className="text-3xl font-black tracking-tight leading-none flex items-center gap-3">
              {theme.icon}
              Post {theme.label}
            </h2>
            <p className="text-white/70 text-xs font-semibold mt-2">Publish details instantly on the platform</p>
          </div>
          <button onClick={onClose} className="relative z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-10 py-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">
            
            {/* ── MODULE SPECIFIC SUB-FORMS ────────────────────────────────────── */}
            
            {/* ── ROOM / FLAT FORM ── */}
            {module === "room" && (
              <div>
                <SectionHeader icon={<House className="w-4 h-4" />} title="Room Information" color={theme.light} iconColor={theme.text} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Listing Title" required>
                      <input className={inputCls} placeholder="e.g. Spacious 1 BHK near College, Karvenagar" value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Description">
                      <textarea className={inputCls + " resize-none h-24"} placeholder="Describe floor details, rules, water timings, etc." value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Room Type" required>
                    <select className={selectCls} value={form.roomType || ""} onChange={(e) => set("roomType", e.target.value)}>
                      <option value="">Select Configuration</option>
                      {["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Entire Flat"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Available For" required>
                    <select className={selectCls} value={form.availableFor || ""} onChange={(e) => set("availableFor", e.target.value)}>
                      <option value="">Select Tenant Type</option>
                      {["Boys", "Girls", "Family", "Any"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Rent (₹)" required>
                    <input type="number" min={0} className={inputCls} placeholder="Rent per month" value={form.rent || ""} onChange={(e) => set("rent", Number(e.target.value))} />
                  </Field>
                  <Field label="Deposit (₹)">
                    <input type="number" min={0} className={inputCls} placeholder="Security deposit" value={form.deposit || ""} onChange={(e) => set("deposit", Number(e.target.value))} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── VACANCIES FORM ── */}
            {module === "vacancy" && (
              <div>
                <SectionHeader icon={<Users className="w-4 h-4" />} title="Bed Vacancy Information" color={theme.light} iconColor={theme.text} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Short vacancy headline" required>
                      <input className={inputCls} placeholder="e.g. Single bed vacancy in flat shared with students" value={form.description || ""} onChange={(e) => set("description", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Room Sharing Type" required>
                    <select className={selectCls} value={form.roomType || ""} onChange={(e) => set("roomType", e.target.value)}>
                      <option value="">Select sharing</option>
                      {["Single", "Double", "Triple", "Shared"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Tenant" required>
                    <select className={selectCls} value={form.preferredTenant || ""} onChange={(e) => set("preferredTenant", e.target.value)}>
                      <option value="">Select gender</option>
                      {["Male", "Female", "Any"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Total Room Capacity">
                    <input type="number" min={1} className={inputCls} placeholder="Total beds" value={form.totalBeds || ""} onChange={(e) => set("totalBeds", Number(e.target.value))} />
                  </Field>
                  <Field label="Available Beds Right Now" required>
                    <input type="number" min={1} className={inputCls} placeholder="Vacant beds" value={form.availableBeds || ""} onChange={(e) => set("availableBeds", Number(e.target.value))} />
                  </Field>
                  <Field label="Monthly Rent (₹)" required>
                    <input type="number" min={0} className={inputCls} placeholder="Per bed share cost" value={form.rent || ""} onChange={(e) => set("rent", Number(e.target.value))} />
                  </Field>
                  <Field label="Deposit (₹)">
                    <input type="number" min={0} className={inputCls} placeholder="Deposit share cost" value={form.deposit || ""} onChange={(e) => set("deposit", Number(e.target.value))} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── ROOMMATE FORM ── */}
            {module === "roommate" && (
              <div>
                <SectionHeader icon={<User className="w-4 h-4" />} title="Roommate Preference" color={theme.light} iconColor={theme.text} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Headline" required>
                      <input className={inputCls} placeholder="e.g. Need roommate for spacious flat near Symbiosis College" value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Preferred Roommate Gender" required>
                    <select className={selectCls} value={form.gender || ""} onChange={(e) => set("gender", e.target.value)}>
                      <option value="">Select Preference</option>
                      {["Boys", "Girls", "Any"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Roommate Occupation" required>
                    <select className={selectCls} value={form.occupation || ""} onChange={(e) => set("occupation", e.target.value)}>
                      <option value="">Select Occupation</option>
                      {["Student", "Professional", "Any"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Room Sharing Mode" required>
                    <select className={selectCls} value={form.roomType || ""} onChange={(e) => set("roomType", e.target.value)}>
                      <option value="">Select Sharing Mode</option>
                      {["Single", "Shared"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Rent Share Amount (₹)" required>
                    <input type="number" min={0} className={inputCls} placeholder="Your share of rent per month" value={form.rentShare || ""} onChange={(e) => {
                      set("rentShare", Number(e.target.value));
                      set("rent", Number(e.target.value)); // Fallback key
                    }} />
                  </Field>
                </div>
              </div>
            )}

            {/* ── FOOD STALL FORM ── */}
            {module === "food" && (
              <div>
                <SectionHeader icon={<Utensils className="w-4 h-4" />} title="Food Stall Details" color={theme.light} iconColor={theme.text} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Food Stall Name" required>
                      <input className={inputCls} placeholder="e.g. Balaji Chinese and Snacks" value={form.stallName || ""} onChange={(e) => {
                        set("stallName", e.target.value);
                        set("title", e.target.value); // Fallback key
                      }} />
                    </Field>
                  </div>
                  <Field label="Veg / Non-Veg Type" required>
                    <select className={selectCls} value={form.foodType || ""} onChange={(e) => set("foodType", e.target.value)}>
                      <option value="">Select Food Classification</option>
                      {["Veg", "Non-Veg", "Both"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Locality Info / Location description">
                    <input className={inputCls} placeholder="e.g. Near main campus gate" value={form.location || ""} onChange={(e) => set("location", e.target.value)} />
                  </Field>
                  <div className="flex items-center mt-6">
                    <button type="button" onClick={() => set("isOpen", !form.isOpen)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${form.isOpen ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-400 border-gray-100"}`}>
                      Open Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── MESS FORM ── */}
            {module === "mess" && (
              <div>
                <SectionHeader icon={<CookingPot className="w-4 h-4" />} title="Mess Details" color={theme.light} iconColor={theme.text} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Mess Business Name" required>
                      <input className={inputCls} placeholder="e.g. Annapurna Vegetarian Mess" value={form.title || ""} onChange={(e) => set("title", e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Food Veg / Non-Veg Option" required>
                    <select className={selectCls} value={form.foodType || ""} onChange={(e) => set("foodType", e.target.value)}>
                      <option value="">Select Option</option>
                      {["VEG", "NON-VEG", "BOTH"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Meals Provided" required>
                    <select className={selectCls} value={form.mealType || ""} onChange={(e) => set("mealType", e.target.value)}>
                      <option value="">Select Meals</option>
                      {["BREAKFAST", "LUNCH", "DINNER", "ALL"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <Field label="Monthly Mess Charge (₹)" required>
                    <input type="number" min={0} className={inputCls} placeholder="Monthly charges" value={form.monthlyFee || ""} onChange={(e) => set("monthlyFee", Number(e.target.value))} />
                  </Field>
                  <div className="flex items-center mt-6">
                    <button type="button" onClick={() => set("homeDelivery", !form.homeDelivery)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${form.homeDelivery ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-400 border-gray-100"}`}>
                      Home Delivery Available
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STUDY ROOMS FORM ── */}
            {module === "study-rooms" && (
              <div>
                <SectionHeader icon={<BookOpen className="w-4 h-4" />} title="Study Room Information" color={theme.light} iconColor={theme.text} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <Field label="Study Room Name" required>
                      <input className={inputCls} placeholder="e.g. Silent Study Zone A" value={form.roomName || ""} onChange={(e) => {
                        set("roomName", e.target.value);
                        set("title", e.target.value); // Fallback key
                      }} />
                    </Field>
                  </div>
                  <Field label="Total Seat Capacity" required>
                    <input type="number" min={1} className={inputCls} placeholder="Total seat desks" value={form.capacity || ""} onChange={(e) => set("capacity", Number(e.target.value))} />
                  </Field>
                  <Field label="Monthly Membership Fee (₹)" required>
                    <input type="number" min={0} className={inputCls} placeholder="Monthly fee cost" value={form.monthlyFee || ""} onChange={(e) => {
                      set("monthlyFee", Number(e.target.value));
                      set("rent", Number(e.target.value)); // Fallback key
                    }} />
                  </Field>
                  <Field label="Operational Hours timing" required>
                    <select className={selectCls} value={form.timing || ""} onChange={(e) => set("timing", e.target.value)}>
                      <option value="">Select timing</option>
                      {["24x7", "DAY", "NIGHT"].map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </Field>
                  <div className="flex gap-4 items-center mt-6">
                    <button type="button" onClick={() => set("hasWifi", !form.hasWifi)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${form.hasWifi ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-400 border-gray-100"}`}>
                      WiFi Available
                    </button>
                    <button type="button" onClick={() => set("hasAC", !form.hasAC)} className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${form.hasAC ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-400 border-gray-100"}`}>
                      AC Available
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── SHARED FORM FIELDS (IMAGES, MAPS, OWNER CONTACT) ───────────────── */}
            <div>
              <SectionHeader icon={<MapPin className="w-4 h-4" />} title="Location & Address" color="bg-rose-50" iconColor="text-rose-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Field label="City" required>
                  <div className="relative" ref={cityDropdownRef}>
                    <div className={`${inputCls} flex items-center justify-between cursor-pointer ${isCityOpen ? "border-indigo-400 ring-4 ring-indigo-50" : ""}`} onClick={() => setIsCityOpen(!isCityOpen)}>
                      <span className={form.city ? "text-gray-800" : "text-gray-300"}>{form.city || "Select City"}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCityOpen ? "rotate-180" : ""}`} />
                    </div>
                    {isCityOpen && (
                      <div className="absolute z-[1001] top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden p-1">
                        <div className="p-2 border-b border-gray-50">
                          <input className="w-full px-3 py-2 bg-gray-50 border-none text-xs rounded-xl" placeholder="Search city..." value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
                        </div>
                        <div className="max-h-56 overflow-y-auto p-1 custom-scrollbar">
                          {INDIAN_CITIES.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase())).map((c) => (
                            <button key={c} type="button" onClick={() => { set("city", c); setIsCityOpen(false); }} className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all ${form.city === c ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:bg-gray-50"}`}>{c}</button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
                <Field label="Address / Landmark / Area details" required>
                  <input className={inputCls} placeholder="e.g. Flat 301, Near Symbiosis College" value={form.address || ""} onChange={(e) => set("address", e.target.value)} />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Exact Location on Map">
                    <LocationPicker onLocationSelect={(loc) => {
                      set("address", loc.address);
                      set("latitude", loc.lat);
                      set("longitude", loc.lng);
                    }} />
                  </Field>
                </div>
              </div>
            </div>

            <div>
              <SectionHeader icon={<ImageIcon className="w-4 h-4" />} title="Property Photos" color="bg-emerald-50" iconColor="text-emerald-500" />
              <ImageUploader images={images} onChange={setImages} themeColor={`border-[var(--card-border)] bg-[var(--card-bg)] ${theme.text}`} />
            </div>

            <div>
              <SectionHeader icon={<User className="w-4 h-4" />} title="Owner Contact Info" color="bg-purple-50" iconColor="text-purple-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Contact Phone Number (10 digits)" required>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input className={inputCls + " pl-12"} placeholder="e.g. 9876543210" value={form.ownerContact || ""} onChange={(e) => set("ownerContact", e.target.value)} />
                  </div>
                </Field>
                <Field label="Owner/Publisher Name">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input className={inputCls + " pl-12"} placeholder="e.g. Rajesh Kumar" value={form.ownerName || ""} onChange={(e) => set("ownerName", e.target.value)} />
                  </div>
                </Field>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-6 shrink-0">
            <div className="flex-1">
              {status === "error" && (
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold animate-in slide-in-from-left-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-2">{errorMsg}</span>
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Listing published successfully!
                </div>
              )}
              {status === "idle" && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verify all information before uploading</p>}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all active:scale-95">Discard</button>
              <button type="submit" disabled={status === "loading" || status === "success"} className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] text-white shadow-2xl transition-all flex items-center gap-3 ${theme.color} hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}>
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {status === "loading" ? "Publishing..." : status === "success" ? "Published" : "Publish Post"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
