"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { searchMedicines, TimeoutError, OpenFdaNetworkError } from "@/lib/openfda";
import DrugCard from "./DrugCard";

interface SearchResultsProps {
  query: string;
}

export default function SearchResults({ query }: SearchResultsProps) {
  const trimmedQuery = query.trim();

  const {
    data: results,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["medicines", trimmedQuery],
    queryFn: () => searchMedicines(trimmedQuery),
    enabled: Boolean(trimmedQuery),
    retry: false,
    staleTime: 60 * 1000,
  });

  // STATE 1: Empty Query
  if (!trimmedQuery) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
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
        <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Enter a Medicine Name
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Type a brand name in the search bar above (e.g. Advil, Tylenol, Amoxicillin).
        </p>
      </div>
    );
  }

  // STATE 2: Loading Skeleton (Not a spinner)
  if (isLoading || (isFetching && !results)) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading search results">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="h-5 w-3/5 rounded bg-gray-200 dark:bg-gray-800" />
              <div className="mt-4 space-y-2.5">
                <div className="h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-4/5 rounded bg-gray-100 dark:bg-gray-800" />
                <div className="h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STATE 3: TanStack Query Error State (with Retry refetch button)
  if (isError) {
    const isTimeout =
      error instanceof TimeoutError ||
      (error as { name?: string })?.name === "TimeoutError" ||
      (error as { statusCode?: number })?.statusCode === 408;

    const isNetwork =
      error instanceof OpenFdaNetworkError ||
      (error as { name?: string })?.name === "OpenFdaNetworkError";

    const errorHeading = isTimeout
      ? "Request Timed Out"
      : isNetwork
      ? "Network Connection Error"
      : "openFDA Service Error";

    const errorDescription = isTimeout
      ? "The openFDA service took too long to respond (timed out after 8 seconds). Please check your connection and try again."
      : isNetwork
      ? "Unable to connect to the openFDA API. Please verify your internet connection and try again."
      : error instanceof Error
      ? error.message
      : "An unexpected error occurred while communicating with openFDA.";

    const borderColor = isTimeout
      ? "border-orange-200 dark:border-orange-900/50"
      : "border-red-200 dark:border-red-900/50";

    const bgColor = isTimeout
      ? "bg-orange-50 text-orange-950 dark:bg-orange-950/30 dark:text-orange-200"
      : "bg-red-50 text-red-950 dark:bg-red-950/30 dark:text-red-200";

    const iconBg = isTimeout
      ? "bg-orange-100 text-orange-600 dark:bg-orange-900/60 dark:text-orange-400"
      : "bg-red-100 text-red-600 dark:bg-red-900/60 dark:text-red-400";

    const buttonColor = isTimeout
      ? "bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
      : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600";

    return (
      <div
        className={`rounded-2xl border p-8 text-center shadow-sm ${borderColor} ${bgColor}`}
      >
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2 className="mt-4 text-lg font-semibold">{errorHeading}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed">
          {errorDescription}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition ${buttonColor}`}
          >
            Retry Search
          </button>
        </div>
      </div>
    );
  }

  // STATE 4: Zero Results Found (Distinct Empty State)
  if (!results || results.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          <svg
            className="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            />
          </svg>
        </div>

        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          No matching label found for &ldquo;{trimmedQuery}&rdquo;
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600 dark:text-gray-400">
          We couldn&apos;t find an official US FDA label under this brand name.
        </p>

        {/* Helpful Search Tip Box */}
        <div className="mx-auto mt-6 max-w-lg rounded-xl border border-blue-100 bg-blue-50/70 p-4 text-left dark:border-blue-900/40 dark:bg-blue-950/30">
          <div className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 18v-5.25m0 0a2.25 2.25 0 10-2.25-2.25 2.25 2.25 0 002.25 2.25zM12 6v.75m0 0a.75.75 0 100-1.5.75.75 0 000 1.5z"
              />
            </svg>
            <div className="text-xs text-blue-900 dark:text-blue-200">
              <p className="font-semibold">Search Tip: Try searching by generic drug name</p>
              <p className="mt-1 leading-relaxed text-blue-800/90 dark:text-blue-300/90">
                Many manufacturers register formulations primarily by their active generic
                ingredient (e.g. <strong>Ibuprofen</strong> instead of <strong>Advil</strong>, or{" "}
                <strong>Acetaminophen</strong> instead of <strong>Tylenol</strong>).
              </p>
            </div>
          </div>
        </div>

        {/* Suggestion Links */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Try searching:
          </span>
          {[
            { name: "Ibuprofen", q: "Ibuprofen" },
            { name: "Acetaminophen", q: "Acetaminophen" },
            { name: "Amoxicillin", q: "Amoxicillin" },
            { name: "Metformin", q: "Metformin" },
          ].map((item) => (
            <Link
              key={item.q}
              href={`/search?q=${encodeURIComponent(item.q)}`}
              className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // STATE 5: Success Results (Disambiguation View)
  return (
    <div>
      <div className="mb-6 border-b border-gray-200 pb-4 dark:border-gray-800">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Results for &ldquo;{trimmedQuery}&rdquo;
          </h1>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {results.length} formulation{results.length === 1 ? "" : "s"} found
          </span>
        </div>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Multiple records may exist for different formulations, strengths, or
          manufacturers of this brand. Select a specific label below to review its details.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {results.map((drug, index) => {
          const uniqueKey =
            drug.set_id ||
            drug.id ||
            `${drug.openfda?.brand_name?.[0]}-${index}`;
          return <DrugCard key={uniqueKey} drug={drug} />;
        })}
      </div>
    </div>
  );
}
