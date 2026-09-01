export const FALLBACK_MESSAGE =
  "Not provided by the manufacturer for this formulation.";

export const NOT_AVAILABLE_LABEL_MESSAGE =
  "Information not available in this label";

/**
 * Formats a drug field or array of strings into a readable string.
 * Returns standard fallback copy if field is missing, empty, or undefined.
 */
export function formatFieldOrFallback(
  field?: string[] | string | null,
  fallback = FALLBACK_MESSAGE
): string {
  if (!field) {
    return fallback;
  }

  if (Array.isArray(field)) {
    const validItems = field
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter((item) => item.length > 0);

    if (validItems.length === 0) {
      return fallback;
    }
    return validItems.join(", ");
  }

  if (typeof field === "string") {
    const trimmed = field.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }

  return fallback;
}

/**
 * Formats openFDA effective_time strings (e.g. "20230501" or ISO dates) into readable human dates.
 */
export function formatEffectiveDate(rawDate?: string | null): string | null {
  if (!rawDate || !rawDate.trim()) return null;
  const trimmed = rawDate.trim();

  // YYYYMMDD format
  if (/^\d{8}$/.test(trimmed)) {
    const year = parseInt(trimmed.slice(0, 4), 10);
    const month = parseInt(trimmed.slice(4, 6), 10) - 1;
    const day = parseInt(trimmed.slice(6, 8), 10);
    const date = new Date(Date.UTC(year, month, day));
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
    }
  }

  // ISO or standard date string
  const date = new Date(trimmed);
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  return trimmed;
}
