// Category definitions with colors for markers
import type { TranslationKey } from "@/lib/i18n/context";

export type CategoryId = "sharing" | "jobs" | "swap" | "food" | "events";

export interface Category {
  id: CategoryId;
  nameKey: TranslationKey;
  color: string;
  icon: string;
}

// Unique marker colors - no duplicates
export const categories: Record<CategoryId, Category> = {
  sharing: {
    id: "sharing",
    nameKey: "category.sharing",
    color: "#00E5E0", // Türkis (brand primary)
    icon: "🔄",
  },
  jobs: {
    id: "jobs",
    nameKey: "category.jobs",
    color: "#4BC9FF", // Hell-Digital-Blau
    icon: "💼",
  },
  swap: {
    id: "swap",
    nameKey: "category.swap",
    color: "#FF9F43", // Warm-Orange
    icon: "🔁",
  },
  food: {
    id: "food",
    nameKey: "category.food",
    color: "#FF5A8E", // Pink-Rot
    icon: "🍽️",
  },
  events: {
    id: "events",
    nameKey: "category.events",
    color: "#B15CFF", // Violett
    icon: "📅",
  },
};

export const categoryList = Object.values(categories);
