"use client";

import dynamic from "next/dynamic";
import SearchBar from "@/components/SearchBar";
import CategoryLegend from "@/components/CategoryLegend";

// Dynamic import for Earth3D to avoid SSR issues with Three.js
const Earth3D = dynamic(() => import("@/components/Earth3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="animate-pulse text-[#0F6D70]">Loading Globe...</div>
    </div>
  ),
});

export default function Hero() {
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Search functionality to be implemented
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log("Category clicked:", categoryId);
    // Category navigation to be implemented
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Background Earth */}
      <div className="absolute inset-0 opacity-30">
        <Earth3D />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center px-4 py-20 mt-16 space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
            style={{ color: "#0F6D70" }}
          >
            Connect with Your Neighbors
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover your community, find local services, and build meaningful connections with people around you.
          </p>
        </div>
        
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />
        
        {/* 3D Earth Showcase */}
        <div className="w-full max-w-xl h-80 sm:h-96">
          <Earth3D />
        </div>
        
        {/* Category Legend */}
        <CategoryLegend onCategoryClick={handleCategoryClick} />
      </div>
    </section>
  );
}
