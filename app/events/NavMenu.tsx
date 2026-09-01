"use client";

import Link from "next/link";
import { useState } from "react";

export default function NavMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex w-full pr-6 sm:pr-16 pointer-events-auto items-center justify-between">
      <Link href="/">
        <img
          src="/Image/flag-orpheus-top.svg"
          alt="Back to home"
          width={100}
          height={80}
          className="h-20 w-auto flex-none hover:opacity-80 transition-opacity"
        />
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/posters"
          className="text-base text-[#473b47] font-bold hover:text-[#5167dd] transition-colors"
        >
          posters
        </Link>
        <Link
          href="/"
          className="text-base text-[#473b47] font-bold hover:text-[#5167dd] transition-colors"
        >
          ← home
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg text-[#473b47] hover:bg-[#f0f0f0] transition-all"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-y-4 border-[#473b47] shadow-lg z-50 pointer-events-auto">
          <div className="flex flex-col p-4 gap-2">
            <Link
              href="/posters"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-[#473b47] font-bold rounded-lg hover:bg-[#f0f0f0] transition-colors"
            >
              posters
            </Link>
            <Link
              href="/"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-[#473b47] font-bold rounded-lg hover:bg-[#f0f0f0] transition-colors"
            >
              ← home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
