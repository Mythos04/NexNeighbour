"use client";

import { useSyncExternalStore, useCallback } from "react";
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { categories } from "@/lib/map/categories";
import type { Marker as MarkerType } from "@/lib/map/types";
import { useI18n } from "@/lib/i18n/context";
import Button from "@/components/ui/Button";

interface MapMarkersProps {
  markers: MarkerType[];
  onMarkerClick?: (marker: MarkerType) => void;
}

// Create custom marker icon with glow effect
function createMarkerIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 12px ${color}, 0 0 24px ${color}40;
        animation: pulse 2s ease-in-out infinite;
      "></div>
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      </style>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

// Create cluster icon
function createClusterIcon(cluster: { getChildCount: () => number }): L.DivIcon {
  const count = cluster.getChildCount();
  return L.divIcon({
    className: "custom-cluster",
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #00E5E0, #00CCC8);
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #0B1014;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 0 16px #00E5E080;
      ">${count}</div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

// SSR-safe mounted check
function useIsMounted(): boolean {
  const subscribe = useCallback(() => () => {}, []);
  const getSnapshot = useCallback(() => true, []);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default function MapMarkers({
  markers,
  onMarkerClick,
}: MapMarkersProps) {
  const { t } = useI18n();
  const mounted = useIsMounted();

  if (!mounted) return null;

  return (
    <MarkerClusterGroup
      chunkedLoading
      iconCreateFunction={createClusterIcon}
      maxClusterRadius={50}
      spiderfyOnMaxZoom
      showCoverageOnHover={false}
    >
      {markers.map((marker) => {
        const category = categories[marker.category];
        const icon = createMarkerIcon(category.color);

        return (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={icon}
            eventHandlers={{
              click: () => onMarkerClick?.(marker),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-center gap-2 mb-2">
                  <span>{category.icon}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${category.color}20`, color: category.color }}
                  >
                    {t(category.nameKey)}
                  </span>
                </div>
                <h3 className="font-semibold text-[#0B1014] mb-1">
                  {marker.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {marker.description}
                </p>
                {marker.address && (
                  <p className="text-xs text-gray-500 mb-3">📍 {marker.address}</p>
                )}
                <Button
                  size="sm"
                  onClick={() => onMarkerClick?.(marker)}
                  className="w-full"
                >
                  {t("map.openDetails")}
                </Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  );
}
