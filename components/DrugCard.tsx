import Link from "next/link";
import { DrugLabel } from "@/types/drug";
import { encodeMedicineSlug } from "@/lib/slug";
import { formatFieldOrFallback } from "@/lib/format";

interface DrugCardProps {
  drug: DrugLabel;
}

export default function DrugCard({ drug }: DrugCardProps) {
  const brandName = drug.openfda?.brand_name?.[0]?.trim() || "Unknown Brand";
  const setId =
    drug.set_id ||
    drug.id ||
    (drug.openfda as Record<string, unknown> | undefined)?.spl_set_id as string | undefined ||
    "unknown";

  const slug = encodeMedicineSlug(brandName, setId);
  const genericName = formatFieldOrFallback(drug.openfda?.generic_name, "Not specified");
  const manufacturer = formatFieldOrFallback(drug.openfda?.manufacturer_name, "Not specified");
  const route = formatFieldOrFallback(drug.openfda?.route, "Not specified");

  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-150 hover:border-blue-500 hover:shadow-md">
      <div>
        {/* Brand Name Title */}
        <h2 className="text-lg font-bold tracking-tight text-gray-900">
          <Link
            href={`/medicine/${slug}`}
            className="transition hover:text-blue-600"
          >
            {brandName}
          </Link>
        </h2>

        {/* Structured Info Rows */}
        <div className="mt-3 space-y-1.5 text-xs">
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-gray-500">
              Generic Name:
            </span>
            <span
              className={`text-right font-medium ${
                genericName === "Not specified"
                  ? "italic text-gray-400"
                  : "text-gray-800"
              }`}
            >
              {genericName}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-gray-500">
              Manufacturer:
            </span>
            <span
              className={`text-right ${
                manufacturer === "Not specified"
                  ? "italic text-gray-400"
                  : "text-gray-700"
              }`}
            >
              {manufacturer}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <span className="font-medium text-gray-500">
              Route:
            </span>
            <span
              className={`text-right ${
                route === "Not specified"
                  ? "italic text-gray-400"
                  : "inline-block rounded bg-blue-50 px-2 py-0.5 font-medium text-blue-700"
              }`}
            >
              {route}
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer Link */}
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
        <span className="text-[11px] text-gray-400">
          ID: {setId.length > 14 ? `${setId.slice(0, 14)}...` : setId}
        </span>
        <Link
          href={`/medicine/${slug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition hover:text-blue-700"
        >
          View Details
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
