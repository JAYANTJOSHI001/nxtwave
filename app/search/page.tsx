import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }> | { q?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  return {
    title: query
      ? `Search Results for "${query}" — Medicine Directory`
      : "Search Medicines — Medicine Directory",
    description: `Browse US FDA drug label results and formulations for "${query}".`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Top Medical Disclaimer - Always visible without scrolling */}
        <aside
          role="note"
          aria-label="Medical Disclaimer"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs leading-relaxed text-amber-900 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <div className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <p>
              <strong className="font-semibold">Disclaimer:</strong> Live US FDA data via
              openFDA. For informational purposes only — not medical advice. Consult a doctor
              or pharmacist.
            </p>
          </div>
        </aside>

        {/* Top Navigation & Search Bar */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Home
            </Link>
          </div>

          <div className="w-full">
            <SearchBar initialQuery={query} />
          </div>
        </div>

        {/* Search Results Area with TanStack Query Lifecycle */}
        <SearchResults query={query} />
      </div>
    </main>
  );
}
