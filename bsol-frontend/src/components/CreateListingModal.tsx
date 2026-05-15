"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  X,
  House,
  CookingPot,
  Utensils,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Users,
  MapPin,
  Plus,
} from "lucide-react";
import { createListing, ListingType } from "@/lib/api";

// Dynamically import LocationPicker to avoid SSR issues with Leaflet
const LocationPicker = dynamic(() => import("./LocationPicker"), {
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

// ─── Type Tabs ─────────────────────────────────────────────────────────────

const TYPES: { id: ListingType; label: string; icon: React.ReactNode; color: string }[] = [
  { id: "RoomVacancy", label: "Room Vacancy", icon: <Users className="w-5 h-5" />, color: "bg-emerald-500" },
  { id: "Room", label: "Full Room/Flat", icon: <House className="w-5 h-5" />, color: "bg-indigo-500" },
  { id: "Mess", label: "Mess", icon: <CookingPot className="w-5 h-5" />, color: "bg-amber-500" },
  { id: "FoodStall", label: "Food Stall", icon: <Utensils className="w-5 h-5" />, color: "bg-pink-500" },
];

const AMENITIES_LIST = [
  "WiFi", "AC", "Washing Machine", "Geyser", "Parking", "Elevator", "Cleaning Service", "CCTV"
];

// ─── Reusable input primitives ──────────────────────────────────────────────

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-[11px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm font-medium text-gray-800 transition-all placeholder:text-gray-300 shadow-sm";

const selectCls = inputCls + " cursor-pointer appearance-none";

// ─── Sub-forms ──────────────────────────────────────────────────────────────

function RoomForm({
  data,
  onChange,
  isVacancy = false,
}: {
  data: Record<string, unknown>;
  onChange: (d: Record<string, unknown>) => void;
  isVacancy?: boolean;
}) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });

  // Handle amenities as an array
  const toggleAmenity = (name: string) => {
    const current = (data.amenities as string[]) || [];
    if (current.includes(name)) {
      set("amenities", current.filter(a => a !== name));
    } else {
      set("amenities", [...current, name]);
    }
  };

  if (isVacancy) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="sm:col-span-2">
          <Field label="Short Description / Title *">
            <input className={inputCls} placeholder='e.g. "Looking for roommate in 2BHK..."' value={(data.description as string) || ""} onChange={e => set("description", e.target.value)} />
          </Field>
        </div>

        <Field label="Room Type">
          <select className={selectCls} value={(data.roomType as string) || ""} onChange={e => set("roomType", e.target.value)}>
            <option value="">Select type</option>
            {["Single", "Double", "Triple", "Shared"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Preferred Tenant">
          <select className={selectCls} value={(data.preferredTenant as string) || ""} onChange={e => set("preferredTenant", e.target.value)}>
            <option value="">Select</option>
            {["Male", "Female", "Any"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <Field label="Rent (₹)">
          <input type="number" className={inputCls} placeholder="e.g. 5000" value={(data.rent as string) || ""} onChange={e => set("rent", e.target.value ? Number(e.target.value) : 0)} />
        </Field>

        <Field label="Deposit (₹)">
          <input type="number" className={inputCls} placeholder="e.g. 10000" value={(data.deposit as string) || ""} onChange={e => set("deposit", e.target.value ? Number(e.target.value) : 0)} />
        </Field>

        <Field label="Brokerage (₹)">
          <input type="number" className={inputCls} placeholder="e.g. 2000" value={(data.brokerage as string) || ""} onChange={e => set("brokerage", e.target.value ? Number(e.target.value) : 0)} />
        </Field>

        <Field label="Available From">
          <input type="date" className={inputCls} value={(data.availableFrom as string) || ""} onChange={e => set("availableFrom", e.target.value)} />
        </Field>

        <Field label="Total Beds">
          <input type="number" className={inputCls} placeholder="Total capacity" value={(data.totalBeds as string) || ""} onChange={e => set("totalBeds", e.target.value ? Number(e.target.value) : 1)} />
        </Field>
        <Field label="Available Beds">
          <input type="number" className={inputCls} placeholder="Current vacancy" value={(data.availableBeds as string) || ""} onChange={e => set("availableBeds", e.target.value ? Number(e.target.value) : 1)} />
        </Field>

        <Field label="Food Included">
          <select className={selectCls} value={(data.foodIncluded as string) || ""} onChange={e => set("foodIncluded", e.target.value)}>
            <option value="">Select</option>
            {["Yes", "No", "Optional"].map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>

        <div className="flex gap-4 items-center">
          <button type="button" onClick={() => set("attachedBathroom", !data.attachedBathroom)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${data.attachedBathroom ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-400 border-gray-100"}`}>
            Attached Bathroom
          </button>
          <button type="button" onClick={() => set("furnished", !data.furnished)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${data.furnished ? "bg-emerald-500 text-white border-emerald-500" : "bg-white text-gray-400 border-gray-100"}`}>
            Furnished
          </button>
        </div>

        {/* Location Section */}
        <div className="sm:col-span-2 mt-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-emerald-500" />
            </div>
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-tight">Exact Location</h3>
          </div>

          <LocationPicker
            onLocationSelect={(loc) => {
              set("location", loc.address);
              set("latitude", loc.lat);
              set("longitude", loc.lng);
            }}
            initialLocation={data.latitude ? { lat: data.latitude as number, lng: data.longitude as number } : undefined}
          />
        </div>

        {/* Amenities Selection */}
        <div className="sm:col-span-2 mt-4">
          <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3 block">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${((data.amenities as string[]) || []).includes(amenity) ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : "bg-white text-gray-400 border-gray-100 hover:border-emerald-200"}`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Fallback for regular Room (not RoomVacancy)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="sm:col-span-2">
        <Field label="Listing Title *">
          <input className={inputCls} placeholder='e.g. "Cozy 1BHK near College"' value={(data.title as string) || ""} onChange={e => set("title", e.target.value)} />
        </Field>
      </div>

      <Field label="Room Type">
        <select className={selectCls} value={(data.roomType as string) || ""} onChange={e => set("roomType", e.target.value)}>
          <option value="">Select type</option>
          {["1RK", "1BHK", "2BHK", "3BHK"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>

      <Field label="Rent (₹)">
        <input type="number" className={inputCls} value={(data.rent as string) || ""} onChange={e => set("rent", Number(e.target.value))} />
      </Field>

      <div className="sm:col-span-2 mt-4">
        <LocationPicker onLocationSelect={(loc) => { set("address", loc.address); set("latitude", loc.lat); set("longitude", loc.lng); }} />
      </div>
    </div>
  );
}

function MessForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="sm:col-span-2">
        <Field label="Mess Name *">
          <input className={inputCls} placeholder='e.g. "Shree Ganesh Mess"' value={(data.title as string) || ""} onChange={e => set("title", e.target.value)} />
        </Field>
      </div>
      <Field label="Food Type">
        <select className={selectCls} value={(data.foodType as string) || ""} onChange={e => set("foodType", e.target.value)}>
          <option value="">Select</option>
          {["VEG", "NON-VEG", "BOTH"].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </Field>
      <Field label="Monthly Fee (₹)">
        <input type="number" className={inputCls} value={(data.monthlyFee as string) || ""} onChange={e => set("monthlyFee", Number(e.target.value))} />
      </Field>
      <div className="sm:col-span-2">
        <LocationPicker onLocationSelect={(loc) => { set("location", loc.address); set("latitude", loc.lat); set("longitude", loc.lng); }} />
      </div>
    </div>
  );
}

function FoodStallForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
  const set = (k: string, v: unknown) => onChange({ ...data, [k]: v });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="sm:col-span-2">
        <Field label="Stall Name *">
          <input className={inputCls} placeholder='e.g. "Raj Vada Pav"' value={(data.stallName as string) || ""} onChange={e => set("stallName", e.target.value)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <LocationPicker onLocationSelect={(loc) => { set("location", loc.address); set("latitude", loc.lat); set("longitude", loc.lng); }} />
      </div>
    </div>
  );
}

// ─── Main Modal ─────────────────────────────────────────────────────────────

interface CreateListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateListingModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateListingModalProps) {
  const [activeType, setActiveType] = useState<ListingType>("RoomVacancy");
  const [formData, setFormData] = useState<Record<string, unknown>>({
    type: "RoomVacancy",
    totalBeds: 1,
    availableBeds: 1,
    amenities: []
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setFormData({
      type: activeType,
      totalBeds: 1,
      availableBeds: 1,
      amenities: []
    });
    setStatus("idle");
    setErrorMsg("");
  }, [activeType]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await createListing(activeType, formData as any);
      setStatus("success");
      setTimeout(() => {
        onSuccess();
        onClose();
        setStatus("idle");
        setFormData({ type: activeType });
      }, 1500);
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const activeTabData = TYPES.find(t => t.id === activeType)!;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md transition-all animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className={`${activeTabData.color} px-10 py-8 text-white flex items-center justify-between shrink-0 relative overflow-hidden`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-1">Bachelor Solution</p>
            <h2 className="text-3xl font-black tracking-tight leading-none">Post {activeTabData.label}</h2>
          </div>
          <button onClick={onClose} className="relative z-10 w-12 h-12 bg-white/20 hover:bg-white/30 rounded-2xl flex items-center justify-center transition-all active:scale-90">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 px-10 pt-8 shrink-0 overflow-x-auto no-scrollbar">
          {TYPES.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveType(t.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-2 shrink-0 ${activeType === t.id
                  ? `${t.color} text-white border-transparent shadow-xl -translate-y-1`
                  : "bg-gray-50 text-gray-400 border-gray-50 hover:border-gray-100"
                }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="px-10 py-8 overflow-y-auto flex-1 custom-scrollbar">
            {(activeType === "Room" || activeType === "RoomVacancy") && (
              <RoomForm
                data={formData}
                onChange={setFormData}
                isVacancy={activeType === "RoomVacancy"}
              />
            )}
            {activeType === "Mess" && <MessForm data={formData} onChange={setFormData} />}
            {activeType === "FoodStall" && <FoodStallForm data={formData} onChange={setFormData} />}
          </div>

          {/* Footer Actions */}
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-6 shrink-0">
            <div className="flex-1">
              {status === "error" && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in slide-in-from-left-2 transition-all">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span className="line-clamp-2">{errorMsg}</span>
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in slide-in-from-left-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Post listed successfully!
                </div>
              )}
              {status === "idle" && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Double check your details</p>}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={onClose} className="px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-400 hover:bg-gray-200 transition-all active:scale-95">
                Discard
              </button>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={`px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.1em] text-white shadow-2xl transition-all flex items-center gap-3 ${activeTabData.color} hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
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
