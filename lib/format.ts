export const FALLBACK_MESSAGE =
  "Not provided by the manufacturer for this formulation.";

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
