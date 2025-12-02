"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n/context";
import LanguageSwitch from "@/components/ui/LanguageSwitch";
import Button from "@/components/ui/Button";

export default function Header() {
  const { t } = useI18n();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B1014]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#00E5E0]">
              NextNeighbor
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#" 
              className="text-white/70 hover:text-[#00E5E0] transition-colors font-medium"
            >
              {t("nav.explore")}
            </Link>
            <Link 
              href="#" 
              className="text-white/70 hover:text-[#00E5E0] transition-colors font-medium"
            >
              {t("nav.about")}
            </Link>
            <Link 
              href="#" 
              className="text-white/70 hover:text-[#00E5E0] transition-colors font-medium"
            >
              {t("nav.contact")}
            </Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <LanguageSwitch />
            <Button variant="primary">
              {t("nav.getStarted")}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
