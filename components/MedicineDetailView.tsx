"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DrugLabel } from "@/types/drug";
import { formatFieldOrFallback } from "@/lib/format";
import WarningSection from "@/components/WarningSection";
import FormulationSelector from "@/components/FormulationSelector";
import DisclaimerBanner from "@/components/DisclaimerBanner";

export interface MedicineDetailViewProps {
  formulations: DrugLabel[];
}

export default function MedicineDetailView({
  formulations,
}: MedicineDetailViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeDrug = formulations[selectedIndex] || formulations[0];

  const brandName = activeDrug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";
  const genericName = formatFieldOrFallback(activeDrug.openfda?.generic_name);
  const manufacturer = formatFieldOrFallback(activeDrug.openfda?.manufacturer_name);
  const route = activeDrug.openfda?.route?.[0] || "Not specified";
  const productType = activeDrug.openfda?.product_type?.[0] || "Drug Label";
  const setId = activeDrug.set_id || activeDrug.id || "N/A";

  const activeIngredient = formatFieldOrFallback(activeDrug.active_ingredient);
  const purpose = formatFieldOrFallback(activeDrug.purpose);
  const dosage = formatFieldOrFallback(activeDrug.dosage_and_administration);
  const warnings = formatFieldOrFallback(activeDrug.warnings);
  const indications = formatFieldOrFallback(activeDrug.indications_and_usage);
  const doNotUse = activeDrug.do_not_use ? formatFieldOrFallback(activeDrug.do_not_use) : null;
  const stopUse = activeDrug.stop_use ? formatFieldOrFallback(activeDrug.stop_use) : null;
  const askDoctor =
    activeDrug.ask_doctor || activeDrug.ask_doctor_or_pharmacist
      ? formatFieldOrFallback(activeDrug.ask_doctor || activeDrug.ask_doctor_or_pharmacist)
      : null;
  const inactiveIngredients = activeDrug.inactive_ingredient
    ? formatFieldOrFallback(activeDrug.inactive_ingredient)
    : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Top Disclaimer Banner - Persistent above the fold */}
      <DisclaimerBanner />

      {/* Navigation Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/search?q=${encodeURIComponent(brandName)}`}
          className="hover:text-blue-600 dark:hover:text-blue-400"
        >
          Search
        </Link>
        <span>/</span>
        <span className="font-medium text-gray-800 dark:text-gray-200 truncate">
          {brandName}
        </span>
      </nav>

      {/* Formulation Selector (Interactive without full page reload) */}
      <FormulationSelector
        formulations={formulations}
        selectedIndex={selectedIndex}
        onSelect={setSelectedIndex}
      />

      {/* Header Hero Card */}
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <span className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {productType}
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {brandName}
            </h1>
          </div>

          {route !== "Not specified" && (
            <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              Route: {route}
            </span>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-gray-100 pt-6 text-sm dark:border-gray-800 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Generic Name
            </span>
            <p className="mt-0.5 font-semibold text-gray-800 dark:text-gray-200">
              {genericName}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Manufacturer
            </span>
            <p className="mt-0.5 font-semibold text-gray-800 dark:text-gray-200">
              {manufacturer}
            </p>
          </div>
        </div>
      </header>

      {/* Section 1: Warnings & Precautions (Prioritized at top for health safety) */}
      <WarningSection
        warnings={warnings}
        doNotUse={doNotUse}
        stopUse={stopUse}
        askDoctor={askDoctor}
      />

      {/* Section 2: Dosage & Administration */}
      <section
        aria-labelledby="dosage-heading"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2
            id="dosage-heading"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Dosage &amp; Administration
          </h2>
        </div>

        <div className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {dosage}
        </div>
      </section>

      {/* Section 3: Active Ingredients & Purpose */}
      <section
        aria-labelledby="ingredients-heading"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.942A4.5 4.5 0 0115.91 17H8.09a4.5 4.5 0 01-2.32-.658L4.2 15.4"
              />
            </svg>
          </div>
          <h2
            id="ingredients-heading"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Active Ingredients &amp; Purpose
          </h2>
        </div>

        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Active Ingredient:
            </span>{" "}
            <span className="whitespace-pre-line">{activeIngredient}</span>
          </div>

          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Purpose:
            </span>{" "}
            <span className="whitespace-pre-line">{purpose}</span>
          </div>
        </div>
      </section>

      {/* Section 4: Indications & Usage */}
      <section
        aria-labelledby="indications-heading"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
              />
            </svg>
          </div>
          <h2
            id="indications-heading"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Indications &amp; Usage
          </h2>
        </div>

        <div className="mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {indications}
        </div>
      </section>

      {/* Section 5: Inactive Ingredients (if available) */}
      {inactiveIngredients && (
        <section
          aria-labelledby="inactive-heading"
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8"
        >
          <h2
            id="inactive-heading"
            className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100"
          >
            Inactive Ingredients
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400 whitespace-pre-line">
            {inactiveIngredients}
          </p>
        </section>
      )}

      {/* Footer Meta */}
      <footer className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400 dark:border-gray-800 dark:text-gray-500">
        <p>US FDA OpenFDA Record Identifier: {setId}</p>
        <div className="mt-2">
          <Link
            href="/"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Search Another Medicine
          </Link>
        </div>
      </footer>
    </div>
  );
}
