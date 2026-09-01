"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2 focus:outline-none">
          <Image
            src="/logo.png"
            alt="nxtwave"
            width={130}
            height={36}
            className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-8 md:flex">
          <button
            type="button"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 cursor-pointer"
          >
            Medicines
          </button>
          <button
            type="button"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 cursor-pointer"
          >
            Health Information
          </button>
          <button
            type="button"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600 cursor-pointer"
          >
            Consult a Doctor
          </button>
        </nav>

        {/* Right Action: Sign In Button */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow active:scale-98 cursor-pointer"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-gray-200 bg-white px-4 pt-2 pb-6 shadow-lg md:hidden">
          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Medicines
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Health Information
            </button>
            <button
              type="button"
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Consult a Doctor
            </button>
            <div className="pt-2">
              <button
                type="button"
                className="w-full rounded-full bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
