import { NextResponse } from "next/server";
import { mockMarkers } from "@/lib/map/mockData";
import type { CategoryId } from "@/lib/map/categories";
import type { PinsResponse } from "@/lib/map/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const north = searchParams.get("north");
  const south = searchParams.get("south");
  const east = searchParams.get("east");
  const west = searchParams.get("west");
  const categories = searchParams.getAll("category") as CategoryId[];
  const search = searchParams.get("search")?.toLowerCase();

  let filteredMarkers = [...mockMarkers];

  // Filter by bounds if provided
  if (north && south && east && west) {
    const bounds = {
      north: parseFloat(north),
      south: parseFloat(south),
      east: parseFloat(east),
      west: parseFloat(west),
    };

    filteredMarkers = filteredMarkers.filter(
      (marker) =>
        marker.lat <= bounds.north &&
        marker.lat >= bounds.south &&
        marker.lng <= bounds.east &&
        marker.lng >= bounds.west
    );
  }

  // Filter by categories if provided
  if (categories.length > 0) {
    filteredMarkers = filteredMarkers.filter((marker) =>
      categories.includes(marker.category)
    );
  }

  // Filter by search term if provided
  if (search) {
    filteredMarkers = filteredMarkers.filter(
      (marker) =>
        marker.title.toLowerCase().includes(search) ||
        marker.description.toLowerCase().includes(search) ||
        marker.address?.toLowerCase().includes(search)
    );
  }

  const response: PinsResponse = {
    items: filteredMarkers,
  };

  return NextResponse.json(response);
}
