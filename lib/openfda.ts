import { DrugLabel, OpenFdaResponse } from "@/types/drug";
import {
  decodeMedicineSlug,
  encodeMedicineSlug,
  decodeSlug,
  encodeSlug,
} from "./slug";

export { decodeMedicineSlug, encodeMedicineSlug, decodeSlug, encodeSlug };

export class OpenFdaError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
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
  constructor(
    message = "Network error while connecting to openFDA",
    public originalError?: unknown
  ) {
    super(message);
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

export async function searchMedicines(query: string): Promise<DrugLabel[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const searchParam = `openfda.brand_name:"${trimmed}"`;
  const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchParam)}&limit=20`;

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

    return validResults;
  }

  let errorData: OpenFdaResponse | undefined;
  try {
    errorData = await response.json();
  } catch {
    // Response body is not JSON
  }

  // openFDA returns HTTP 404 with error.code "NOT_FOUND" when 0 records match
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
  if (!slug || !slug.trim()) {
    return null;
  }

  const { setId } = decodeMedicineSlug(slug);
  if (!setId) {
    return null;
  }

  // Search by openfda.spl_set_id, root set_id, or direct id
  const searchParam = `(openfda.spl_set_id:"${setId}"+OR+set_id:"${setId}"+OR+id:"${setId}")`;
  const url = `${OPENFDA_BASE_URL}?search=${encodeURIComponent(searchParam)}&limit=1`;

  const response = await fetchOpenFda(url);

  if (response.ok) {
    const data: OpenFdaResponse<DrugLabel> = await response.json();
    return data.results?.[0] ?? null;
  }

  let errorData: OpenFdaResponse | undefined;
  try {
    errorData = await response.json();
  } catch {
    // Response body is not JSON
  }

  // Record not found in openFDA
  if (response.status === 404 && errorData?.error?.code === "NOT_FOUND") {
    return null;
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
