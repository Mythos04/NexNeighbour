"use client";

import { categoryList } from "@/lib/map/categories";
import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";

export default function GlobeLegend() {
  const { t } = useI18n();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="absolute bottom-4 left-4 p-4 bg-[#0B1014]/85 backdrop-blur-md 
                 border border-[#00E5E0]/20 rounded-xl shadow-[0_0_30px_#00E5E010]"
    >
      <h3 className="text-sm font-semibold text-white mb-3">
        {t("map.legend.title")}
      </h3>
      <div className="space-y-2">
        {categoryList.map((category) => (
          <div key={category.id} className="flex items-center gap-3 text-sm">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{
                backgroundColor: category.color,
                boxShadow: `0 0 10px ${category.color}80`,
              }}
            />
            <span className="text-white/80">
              {category.icon} {t(category.nameKey)}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
