"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import GlobeLegend from "@/components/globe/GlobeLegend";
import type { Marker } from "@/lib/map/types";
import { categories } from "@/lib/map/categories";

// Dynamic import for GlobeCanvas to avoid SSR issues with Three.js
const GlobeCanvas = dynamic(() => import("@/components/globe/GlobeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-[#00E5E0]">Loading Globe...</div>
    </div>
  ),
});

export default function Hero() {
  const { t } = useI18n();
  const router = useRouter();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);

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

  const handleMarkerClick = (marker: Marker) => {
    setSelectedMarker(marker);
  };

  const handleOpenInMap = () => {
    if (selectedMarker) {
      router.push(`/map?lat=${selectedMarker.lat}&lng=${selectedMarker.lng}&zoom=14`);
    }
  };

  const handleZoomToNeighborhood = () => {
    router.push("/map");
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0B1014]">
      {/* Globe Background */}
      <div className="absolute inset-0">
        <GlobeCanvas markers={markers} onMarkerClick={handleMarkerClick} />
      </div>

      {/* Globe Legend */}
      <GlobeLegend />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-20 mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6 max-w-3xl"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white">
            {t("hero.title").split(" ").map((word, i) => (
              <span key={i}>
                {i === 3 || i === 4 ? (
                  <span className="text-[#00E5E0]">{word} </span>
                ) : (
                  <span>{word} </span>
                )}
              </span>
            ))}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto">
            {t("hero.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10"
        >
          <Button size="lg" onClick={handleZoomToNeighborhood}>
            {t("hero.cta")} →
          </Button>
        </motion.div>
      </div>

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
            <div className="pt-4">
              <Button onClick={handleOpenInMap} className="w-full">
                {t("map.openInMap")} →
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-6 text-sm text-white/40">
        <a href="#" className="hover:text-white/60 transition-colors">
          {t("footer.imprint")}
        </a>
        <a href="#" className="hover:text-white/60 transition-colors">
          {t("footer.privacy")}
        </a>
      </footer>
    </section>
  );
}
