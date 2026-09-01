import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import PopularSearches from "@/components/PopularSearches";
import FloatingDisclaimer from "@/components/FloatingDisclaimer";
import Image from "next/image";

export const metadata = {
  title: "nxtwave — Know your medicine, before you take it",
  description:
    "Search official US FDA drug labels for verified dosage instructions, active ingredients, critical warnings, and manufacturer information.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      {/* Top Navigation Bar */}
      <Navbar />

      {/* Hero Section with Dotted Grid Background fading to 0 opacity at center */}
      <section className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:py-24 md:py-32">
        {/* Background Dot Layer with Center-to-Edge Radial Mask */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-dot-pattern"
        />

        {/* Hero Content Container */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center">
          {/* Main Hero Heading in Poppins with #D80008 medicine highlight */}
          <h1 className="font-poppins text-3xl font-semibold tracking-tight text-gray-950 sm:text-5xl md:text-[54px] md:leading-[1.2]">
            Know your <span style={{ color: "#D80008" }} className="font-semibold">medicine</span>,
            <br />
            before you take it.
          </h1>

          {/* Subheading */}
          <p className="mt-4 text-sm text-gray-600 sm:mt-5 sm:text-base md:text-lg">
            Search medicines by brand name or active ingredient.
          </p>

          {/* Pill-shaped Search Bar */}
          <div className="mt-8 flex w-full max-w-2xl justify-center sm:mt-10">
            <SearchBar autoFocus placeholder="Search by medicine name or active ingredient" />
          </div>

          {/* Popular Searches Chips */}
          <PopularSearches />

          {/* Visible One-Line Disclaimer */}
          <div className="mt-10 flex items-center justify-center gap-1.5 rounded-full bg-slate-50/90 px-4 py-1.5 text-xs text-gray-500 ring-1 ring-slate-200/70 shadow-2xs">
            <svg
              className="h-3.5 w-3.5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <span>This tool uses public FDA data and is not medical advice</span>
          </div>
        </div>
      </section>

      {/* Section 1: What you'll find */}
      <section className="border-t border-gray-100 bg-gray-50/50 px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10">
              Verified Information
            </span>
            <h2 className="mt-3 font-poppins text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              What you&apos;ll find
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
              Direct, transparent breakdown of official US FDA drug labels to help you make informed decisions.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: Active ingredients */}
            <div className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="mt-5 font-poppins text-lg font-semibold text-gray-900">
                Active ingredients
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-blue-600">
                What&apos;s inside?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                See the active ingredients and strength listed on the drug label.
              </p>
            </div>

            {/* Card 2: Uses & purpose */}
            <div className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-5 font-poppins text-lg font-semibold text-gray-900">
                Uses &amp; purpose
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-emerald-600">
                What is it used for?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Understand the labeled purpose and intended uses.
              </p>
            </div>

            {/* Card 3: Warnings */}
            <div className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-amber-300 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-5 font-poppins text-lg font-semibold text-gray-900">
                Warnings
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-amber-600">
                What should I know?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                Review important warnings, precautions and contraindications.
              </p>
            </div>

            {/* Card 4: Dosage */}
            <div className="group flex flex-col rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-purple-300 hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-5 font-poppins text-lg font-semibold text-gray-900">
                Dosage
              </h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-purple-600">
                How is it taken?
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                View dosage and administration information when available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How it works */}
      <section className="bg-white px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-700/10">
              Simple 3-Step Process
            </span>
            <h2 className="mt-3 font-poppins text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
              From medicine name to useful information
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-sm sm:text-base text-gray-600">
              Search &rarr; Choose a medicine &rarr; Review the label
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 relative">
            {/* Step 1: Search */}
            <div className="relative flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-gray-50/50 p-8 shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-poppins text-xl font-bold text-white shadow-md shadow-blue-500/20">
                1
              </div>
              <h3 className="mt-6 font-poppins text-xl font-semibold text-gray-900">
                Search
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Type the medicine brand name or active generic ingredient into the search bar.
              </p>
            </div>

            {/* Step 2: Choose a medicine */}
            <div className="relative flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-gray-50/50 p-8 shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-poppins text-xl font-bold text-white shadow-md shadow-blue-500/20">
                2
              </div>
              <h3 className="mt-6 font-poppins text-xl font-semibold text-gray-900">
                Choose a medicine
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Select the exact brand, dosage strength, or packaging variant from ranked matches.
              </p>
            </div>

            {/* Step 3: Review the label */}
            <div className="relative flex flex-col items-center text-center rounded-2xl border border-gray-100 bg-gray-50/50 p-8 shadow-2xs">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 font-poppins text-xl font-bold text-white shadow-md shadow-blue-500/20">
                3
              </div>
              <h3 className="mt-6 font-poppins text-xl font-semibold text-gray-900">
                Review the label
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Explore structured ingredients, safety warnings, intended indications, and dosage advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Built for how people search for medicines in India */}
      <section className="border-t border-gray-100 bg-slate-50/60 px-4 py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-blue-100 bg-gradient-to-b from-white via-blue-50/30 to-white p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-semibold text-blue-800">
                <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                Designed for Indian Healthcare Search
              </div>

              <h2 className="mt-4 font-poppins text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
                Built for how people search for medicines in India
              </h2>

              <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600">
                Medicine names can vary across brands, strengths and formulations. When multiple matches are found, we help you identify the right result before showing its information.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {/* Item 1: Brand names */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <h3 className="mt-4 font-poppins text-base font-semibold text-gray-900">
                  Brand names
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Search by familiar medicine names.
                </p>
              </div>

              {/* Item 2: Multiple strengths */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <h3 className="mt-4 font-poppins text-base font-semibold text-gray-900">
                  Multiple strengths
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Distinguish 200 mg, 400 mg, etc.
                </p>
              </div>

              {/* Item 3: Different formulations */}
              <div className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-2xs transition-all hover:border-blue-300 hover:shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="mt-4 font-poppins text-base font-semibold text-gray-900">
                  Different formulations
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  Tablet, capsule, suspension and more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200/80 bg-white px-4 py-8 text-xs text-gray-500">
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

      {/* Floating Info Button & Modal Popover */}
      <FloatingDisclaimer />
    </div>
  );
}
