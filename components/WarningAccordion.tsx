import React from "react";
import { parseWarnings } from "@/lib/parseWarnings";

interface WarningAccordionProps {
  warnings?: string[] | string | null;
}

export default function WarningAccordion({ warnings }: WarningAccordionProps) {
  const sections = parseWarnings(warnings);

  if (sections.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic">
        Information not available in this label
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((section, index) => (
        <details
          key={index}
          open={index === 0}
          className="group rounded-xl border border-red-200/80 bg-red-50/30 transition-colors open:bg-white open:shadow-xs"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between p-4 font-semibold text-red-950 select-none">
            <span className="flex items-center gap-2.5">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                !
              </span>
              <span>{section.heading}</span>
            </span>
            <svg
              className="h-4 w-4 text-red-600 transition-transform duration-200 group-open:rotate-180"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </summary>
          <div className="border-t border-red-100 px-4 pb-4 pt-3 text-sm leading-relaxed text-gray-800 whitespace-pre-line">
            {section.body}
          </div>
        </details>
      ))}
    </div>
  );
}
