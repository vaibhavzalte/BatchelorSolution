"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  X,
  House,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  ImageIcon,
  Trash2,
  User,
  Phone,
  Mail,
  IndianRupee,
  BedDouble,
  Info,
  Plus,
  Check,
  Search,
  ChevronDown,
} from "lucide-react";
import { createRoomListing } from "@/lib/api";

const LocationPicker = dynamic(() => import("../LocationPicker"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
        <p className="text-xs font-bold text-gray-400">Loading Map…</p>
      </div>
    </div>
  ),
});

// ─── Constants ────────────────────────────────────────────────────────────────

const ROOM_TYPES = ["1 RK", "1 BHK", "2 BHK", "3 BHK", "4 BHK", "Entire Flat"];
const AVAILABLE_FOR = ["Boys", "Girls", "Family", "Any"];
const AMENITIES_OPTIONS = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "ac", label: "AC" },
  { key: "parking", label: "Parking" },
  { key: "washing machine", label: "Washing Machine" },
];

const INDIAN_CITIES = [
  "Pune",
  "Nashik",
  "Mumbai",
  "Nagpur",
  "Bangalore",
  "Hyderabad",
  "Delhi",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Lucknow",
  "Kanpur",
  "Indore",
  "Thane",
  "Bhopal",
  "Visakhapatnam",
  "Pimpri-Chinchwad",
  "Patna",
  "Vadodara",
];

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGES = 6;

// ─── Primitives ───────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300 shadow-sm";
const selectCls = inputCls + " cursor-pointer appearance-none";

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
        {required && <span className="text-indigo-500">*</span>}
      </label>
      {children}
      {hint && (
        <p className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
          <Info className="w-3 h-3" /> {hint}
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

// ─── Image Uploader ───────────────────────────────────────────────────────────

interface ImageFile {
  file: File;
  previewUrl: string;
  error?: string;
}

function ImageUploader({
  images,
  onChange,
}: {
  images: ImageFile[];
  onChange: (imgs: ImageFile[]) => void;
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
      {/* Drop Zone */}
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
            : "border-indigo-200 bg-indigo-50/40 hover:bg-indigo-50 hover:border-indigo-300"
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
          <ImageIcon className="w-6 h-6 text-indigo-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-indigo-600">
            {images.length >= MAX_IMAGES ? "Max images reached" : "Click or drag & drop photos"}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Up to {MAX_IMAGES} images · Max 5 MB each · JPG, PNG, WEBP
          </p>
        </div>
      </div>

      {/* Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`relative rounded-xl overflow-hidden aspect-video bg-gray-100 group ${
                img.error ? "ring-2 ring-red-400" : ""
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
                className="absolute top-1.5 right-1.5 w-7 h-7 bg-black/60 hover:bg-red-500 rounded-lg flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
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

// ─── Main Modal ───────────────────────────────────────────────────────────────

export interface RoomFormData {
  // Core
  title: string;
  description: string;
  roomType: string;
  availableFor: string;
  totalRooms: number;
  availableRooms: number;
  // Pricing
  rent: number;
  deposit: number;
  maintenance: number;
  brokerage: number;
  // Amenities
  amenities: string[];
  // Location
  address: string;
  area: string;
  city: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  // Owner
  ownerName: string;
  ownerContact: string;
  ownerEmail: string;
}

const INITIAL_FORM: RoomFormData = {
  title: "",
  description: "",
  roomType: "",
  availableFor: "",
  totalRooms: 1,
  availableRooms: 1,
  rent: 0,
  deposit: 0,
  maintenance: 0,
  brokerage: 0,
  amenities: [],
  address: "",
  area: "",
  city: "Pune",
  location: "",
  latitude: null,
  longitude: null,
  ownerName: "",
  ownerContact: "",
  ownerEmail: "",
};

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateRoomModal({ isOpen, onClose, onSuccess }: CreateRoomModalProps) {
  const [form, setForm] = useState<RoomFormData>(INITIAL_FORM);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState(""); // validation errors only
  const [toast, setToast] = useState<string | null>(null); // server / network errors
  const [customAmenity, setCustomAmenity] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof RoomFormData>(k: K, v: RoomFormData[K]) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const toggleAmenity = (key: string) => {
    const current = form.amenities;
    if (current.includes(key)) {
      set("amenities", current.filter((a) => a !== key));
    } else {
      set("amenities", [...current, key]);
    }
  };

  const handleAddCustomAmenity = () => {
    if (customAmenity.trim()) {
      const val = customAmenity.trim().toLowerCase();
      if (!form.amenities.includes(val)) {
        set("amenities", [...form.amenities, val]);
      }
      setCustomAmenity("");
    }
  };

  const addCustomAmenityOnKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomAmenity();
    }
  };

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setImages([]);
      setStatus("idle");
      setErrorMsg("");
      setToast(null);
    }
  }, [isOpen]);

  // Auto-dismiss toast after 4 s
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(e.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const hasImageError = images.some((i) => i.error);

  const validate = (): string | null => {
    if (!form.title.trim()) return "Listing title is required.";
    if (!form.roomType) return "Please select a room type.";
    if (!form.availableFor) return "Please select who the room is available for.";
    if (form.rent <= 0) return "Rent must be greater than 0.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.ownerName.trim()) return "Owner name is required.";
    
    // Phone validation
    if (!form.ownerContact.trim()) return "Owner contact is required.";
    if (!/^\d{10}$/.test(form.ownerContact)) return "Contact number must be exactly 10 digits.";

    // Email validation (if provided)
    if (form.ownerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) {
      return "Please enter a valid email address.";
    }

    if (hasImageError) return "Remove oversized images before posting.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErr = validate();
    if (validationErr) {
      setStatus("error");
      setErrorMsg(validationErr);
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      await createRoomListing("Room", form, images.map((i) => i.file));
      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
      }, 1500);
    } catch (err) {
      // Full error is already console.error'd inside createRoomListing
      console.error("[CreateRoomModal] Submit failed:", err);
      setStatus("idle"); // reset button so user can retry
      setToast(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* ── Floating Toast (server / network errors) ── */}
      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4 duration-300 max-w-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{toast}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        {/* ── Header ── */}
        <div className="bg-indigo-600 px-10 py-8 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">
              Bachelor Solution · Room
            </p>
            <h2 className="text-3xl font-black tracking-tight leading-none flex items-center gap-3">
              <House className="w-8 h-8 opacity-80" />
              Post a Room / Flat
            </h2>
            <p className="text-indigo-200 text-xs font-medium mt-2">
              Fill in the details to publish your listing
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all active:scale-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-10 py-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">

            {/* ── Section 1: Basic Info ── */}
            <div>
              <SectionHeader icon={<House className="w-4 h-4" />} title="Basic Information" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Listing Title" required>
                    <input
                      className={inputCls}
                      placeholder='e.g. "Spacious 1 BHK near College, Dhanori"'
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea
                      className={inputCls + " resize-none h-24"}
                      placeholder="Describe the property, nearby landmarks, floor details, etc."
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </Field>
                </div>

                <Field label="Room Type" required>
                  <select
                    className={selectCls}
                    value={form.roomType}
                    onChange={(e) => set("roomType", e.target.value)}
                  >
                    <option value="">Select type</option>
                    {ROOM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Available For" required>
                  <select
                    className={selectCls}
                    value={form.availableFor}
                    onChange={(e) => set("availableFor", e.target.value)}
                  >
                    <option value="">Select</option>
                    {AVAILABLE_FOR.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                {/* Removed Total Rooms and Available Rooms as per request */}
              </div>
            </div>

            {/* ── Section 2: Pricing ── */}
            <div>
              <SectionHeader
                icon={<IndianRupee className="w-4 h-4" />}
                title="Pricing"
                color="bg-green-50"
                iconColor="text-green-600"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="Rent (₹)" required>
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="6000"
                    value={form.rent || ""}
                    onChange={(e) => set("rent", Number(e.target.value))}
                  />
                </Field>
                <Field label="Deposit (₹)">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="1000"
                    value={form.deposit || ""}
                    onChange={(e) => set("deposit", Number(e.target.value))}
                  />
                </Field>
                <Field label="Maintenance (₹)">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="200"
                    value={form.maintenance || ""}
                    onChange={(e) => set("maintenance", Number(e.target.value))}
                  />
                </Field>
                <Field label="Brokerage (₹)">
                  <input
                    type="number"
                    min={0}
                    className={inputCls}
                    placeholder="500"
                    value={form.brokerage || ""}
                    onChange={(e) => set("brokerage", Number(e.target.value))}
                  />
                </Field>
              </div>
            </div>

            {/* ── Section 3: Amenities ── */}
            <div>
              <SectionHeader
                icon={<BedDouble className="w-4 h-4" />}
                title="Amenities"
                color="bg-amber-50"
                iconColor="text-amber-600"
              />
              <div className="flex flex-wrap gap-2 mb-4">
                {AMENITIES_OPTIONS.map((am) => {
                  const active = form.amenities.includes(am.key);
                  return (
                    <button
                      key={am.key}
                      type="button"
                      onClick={() => toggleAmenity(am.key)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
                        active
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                          : "bg-white text-gray-400 border-gray-100 hover:border-indigo-200 hover:text-indigo-400"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                        active ? "bg-white border-white" : "border-gray-200"
                      }`}>
                        {active && <Check className="w-2.5 h-2.5 text-indigo-600 stroke-[4px]" />}
                      </div>
                      {am.label}
                    </button>
                  );
                })}
                {form.amenities
                  .filter((a) => !AMENITIES_OPTIONS.some((opt) => opt.key === a))
                  .map((custom) => (
                    <button
                      key={custom}
                      type="button"
                      onClick={() => toggleAmenity(custom)}
                      className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 bg-indigo-100 text-indigo-700 border-indigo-200 shadow-sm flex items-center gap-1.5"
                    >
                      {custom}
                      <X className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
              </div>
              <div className="relative group">
                <input
                  className={inputCls + " pr-14"}
                  placeholder="e.g. Garden, Security, Balcony..."
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyDown={addCustomAmenityOnKey}
                />
                <button
                  type="button"
                  onClick={handleAddCustomAmenity}
                  disabled={!customAmenity.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* ── Section 4: Location ── */}
            <div>
              <SectionHeader
                icon={<MapPin className="w-4 h-4" />}
                title="Location"
                color="bg-rose-50"
                iconColor="text-rose-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Field label="City" required>
                  <div className="relative" ref={cityDropdownRef}>
                    <div
                      className={`${inputCls} flex items-center justify-between cursor-pointer ${
                        isCityOpen ? "border-indigo-400 ring-4 ring-indigo-50" : ""
                      }`}
                      onClick={() => setIsCityOpen(!isCityOpen)}
                    >
                      <span className={form.city ? "text-gray-800" : "text-gray-300"}>
                        {form.city || "Select City"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          isCityOpen ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {isCityOpen && (
                      <div className="absolute z-[1001] top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-gray-50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input
                              autoFocus
                              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none focus:ring-0 text-sm font-medium text-gray-800 placeholder:text-gray-300 rounded-xl"
                              placeholder="Search city..."
                              value={cityQuery}
                              onChange={(e) => setCityQuery(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                          {INDIAN_CITIES.filter((c) =>
                            c.toLowerCase().includes(cityQuery.toLowerCase())
                          ).length > 0 ? (
                            INDIAN_CITIES.filter((c) =>
                              c.toLowerCase().includes(cityQuery.toLowerCase())
                            ).map((c) => (
                              <button
                                key={c}
                                type="button"
                                onClick={() => {
                                  set("city", c);
                                  setIsCityOpen(false);
                                  setCityQuery("");
                                }}
                                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                                  form.city === c
                                    ? "bg-indigo-50 text-indigo-600"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                {c}
                              </button>
                            ))
                          ) : (
                            <div className="p-4 text-center">
                              <p className="text-xs font-bold text-gray-400">No cities found</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
                <Field label="Address" required>
                  <input
                    className={inputCls}
                    placeholder="Street address or landmark"
                    value={form.address}
                    onChange={(e) => set("address", e.target.value)}
                  />
                </Field>
                <Field label="Area / Locality">
                  <input
                    className={inputCls}
                    placeholder="e.g. Dhanori"
                    value={form.area}
                    onChange={(e) => set("area", e.target.value)}
                  />
                </Field>
                <Field label="Google Map Location(url)">
                  <input
                    className={inputCls}
                    placeholder="https://maps.app.goo.gl/AbCdEf12345"
                    value={form.location}
                    onChange={(e) => set("location", e.target.value)}
                  />
                </Field>
              </div>
              {/* Map picker */}
              <LocationPicker
                onLocationSelect={(loc) => {
                  set("latitude", loc.lat);
                  set("longitude", loc.lng);
                  if (!form.address) set("address", loc.address);
                }}
                initialLocation={
                  form.latitude ? { lat: form.latitude, lng: form.longitude! } : undefined
                }
              />
              {/* Latitude and Longitude hidden as per request */}
            </div>

            {/* ── Section 5: Owner Info ── */}
            <div>
              <SectionHeader
                icon={<User className="w-4 h-4" />}
                title="Owner / Contact"
                color="bg-purple-50"
                iconColor="text-purple-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Owner Name" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      className={inputCls + " pl-10"}
                      placeholder="Full name"
                      value={form.ownerName}
                      onChange={(e) => set("ownerName", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Contact Number" required>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      className={inputCls + " pl-10 pr-16"}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      value={form.ownerContact}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        set("ownerContact", val);
                      }}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 tabular-nums">
                      {form.ownerContact.length}/10
                    </div>
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email Address">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="email"
                        className={inputCls + " pl-10"}
                        placeholder="owner@email.com"
                        value={form.ownerEmail}
                        onChange={(e) => set("ownerEmail", e.target.value)}
                      />
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            {/* ── Section 6: Photos ── */}
            <div>
              <SectionHeader
                icon={<ImageIcon className="w-4 h-4" />}
                title="Photos"
                color="bg-cyan-50"
                iconColor="text-cyan-500"
              />
              <ImageUploader images={images} onChange={setImages} />
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-6 shrink-0">
            <div className="flex-1 min-w-0">
              {/* Validation errors — always user-friendly, safe to show inline */}
              {status === "error" && errorMsg && (
                <div className="flex items-start gap-2 text-red-500 text-xs font-bold animate-in slide-in-from-left-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Room listing published successfully!
                </div>
              )}
              {(status === "idle" || status === "loading") && !errorMsg && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Double-check your details before posting
                </p>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all active:scale-95"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] text-white shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                {status === "loading"
                  ? "Publishing…"
                  : status === "success"
                  ? "Published ✓"
                  : "Publish Room"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
