"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { JOIN_URL } from "../lib/site";

export default function HomeNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex w-full pr-6 sm:pr-16 pointer-events-auto items-center justify-between">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/Image/flag-orpheus-top.svg"
          alt=""
          role="presentation"
          width={100}
          height={80}
          className="h-20 w-auto flex-none"
          priority
        />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6">
        <Link
          href="/events"
          className="text-base text-[#473b47] font-bold hover:text-[#5167dd] transition-colors"
        >
          events
        </Link>
        <Link
          href="/posters"
          className="text-base text-[#473b47] font-bold hover:text-[#5167dd] transition-colors"
        >
          posters
        </Link>
        <Link
          href="/contact"
          className="text-base text-[#473b47] font-bold hover:text-[#5167dd] transition-colors"
        >
          contact
        </Link>
        <p className="text-base text-[#473b47]">
          join us:{" "}
          <a
            href={JOIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center rounded-xl leading-none font-bold text-[#5167dd] underline-offset-2 outline-offset-4 outline-[#5167dd] transition hover:text-[#5e6fe5] hover:underline focus:text-[#5e6fe5] focus:outline-2"
          >
            <span>get started</span>
            <span className="ml-1">→</span>
          </a>
        </p>
      </div>

      {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-y-4 border-[#473b47] shadow-lg z-50">
          <div className="flex flex-col p-4 gap-2">
            <Link
              href="/events"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-[#473b47] font-bold rounded-lg hover:bg-[#f0f0f0] transition-colors"
            >
              events
            </Link>
            <Link
              href="/posters"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-[#473b47] font-bold rounded-lg hover:bg-[#f0f0f0] transition-colors"
            >
              posters
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-[#473b47] font-bold rounded-lg hover:bg-[#f0f0f0] transition-colors"
            >
              contact
            </Link>
            <a
              href={JOIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="px-4 py-3 text-[#5167dd] font-bold rounded-lg hover:bg-[#f0f0f0] transition-colors flex items-center gap-1"
            >
              get started →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
