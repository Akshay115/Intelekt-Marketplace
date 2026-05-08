import type { InsforgeFailure, InsforgeHttpMethod } from "@/lib/insforge/types";

type InsforgeErrorInput = {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
  nextActions?: string;
  method?: InsforgeHttpMethod;
  url?: string;
};

export class InsforgeClientError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  nextActions?: string;
  method?: InsforgeHttpMethod;
  url?: string;

  constructor(input: InsforgeErrorInput) {
    super(input.message);
    this.name = "InsforgeClientError";
    this.status = input.status;
    this.code = input.code;
    this.details = input.details;
    this.nextActions = input.nextActions;
    this.method = input.method;
    this.url = input.url;
  }

  toResult(): InsforgeFailure {
    return {
      ok: false,
      status: this.status,
      error: {
        message: this.message,
        status: this.status,
        code: this.code,
        details: this.details,
        nextActions: this.nextActions,
      },
    };
  }
}

type InsforgeApiErrorBody = {
  error?: string;
  code?: string;
  message?: string;
  status?: number;
  statusCode?: number;
  details?: unknown;
  nextActions?: string;
};

export function createInsforgeErrorFromResponse(
  response: Response,
  body: unknown,
  method: InsforgeHttpMethod,
  url: string
) {
  const payload = isApiErrorBody(body) ? body : undefined;
  const status = payload?.statusCode ?? payload?.status ?? response.status;
  const code = payload?.code ?? payload?.error;
  const message =
    payload?.message ??
    payload?.error ??
    `InsForge request failed with ${response.status} ${response.statusText}`;

  return new InsforgeClientError({
    message,
    status,
    code,
    details: payload?.details ?? body,
    nextActions: payload?.nextActions,
    method,
    url,
  });
}

export function normalizeInsforgeError(
  error: unknown,
  method?: InsforgeHttpMethod,
  url?: string
) {
  if (error instanceof InsforgeClientError) {
    return error;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return new InsforgeClientError({
      message: "InsForge request timed out or was aborted.",
      code: "REQUEST_ABORTED",
      method,
      url,
    });
  }

  if (error instanceof Error) {
    return new InsforgeClientError({
      message: error.message,
      code: "REQUEST_FAILED",
      method,
      url,
    });
  }

  return new InsforgeClientError({
    message: "Unknown InsForge request error.",
    code: "UNKNOWN_ERROR",
    details: error,
    method,
    url,
  });
}

function isApiErrorBody(value: unknown): value is InsforgeApiErrorBody {
  return Boolean(value && typeof value === "object");
}
