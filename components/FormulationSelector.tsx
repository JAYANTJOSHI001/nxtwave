"use client";

import React from "react";
import { DrugLabel } from "@/types/drug";

export interface FormulationSelectorProps {
  formulations: DrugLabel[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function getFormulationSummary(drug: DrugLabel, index: number): {
  title: string;
  badge: string;
  detail: string;
} {
  const brand = drug.openfda?.brand_name?.[0]?.trim();
  const generic = drug.openfda?.generic_name?.[0]?.trim();
  const route = drug.openfda?.route?.[0]?.trim();
  const productType = drug.openfda?.product_type?.[0]?.trim();
  const activeIng = drug.active_ingredient?.[0]?.trim();

  const title = brand || generic || `Formulation ${index + 1}`;
  const badge = route || productType || `Option ${index + 1}`;
  
  let detail = "";
  if (activeIng) {
    detail = activeIng.length > 50 ? activeIng.slice(0, 47) + "..." : activeIng;
  } else if (productType && route) {
    detail = productType;
  } else {
    detail = drug.id || drug.set_id || "FDA Record";
  }

  return { title, badge, detail };
}

export default function FormulationSelector({
  formulations,
  selectedIndex,
  onSelect,
  className = "",
}: FormulationSelectorProps) {
  if (!formulations || formulations.length <= 1) {
    return null;
  }

  return (
    <nav
      aria-label="Drug Formulations Selector"
      className={`rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 shadow-sm sm:p-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
            {formulations.length}
          </span>
          <h2 className="text-sm font-bold text-gray-900">
            Available Formulations &amp; Strengths
          </h2>
        </div>
        <span className="text-xs text-blue-800 font-medium">
          Select to switch views without reloading
        </span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {formulations.map((formulation, index) => {
          const isSelected = index === selectedIndex;
          const { title, badge, detail } = getFormulationSummary(formulation, index);

          return (
            <button
              key={formulation.id || formulation.set_id || `formulation-${index}`}
              type="button"
              onClick={() => onSelect(index)}
              aria-pressed={isSelected}
              className={`group relative flex flex-col items-start rounded-xl p-3 text-left transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${
                isSelected
                  ? "border-2 border-blue-600 bg-white shadow-md"
                  : "border border-gray-200 bg-white/70 hover:border-blue-300 hover:bg-white"
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span
                  className={`inline-block truncate text-xs font-bold ${
                    isSelected
                      ? "text-blue-700"
                      : "text-gray-800 group-hover:text-blue-600"
                  }`}
                >
                  {title}
                </span>

                <span
                  className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    isSelected
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {badge}
                </span>
              </div>

              <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                {detail}
              </p>

              {isSelected && (
                <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-blue-600">
                  <svg
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Active Formulation
                </div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
