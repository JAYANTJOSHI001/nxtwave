import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200/80 bg-white px-4 py-8 text-xs text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="nxtwave"
            width={100}
            height={26}
            className="h-6 w-auto object-contain"
          />
          <span className="text-gray-400">|</span>
          <span>Drug Label &amp; Medicine Lookup</span>
        </div>
        <p>
          &copy; {new Date().getFullYear()} nxtwave. Sourced from public US FDA openFDA datasets. Not medical advice.
        </p>
      </div>
    </footer>
  );
}
