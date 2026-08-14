"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/Image/logo2.svg"
                alt="Everest Hack Club"
                width={40}
                height={40}
                className="group-hover:scale-110 transition-transform object-contain"
              />
            </div>
            <span className="font-bold text-xl text-black">
              Everest <span className="text-red-600">Hack Club</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#about"
              className="text-gray-700 hover:text-black font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/#faq"
              className="text-gray-700 hover:text-black font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              className="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition-all"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-black"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/#about"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-black font-medium"
            >
              About
            </Link>
            <Link
              href="/#faq"
              onClick={() => setIsOpen(false)}
              className="block text-gray-700 hover:text-black font-medium"
            >
              FAQ
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full px-6 py-2 bg-black text-white rounded-full font-semibold text-center hover:bg-gray-900 transition-all"
            >
              Contact
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
