import { DrugLabel, OpenFdaResponse } from "../types/drug";
import { rankMedicinesHybrid } from "./ranking";
import {
  decodeMedicineSlug,
  encodeMedicineSlug,
  decodeSlug,
  encodeSlug,
} from "./slug";

export { decodeMedicineSlug, encodeMedicineSlug, decodeSlug, encodeSlug };

export class OpenFdaError extends Error {
  public statusCode?: number;
  public code?: string;

  constructor(message: string, statusCode?: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "OpenFdaError";
    Object.setPrototypeOf(this, OpenFdaError.prototype);
  }
}

export class TimeoutError extends OpenFdaError {
  constructor(message = "Request to openFDA timed out after 8 seconds") {
    super(message, 408, "TIMEOUT");
    this.name = "TimeoutError";
    Object.setPrototypeOf(this, TimeoutError.prototype);
  }
}

export { TimeoutError as OpenFdaTimeoutError };

export class OpenFdaNotFoundError extends OpenFdaError {
  constructor(message = "No matching medicines found") {
    super(message, 404, "NOT_FOUND");
    this.name = "OpenFdaNotFoundError";
    Object.setPrototypeOf(this, OpenFdaNotFoundError.prototype);
  }
}

export class OpenFdaNetworkError extends OpenFdaError {
  public originalError?: unknown;

  constructor(
    message = "Network error while connecting to openFDA",
    originalError?: unknown
  ) {
    super(message);
    this.originalError = originalError;
    this.name = "OpenFdaNetworkError";
    Object.setPrototypeOf(this, OpenFdaNetworkError.prototype);
  }
}

export class OpenFdaApiError extends OpenFdaError {
  constructor(message: string, statusCode: number, code?: string) {
    super(message, statusCode, code);
    this.name = "OpenFdaApiError";
    Object.setPrototypeOf(this, OpenFdaApiError.prototype);
  }
}

const OPENFDA_BASE_URL =
  process.env.OPENFDA_BASE_URL || "https://api.fda.gov/drug/label.json";

const REQUEST_TIMEOUT_MS = 8000;

async function fetchOpenFda(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error: unknown) {
    if (
      (error instanceof Error && error.name === "AbortError") ||
      controller.signal.aborted
    ) {
      throw new TimeoutError("Request to openFDA timed out after 8 seconds");
    }
    throw new OpenFdaNetworkError(
      error instanceof Error ? error.message : "Failed to fetch from openFDA",
      error
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Escapes Lucene special characters (: " ( ) * ~ \ + - ! [ ] { } ^ ? /)
 * and strips literal boolean operators (AND, OR, NOT) before the query is interpolated.
 */
export function sanitizeLuceneQuery(input: string): string {
  if (!input) return "";
  // 1. Replace Lucene special characters with spaces
  let sanitized = input.replace(/[:"()*~\\+\-![\]{}^?\/]/g, " ");
  // 2. Remove standalone Lucene boolean keywords (AND, OR, NOT)
  sanitized = sanitized.replace(/\b(AND|OR|NOT)\b/gi, " ");
  // 3. Normalize multiple whitespace
  return sanitized.replace(/\s+/g, " ").trim();
}

/**
 * Builds a compound Lucene OR query spanning brand_name, generic_name,
 * substance_name, significant first tokens, and trailing prefix wildcards.
 */
export function buildBroadLuceneQuery(rawQuery: string): string {
  const sanitized = sanitizeLuceneQuery(rawQuery);
  if (!sanitized) return "";

  const tokens = sanitized.split(/\s+/).filter(Boolean);
  const clauses: string[] = [];

  // 1. Full phrase matches across all 3 key openFDA fields
  clauses.push(`openfda.brand_name:"${sanitized}"`);
  clauses.push(`openfda.generic_name:"${sanitized}"`);
  clauses.push(`openfda.substance_name:"${sanitized}"`);

  // 2. If multi-token (e.g. "advil pm"), also match the first significant token
  const firstToken = tokens[0];
  if (tokens.length > 1 && firstToken) {
    clauses.push(`openfda.brand_name:"${firstToken}"`);
    clauses.push(`openfda.generic_name:"${firstToken}"`);
    clauses.push(`openfda.substance_name:"${firstToken}"`);
  }

  // 3. Prefix wildcard for typo tolerance / broader candidate retrieval on first token
  if (firstToken && firstToken.length >= 4) {
    const prefixLen = Math.max(3, Math.min(firstToken.length - 1, 7));
    const prefix = firstToken.slice(0, prefixLen);
    clauses.push(`openfda.brand_name:${prefix}*`);
    clauses.push(`openfda.generic_name:${prefix}*`);
    clauses.push(`openfda.substance_name:${prefix}*`);
  }

  const uniqueClauses = Array.from(new Set(clauses));
  return `(${uniqueClauses.join(" OR ")})`;
}

// In-memory per-session cache to guard against openFDA 40 req/min rate limit
interface CacheEntry {
  data: DrugLabel[];
  timestamp: number;
}
const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function searchMedicines(query: string): Promise<DrugLabel[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const sanitized = sanitizeLuceneQuery(trimmed);
  if (!sanitized) {
    return [];
  }

  const cacheKey = sanitized.toLowerCase();
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const searchParam = buildBroadLuceneQuery(trimmed);
  if (!searchParam) {
    return [];
  }

  const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchParam)}&limit=30`;

  const response = await fetchOpenFda(url);

  if (response.ok) {
    const data: OpenFdaResponse<DrugLabel> = await response.json();
    const rawResults = data.results ?? [];

    const validResults: DrugLabel[] = [];
    for (const item of rawResults) {
      const hasBrandName =
        Array.isArray(item.openfda?.brand_name) &&
        item.openfda.brand_name.length > 0 &&
        Boolean(item.openfda.brand_name[0]?.trim());

      if (hasBrandName) {
        validResults.push(item);
      } else if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[openFDA] Filtered out record lacking 'openfda.brand_name':`,
          {
            id: item.id,
            set_id: item.set_id,
            generic_name: item.openfda?.generic_name,
          }
        );
      }
    }

    // Hybrid re-ranking: combine exact match weighting + Fuse.js fuzzy similarity
    const rankedResults = rankMedicinesHybrid(validResults, sanitized);

    // Cache the ranked results
    searchCache.set(cacheKey, {
      data: rankedResults,
      timestamp: Date.now(),
    });

    return rankedResults;
  }

  let errorData: OpenFdaResponse | undefined;
  try {
    errorData = await response.json();
  } catch {
    // Response body is not JSON
  }

  // openFDA returns HTTP 404 with error.code "NOT_FOUND" when 0 records match
  if (response.status === 404 && errorData?.error?.code === "NOT_FOUND") {
    searchCache.set(cacheKey, {
      data: [],
      timestamp: Date.now(),
    });
    return [];
  }

  const errorMessage =
    errorData?.error?.message ||
    `openFDA request failed with status ${response.status}`;

  throw new OpenFdaApiError(
    errorMessage,
    response.status,
    errorData?.error?.code
  );
}

export async function getMedicineFormulationsBySlug(
  slug: string
): Promise<DrugLabel[]> {
  if (!slug || !slug.trim()) {
    return [];
  }

  const { setId } = decodeMedicineSlug(slug);
  if (!setId) {
    return [];
  }

  // Search by openfda.spl_set_id, root set_id, or direct id (up to 10 matching formulations)
  const searchParam = `(openfda.spl_set_id:"${setId}" OR set_id:"${setId}" OR id:"${setId}")`;
  const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchParam)}&limit=10`;

  const response = await fetchOpenFda(url);

  if (response.ok) {
    const data: OpenFdaResponse<DrugLabel> = await response.json();
    return data.results ?? [];
  }

  let errorData: OpenFdaResponse | undefined;
  try {
    errorData = await response.json();
  } catch {
    // Response body is not JSON
  }

  // Record not found in openFDA
  if (response.status === 404 && errorData?.error?.code === "NOT_FOUND") {
    return [];
  }

  const errorMessage =
    errorData?.error?.message ||
    `openFDA request failed with status ${response.status}`;

  throw new OpenFdaApiError(
    errorMessage,
    response.status,
    errorData?.error?.code
  );
}

export async function getMedicineBySlug(
  slug: string
): Promise<DrugLabel | null> {
  const formulations = await getMedicineFormulationsBySlug(slug);
  return formulations.length > 0 ? formulations[0] : null;
}
