"use client";

import { Suspense, useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchMedicines } from "@/lib/openfda";
import { formatFieldOrFallback } from "@/lib/format";
import { encodeMedicineSlug } from "@/lib/slug";
import { DrugLabel } from "@/types/drug";

export interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

function SearchBarInner({
  initialQuery = "",
  placeholder = "Search by medicine name or active ingredient",
  autoFocus = false,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams ? searchParams.get("q") || "" : "";

  const containerRef = useRef<HTMLDivElement>(null);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const [query, setQuery] = useState(initialQuery || urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Sync state if URL search query changes
  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    if (urlQuery !== query) {
      setQuery(urlQuery);
      setDebouncedQuery(urlQuery);
    }
  }

  // Debounce input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = query.trim();
      setDebouncedQuery(trimmed);
      if (trimmed.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(-1);
      } else {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // TanStack Query to fetch suggestions
  const { data, isFetching, isLoading, isError } = useQuery({
    queryKey: ["medicines", debouncedQuery],
    queryFn: () => searchMedicines(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 60 * 1000,
  });

  // Deduplicate suggestions by normalized brand name and generic name
  const suggestions = useMemo(() => {
    const rawList = data || [];
    const seen = new Set<string>();
    const unique: DrugLabel[] = [];

    for (const drug of rawList) {
      const brand = drug.openfda?.brand_name?.[0]?.trim() || "";
      if (!brand) continue;

      const generic = Array.isArray(drug.openfda?.generic_name)
        ? drug.openfda.generic_name.join(" ").trim()
        : "";

      // Normalize brand and generic names case-insensitively with unified spacing
      const normalizedBrand = brand.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const normalizedGeneric = generic.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
      const key = `${normalizedBrand}::${normalizedGeneric}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(drug);
        if (unique.length >= 5) {
          break;
        }
      }
    }

    return unique;
  }, [data]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigation helpers
  const navigateToMedicine = (drug: DrugLabel) => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    const brandName = drug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";
    const setId =
      drug.set_id ||
      drug.id ||
      ((drug.openfda as Record<string, unknown> | undefined)?.spl_set_id as string | undefined) ||
      "unknown";
    const slug = encodeMedicineSlug(brandName, setId);
    router.push(`/medicine/${slug}`);
  };

  const navigateToFullSearch = (searchTerm: string) => {
    setIsOpen(false);
    setHighlightedIndex(-1);
    const trimmed = searchTerm.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOpen && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
      navigateToMedicine(suggestions[highlightedIndex]);
    } else {
      navigateToFullSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || isError) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (suggestions.length > 0) {
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (suggestions.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
        }
        break;

      case "Enter":
        if (highlightedIndex >= 0 && suggestions[highlightedIndex]) {
          e.preventDefault();
          navigateToMedicine(suggestions[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const showDropdown = isOpen && !isError && debouncedQuery.length > 0;
  const isQueryLoading = (isFetching || isLoading) && debouncedQuery.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="group relative flex w-full items-center rounded-full border-2 border-blue-600 bg-white p-1 shadow-sm transition-all focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/15">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (debouncedQuery.length > 0) {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            autoFocus={autoFocus}
            placeholder={placeholder}
            role="combobox"
            aria-expanded={showDropdown}
            aria-autocomplete="list"
            aria-controls="search-suggestions-list"
            aria-activedescendant={
              highlightedIndex >= 0 ? `suggestion-item-${highlightedIndex}` : undefined
            }
            aria-label="Search medicine name or active ingredient"
            className="w-full rounded-full bg-transparent py-3 pl-5 pr-14 text-sm sm:py-3.5 sm:pl-6 sm:pr-16 sm:text-base text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />

          <button
            type="submit"
            aria-label="Search medicines"
            className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 disabled:opacity-50 sm:h-11 sm:w-11 cursor-pointer"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </div>
      </form>

      {/* Typeahead Suggestions Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          {isQueryLoading ? (
            <div className="flex items-center gap-2.5 px-4 py-3.5 text-sm text-gray-500">
              <svg
                className="h-4 w-4 animate-spin text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Searching medicines...</span>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="px-4 py-3.5 text-sm text-gray-500 italic">
              No matches &mdash; press Enter to search anyway
            </div>
          ) : (
            <ul
              id="search-suggestions-list"
              role="listbox"
              aria-label="Search suggestions"
              className="py-1.5"
            >
              {suggestions.map((drug, index) => {
                const brand = drug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";
                const generic = formatFieldOrFallback(
                  drug.openfda?.generic_name,
                  "Generic name not specified"
                );
                const isHighlighted = highlightedIndex === index;

                return (
                  <li
                    key={drug.id || drug.set_id || index}
                    id={`suggestion-item-${index}`}
                    role="option"
                    aria-selected={isHighlighted}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      navigateToMedicine(drug);
                    }}
                    onClick={() => navigateToMedicine(drug)}
                    className={`flex cursor-pointer items-center justify-between px-4 py-2.5 text-left transition-colors ${
                      isHighlighted
                        ? "border-l-4 border-blue-600 bg-blue-50 text-blue-900"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="truncate text-sm font-semibold text-gray-900">
                        {brand}
                      </div>
                      <div className="truncate text-xs text-gray-500">
                        {generic}
                      </div>
                    </div>
                    <svg
                      className="h-4 w-4 shrink-0 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchBar(props: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className={`w-full max-w-2xl ${props.className ?? ""}`}>
          <div className="relative flex w-full items-center rounded-full border-2 border-blue-600 bg-white p-1 shadow-sm">
            <input
              type="search"
              disabled
              placeholder={props.placeholder ?? "Search by medicine name or active ingredient"}
              className="w-full rounded-full bg-transparent py-3 pl-5 pr-14 text-sm sm:py-3.5 sm:pl-6 sm:pr-16 sm:text-base text-gray-400"
            />
            <div className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-blue-600 text-white sm:h-11 sm:w-11">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
          </div>
        </div>
      }
    >
      <SearchBarInner {...props} />
    </Suspense>
  );
}
