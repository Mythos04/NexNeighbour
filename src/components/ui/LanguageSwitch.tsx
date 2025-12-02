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
                 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full
                 text-white hover:bg-white/20 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={t("a11y.toggleLanguage")}
    >
      <span className={locale === "de" ? "opacity-100" : "opacity-50"}>DE</span>
      <span className="text-white/40">|</span>
      <span className={locale === "en" ? "opacity-100" : "opacity-50"}>EN</span>
    </motion.button>
  );
}
