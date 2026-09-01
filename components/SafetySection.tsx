import React from "react";
import { DrugLabel } from "@/types/drug";
import { parseTextBullets } from "@/lib/parseTextBullets";
import { NOT_AVAILABLE_LABEL_MESSAGE } from "@/lib/format";

interface SafetySectionProps {
  drug: DrugLabel;
}

export default function SafetySection({ drug }: SafetySectionProps) {
  // 1. Do Not Use
  const doNotUseRaw = drug.do_not_use ? drug.do_not_use.join(" ") : null;
  const doNotUseBullets = doNotUseRaw ? parseTextBullets(doNotUseRaw) : null;

  // 2. Ask a Doctor / Ask a Doctor or Pharmacist
  const askDoctorRaw = drug.ask_doctor ? drug.ask_doctor.join(" ").trim() : null;
  const askDoctorPharmacistRaw = drug.ask_doctor_or_pharmacist
    ? drug.ask_doctor_or_pharmacist.join(" ").trim()
    : null;

  const showBothDoctorSections =
    Boolean(askDoctorRaw && askDoctorPharmacistRaw && askDoctorRaw !== askDoctorPharmacistRaw);

  // 3. Pregnancy & Breastfeeding
  const pregnancyRaw = drug.pregnancy_or_breast_feeding
    ? drug.pregnancy_or_breast_feeding.join(" ").trim()
    : null;

  // 4. When to Stop Use
  const stopUseRaw = drug.stop_use ? drug.stop_use.join(" ").trim() : null;
  const stopUseBullets = stopUseRaw ? parseTextBullets(stopUseRaw) : null;

  return (
    <div className="space-y-6">
      {/* 1. Do Not Use */}
      <div
        id="do-not-use"
        className={`rounded-xl border p-5 transition-colors ${
          doNotUseRaw
            ? "border-red-200 bg-white dark:border-red-900/60 dark:bg-gray-900"
            : "border-gray-100 bg-gray-50/50 opacity-75 dark:border-gray-800 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              doNotUseRaw
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            ✕
          </span>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            Do Not Use
          </h3>
        </div>

        <div className="mt-3 text-sm leading-relaxed">
          {doNotUseRaw && doNotUseBullets ? (
            doNotUseBullets.isBulleted ? (
              <div className="space-y-2 text-gray-800 dark:text-gray-200">
                {doNotUseBullets.intro && (
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {doNotUseBullets.intro}
                  </p>
                )}
                <ul className="list-disc space-y-1.5 pl-5 text-gray-700 dark:text-gray-300">
                  {doNotUseBullets.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                {doNotUseRaw}
              </p>
            )
          ) : (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              {NOT_AVAILABLE_LABEL_MESSAGE}
            </p>
          )}
        </div>
      </div>

      {/* 2. Ask a Doctor / Pharmacist */}
      <div
        id="ask-doctor"
        className={`rounded-xl border p-5 transition-colors ${
          askDoctorRaw || askDoctorPharmacistRaw
            ? "border-blue-200 bg-white dark:border-blue-900/60 dark:bg-gray-900"
            : "border-gray-100 bg-gray-50/50 opacity-75 dark:border-gray-800 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              askDoctorRaw || askDoctorPharmacistRaw
                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            ?
          </span>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            Ask a Doctor Before Use
          </h3>
        </div>

        <div className="mt-3 text-sm leading-relaxed">
          {showBothDoctorSections ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ask a doctor
                </h4>
                <p className="mt-1 whitespace-pre-line text-gray-800 dark:text-gray-200">
                  {askDoctorRaw}
                </p>
              </div>
              <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Ask a doctor or pharmacist
                </h4>
                <p className="mt-1 whitespace-pre-line text-gray-800 dark:text-gray-200">
                  {askDoctorPharmacistRaw}
                </p>
              </div>
            </div>
          ) : askDoctorRaw || askDoctorPharmacistRaw ? (
            <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
              {askDoctorRaw || askDoctorPharmacistRaw}
            </p>
          ) : (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              {NOT_AVAILABLE_LABEL_MESSAGE}
            </p>
          )}
        </div>
      </div>

      {/* 3. Pregnancy & Breastfeeding */}
      <div
        id="pregnancy-breastfeeding"
        className={`rounded-xl border p-5 transition-colors ${
          pregnancyRaw
            ? "border-amber-200 bg-white dark:border-amber-900/60 dark:bg-gray-900"
            : "border-gray-100 bg-gray-50/50 opacity-75 dark:border-gray-800 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              pregnancyRaw
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            !
          </span>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            Pregnancy &amp; Breastfeeding
          </h3>
        </div>

        <div className="mt-3 text-sm leading-relaxed">
          {pregnancyRaw ? (
            <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
              {pregnancyRaw}
            </p>
          ) : (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              {NOT_AVAILABLE_LABEL_MESSAGE}
            </p>
          )}
        </div>
      </div>

      {/* 4. When to Stop Use */}
      <div
        id="stop-use"
        className={`rounded-xl border p-5 transition-colors ${
          stopUseRaw
            ? "border-rose-200 bg-white dark:border-rose-900/60 dark:bg-gray-900"
            : "border-gray-100 bg-gray-50/50 opacity-75 dark:border-gray-800 dark:bg-gray-900/30"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              stopUseRaw
                ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                : "bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            }`}
          >
            ■
          </span>
          <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
            When to Stop Use
          </h3>
        </div>

        <div className="mt-3 text-sm leading-relaxed">
          {stopUseRaw && stopUseBullets ? (
            stopUseBullets.isBulleted ? (
              <div className="space-y-2 text-gray-800 dark:text-gray-200">
                {stopUseBullets.intro && (
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {stopUseBullets.intro}
                  </p>
                )}
                <ul className="list-disc space-y-1.5 pl-5 text-gray-700 dark:text-gray-300">
                  {stopUseBullets.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="whitespace-pre-line text-gray-800 dark:text-gray-200">
                {stopUseRaw}
              </p>
            )
          ) : (
            <p className="text-xs italic text-gray-400 dark:text-gray-500">
              {NOT_AVAILABLE_LABEL_MESSAGE}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
