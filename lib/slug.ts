/**
 * Generates an SEO-friendly slug combining the brand name and the unique set_id.
 * Format: [sanitized-brand-name]--[set_id]
 */
export function encodeMedicineSlug(
  brandName?: string | null,
  setId?: string | null
): string {
  const cleanBrand = (brandName || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "medicine";

  const cleanSetId = (setId || "").trim() || "unknown";

  return `${cleanBrand}--${cleanSetId}`;
}

export const encodeSlug = encodeMedicineSlug;

/**
 * Decodes a medicine slug into its brand name slug and set_id components.
 */
export function decodeMedicineSlug(slug: string): {
  brandNameSlug: string;
  setId: string;
} {
  if (!slug) {
    return { brandNameSlug: "", setId: "" };
  }

  const decoded = decodeURIComponent(slug).trim();
  const delimiterIndex = decoded.lastIndexOf("--");

  if (delimiterIndex !== -1) {
    const brandNameSlug = decoded.slice(0, delimiterIndex);
    const setId = decoded.slice(delimiterIndex + 2);
    return { brandNameSlug, setId };
  }

  // Fallback: Check if slug contains a UUID (standard set_id format)
  const uuidRegex =
    /[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/;
  const match = decoded.match(uuidRegex);
  if (match) {
    const setId = match[0];
    const brandNameSlug = decoded
      .replace(setId, "")
      .replace(/^-+|-+$/g, "");
    return { brandNameSlug, setId };
  }

  return { brandNameSlug: decoded, setId: decoded };
}

export const decodeSlug = decodeMedicineSlug;
