import type { CategoryId } from "./categories";

export interface Marker {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  lat: number;
  lng: number;
  address?: string;
  countryCode?: string;
  createdAt: string;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PinsResponse {
  items: Marker[];
}
