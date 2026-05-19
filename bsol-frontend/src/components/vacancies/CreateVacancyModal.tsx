"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  X,
  Users,
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
  Maximize2,
  Minimize2,
  CalendarDays
} from "lucide-react";
import { createVacancyListing, VacancyPayload } from "@/lib/api";

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

const ROOM_TYPES = ["1 Sharing", "2 Sharing", "3 Sharing", "4+ Sharing"];
const PREFERRED_TENANT = ["Male", "Female", "Any"];
const AMENITIES_OPTIONS = [
  { key: "wifi", label: "Wi-Fi" },
  { key: "ac", label: "AC" },
  { key: "parking", label: "Parking" },
  { key: "washing machine", label: "Washing Machine" },
];

const INDIAN_CITIES = [
  "Pune", "Nashik", "Mumbai", "Nagpur", "Bangalore", "Hyderabad", "Delhi",
  "Chennai", "Kolkata", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna",
  "Vadodara",
];

const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGES = 6;

// ─── Primitives ───────────────────────────────────────────────────────────────

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300 shadow-sm";
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
        {required && <span className="text-emerald-500">*</span>}
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
  color = "bg-emerald-50",
  iconColor = "text-emerald-500",
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
            : "border-emerald-200 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300"
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
          <ImageIcon className="w-6 h-6 text-emerald-400" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-emerald-600">
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

const INITIAL_FORM: VacancyPayload = {
  title: "",
  description: "",
  roomType: "",
  totalVacancies: 1,
  availableBeds: 1,
  preferredTenant: "",
  rent: 0,
  deposit: 0,
  maintenance: 0,
  brokerage: 0,
  amenities: [],
  availableFrom: new Date().toISOString().split('T')[0],
  address: "",
  area: "",
  city: "Pune",
  location: "",
  googleMap: "",
  latitude: null,
  longitude: null,
  ownerName: "",
  ownerContact: "",
  ownerEmail: "",
};

interface CreateVacancyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateVacancyModal({ isOpen, onClose, onSuccess }: CreateVacancyModalProps) {
  const [form, setForm] = useState<VacancyPayload>(INITIAL_FORM);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [customAmenity, setCustomAmenity] = useState("");
  const [cityQuery, setCityQuery] = useState("");
  const [isCityOpen, setIsCityOpen] = useState(false);
  const [isMapMaximized, setIsMapMaximized] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  const set = <K extends keyof VacancyPayload>(k: K, v: VacancyPayload[K]) =>
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

  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setImages([]);
      setStatus("idle");
      setErrorMsg("");
      setToast(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

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
    if (!form.preferredTenant) return "Please select preferred tenant.";
    if (form.rent <= 0) return "Rent must be greater than 0.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.ownerName.trim()) return "Owner name is required.";
    if (!form.ownerContact.trim()) return "Owner contact is required.";
    if (!/^\d{10}$/.test(form.ownerContact)) return "Contact number must be exactly 10 digits.";
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

    const finalForm = { ...form };
    if (!finalForm.googleMap && finalForm.latitude && finalForm.longitude) {
      finalForm.googleMap = `https://www.google.com/maps?q=${finalForm.latitude},${finalForm.longitude}`;
    }
    
    // Ensure availableFrom is in ISO format
    if (finalForm.availableFrom) {
      try {
        finalForm.availableFrom = new Date(finalForm.availableFrom).toISOString();
      } catch (e) {
        // ignore
      }
    }

    try {
      await createVacancyListing("RoomVacancy", finalForm, images.map((i) => i.file));
      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
      }, 1500);
    } catch (err) {
      console.error("[CreateVacancyModal] Submit failed:", err);
      setStatus("idle");
      setToast(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      {toast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-5 py-3.5 bg-gray-900 text-white rounded-2xl shadow-2xl text-sm font-semibold animate-in slide-in-from-top-4 duration-300 max-w-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast(null)} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        <div className="bg-emerald-600 px-10 py-8 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1">
              Bachelor Solution · Vacancy
            </p>
            <h2 className="text-3xl font-black tracking-tight leading-none flex items-center gap-3">
              <Users className="w-8 h-8 opacity-80" />
              Post a Vacancy
            </h2>
            <p className="text-emerald-100 text-xs font-medium mt-2">
              Fill in the details to publish your vacancy listing
            </p>
          </div>
          <button onClick={onClose} className="relative z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-10 py-8 overflow-y-auto flex-1 space-y-10 custom-scrollbar">

            <div>
              <SectionHeader icon={<Users className="w-4 h-4" />} title="Basic Information" color="bg-emerald-50" iconColor="text-emerald-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <Field label="Listing Title" required>
                    <input className={inputCls} placeholder='e.g. "1 Bed Available in 2 BHK flat"' value={form.title} onChange={(e) => set("title", e.target.value)} />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Description">
                    <textarea className={inputCls + " resize-none h-24"} placeholder="Describe the property, nearby landmarks, flatmates etc." value={form.description} onChange={(e) => set("description", e.target.value)} />
                  </Field>
                </div>

                <Field label="Room Type" required>
                  <select className={selectCls} value={form.roomType} onChange={(e) => set("roomType", e.target.value)}>
                    <option value="">Select type</option>
                    {ROOM_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Preferred Tenant" required>
                  <select className={selectCls} value={form.preferredTenant} onChange={(e) => set("preferredTenant", e.target.value)}>
                    <option value="">Select</option>
                    {PREFERRED_TENANT.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Total Vacancies">
                  <input type="number" min={1} className={inputCls} value={form.totalVacancies} onChange={(e) => set("totalVacancies", Number(e.target.value))} />
                </Field>

                <Field label="Available From">
                  <div className="relative">
                    <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input type="date" className={inputCls + " pl-10"} value={form.availableFrom.split('T')[0]} onChange={(e) => set("availableFrom", e.target.value)} />
                  </div>
                </Field>
              </div>
            </div>

            <div>
              <SectionHeader icon={<IndianRupee className="w-4 h-4" />} title="Pricing" color="bg-green-50" iconColor="text-green-600" />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Field label="Rent (₹)" required>
                  <input type="number" min={0} className={inputCls} placeholder="6000" value={form.rent || ""} onChange={(e) => set("rent", Number(e.target.value))} />
                </Field>
                <Field label="Deposit (₹)">
                  <input type="number" min={0} className={inputCls} placeholder="1000" value={form.deposit || ""} onChange={(e) => set("deposit", Number(e.target.value))} />
                </Field>
                <Field label="Maintenance (₹)">
                  <input type="number" min={0} className={inputCls} placeholder="200" value={form.maintenance || ""} onChange={(e) => set("maintenance", Number(e.target.value))} />
                </Field>
                <Field label="Brokerage (₹)">
                  <input type="number" min={0} className={inputCls} placeholder="500" value={form.brokerage || ""} onChange={(e) => set("brokerage", Number(e.target.value))} />
                </Field>
              </div>
            </div>

            <div>
              <SectionHeader icon={<BedDouble className="w-4 h-4" />} title="Amenities" color="bg-amber-50" iconColor="text-amber-600" />
              <div className="flex flex-wrap gap-2 mb-4">
                {AMENITIES_OPTIONS.map((am) => {
                  const active = form.amenities.includes(am.key);
                  return (
                    <button
                      key={am.key}
                      type="button"
                      onClick={() => toggleAmenity(am.key)}
                      className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 transition-all flex items-center gap-2 ${
                        active ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100" : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200 hover:text-emerald-500"
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${active ? "bg-white border-white" : "border-gray-200"}`}>
                        {active && <Check className="w-2.5 h-2.5 text-emerald-600 stroke-[4px]" />}
                      </div>
                      {am.label}
                    </button>
                  );
                })}
                {form.amenities.filter((a) => !AMENITIES_OPTIONS.some((opt) => opt.key === a)).map((custom) => (
                    <button key={custom} type="button" onClick={() => toggleAmenity(custom)} className="px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider border-2 bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm flex items-center gap-1.5">
                      {custom}
                      <X className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
              </div>
              <div className="relative group">
                <input className={inputCls + " pr-14"} placeholder="e.g. Balcony, Maid included..." value={customAmenity} onChange={(e) => setCustomAmenity(e.target.value)} onKeyDown={addCustomAmenityOnKey} />
                <button type="button" onClick={handleAddCustomAmenity} disabled={!customAmenity.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <SectionHeader icon={<MapPin className="w-4 h-4" />} title="Location" color="bg-rose-50" iconColor="text-rose-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <Field label="City" required>
                  <div className="relative" ref={cityDropdownRef}>
                    <div className={`${inputCls} flex items-center justify-between cursor-pointer ${isCityOpen ? "border-emerald-400 ring-4 ring-emerald-50" : ""}`} onClick={() => setIsCityOpen(!isCityOpen)}>
                      <span className={form.city ? "text-gray-800" : "text-gray-300"}>{form.city || "Select City"}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCityOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isCityOpen && (
                      <div className="absolute z-[1001] top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-3 border-b border-gray-50">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input autoFocus className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none focus:ring-0 text-sm font-medium text-gray-800 placeholder:text-gray-300 rounded-xl" placeholder="Search city..." value={cityQuery} onChange={(e) => setCityQuery(e.target.value)} />
                          </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto custom-scrollbar p-1">
                          {INDIAN_CITIES.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase())).length > 0 ? (
                            INDIAN_CITIES.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase())).map((c) => (
                              <button key={c} type="button" onClick={() => { set("city", c); setIsCityOpen(false); setCityQuery(""); }} className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${form.city === c ? "bg-emerald-50 text-emerald-600" : "text-gray-600 hover:bg-gray-50"}`}>
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
                  <input className={inputCls} placeholder="e.g. Karvenagar" value={form.address} onChange={(e) => set("address", e.target.value)} />
                </Field>
                <Field label="Area / Locality">
                  <input className={inputCls} placeholder="e.g. flat no. 402, building no. 101" value={form.area} onChange={(e) => set("area", e.target.value)} />
                </Field>
                <Field label="Google Map Location(url)">
                  <input className={inputCls} placeholder="https://maps.app.goo.gl/AbCdEf12345" value={form.googleMap} onChange={(e) => set("googleMap", e.target.value)} />
                </Field>
              </div>
            </div>

            <div>
              <SectionHeader icon={<User className="w-4 h-4" />} title="Owner / Contact" color="bg-purple-50" iconColor="text-purple-500" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Owner Name" required>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input className={inputCls + " pl-10"} placeholder="Full name" value={form.ownerName} onChange={(e) => set("ownerName", e.target.value)} />
                  </div>
                </Field>
                <Field label="Contact Number" required>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input className={inputCls + " pl-10 pr-16"} placeholder="10-digit mobile" maxLength={10} value={form.ownerContact} onChange={(e) => { const val = e.target.value.replace(/\D/g, "").slice(0, 10); set("ownerContact", val); }} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300 tabular-nums">
                      {form.ownerContact.length}/10
                    </div>
                  </div>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Email Address">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input type="email" className={inputCls + " pl-10"} placeholder="owner@email.com" value={form.ownerEmail} onChange={(e) => set("ownerEmail", e.target.value)} />
                    </div>
                  </Field>
                </div>
              </div>
            </div>

            <div>
              <SectionHeader icon={<ImageIcon className="w-4 h-4" />} title="Photos" color="bg-cyan-50" iconColor="text-cyan-500" />
              <ImageUploader images={images} onChange={setImages} />
            </div>

            <div className="p-6 bg-emerald-50/50 border-2 border-emerald-100 rounded-[2rem] space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600">
                  <MapPin className="w-5 h-5" />
                  <h3 className="text-sm font-black uppercase tracking-tight">Pin Your Location</h3>
                </div>
                <button type="button" onClick={() => setIsMapMaximized(true)} className="flex items-center gap-2 px-3 py-1.5 bg-white text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                  <Maximize2 className="w-3 h-3" /> Full Screen
                </button>
              </div>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Marking your exact location on the map helps users find your post when they search by area or locality.
              </p>
              
              {!isMapMaximized ? (
                <LocationPicker
                  onLocationSelect={(loc) => { set("latitude", loc.lat); set("longitude", loc.lng); set("address", loc.address); }}
                  initialAddress={form.address}
                  initialLocation={form.latitude ? { lat: form.latitude, lng: form.longitude! } : undefined}
                />
              ) : (
                <div className="h-64 bg-gray-50/50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-emerald-100 gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                    <Maximize2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">
                    Map is open in Full Screen
                  </p>
                </div>
              )}
            </div>

            {isMapMaximized && (
              <div className="fixed inset-0 z-[1000] bg-white animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                <div className="p-6 bg-emerald-600 text-white flex items-center justify-between shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">Precise Location Picker</h3>
                      <p className="text-emerald-100 text-xs font-medium">Click on the map to set your vacancy's exact position</p>
                    </div>
                  </div>
                  <button onClick={() => setIsMapMaximized(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all active:scale-90">
                    <Minimize2 className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex-1 relative flex flex-col">
                  <LocationPicker
                    containerClassName="flex-1 min-h-0 p-6"
                    className="flex-1"
                    onLocationSelect={(loc) => { set("latitude", loc.lat); set("longitude", loc.lng); set("address", loc.address); }}
                    initialAddress={form.address}
                    initialLocation={form.latitude ? { lat: form.latitude, lng: form.longitude! } : undefined}
                  />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-white px-8 py-4 rounded-[2rem] shadow-2xl border border-gray-100 flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Position</span>
                      <span className="text-xs font-bold text-gray-800">
                        {form.latitude ? `${form.latitude.toFixed(6)}, ${form.longitude?.toFixed(6)}` : "None"}
                      </span>
                    </div>
                    <button onClick={() => setIsMapMaximized(false)} className="px-8 py-3 bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg active:scale-95">
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-6 shrink-0">
            <div className="flex-1 min-w-0">
              {status === "error" && errorMsg && (
                <div className="flex items-start gap-2 text-red-500 text-xs font-bold animate-in slide-in-from-left-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Vacancy listing published successfully!
                </div>
              )}
              {(status === "idle" || status === "loading") && !errorMsg && (
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  Double-check your details before posting
                </p>
              )}
            </div>

            <div className="flex gap-3 shrink-0">
              <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all active:scale-95">
                Discard
              </button>
              <button type="submit" disabled={status === "loading" || status === "success"} className="px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] text-white shadow-xl shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {status === "loading" ? "Publishing…" : status === "success" ? "Published ✓" : "Publish Vacancy"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
