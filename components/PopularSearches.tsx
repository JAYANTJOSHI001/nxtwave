"use client";

import { useRouter } from "next/navigation";

const POPULAR_SEARCHES = ["Advil", "Ibuprofen", "Aspirin", "Paracetamol"];

export default function PopularSearches() {
  const router = useRouter();

  const handleSearch = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-gray-600">
      <span className="font-normal text-gray-700">
        Popular searches :
      </span>
      <div className="flex flex-wrap items-center gap-2">
        {POPULAR_SEARCHES.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => handleSearch(term)}
            className="rounded-md border border-gray-200 bg-gray-100/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-2xs transition-all hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 active:scale-95 cursor-pointer"
          >
            {term}
          </button>
        ))}
      </div>
    </div>
  );
}
