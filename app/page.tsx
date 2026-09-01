import SearchBar from "@/components/SearchBar";

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
        <aside
          role="note"
          aria-label="Medical Disclaimer"
          className="mb-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400"
              xmlns="http://www.w3.org/2000/svg"
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
              <strong className="font-semibold">Medical & Regulatory Disclaimer:</strong>{" "}
              This directory sources official drug labels directly from the{" "}
              <strong className="font-semibold">US FDA dataset via openFDA</strong>. It is for
              informational and educational purposes only and does not constitute medical
              advice, diagnosis, or treatment. Always consult a licensed doctor or pharmacist
              regarding medical conditions and medications.
            </p>
          </div>
        </aside>

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
