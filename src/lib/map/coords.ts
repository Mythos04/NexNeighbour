import * as THREE from "three";

// Convert lat/lng to 3D vector for globe positioning
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 2
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

// Calculate bounds from center point and zoom level
export function calcBoundsFromCenter(
  lat: number,
  lng: number,
  zoomLevel: number = 12
): { north: number; south: number; east: number; west: number } {
  // Approximate degrees per zoom level
  const degreesPerZoom = 360 / Math.pow(2, zoomLevel);

  return {
    north: lat + degreesPerZoom / 2,
    south: lat - degreesPerZoom / 2,
    east: lng + degreesPerZoom / 2,
    west: lng - degreesPerZoom / 2,
  };
}

// Mock geocoding function - to be replaced with real API
// Maps example PLZ/cities to coordinates
interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

const mockGeocodingData: Record<string, GeocodingResult> = {
  // Germany
  "10115": { lat: 52.532, lng: 13.383, displayName: "Berlin, Germany" },
  "10117": { lat: 52.516, lng: 13.388, displayName: "Berlin Mitte, Germany" },
  "80331": { lat: 48.137, lng: 11.575, displayName: "München, Germany" },
  "20095": { lat: 53.551, lng: 9.993, displayName: "Hamburg, Germany" },
  "50667": { lat: 50.938, lng: 6.959, displayName: "Köln, Germany" },
  "60311": { lat: 50.11, lng: 8.682, displayName: "Frankfurt, Germany" },
  berlin: { lat: 52.52, lng: 13.405, displayName: "Berlin, Germany" },
  münchen: { lat: 48.137, lng: 11.576, displayName: "München, Germany" },
  munich: { lat: 48.137, lng: 11.576, displayName: "Munich, Germany" },
  hamburg: { lat: 53.551, lng: 9.993, displayName: "Hamburg, Germany" },
  köln: { lat: 50.938, lng: 6.959, displayName: "Köln, Germany" },
  cologne: { lat: 50.938, lng: 6.959, displayName: "Cologne, Germany" },
  frankfurt: { lat: 50.11, lng: 8.682, displayName: "Frankfurt, Germany" },
  // International
  london: { lat: 51.507, lng: -0.127, displayName: "London, UK" },
  paris: { lat: 48.856, lng: 2.352, displayName: "Paris, France" },
  "new york": { lat: 40.713, lng: -74.006, displayName: "New York, USA" },
  tokyo: { lat: 35.689, lng: 139.692, displayName: "Tokyo, Japan" },
};

export async function geocodeSearch(
  query: string
): Promise<GeocodingResult | null> {
  // Normalize query
  const normalizedQuery = query.toLowerCase().trim();

  // Check mock data
  const result = mockGeocodingData[normalizedQuery];
  if (result) {
    return result;
  }

  // TODO: Replace with real geocoding API (e.g., Nominatim, Mapbox, Google)
  // Example: const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);

  return null;
}

// Check if coordinates are within bounds
export function isWithinBounds(
  lat: number,
  lng: number,
  bounds: { north: number; south: number; east: number; west: number }
): boolean {
  return (
    lat <= bounds.north &&
    lat >= bounds.south &&
    lng <= bounds.east &&
    lng >= bounds.west
  );
}
