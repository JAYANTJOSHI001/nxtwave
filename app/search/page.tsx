import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SearchResults from "@/components/SearchResults";
import DisclaimerBanner from "@/components/DisclaimerBanner";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }> | { q?: string };
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  return {
    title: query
      ? `Search Results for "${query}" — nxtwave`
      : "Search Medicines — nxtwave",
    description: `Browse US FDA drug label results and formulations for "${query}".`,
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q?.trim() || "";

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-gray-900 sm:py-12">
      <div className="mx-auto max-w-4xl">
        {/* Top Medical Disclaimer - Always visible without scrolling */}
        <DisclaimerBanner className="mb-6" />

        {/* Top Navigation & Search Bar */}
        <div className="mb-8 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
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
