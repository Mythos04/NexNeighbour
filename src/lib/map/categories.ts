// Category definitions with colors for markers
import type { TranslationKey } from "@/lib/i18n/context";

export type CategoryId = "sharing" | "jobs" | "swap" | "food" | "events";

export interface Category {
  id: CategoryId;
  nameKey: TranslationKey;
  color: string;
  icon: string;
}

export const categories: Record<CategoryId, Category> = {
  sharing: {
    id: "sharing",
    nameKey: "category.sharing",
    color: "#00E5E0", // Turquoise
    icon: "🔄",
  },
  jobs: {
    id: "jobs",
    nameKey: "category.jobs",
    color: "#FFD700", // Gold
    icon: "💼",
  },
  swap: {
    id: "swap",
    nameKey: "category.swap",
    color: "#FF6B6B", // Coral
    icon: "🔁",
  },
  food: {
    id: "food",
    nameKey: "category.food",
    color: "#4ECDC4", // Mint
    icon: "🍽️",
  },
  events: {
    id: "events",
    nameKey: "category.events",
    color: "#9B59B6", // Purple
    icon: "📅",
  },
};

export const categoryList = Object.values(categories);
