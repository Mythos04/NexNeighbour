"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-[#0F6D70]">
              NexNeighbour
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="#" 
              className="text-gray-700 hover:text-[#0F6D70] transition-colors font-medium"
            >
              Explore
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-[#0F6D70] transition-colors font-medium"
            >
              About
            </Link>
            <Link 
              href="#" 
              className="text-gray-700 hover:text-[#0F6D70] transition-colors font-medium"
            >
              Contact
            </Link>
          </nav>
          
          <button className="px-5 py-2 rounded-full font-medium text-white bg-[#0F6D70] hover:bg-[#0a5355] transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </header>
  );
}
