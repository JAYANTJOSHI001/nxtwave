import React from "react";

export interface DisclaimerBannerProps {
  className?: string;
}

export default function DisclaimerBanner({ className = "" }: DisclaimerBannerProps) {
  return (
    <aside
      role="note"
      aria-label="Medical and Regulatory Disclaimer"
      className={`relative rounded-xl border border-amber-300/80 bg-gradient-to-r from-amber-50 via-yellow-50/80 to-amber-50 p-4 text-xs leading-relaxed text-amber-950 shadow-sm dark:border-amber-800/60 dark:from-amber-950/50 dark:via-yellow-950/30 dark:to-amber-950/40 dark:text-amber-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-200/80 text-amber-800 dark:bg-amber-900/80 dark:text-amber-300">
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p>
            <strong className="font-semibold text-amber-900 dark:text-amber-100">
              Important Medical &amp; Regulatory Disclaimer:
            </strong>{" "}
            This drug label information is sourced directly from the{" "}
            <strong className="font-semibold text-amber-900 dark:text-amber-100">
              US FDA dataset via openFDA
            </strong>
            . This service is for informational and educational purposes only and does{" "}
            <strong className="font-semibold text-amber-900 dark:text-amber-100">
              not constitute medical advice
            </strong>
            , diagnosis, or personalized treatment recommendations. Always consult a licensed{" "}
            <strong className="font-semibold text-amber-900 dark:text-amber-100">
              physician or certified pharmacist
            </strong>{" "}
            before taking, modifying, or discontinuing any medication.
          </p>
        </div>
      </div>
    </aside>
  );
}
