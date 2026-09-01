import * as cheerio from "cheerio";

export interface ParsedDosageTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

/**
 * Parses dosage_and_administration_table HTML using cheerio in a Node-safe environment.
 * Extracts clean headers and rows without executing JavaScript or using dangerouslySetInnerHTML.
 */
export function parseDosageTable(
  rawTableHtml?: string[] | string | null
): ParsedDosageTable | null {
  if (!rawTableHtml) return null;

  const html = Array.isArray(rawTableHtml) ? rawTableHtml.join("\n") : String(rawTableHtml);
  if (!html.trim()) return null;

  try {
    const $ = cheerio.load(html);
    const table = $("table").first();
    if (!table.length) return null;

    const caption = table.find("caption").text().trim() || undefined;

    let headers: string[] = [];
    const rows: string[][] = [];

    // Check <th> elements in the table
    const thElements = table.find("th");
    if (thElements.length > 0) {
      thElements.each((_, el) => {
        const text = $(el).text().replace(/\s+/g, " ").trim();
        if (text) headers.push(text);
      });
    }

    // Process table rows <tr>
    table.find("tr").each((_, tr) => {
      const rowCells: string[] = [];
      const isHeaderRow = $(tr).find("th").length > 0 && $(tr).find("td").length === 0;
      if (isHeaderRow && headers.length === 0) {
        $(tr).find("th").each((_, th) => {
          const text = $(th).text().replace(/\s+/g, " ").trim();
          if (text) headers.push(text);
        });
        return;
      }

      $(tr).find("td").each((_, td) => {
        const text = $(td).text().replace(/\s+/g, " ").trim();
        rowCells.push(text);
      });

      if (rowCells.length > 0 && rowCells.some((c) => c.length > 0)) {
        rows.push(rowCells);
      }
    });

    // If no <th> was found, and the first row could be headers
    if (headers.length === 0 && rows.length > 1) {
      headers = rows.shift() || [];
    }

    if (rows.length === 0 && headers.length === 0) {
      return null;
    }

    return {
      headers,
      rows,
      caption,
    };
  } catch {
    return null;
  }
}
