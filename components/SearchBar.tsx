"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { searchMedicines } from "@/lib/openfda";

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

function SearchBarInner({
  initialQuery = "",
  placeholder = "Search medicine by brand name (e.g. Advil, Tylenol, Lipitor)...",
  autoFocus = false,
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams ? searchParams.get("q") || "" : "";

  const [query, setQuery] = useState(initialQuery || urlQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const lastNavigatedQueryRef = useRef(initialQuery || urlQuery);

  // Sync state if URL search query changes
  useEffect(() => {
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      setDebouncedQuery(urlQuery);
      lastNavigatedQueryRef.current = urlQuery;
    }
  }, [urlQuery]);

  // Debounce input by 400ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  // TanStack Query to fetch / prefetch medicines
  const { isFetching, isLoading } = useQuery({
    queryKey: ["medicines", debouncedQuery],
    queryFn: () => searchMedicines(debouncedQuery),
    enabled: debouncedQuery.length > 0,
    staleTime: 60 * 1000,
  });

  // Navigate after debounce if query changed and is non-empty
  useEffect(() => {
    const trimmed = debouncedQuery.trim();
    if (trimmed && trimmed !== lastNavigatedQueryRef.current) {
      lastNavigatedQueryRef.current = trimmed;
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }, [debouncedQuery, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed && trimmed !== lastNavigatedQueryRef.current) {
      lastNavigatedQueryRef.current = trimmed;
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const showSkeleton = (isFetching || isLoading) && debouncedQuery.length > 0;

  return (
    <div className={`w-full max-w-2xl ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus={autoFocus}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-28 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          />

          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300 dark:disabled:bg-gray-700"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading Skeleton Indicator (not a spinner) */}
      {showSkeleton && (
        <div
          role="status"
          aria-label="Searching medicines"
          className="mt-3 w-full rounded-lg border border-gray-200 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex animate-pulse items-center space-x-3">
            <div className="h-4 w-4 rounded-full bg-blue-200 dark:bg-blue-900" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 w-1/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-2.5 w-3/4 rounded bg-gray-100 dark:bg-gray-800" />
            </div>
          </div>
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
          <div className="relative flex items-center">
            <input
              type="search"
              disabled
              placeholder={props.placeholder ?? "Search medicine by brand name..."}
              className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-28 text-base text-gray-400 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
        </div>
      }
    >
      <SearchBarInner {...props} />
    </Suspense>
  );
}
