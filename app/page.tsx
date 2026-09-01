import SearchBar from "@/components/SearchBar";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export const metadata = {
  title: "Medicine Directory — US FDA Drug Label Information",
  description:
    "Instant lookup for US FDA approved medicine labels, active ingredients, dosage, and warnings via openFDA.",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-gray-100 sm:py-16">
      <div className="w-full max-w-3xl">
        {/* Top Disclaimer Banner - Visible without scrolling */}
        <DisclaimerBanner className="mb-8" />

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center">
          <span className="mb-3 inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
            openFDA Live Label Directory
          </span>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Find Prescription & OTC Medicine Labels
          </h1>

          <p className="mt-4 max-w-xl text-base text-gray-600 dark:text-gray-400 sm:text-lg">
            Search official US FDA drug labels for verified dosage instructions, active
            ingredients, critical warnings, and manufacturer information.
          </p>

          {/* Centered Search Bar */}
          <div className="mt-8 flex w-full justify-center">
            <SearchBar autoFocus />
          </div>

          {/* Search Examples & Quick Tags */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Popular searches:
            </span>
            {["Advil", "Tylenol", "Amoxicillin", "Lipitor", "Metformin"].map((example) => (
              <span
                key={example}
                className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-gray-600 shadow-sm transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
              >
                {example}
              </span>
            ))}
          </div>
        </section>

        {/* Key Features Overview */}
        <section className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              Active Ingredients
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Understand the key substances, generic names, and intended pharmacological purpose.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              Warnings & Precautions
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quick access to crucial safety alerts, contraindications, and when to consult a doctor.
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-2 text-base font-semibold text-gray-900 dark:text-gray-100">
              Dosage & Administration
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Review manufacturer-provided administration guidelines and route specifications.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
