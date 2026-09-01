import React from "react";
import { DrugLabel } from "@/types/drug";
import { parseIngredients } from "@/lib/parseIngredients";

interface AtAGlanceCardProps {
  drug: DrugLabel;
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AtAGlanceCard({ drug }: AtAGlanceCardProps) {
  const { ingredients, isParsed } = parseIngredients(drug.active_ingredient);

  // 1. Active ingredients
  let activeIngredientsStr: string | null = null;
  let strengthsStr: string | null = null;

  if (isParsed && ingredients.length > 0) {
    activeIngredientsStr = ingredients.map((i) => i.name).filter(Boolean).join(" + ");
    const strengths = ingredients.map((i) => i.strength).filter(Boolean);
    if (strengths.length === ingredients.length) {
      strengthsStr = strengths.join(" + ");
    }
  } else if (drug.openfda?.generic_name && drug.openfda.generic_name.length > 0) {
    activeIngredientsStr = drug.openfda.generic_name.join(" + ").trim() || null;
  } else if (drug.openfda?.substance_name && drug.openfda.substance_name.length > 0) {
    activeIngredientsStr = drug.openfda.substance_name.join(" + ").trim() || null;
  }

  // 2. Dosage form
  let dosageForm: string | null = null;
  const rawForm = (drug.openfda as Record<string, unknown> | undefined)?.dosage_form;
  if (Array.isArray(rawForm) && rawForm.length > 0 && typeof rawForm[0] === "string" && rawForm[0].trim()) {
    dosageForm = toTitleCase(rawForm[0].split(",")[0].trim());
  } else {
    // Scan text or product_type
    const productType = drug.openfda?.product_type?.[0];
    if (
      productType &&
      !productType.toLowerCase().includes("human otc") &&
      !productType.toLowerCase().includes("prescription") &&
      !productType.toLowerCase().includes("drug")
    ) {
      dosageForm = toTitleCase(productType.split(",")[0].trim());
    } else {
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
          dosageForm = form.charAt(0).toUpperCase() + form.slice(1);
          break;
        }
      }
    }
  }

  // 3. Route
  let route: string | null = null;
  if (drug.openfda?.route && drug.openfda.route.length > 0 && drug.openfda.route[0].trim()) {
    route = toTitleCase(drug.openfda.route[0].split(",")[0].trim());
  }

  // 4. Product type
  let productType: string | null = null;
  if (drug.openfda?.product_type && drug.openfda.product_type.length > 0 && drug.openfda.product_type[0].trim()) {
    productType = drug.openfda.product_type[0].trim();
  }

  // 5. Manufacturer
  let manufacturer: string | null = null;
  if (drug.openfda?.manufacturer_name && drug.openfda.manufacturer_name.length > 0 && drug.openfda.manufacturer_name[0].trim()) {
    manufacturer = drug.openfda.manufacturer_name.join(", ").trim();
  }

  // Build rows - strictly omit any row that is null/empty
  const rows: { label: string; value: string }[] = [];
  if (activeIngredientsStr) rows.push({ label: "Active ingredients", value: activeIngredientsStr });
  if (strengthsStr) rows.push({ label: "Strength", value: strengthsStr });
  if (dosageForm) rows.push({ label: "Dosage form", value: dosageForm });
  if (route) rows.push({ label: "Route", value: route });
  if (productType) rows.push({ label: "Product type", value: productType });
  if (manufacturer) rows.push({ label: "Manufacturer", value: manufacturer });

  if (rows.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="at-a-glance-heading" className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </div>
        <h2 id="at-a-glance-heading" className="text-base font-bold tracking-tight text-gray-900">
          At a glance
        </h2>
      </div>

      <dl className="mt-4 divide-y divide-gray-100 text-sm">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-1 py-2.5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-xs font-medium text-gray-500 sm:text-sm">
              {row.label}
            </dt>
            <dd className="mt-0.5 font-medium text-gray-900 sm:col-span-2 sm:mt-0">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
