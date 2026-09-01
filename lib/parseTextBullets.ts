export interface ParseBulletsResult {
  intro?: string;
  bullets: string[];
  isBulleted: boolean;
  fallbackText: string;
}

// Common OTC indication keywords that often appear run-together in FDA label text
const KNOWN_SYMPTOM_TOKENS = [
  "headache",
  "toothache",
  "backache",
  "muscular aches",
  "muscle aches",
  "minor aches and pains",
  "the common cold",
  "common cold",
  "menstrual cramps",
  "premenstrual and menstrual cramps",
  "minor pain of arthritis",
  "arthritis pain",
  "sore throat",
  "sinus congestion",
  "nasal congestion",
  "fever",
  "temporarily reduces fever",
  "runny nose",
  "sneezing",
  "itchy, watery eyes",
  "itchy nose or throat",
  "cough",
];

/**
 * Attempts to parse run-together indication or stop-use text into clean bullets.
 * If the split produces fewer than 2 items or items longer than ~40 characters,
 * falls back to rendering as normal paragraph prose.
 */
export function parseTextBullets(
  rawInput?: string[] | string | null
): ParseBulletsResult {
  if (!rawInput) {
    return { bullets: [], isBulleted: false, fallbackText: "" };
  }

  const rawText = Array.isArray(rawInput) ? rawInput.join(" ") : String(rawInput);
  const trimmed = rawText.trim();
  if (!trimmed) {
    return { bullets: [], isBulleted: false, fallbackText: "" };
  }

  // 1. Check for explicit bullet delimiters (•, *, -, \n, ;, etc.)
  if (/[\u2022\u25cf\u25cb\*\n;]/.test(trimmed)) {
    const rawItems = trimmed
      .split(/[\u2022\u25cf\u25cb\n;]+/)
      .map((item) => item.replace(/^[\s\*\-\:]+|[\s\*\-\:]+$/g, "").trim())
      .filter((item) => item.length > 0);

    let intro: string | undefined;
    let items = rawItems;

    if (items.length > 0 && items[0].endsWith(":")) {
      intro = items[0];
      items = items.slice(1);
    }

    if (items.length >= 2 && items.every((item) => item.length <= 40)) {
      return {
        intro,
        bullets: items,
        isBulleted: true,
        fallbackText: trimmed,
      };
    }
  }

  // 2. Check for "due to:" or ":" pattern with comma separation
  const colonIndex = trimmed.indexOf(":");
  if (colonIndex !== -1 && colonIndex < 100) {
    const intro = trimmed.slice(0, colonIndex + 1).trim();
    const rest = trimmed.slice(colonIndex + 1).trim();

    // Try comma or semicolon split first
    const commaSplit = rest
      .split(/[,;]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (commaSplit.length >= 2 && commaSplit.every((item) => item.length <= 40)) {
      return {
        intro,
        bullets: commaSplit,
        isBulleted: true,
        fallbackText: trimmed,
      };
    }

    // Try finding known symptom sequences in run-together rest text
    const lowerRest = rest.toLowerCase();
    const matchedTokens: { token: string; index: number }[] = [];

    for (const symptom of KNOWN_SYMPTOM_TOKENS) {
      const idx = lowerRest.indexOf(symptom);
      if (idx !== -1) {
        matchedTokens.push({ token: symptom, index: idx });
      }
    }

    matchedTokens.sort((a, b) => a.index - b.index);

    // Filter overlapping tokens
    const filteredTokens: string[] = [];
    let lastIdx = -1;
    for (const match of matchedTokens) {
      if (match.index >= lastIdx) {
        // Find original casing substring
        const actualCased = rest.substr(match.index, match.token.length);
        filteredTokens.push(actualCased);
        lastIdx = match.index + match.token.length;
      }
    }

    if (
      filteredTokens.length >= 2 &&
      filteredTokens.every((item) => item.length <= 40)
    ) {
      return {
        intro,
        bullets: filteredTokens,
        isBulleted: true,
        fallbackText: trimmed,
      };
    }
  }

  // Fallback: bad split or insufficient structure -> prose paragraph
  return {
    bullets: [],
    isBulleted: false,
    fallbackText: trimmed,
  };
}
