export interface ParsedIngredient {
  name: string;
  strength?: string;
  classification?: string;
}

export interface ParseIngredientsResult {
  ingredients: ParsedIngredient[];
  rawText: string;
  isParsed: boolean;
}

/**
 * Normalizes classification strings like "(NSAID*)" or "(NSAID)*" or "NSAID*" to "NSAID".
 */
function cleanClassification(rawClass?: string): string | undefined {
  if (!rawClass) return undefined;
  const cleaned = rawClass
    .replace(/^[\(\[\s]+|[\)\]\s*]+$/g, "")
    .replace(/\*+/g, "")
    .trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

/**
 * Cleans ingredient names by removing leading active ingredient prefixes,
 * trailing punctuation, and dangling asterisks.
 */
function cleanIngredientName(rawName: string): string {
  return rawName
    .replace(/^(?:active\s+ingredients?|purpose|in\s+each\s+[^:\n]+|each\s+[^:\n]+)\s*[:\-]?\s*/i, "")
    .replace(/^[\s,;:\-]+|[\s,;:\-]+$/g, "")
    .replace(/\*+/g, "")
    .trim();
}

/**
 * Attempts to cleanly parse FDA OTC active_ingredient field into structured ingredients.
 * If parsing fails or is unconfident, returns isParsed: false and the cleaned raw text.
 */
export function parseIngredients(
  rawInput?: string[] | string | null
): ParseIngredientsResult {
  if (!rawInput) {
    return { ingredients: [], rawText: "", isParsed: false };
  }

  const rawText = Array.isArray(rawInput) ? rawInput.join(" ") : String(rawInput);
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { ingredients: [], rawText: "", isParsed: false };
  }

  // Strip generic label header if present, e.g. "Active ingredient (in each tablet)"
  let cleanText = trimmed.replace(
    /^active\s+ingredients?\s*(?:\([^)]*\))?\s*[:\-]?\s*/i,
    ""
  );

  // Strip trailing purpose or footnote lines if they start after the ingredient declarations
  // e.g. "... *nonsteroidal anti-inflammatory drug" or "Purpose Pain reliever"
  const footnoteMatch = cleanText.match(/\s*\*+(?:nonsteroidal\s+anti-inflammatory\s+drug|[a-z\s]+)$/i);
  let footnoteClassification: string | undefined;
  if (footnoteMatch) {
    if (/nonsteroidal\s+anti-inflammatory\s+drug/i.test(footnoteMatch[0])) {
      footnoteClassification = "NSAID";
    }
    cleanText = cleanText.slice(0, footnoteMatch.index).trim();
  }

  // If there's an explicit "Purpose ..." block at the end, strip it
  cleanText = cleanText.replace(/\s+Purpose\s*[:\-]?\s*.*$/i, "").trim();

  // Pattern to match: Name + Strength (e.g. 250 mg, 125 mg, 5%, 10 mcg, 0.5 mL) + optional (Classification)
  const ingredientRegex =
    /([A-Za-z0-9\s,\-\/\.\'\(\)]+?)\s+(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|mL|%|IU|units|USP\s+units))\b(?:\s*\(([^)]+)\))?/gi;

  const matches = Array.from(cleanText.matchAll(ingredientRegex));

  if (!matches || matches.length === 0) {
    // If no regex match found, check if it's a simple single substance name without strength
    const simpleName = cleanIngredientName(cleanText);
    if (simpleName && simpleName.length < 60 && !simpleName.includes("\n")) {
      return {
        ingredients: [{ name: simpleName }],
        rawText: trimmed,
        isParsed: true,
      };
    }
    return {
      ingredients: [],
      rawText: trimmed,
      isParsed: false,
    };
  }

  const results: ParsedIngredient[] = [];

  for (const match of matches) {
    const rawName = match[1];
    const strength = match[2]?.trim();
    const rawClass = match[3];

    const name = cleanIngredientName(rawName);

    // Guard against garbage or overlong captures
    if (!name || name.length > 80 || name.toLowerCase().startsWith("warning")) {
      continue;
    }

    let classification = cleanClassification(rawClass);
    if (!classification && footnoteClassification && /ibuprofen|aspirin|naproxen/i.test(name)) {
      classification = footnoteClassification;
    }

    results.push({
      name,
      strength,
      classification: classification || undefined,
    });
  }

  if (results.length === 0) {
    return {
      ingredients: [],
      rawText: trimmed,
      isParsed: false,
    };
  }

  return {
    ingredients: results,
    rawText: trimmed,
    isParsed: true,
  };
}

/**
 * Returns a clean subtitle string like "Ibuprofen 125 mg + Acetaminophen 250 mg"
 * or returns null if not cleanly parseable.
 */
export function formatIngredientSubtitle(
  rawInput?: string[] | string | null
): string | null {
  const { ingredients, isParsed } = parseIngredients(rawInput);
  if (!isParsed || ingredients.length === 0) {
    return null;
  }

  const parts = ingredients
    .map((item) => {
      if (item.name && item.strength) {
        return `${item.name} ${item.strength}`;
      }
      return item.name;
    })
    .filter(Boolean);

  return parts.length > 0 ? parts.join(" + ") : null;
}
