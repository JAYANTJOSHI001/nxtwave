import React from "react";
import { parseDosageTable } from "@/lib/parseDosageTable";
import { formatFieldOrFallback } from "@/lib/format";

interface DosageTableProps {
  tableHtml?: string[] | string | null;
  plainText?: string[] | string | null;
}

export default function DosageTable({
  tableHtml,
  plainText,
}: DosageTableProps) {
  const parsedTable = parseDosageTable(tableHtml);
  const rawPlainText = formatFieldOrFallback(plainText, "");

  const hasTable = Boolean(parsedTable && (parsedTable.rows.length > 0 || parsedTable.headers.length > 0));
  const hasPlainText = Boolean(rawPlainText && rawPlainText.trim().length > 0);

  return (
    <div className="space-y-4">
      {hasTable && parsedTable ? (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            {parsedTable.caption && (
              <caption className="bg-gray-50 px-4 py-2 text-left text-xs font-semibold text-gray-700">
                {parsedTable.caption}
              </caption>
            )}
            {parsedTable.headers.length > 0 && (
              <thead className="bg-gray-50">
                <tr>
                  {parsedTable.headers.map((header, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-gray-200 bg-white">
              {parsedTable.rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                >
                  {row.map((cell, cellIdx) => (
                    <td
                      key={cellIdx}
                      className="px-4 py-3 text-sm text-gray-700"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : hasPlainText ? (
        <div className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
          {rawPlainText}
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Dosage information not available in this label.
        </p>
      )}

      {/* Fixed Dosage Disclaimer */}
      <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 border border-gray-200/80">
        <span className="font-medium text-gray-700">Directions note: </span>
        This information is reproduced from the available drug label. Always follow the directions on your specific product and consult a doctor or pharmacist when needed.
      </div>
    </div>
  );
}
