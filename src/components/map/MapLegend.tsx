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
                 rounded-xl p-4 shadow-[0_0_30px_#00E5E010]"
    >
      <h3 className="text-sm font-semibold text-white mb-3">
        {t("map.legend.title")}
      </h3>
      <div className="space-y-2">
        {categoryList.map((category) => {
          const isSelected = selectedCategories.includes(category.id);
          return (
            <button
              key={category.id}
              onClick={() => onCategoryToggle(category.id)}
              className={`flex items-center gap-3 w-full p-2.5 rounded-lg transition-all
                         ${isSelected ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <span
                className="w-4 h-4 rounded-full flex-shrink-0 transition-all"
                style={{
                  backgroundColor: category.color,
                  boxShadow: isSelected ? `0 0 12px ${category.color}` : `0 0 6px ${category.color}40`,
                  opacity: isSelected ? 1 : 0.6,
                }}
              />
              <span
                className={`text-sm transition-all ${
                  isSelected ? "text-white font-medium" : "text-white/60"
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
