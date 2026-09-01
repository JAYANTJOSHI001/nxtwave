"use client";

import { useState, useEffect } from "react";

export default function FloatingDisclaimer() {
  const [isOpen, setIsOpen] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating Circular Info Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open Medical and Regulatory Disclaimer"
        className="fixed right-6 bottom-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-110 hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-500/30 cursor-pointer"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2.2"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
          />
        </svg>
      </button>

      {/* Popover / Modal Overlay */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="disclaimer-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsOpen(false);
          }}
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl text-gray-900">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 id="disclaimer-modal-title" className="text-base font-semibold text-gray-900">
                    Medical &amp; Regulatory Disclaimer
                  </h3>
                  <p className="text-xs text-gray-500">
                    openFDA Live Data Attribution
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
                aria-label="Close dialog"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 space-y-3.5 text-sm leading-relaxed text-gray-600">
              <p>
                <strong className="font-semibold text-gray-900">Data Source:</strong>{" "}
                All drug information and labeling details provided through this tool are indexed from public datasets provided by the{" "}
                <span className="font-medium text-gray-900">U.S. Food and Drug Administration (FDA)</span> via the{" "}
                <a
                  href="https://open.fda.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 underline hover:text-blue-700"
                >
                  openFDA platform
                </a>.
              </p>

              <p>
                <strong className="font-semibold text-gray-900">Not Medical Advice:</strong>{" "}
                This service is strictly for informational, educational, and research purposes. It does{" "}
                <strong className="text-gray-900">not constitute professional medical advice</strong>, clinical diagnosis, or treatment recommendations.
              </p>

              <p>
                <strong className="font-semibold text-gray-900">Always Consult a Professional:</strong>{" "}
                Always consult a qualified healthcare provider, physician, or pharmacist with any questions regarding prescription medications, dosage, active ingredients, or potential adverse reactions.
              </p>

              <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                Subject to{" "}
                <a
                  href="https://open.fda.gov/terms/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-700"
                >
                  openFDA Terms of Service
                </a>. openFDA is a beta research project not intended for clinical use.
              </p>
            </div>

            {/* Footer */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-98 cursor-pointer"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
