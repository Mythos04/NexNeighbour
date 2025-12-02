"use client";

import { categoryList, type CategoryId } from "@/lib/map/categories";
import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";

interface MapLegendProps {
  selectedCategories: CategoryId[];
  onCategoryToggle: (category: CategoryId) => void;
}

export default function MapLegend({
  selectedCategories,
  onCategoryToggle,
}: MapLegendProps) {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#0B1014]/90 backdrop-blur-md border border-[#00E5E0]/20 
                 rounded-xl p-4 shadow-xl"
    >
      <h3 className="text-sm font-medium text-white mb-3">
        {t("map.legend.title")}
      </h3>
      <div className="space-y-2">
        {categoryList.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onCategoryToggle(category.id)}
              className={`flex items-center gap-3 w-full p-2 rounded-lg transition-all
                         ${isSelected ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <span
                className="w-4 h-4 rounded-full shadow-lg flex-shrink-0"
                style={{
                  backgroundColor: category.color,
                  boxShadow: isSelected ? `0 0 12px ${category.color}` : "none",
                  opacity: isSelected ? 1 : 0.5,
                }}
              />
              <span
                className={`text-sm transition-opacity ${
                  isSelected ? "text-white" : "text-white/50"
                }`}
              >
                {category.icon} {t(category.nameKey)}
              </span>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
