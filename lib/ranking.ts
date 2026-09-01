import Fuse from "fuse.js";
import { DrugLabel } from "../types/drug";

/**
 * Calculates a normalized exact keyword score (0.0 to 1.0) based on whole-phrase
 * and whole-token matches against brand_name (highest priority), generic_name,
 * and substance_name.
 */
export function calculateExactScore(drug: DrugLabel, rawQuery: string): number {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return 0;

  const qTokens = q.split(/\s+/).filter(Boolean);
  let rawScore = 0;

  const brandNames = (drug.openfda?.brand_name || []).map((s) => s.toLowerCase());
  const genericNames = (drug.openfda?.generic_name || []).map((s) => s.toLowerCase());
  const substanceNames = (drug.openfda?.substance_name || []).map((s) => s.toLowerCase());

  // 1. Brand Name Matching (Highest Priority)
  for (const b of brandNames) {
    if (b === q) {
      rawScore = Math.max(rawScore, 100);
    } else if (b.startsWith(q)) {
      rawScore = Math.max(rawScore, 85);
    } else {
      const matchesAllTokens =
        qTokens.length > 0 &&
        qTokens.every((token) => new RegExp(`\\b${escapeRegExp(token)}\\b`, "i").test(b));
      if (matchesAllTokens) {
        rawScore = Math.max(rawScore, 75);
      } else if (b.includes(q)) {
        rawScore = Math.max(rawScore, 65);
      }
    }
  }

  // 2. Generic Name Matching (Secondary Priority)
  for (const g of genericNames) {
    if (g === q) {
      rawScore = Math.max(rawScore, 60);
    } else if (g.startsWith(q)) {
      rawScore = Math.max(rawScore, 50);
    } else {
      const matchesAllTokens =
        qTokens.length > 0 &&
        qTokens.every((token) => new RegExp(`\\b${escapeRegExp(token)}\\b`, "i").test(g));
      if (matchesAllTokens) {
        rawScore = Math.max(rawScore, 45);
      } else if (g.includes(q)) {
        rawScore = Math.max(rawScore, 40);
      }
    }
  }

  // 3. Substance Name Matching (Tertiary Priority)
  for (const s of substanceNames) {
    if (s === q) {
      rawScore = Math.max(rawScore, 55);
    } else if (s.startsWith(q)) {
      rawScore = Math.max(rawScore, 45);
    } else {
      const matchesAllTokens =
        qTokens.length > 0 &&
        qTokens.every((token) => new RegExp(`\\b${escapeRegExp(token)}\\b`, "i").test(s));
      if (matchesAllTokens) {
        rawScore = Math.max(rawScore, 40);
      } else if (s.includes(q)) {
        rawScore = Math.max(rawScore, 35);
      }
    }
  }

  return rawScore / 100;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface RankedDrugResult {
  drug: DrugLabel;
  exactScore: number;
  fuzzySimilarity: number;
  hybridScore: number;
}

/**
 * Re-ranks candidate drugs using a hybrid formula:
 * hybridScore = (exactScore * 0.7) + (fuzzySimilarity * 0.3)
 *
 * Where fuzzySimilarity is inverted from Fuse.js score: (1 - fuseScore).
 */
export function rankMedicinesHybrid(
  drugs: DrugLabel[],
  query: string
): DrugLabel[] {
  if (!drugs.length || !query.trim()) {
    return drugs;
  }

  const trimmedQuery = query.trim();

  // Fuse.js configuration
  const fuse = new Fuse(drugs, {
    includeScore: true,
    threshold: 0.5,
    distance: 100,
    minMatchCharLength: 2,
    keys: [
      { name: "openfda.brand_name", weight: 0.6 },
      { name: "openfda.generic_name", weight: 0.3 },
      { name: "openfda.substance_name", weight: 0.1 },
    ],
  });

  const fuseResults = fuse.search(trimmedQuery);
  const similarityMap = new Map<DrugLabel, number>();

  for (const match of fuseResults) {
    // Fuse score: 0 = perfect match, 1 = mismatch.
    // Convert to similarity where 1 is perfect match and 0 is mismatch.
    const rawScore = match.score ?? 1;
    const similarity = Math.max(0, Math.min(1, 1 - rawScore));
    similarityMap.set(match.item, similarity);
  }

  const EXACT_WEIGHT = 0.7;
  const FUZZY_WEIGHT = 0.3;

  const scored: RankedDrugResult[] = drugs.map((drug) => {
    const exactScore = calculateExactScore(drug, trimmedQuery);
    const fuzzySimilarity = similarityMap.get(drug) ?? 0;
    const hybridScore = exactScore * EXACT_WEIGHT + fuzzySimilarity * FUZZY_WEIGHT;

    return {
      drug,
      exactScore,
      fuzzySimilarity,
      hybridScore,
    };
  });

  // Sort descending by hybridScore
  scored.sort((a, b) => b.hybridScore - a.hybridScore);

  return scored.map((item) => item.drug);
}
