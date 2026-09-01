"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DrugLabel } from "@/types/drug";
import { formatFieldOrFallback } from "@/lib/format";
import { parseIngredients, formatIngredientSubtitle } from "@/lib/parseIngredients";
import { parseTextBullets } from "@/lib/parseTextBullets";
import AtAGlanceCard from "@/components/AtAGlanceCard";
import IngredientCard from "@/components/IngredientCard";
import DosageTable from "@/components/DosageTable";
import WarningAccordion from "@/components/WarningAccordion";
import SafetySection from "@/components/SafetySection";
import MetadataSection from "@/components/MetadataSection";
import FormulationSelector from "@/components/FormulationSelector";

export interface MedicineDetailViewProps {
  formulations: DrugLabel[];
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function extractDosageForm(drug: DrugLabel): string | null {
  const rawForm = (drug.openfda as Record<string, unknown> | undefined)?.dosage_form;
  if (Array.isArray(rawForm) && rawForm.length > 0 && typeof rawForm[0] === "string" && rawForm[0].trim()) {
    return toTitleCase(rawForm[0].split(",")[0].trim());
  }

  const productType = drug.openfda?.product_type?.[0];
  if (
    productType &&
    !productType.toLowerCase().includes("human otc") &&
    !productType.toLowerCase().includes("prescription") &&
    !productType.toLowerCase().includes("drug")
  ) {
    return toTitleCase(productType.split(",")[0].trim());
  }

  const textToScan = [
    ...(drug.openfda?.brand_name || []),
    ...(drug.dosage_and_administration || []),
    ...(drug.purpose || []),
  ].join(" ").toLowerCase();

  const commonForms = [
    "tablet", "capsule", "caplet", "chewable", "gel", "liquid",
    "suspension", "solution", "syrup", "cream", "ointment", "lotion",
    "injection", "drops", "spray", "patch", "powder", "lozenge"
  ];
  for (const form of commonForms) {
    if (new RegExp(`\\b${form}s?\\b`, "i").test(textToScan)) {
      return form.charAt(0).toUpperCase() + form.slice(1);
    }
  }

  return null;
}

function extractRoute(drug: DrugLabel): string | null {
  const rawRoute = drug.openfda?.route?.[0];
  if (!rawRoute) return null;
  const first = rawRoute.split(",")[0].trim();
  return first ? toTitleCase(first) : null;
}

export default function MedicineDetailView({
  formulations,
}: MedicineDetailViewProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const activeDrug = formulations[selectedIndex] || formulations[0];

  const brandName = activeDrug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";
  const ingredientSubtitle = formatIngredientSubtitle(activeDrug.active_ingredient);
  const dosageForm = extractDosageForm(activeDrug);
  const route = extractRoute(activeDrug);
  const productType = activeDrug.openfda?.product_type?.[0]?.trim() || null;

  // Purpose extraction for hero and uses
  const rawPurpose = activeDrug.purpose?.[0]?.trim() || null;
  const purposeCleaned = rawPurpose
    ? rawPurpose.replace(/^purpose\s*[:\-]?\s*/i, "").trim()
    : null;

  // Active ingredients parsing for cards
  const ingredientResult = parseIngredients(activeDrug.active_ingredient);

  // Uses / indications parsing
  const indicationsBullets = parseTextBullets(activeDrug.indications_and_usage);
  const hasIndications = Boolean(
    indicationsBullets.bullets.length > 0 || indicationsBullets.fallbackText.length > 0
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-16">
      {/* 1. Breadcrumb: Home / Medicines / {brand name} */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-gray-500"
      >
        <Link href="/" className="transition-colors hover:text-blue-600">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/search" className="transition-colors hover:text-blue-600">
          Medicines
        </Link>
        <span aria-hidden="true">/</span>
        <span className="truncate font-medium text-gray-900">
          {brandName}
        </span>
      </nav>

      {/* 2. Hero Identity Block */}
      <header
        id="overview"
        className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8"
      >
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-950 sm:text-4xl">
            {brandName}
          </h1>

          {ingredientSubtitle && (
            <p className="text-lg font-medium text-gray-600">
              {ingredientSubtitle}
            </p>
          )}

          {/* Badges for dosage form / route / product type */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {dosageForm && (
              <span className="rounded-lg border border-red-200 bg-red-50/60 px-2.5 py-1 text-xs font-semibold text-red-700">
                {dosageForm}
              </span>
            )}
            {route && (
              <span className="rounded-lg border border-blue-200 bg-blue-50/60 px-2.5 py-1 text-xs font-semibold text-blue-700">
                {route}
              </span>
            )}
            {productType && (
              <span className="rounded-lg border border-gray-200 bg-gray-100/80 px-2.5 py-1 text-xs font-medium text-gray-700">
                {productType}
              </span>
            )}
          </div>

          {/* Formulation Selector (inside hero directly under badges) */}
          {formulations.length > 1 && (
            <div className="pt-3">
              <FormulationSelector
                formulations={formulations}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
              />
            </div>
          )}

          {/* Purpose as a one-line summary */}
          {purposeCleaned && (
            <div className="pt-3 border-t border-gray-100 text-sm">
              <span className="font-semibold text-gray-900">Purpose: </span>
              <span className="text-gray-700">{purposeCleaned}</span>
            </div>
          )}
        </div>
      </header>

      {/* 3. Visible Source Disclaimer directly under hero, above the fold */}
      <aside
        role="note"
        aria-label="Source and Regional Disclaimer"
        className="rounded-xl border border-amber-200/90 bg-amber-50/60 p-4 text-xs leading-relaxed text-amber-950"
      >
        <div className="flex items-start gap-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="space-y-1">
            <p className="font-semibold text-amber-900">
              Source: US FDA drug label
            </p>
            <p className="text-amber-800/90">
              This label data is indexed from the United States Food and Drug Administration (FDA). Medicine availability, brand names, formulations, approved indications, and labeling may differ in India and other countries. Always verify with local regulatory labels and consult a healthcare professional.
            </p>
          </div>
        </div>
      </aside>

      {/* 4. "At a glance" Card */}
      <AtAGlanceCard drug={activeDrug} />

      {/* 5. Active Ingredients */}
      <section id="active-ingredients" aria-labelledby="active-ingredients-heading" className="space-y-4">
        <h2 id="active-ingredients-heading" className="text-xl font-bold tracking-tight text-gray-900">
          Active ingredients
        </h2>

        {ingredientResult.isParsed && ingredientResult.ingredients.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {ingredientResult.ingredients.map((ing, idx) => (
              <IngredientCard key={idx} ingredient={ing} />
            ))}
          </div>
        ) : ingredientResult.rawText ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-relaxed text-gray-800 shadow-2xs whitespace-pre-line">
            {ingredientResult.rawText}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">
            Information not available in this label
          </p>
        )}
      </section>

      {/* 6. Uses */}
      <section id="uses" aria-labelledby="uses-heading" className="space-y-3 pt-2">
        <h2 id="uses-heading" className="text-xl font-bold tracking-tight text-gray-900">
          Uses &amp; Indications
        </h2>

        {purposeCleaned && (
          <p className="font-semibold text-gray-900 text-sm sm:text-base">
            Purpose: {purposeCleaned}
          </p>
        )}

        {hasIndications ? (
          indicationsBullets.isBulleted ? (
            <div className="space-y-2 text-sm text-gray-800">
              {indicationsBullets.intro && (
                <p className="font-medium text-gray-900">
                  {indicationsBullets.intro}
                </p>
              )}
              <ul className="list-disc space-y-1.5 pl-5 text-gray-700">
                {indicationsBullets.bullets.map((bullet, idx) => (
                  <li key={idx}>{bullet}</li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
              {indicationsBullets.fallbackText}
            </p>
          )
        ) : !purposeCleaned ? (
          <p className="text-sm text-gray-500 italic">
            Information not available in this label
          </p>
        ) : null}
      </section>

      {/* 7. Dosage & Directions */}
      <section id="dosage-directions" aria-labelledby="dosage-directions-heading" className="space-y-4 pt-2">
        <h2 id="dosage-directions-heading" className="text-xl font-bold tracking-tight text-gray-900">
          Dosage &amp; directions
        </h2>

        <DosageTable
          tableHtml={activeDrug.dosage_and_administration_table}
          plainText={activeDrug.dosage_and_administration}
        />
      </section>

      {/* 8. Important Safety Information (Warning Accordion) */}
      <section id="warnings" aria-labelledby="warnings-heading" className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
            !
          </span>
          <h2 id="warnings-heading" className="text-xl font-bold tracking-tight text-gray-900">
            Important safety information
          </h2>
        </div>

        <WarningAccordion warnings={activeDrug.warnings} />
      </section>

      {/* 9. Structured Safety Sections */}
      <section id="safety-precautions" aria-labelledby="safety-precautions-heading" className="space-y-4 pt-2">
        <h2 id="safety-precautions-heading" className="text-xl font-bold tracking-tight text-gray-900">
          Safety precautions
        </h2>

        <SafetySection drug={activeDrug} />
      </section>

      {/* 10. Technical / Source Metadata (Collapsed by default) */}
      <MetadataSection drug={activeDrug} />

      {/* Back to search navigation & record reference */}
      <div className="pt-6 text-center text-xs text-gray-400">
        <p>OpenFDA Record Reference: {activeDrug.set_id || activeDrug.id || "N/A"}</p>
        <div className="mt-3">
          <Link
            href="/search"
            className="font-medium text-blue-600 hover:underline"
          >
            ← Search another medicine
          </Link>
        </div>
      </div>
    </div>
  );
}
