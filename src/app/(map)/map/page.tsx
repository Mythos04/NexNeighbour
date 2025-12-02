"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import MapSearchBar from "@/components/map/MapSearchBar";
import MapLegend from "@/components/map/MapLegend";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import type { Marker } from "@/lib/map/types";
import { categories, categoryList, type CategoryId } from "@/lib/map/categories";

// Dynamic import for MapCanvas to avoid SSR issues with Leaflet
const MapCanvas = dynamic(() => import("@/components/map/MapCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0B1014]">
      <div className="animate-pulse text-[#00E5E0]">Loading Map...</div>
    </div>
  ),
});

function MapContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>(
    categoryList.map((c) => c.id)
  );
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
  const [searchFlyTo, setSearchFlyTo] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
  } | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  // Get initial fly-to location from URL params (computed once)
  const initialFlyTo = useMemo(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");
    const zoom = searchParams.get("zoom");

    if (lat && lng) {
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        zoom: zoom ? parseInt(zoom) : 14,
      };
    }
    return null;
  }, [searchParams]);

  // Combine initial fly-to with search fly-to
  const flyToLocation = searchFlyTo || initialFlyTo;

  // Fetch markers
  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch("/api/pins");
        const data = await response.json();
        setMarkers(data.items);
      } catch (error) {
        console.error("Failed to fetch markers:", error);
      }
    }
    fetchMarkers();
  }, []);

  // Filter markers by category (computed, not state)
  const filteredMarkers = useMemo(() => {
    return markers.filter((marker) =>
      selectedCategories.includes(marker.category)
    );
  }, [markers, selectedCategories]);

  const handleCategoryToggle = useCallback((categoryId: CategoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);

  const handleSearch = useCallback((result: {
    lat: number;
    lng: number;
    displayName: string;
  }) => {
    setSearchFlyTo({ lat: result.lat, lng: result.lng, zoom: 13 });
  }, []);

  const handleMarkerClick = useCallback((marker: Marker) => {
    setSelectedMarker(marker);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-[#0B1014]">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-4 flex items-center justify-between pointer-events-none">
        <Link href="/" className="pointer-events-auto">
          <span className="text-2xl font-bold text-[#00E5E0]">NextNeighbor</span>
        </Link>
        <div className="flex items-center gap-4 pointer-events-auto">
          <LanguageSwitch />
          <Button variant="secondary" onClick={() => router.push("/")}>
            ← {t("hero.explore")}
          </Button>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative" id="main-content">
        <MapCanvas
          markers={filteredMarkers}
          onMarkerClick={handleMarkerClick}
          flyToLocation={flyToLocation}
        />

        {/* Search Bar Overlay */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4">
          <MapSearchBar onSearch={handleSearch} />
        </div>

        {/* Toggle Panel Button (Mobile) */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="md:hidden absolute bottom-24 right-4 z-20 p-3 bg-[#0B1014]/90 
                     backdrop-blur-md border border-[#00E5E0]/30 rounded-full 
                     text-[#00E5E0] hover:bg-[#00E5E0]/10"
          aria-label={isPanelOpen ? "Hide filters" : "Show filters"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </button>
      </div>

      {/* Side Panel */}
      <motion.aside
        initial={{ x: 300 }}
        animate={{ x: isPanelOpen ? 0 : 300 }}
        className={`absolute md:relative right-0 top-0 bottom-0 w-72 
                   bg-[#0B1014]/95 backdrop-blur-xl border-l border-[#00E5E0]/20
                   p-4 pt-24 z-30 overflow-y-auto ${
                     isPanelOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
                   }`}
      >
        <h2 className="text-lg font-semibold text-white mb-4">
          {t("map.filter.title")}
        </h2>

        <MapLegend
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
        />

        {/* Stats */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <div className="text-3xl font-bold text-[#00E5E0]">
            {filteredMarkers.length}
          </div>
          <div className="text-sm text-white/60">
            {filteredMarkers.length === 1 ? "Entry" : "Entries"} in view
          </div>
        </div>
      </motion.aside>

      {/* Marker Detail Modal */}
      <Modal
        isOpen={!!selectedMarker}
        onClose={() => setSelectedMarker(null)}
        title={selectedMarker?.title}
      >
        {selectedMarker && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-sm"
                style={{
                  backgroundColor: `${categories[selectedMarker.category].color}20`,
                  color: categories[selectedMarker.category].color,
                }}
              >
                {categories[selectedMarker.category].icon}{" "}
                {t(categories[selectedMarker.category].nameKey)}
              </span>
            </div>
            <p className="text-white/80">{selectedMarker.description}</p>
            {selectedMarker.address && (
              <p className="text-sm text-white/60">📍 {selectedMarker.address}</p>
            )}
            <p className="text-xs text-white/40">
              Created: {new Date(selectedMarker.createdAt).toLocaleDateString()}
            </p>
            <div className="pt-4">
              <Button className="w-full">{t("modal.details")}</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-72 p-4 flex justify-center gap-6 text-sm text-white/40 z-10 pointer-events-none">
        <a href="#" className="hover:text-white/60 transition-colors pointer-events-auto">
          {t("footer.imprint")}
        </a>
        <a href="#" className="hover:text-white/60 transition-colors pointer-events-auto">
          {t("footer.privacy")}
        </a>
      </footer>
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-[#0B1014]">
        <div className="animate-pulse text-[#00E5E0]">Loading...</div>
      </div>
    }>
      <MapContent />
    </Suspense>
  );
}