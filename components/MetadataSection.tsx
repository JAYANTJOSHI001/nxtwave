import React from "react";
import { DrugLabel } from "@/types/drug";
import { formatEffectiveDate } from "@/lib/format";

interface MetadataSectionProps {
  drug: DrugLabel;
}

export default function MetadataSection({ drug }: MetadataSectionProps) {
  // Parse inactive ingredients
  const rawInactive = drug.inactive_ingredient
    ? drug.inactive_ingredient.join(", ")
    : null;

  const inactiveList = rawInactive
    ? rawInactive
        .replace(/^inactive\s+ingredients?\s*[:\-]?\s*/i, "")
        .split(/[,;]/)
        .map((item) => item.trim())
        .filter((item) => item.length > 0)
    : [];

  // Label metadata items
  const productType = drug.openfda?.product_type?.[0] || null;
  const effectiveDate = formatEffectiveDate(drug.effective_time);
  const version = drug.version || null;
  const ndc =
    drug.openfda?.package_ndc?.[0] ||
    drug.openfda?.product_ndc?.[0] ||
    null;
  const applicationNumber = drug.openfda?.application_number?.[0] || null;
  const setId = drug.set_id || drug.id || drug.openfda?.spl_set_id?.[0] || null;

  const metadataItems: { label: string; value: string }[] = [];
  if (productType) metadataItems.push({ label: "Product Type", value: productType });
  if (effectiveDate) metadataItems.push({ label: "Label Effective Date", value: effectiveDate });
  if (version) metadataItems.push({ label: "Label Version", value: String(version) });
  if (ndc) metadataItems.push({ label: "NDC Code", value: ndc });
  if (applicationNumber) metadataItems.push({ label: "Application Number", value: applicationNumber });
  if (setId) metadataItems.push({ label: "SPL Set ID", value: setId });

  return (
    <div id="supplementary-metadata" className="space-y-4 pt-6 border-t border-gray-200">
      {/* 1. Other Ingredients (Collapsed by default) */}
      <details className="group rounded-xl border border-gray-200 bg-gray-50/60 transition-colors open:bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-gray-800 select-none">
          <span>Other ingredients (Inactive)</span>
          <svg
            className="h-4 w-4 text-gray-500 transition-transform duration-200 group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <div className="border-t border-gray-200/60 p-4 text-xs leading-relaxed text-gray-600">
          {inactiveList.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {inactiveList.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-md bg-gray-100 px-2 py-1 text-gray-700"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="italic text-gray-400">
              Information not available in this label
            </p>
          )}
        </div>
      </details>

      {/* 2. Label Information & Technical Metadata (Collapsed by default) */}
      <details className="group rounded-xl border border-gray-200 bg-gray-50/60 transition-colors open:bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-semibold text-gray-800 select-none">
          <div className="flex items-center gap-2">
            <span>Label Information &amp; Source Metadata</span>
            <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
              Technical
            </span>
          </div>
          <svg
            className="h-4 w-4 text-gray-500 transition-transform duration-200 group-open:rotate-180"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <div className="border-t border-gray-200/60 p-4 text-xs leading-relaxed">
          <p className="mb-3 text-gray-500">
            This section contains official regulatory identifiers and submission metadata indexed from openFDA structured product labeling (SPL).
          </p>

          <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2">
            {metadataItems.map((item) => (
              <div key={item.label} className="border-b border-gray-100 pb-1.5">
                <dt className="text-gray-500">{item.label}</dt>
                <dd className="font-mono text-gray-800">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </details>
    </div>
  );
}
