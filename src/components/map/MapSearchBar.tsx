"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/context";
import { searchSchema } from "@/lib/validation/searchSchema";
import { geocodeSearch } from "@/lib/map/coords";

interface MapSearchBarProps {
  onSearch: (result: { lat: number; lng: number; displayName: string }) => void;
}

export default function MapSearchBar({ onSearch }: MapSearchBarProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate input
    const result = searchSchema.safeParse({ query });
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setIsLoading(true);

    try {
      const geocodeResult = await geocodeSearch(query);
      if (geocodeResult) {
        onSearch(geocodeResult);
        setQuery("");
      } else {
        setError(t("map.search.noResults"));
      }
    } catch {
      setError(t("error.generic"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError(null);
          }}
          placeholder={t("map.search.placeholder")}
          className="w-full px-5 py-3 pr-12 text-white bg-[#0B1014]/80 backdrop-blur-md 
                     border border-[#00E5E0]/30 rounded-full
                     focus:border-[#00E5E0] focus:outline-none focus:ring-2 focus:ring-[#00E5E0]/20
                     placeholder:text-white/40 transition-all"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 
                     bg-[#00E5E0] rounded-full hover:bg-[#00CCC8] transition-colors
                     disabled:opacity-50"
          aria-label={t("map.search.button")}
        >
          {isLoading ? (
            <svg className="w-5 h-5 text-[#0B1014] animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-[#0B1014]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-400 text-center"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  );
}
