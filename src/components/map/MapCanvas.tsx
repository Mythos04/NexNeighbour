"use client";

import { useSyncExternalStore, useCallback } from "react";
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import type { Marker as MarkerType } from "@/lib/map/types";
import MapMarkers from "./MapMarkers";
import "leaflet/dist/leaflet.css";

interface MapCanvasProps {
  markers: MarkerType[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (marker: MarkerType) => void;
  flyToLocation?: { lat: number; lng: number; zoom?: number } | null;
}

// Component to handle flying to location
function FlyToHandler({
  location,
}: {
  location: { lat: number; lng: number; zoom?: number } | null;
}) {
  const map = useMap();

  if (location) {
    map.flyTo([location.lat, location.lng], location.zoom || 13, {
      duration: 2,
    });
  }

  return null;
}

// SSR-safe client detection
function useIsClient(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => true, []);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0B1014]">
      <div className="text-[#00E5E0] animate-pulse">{t("loading.map")}</div>
    </div>
  );
}

export default function MapCanvas({
  markers,
  center = [52.52, 13.405], // Berlin default
  zoom = 5,
  onMarkerClick,
  flyToLocation,
}: MapCanvasProps) {
  const { t } = useI18n();
  const isClient = useIsClient();

  if (!isClient) {
    return <LoadingFallback />;
  }

  return (
    <motion.div
      className="w-full h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-full"
        zoomControl={false}
        style={{ background: "#0B1014" }}
      >
        {/* Dark themed map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <ZoomControl position="bottomright" />

        <MapMarkers markers={markers} onMarkerClick={onMarkerClick} />

        <FlyToHandler location={flyToLocation ?? null} />
      </MapContainer>

      {/* Attribution overlay for DSGVO compliance */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-[#0B1014]/80 text-xs text-white/50 text-center">
        {t("footer.attribution")}
      </div>
    </motion.div>
  );
}
