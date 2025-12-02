"use client";

import { useI18n } from "@/lib/i18n/context";
import { motion } from "framer-motion";

export default function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();

  const toggleLocale = () => {
    setLocale(locale === "de" ? "en" : "de");
  };

  return (
    <motion.button
      onClick={toggleLocale}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium 
                 bg-[#0B1014]/60 backdrop-blur-sm border border-[#00E5E0]/30 rounded-full
                 text-white hover:border-[#00E5E0] hover:shadow-[0_0_10px_#00E5E040] transition-all"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={t("a11y.toggleLanguage")}
    >
      <span className={locale === "de" ? "text-[#00E5E0]" : "text-white/50"}>DE</span>
      <span className="text-[#00E5E0]/40">|</span>
      <span className={locale === "en" ? "text-[#00E5E0]" : "text-white/50"}>EN</span>
    </motion.button>
  );
}
