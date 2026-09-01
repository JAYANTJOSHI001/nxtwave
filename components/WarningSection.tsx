import React from "react";

export interface WarningSectionProps {
  warnings?: string | null;
  doNotUse?: string | null;
  stopUse?: string | null;
  askDoctor?: string | null;
  className?: string;
}

export default function WarningSection({
  warnings,
  doNotUse,
  stopUse,
  askDoctor,
  className = "",
}: WarningSectionProps) {
  const displayWarnings =
    warnings?.trim() || "Not provided by the manufacturer for this formulation.";

  return (
    <section
      aria-labelledby="warnings-section-heading"
      className={`relative overflow-hidden rounded-2xl border-2 border-red-300/80 bg-gradient-to-br from-red-50 via-rose-50/70 to-amber-50/40 p-6 shadow-md transition-shadow hover:shadow-lg dark:border-red-800/80 dark:from-red-950/40 dark:via-rose-950/30 dark:to-amber-950/20 sm:p-8 ${className}`}
    >
      {/* Visual Accent Indicator */}
      <div className="absolute left-0 top-0 h-full w-2 bg-red-600 dark:bg-red-500" />

      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm ring-4 ring-red-100 dark:bg-red-600 dark:ring-red-900/60">
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-700 dark:text-red-400">
            Critical Safety Information
          </span>
          <h2
            id="warnings-section-heading"
            className="text-xl font-extrabold tracking-tight text-red-950 dark:text-red-100 sm:text-2xl"
          >
            Warnings &amp; Precautions
          </h2>
        </div>
      </div>

      {/* Main Warnings Body */}
      <div className="mt-5 space-y-5 text-sm leading-relaxed text-red-950/95 dark:text-red-100/90">
        <div className="rounded-xl border border-red-200/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-red-900/60 dark:bg-gray-900/80">
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {displayWarnings}
          </p>
        </div>

        {/* Highlighted Warning Sub-cards */}
        <div className="grid grid-cols-1 gap-4">
          {doNotUse && (
            <div className="rounded-xl border-l-4 border-l-red-600 border border-red-200 bg-white p-4 shadow-sm dark:border-red-900/60 dark:border-l-red-500 dark:bg-gray-900/90">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-950 dark:text-red-400">
                  ✕
                </span>
                <h3 className="font-bold text-red-900 dark:text-red-200">
                  Do Not Use
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-red-950 dark:text-red-200 whitespace-pre-line">
                {doNotUse}
              </p>
            </div>
          )}

          {stopUse && (
            <div className="rounded-xl border-l-4 border-l-amber-600 border border-amber-200 bg-white p-4 shadow-sm dark:border-amber-900/60 dark:border-l-amber-500 dark:bg-gray-900/90">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                  !
                </span>
                <h3 className="font-bold text-amber-900 dark:text-amber-200">
                  Stop Use and Ask a Doctor If
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-950 dark:text-amber-200 whitespace-pre-line">
                {stopUse}
              </p>
            </div>
          )}

          {askDoctor && (
            <div className="rounded-xl border-l-4 border-l-blue-600 border border-blue-200 bg-white p-4 shadow-sm dark:border-blue-900/60 dark:border-l-blue-500 dark:bg-gray-900/90">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-400">
                  ?
                </span>
                <h3 className="font-bold text-blue-900 dark:text-blue-200">
                  Ask a Doctor or Pharmacist Before Use
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-gray-800 dark:text-gray-200 whitespace-pre-line">
                {askDoctor}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
