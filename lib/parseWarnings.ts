export interface ParsedWarningSection {
  heading: string;
  body: string;
}

// Known FDA OTC warning sub-heading phrases in priority / regex match form
const KNOWN_WARNING_HEADERS: { pattern: RegExp; title: string }[] = [
  { pattern: /\ballergy\s+alert\b[:\-]?/i, title: "Allergy alert" },
  { pattern: /\bstomach\s+bleeding\s+warning\b[:\-]?/i, title: "Stomach bleeding warning" },
  { pattern: /\bliver\s+(?:damage\s+)?warning\b[:\-]?/i, title: "Liver warning" },
  { pattern: /\bheart\s+attack\s+and\s+stroke\s+warning\b[:\-]?/i, title: "Heart attack and stroke warning" },
  { pattern: /\bsore\s+throat\s+warning\b[:\-]?/i, title: "Sore throat warning" },
  { pattern: /\breye(?:'s)?\s+syndrome(?:\s+warning)?\b[:\-]?/i, title: "Reye's syndrome" },
  { pattern: /\bcaffeine\s+warning\b[:\-]?/i, title: "Caffeine warning" },
  { pattern: /\balcohol\s+warning\b[:\-]?/i, title: "Alcohol warning" },
  { pattern: /\bnsaid\s+warning\b[:\-]?/i, title: "NSAID warning" },
  { pattern: /\basthma\s+(?:alert|warning)\b[:\-]?/i, title: "Asthma alert" },
  { pattern: /\bskin\s+reaction\s+warning\b[:\-]?/i, title: "Skin reaction warning" },
  { pattern: /\bmedication\s+overuse\s+headache\s+warning\b[:\-]?/i, title: "Medication overuse headache warning" },
  { pattern: /\bflammable\b[:\-]?/i, title: "Flammability warning" },
  { pattern: /\boverdose\s+warning\b[:\-]?/i, title: "Overdose warning" },
  { pattern: /\bchoking\s+warning\b[:\-]?/i, title: "Choking warning" },
];

// Prepositions or connecting words immediately preceding a match indicating mid-sentence usage
const INVALID_PRECEDING_WORDS = new RegExp(
  /(?:sign|signs|symptom|symptoms|risk|risks|case|cases|history|cause|causes|causing|called|develop|developing|of|for|from|with|to|in|by|like|as|such\s+as|and|or|including|a|an|the)\s+$/i
);

/**
 * Checks whether a match position is a genuine FDA section header
 * vs. a casual mid-sentence mention (e.g. "...sign of Reye's syndrome, a rare illness").
 */
function isValidHeaderMatch(
  text: string,
  startIndex: number,
  matchLength: number
): boolean {
  const precedingText = text.slice(0, startIndex);
  const matchedText = text.slice(startIndex, startIndex + matchLength);
  const trailingText = text.slice(startIndex + matchLength);

  // If match ends with a colon or dash, it is almost certainly a header (e.g. "Reye's syndrome:")
  const hasDelimiter = /[:\-]$/.test(matchedText.trim()) || /^[\s]*[:\-]/.test(trailingText);
  if (hasDelimiter) {
    // Even with delimiter, verify it wasn't preceded by "sign of"
    if (INVALID_PRECEDING_WORDS.test(precedingText)) {
      return false;
    }
    return true;
  }

  // If preceded by prepositional or connecting words, reject
  if (INVALID_PRECEDING_WORDS.test(precedingText)) {
    return false;
  }

  // If followed by comma and lowercase (e.g. ", a rare illness"), reject
  if (/^\s*,\s*[a-z]/.test(trailingText)) {
    return false;
  }

  // Must be preceded by start of text, newline, punctuation, or "Warnings" label
  const isStart = startIndex === 0;
  const isAfterBreak = /[\n\r\.!\?;:]\s*$/i.test(precedingText) || /^warnings?[:\s]*$/i.test(precedingText.trim());

  return isStart || isAfterBreak;
}

/**
 * Heuristically splits raw FDA OTC warnings text into structured heading/body sections.
 * If zero known headers are found, falls back to a single block titled "Warnings" with the full text.
 */
export function parseWarnings(
  rawInput?: string[] | string | null
): ParsedWarningSection[] {
  if (!rawInput) {
    return [];
  }

  const rawText = Array.isArray(rawInput) ? rawInput.join("\n\n") : String(rawInput);
  let trimmed = rawText.trim();
  if (!trimmed) {
    return [];
  }

  // Find all match occurrences of known headers
  interface HeaderMatch {
    title: string;
    startIndex: number;
    matchLength: number;
  }

  const matches: HeaderMatch[] = [];

  for (const item of KNOWN_WARNING_HEADERS) {
    const globalRegex = new RegExp(item.pattern.source, "gi");
    let match: RegExpExecArray | null;
    while ((match = globalRegex.exec(trimmed)) !== null) {
      if (isValidHeaderMatch(trimmed, match.index, match[0].length)) {
        matches.push({
          title: item.title,
          startIndex: match.index,
          matchLength: match[0].length,
        });
      }
    }
  }

  // Fallback: If zero headers matched, return a single block titled "Warnings"
  if (matches.length === 0) {
    return [
      {
        heading: "Warnings",
        body: trimmed,
      },
    ];
  }

  // Sort matches by appearance in text
  matches.sort((a, b) => a.startIndex - b.startIndex);

  // Remove overlapping matches and deduplicate consecutive identical titles
  const uniqueMatches: HeaderMatch[] = [];
  let lastEnd = -1;
  for (const m of matches) {
    if (m.startIndex >= lastEnd) {
      uniqueMatches.push(m);
      lastEnd = m.startIndex + m.matchLength;
    }
  }

  const sections: ParsedWarningSection[] = [];

  // If there's content before the first header (e.g. general warnings intro)
  const firstMatch = uniqueMatches[0];
  if (firstMatch.startIndex > 0) {
    const preamble = trimmed.slice(0, firstMatch.startIndex).trim();
    // Only emit "General Warnings" if the preamble contains genuine content
    // and is not just the single word "Warnings" or "Warning:"
    if (
      preamble.length > 0 &&
      !/^warnings?[:\s]*$/i.test(preamble) &&
      preamble.length > 15
    ) {
      sections.push({
        heading: "General Warnings",
        body: preamble,
      });
    }
  }

  for (let i = 0; i < uniqueMatches.length; i++) {
    const current = uniqueMatches[i];
    const next = uniqueMatches[i + 1];
    const bodyStart = current.startIndex + current.matchLength;
    const bodyEnd = next ? next.startIndex : trimmed.length;

    let bodyText = trimmed.slice(bodyStart, bodyEnd).trim();
    // Strip leading colon/hyphen if left over
    bodyText = bodyText.replace(/^[:\-]\s*/, "").trim();

    if (bodyText.length > 0) {
      sections.push({
        heading: current.title,
        body: bodyText,
      });
    }
  }

  if (sections.length === 0) {
    return [
      {
        heading: "Warnings",
        body: trimmed,
      },
    ];
  }

  return sections;
}
