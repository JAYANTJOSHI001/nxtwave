import Link from "next/link";
import { DrugLabel } from "@/types/drug";
import { encodeMedicineSlug } from "@/lib/slug";
import { formatFieldOrFallback } from "@/lib/format";

interface DrugCardProps {
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

function extractDosageForm(drug: DrugLabel): string | null {
  // 1. Check openfda dosage_form if available
  const rawForm = (drug.openfda as Record<string, unknown> | undefined)?.dosage_form;
  if (Array.isArray(rawForm) && rawForm.length > 0 && typeof rawForm[0] === "string") {
    const first = rawForm[0].split(",")[0].trim();
    if (first) return toTitleCase(first);
  } else if (typeof rawForm === "string" && rawForm.trim()) {
    return toTitleCase(rawForm.split(",")[0].trim());
  }

  // 2. Check openfda product_type if it specifies a form
  const productType = drug.openfda?.product_type?.[0];
  if (productType) {
    const first = productType.split(",")[0].trim();
    if (
      first &&
      !first.toLowerCase().includes("human otc") &&
      !first.toLowerCase().includes("prescription") &&
      !first.toLowerCase().includes("drug")
    ) {
      return toTitleCase(first);
    }
  }

  // 3. Scan brand name or dosage text for common dosage forms
  const textToScan = [
    ...(drug.openfda?.brand_name || []),
    ...(drug.dosage_and_administration || []),
    ...(drug.purpose || []),
  ]
    .join(" ")
    .toLowerCase();

  const commonForms = [
    "tablet",
    "capsule",
    "caplet",
    "chewable",
    "gel",
    "liquid",
    "suspension",
    "solution",
    "syrup",
    "cream",
    "ointment",
    "lotion",
    "injection",
    "drops",
    "spray",
    "patch",
    "powder",
    "lozenge",
    "suppository",
  ];

  for (const form of commonForms) {
    const regex = new RegExp(`\\b${form}s?\\b`, "i");
    if (regex.test(textToScan)) {
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

function formatPurpose(drug: DrugLabel): string {
  const raw = drug.purpose?.[0] || drug.indications_and_usage?.[0] || "";
  if (!raw) return "Not specified";
  const cleaned = raw.replace(/^purpose\s*[:\-]?\s*/i, "").replace(/\s+/g, " ").trim();
  return formatFieldOrFallback(cleaned, "Not specified");
}

function formatActiveIngredients(drug: DrugLabel): string {
  const raw = drug.active_ingredient || drug.openfda?.substance_name || drug.openfda?.generic_name;
  if (!raw) return "Not specified";
  if (Array.isArray(raw)) {
    const valid = raw
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);
    return valid.length > 0 ? valid.join(" · ") : "Not specified";
  }
  return formatFieldOrFallback(raw, "Not specified");
}

export default function DrugCard({ drug }: DrugCardProps) {
  const brandName = drug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";
  const setId =
    drug.set_id ||
    drug.id ||
    ((drug.openfda as Record<string, unknown> | undefined)?.spl_set_id as string | undefined) ||
    "unknown";

  const slug = encodeMedicineSlug(brandName, setId);
  const dosageForm = extractDosageForm(drug);
  const route = extractRoute(drug);

  const purpose = formatPurpose(drug);
  const manufacturer = formatFieldOrFallback(drug.openfda?.manufacturer_name, "Not specified");
  const activeIngredients = formatActiveIngredients(drug);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-150 hover:border-blue-300 hover:shadow-md">
      <div>
        {/* Top Row: Brand Name (Heading) + Badges */}
        <div className="flex items-center justify-between gap-3 min-w-0">
          <h2
            className="text-xl font-bold tracking-tight text-gray-950 truncate min-w-0 flex-1"
            title={brandName}
          >
            {brandName}
          </h2>

          <div className="flex items-center gap-2 shrink-0">
            {dosageForm && (
              <span
                className="inline-block max-w-[110px] truncate rounded-lg border border-red-500 bg-red-50/40 px-2.5 py-0.5 text-xs font-semibold text-red-600"
                title={dosageForm}
              >
                {dosageForm}
              </span>
            )}
            {route && (
              <span
                className="inline-block max-w-[110px] truncate rounded-lg border border-blue-500 bg-blue-50/40 px-2.5 py-0.5 text-xs font-semibold text-blue-600"
                title={route}
              >
                {route}
              </span>
            )}
          </div>
        </div>

        {/* Structured Label/Value Rows */}
        <div className="mt-6 space-y-3 text-sm">
          {/* Purpose */}
          <div className="flex items-baseline justify-between gap-4 min-w-0">
            <span className="shrink-0 text-gray-600">Purpose</span>
            <span
              className="truncate text-right font-normal text-gray-950 max-w-[62%]"
              title={purpose}
            >
              {purpose}
            </span>
          </div>

          {/* Manufacturer */}
          <div className="flex items-baseline justify-between gap-4 min-w-0">
            <span className="shrink-0 text-gray-600">Manufacturer</span>
            <span
              className="truncate text-right font-normal text-gray-950 max-w-[62%]"
              title={manufacturer}
            >
              {manufacturer}
            </span>
          </div>

          {/* Active Ingredients */}
          <div className="flex items-baseline justify-between gap-4 min-w-0">
            <span className="shrink-0 text-gray-600">Active ingredients</span>
            <span
              className="truncate text-right font-normal text-gray-950 max-w-[62%]"
              title={activeIngredients}
            >
              {activeIngredients}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="mt-6 pt-2">
        <Link
          href={`/medicine/${slug}`}
          className="flex w-full items-center justify-center rounded-full border border-blue-600 bg-white py-2.5 text-center text-sm font-semibold text-blue-600 shadow-2xs transition-all hover:bg-blue-50 hover:border-blue-700 active:scale-98"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
