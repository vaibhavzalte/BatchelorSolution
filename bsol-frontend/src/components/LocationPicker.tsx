"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Navigation, MapPin, Loader2, X } from "lucide-react";
import debounce from "lodash.debounce";

// Fix Leaflet marker icons
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface LocationPickerProps {
  onLocationSelect: (data: LocationData) => void;
  initialLocation?: { lat: number; lng: number };
}

// ─── Sub-components for Map ──────────────────────────────────────────────────

function MapEvents({ onMove }: { onMove: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMove(e.latlng.lat, e.latlng.lng);
    },
    dragend(e) {
      const center = e.target.getCenter();
      onMove(center.lat, center.lng);
    }
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

// ─── Main LocationPicker Component ───────────────────────────────────────────

export default function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(
    initialLocation ? [initialLocation.lat, initialLocation.lng] : [18.5204, 73.8567] // Default Pune
  );
  const [address, setAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLocating, setIsLocating] = useState(false);

  // Reverse Geocoding (Lat/Lng -> Address)
  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      if (data.display_name) {
        setAddress(data.display_name);
        setSuggestions([]); // Clear suggestions when moving map or getting address
        onLocationSelect({ address: data.display_name, lat, lng });
      }
    } catch (err) {
      console.error("Geocoding error", err);
    }
  }, [onLocationSelect]);

  // Forward Geocoding (Address -> Lat/Lng)
  const searchAddress = useMemo(() => debounce(async (query: string) => {
    if (!query || query.length < 3) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setIsSearching(false);
    }
  }, 500), []);

  const handleSuggestionClick = (s: any) => {
    const lat = parseFloat(s.lat);
    const lng = parseFloat(s.lon);
    setPosition([lat, lng]);
    setAddress(s.display_name);
    setSuggestions([]);
    onLocationSelect({ address: s.display_name, lat, lng });
  };

  const handleUseCurrentLocation = () => {
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
        setSuggestions([]); // Clear suggestions on geolocation
        fetchAddress(latitude, longitude);
        setIsLocating(false);
      },
      (err) => {
        console.error(err);
        setIsLocating(false);
        alert("Could not get current location. Please check permissions.");
      }
    );
  };

  const handleMapMove = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    fetchAddress(lat, lng);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                searchAddress(e.target.value);
              }}
              placeholder="Search or enter address manually..."
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-primary outline-none text-sm"
            />
            {address && (
              <button 
                onClick={() => setAddress("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2 px-4 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition-all disabled:opacity-50"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
            <span className="hidden sm:inline">Use My Location</span>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute z-[1000] top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-xl overflow-hidden max-h-60 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSuggestionClick(s)}
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 flex items-start gap-2"
              >
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-1" />
                <span>{s.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Container */}
      <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 relative">
        <MapContainer
          center={position}
          zoom={15}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <ChangeView center={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} />
          <MapEvents onMove={handleMapMove} />
        </MapContainer>
        
        <div className="absolute bottom-4 right-4 z-[1000] bg-white px-3 py-1.5 rounded-lg shadow-md text-[10px] font-bold text-gray-500 pointer-events-none">
          Click or Drag map to select location
        </div>
      </div>

      {/* Latitude and Longitude hidden as per request */}
    </div>
  );
}
