import {
  createInsforgeErrorFromResponse,
  normalizeInsforgeError,
} from "@/lib/insforge/errors";
import type {
  InsforgeClient,
  InsforgeClientConfig,
  InsforgeHealthCheck,
  InsforgeHttpMethod,
  InsforgeRequestOptions,
  InsforgeResult,
} from "@/lib/insforge/types";

const DEFAULT_TIMEOUT_MS = 30_000;
const HEALTH_ENDPOINTS = ["/api/health", "/health", "/api/auth/public-config"] as const;

/**
 * Create a browser-safe InsForge client.
 *
 * This client only reads `NEXT_PUBLIC_INSFORGE_URL` and
 * `NEXT_PUBLIC_INSFORGE_ANON_KEY`. It never receives or exposes the service role
 * key. Pass `getAuthToken` later when auth is implemented so user sessions can
 * override the anon token for authenticated requests.
 *
 * @example
 * ```ts
 * const insforge = createBrowserInsforgeClient()
 * const result = await insforge.get<{ data: unknown[] }>("/api/database/users")
 * ```
 */
export function createBrowserInsforgeClient(options?: {
  getAuthToken?: InsforgeClientConfig["getAuthToken"];
  fetcher?: typeof fetch;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
  const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_INSFORGE_URL is required to create the browser InsForge client."
    );
  }

  if (!anonKey) {
    throw new Error(
      "NEXT_PUBLIC_INSFORGE_ANON_KEY is required to create the browser InsForge client."
    );
  }

  return createInsforgeFetchClient({
    baseUrl,
    apiKey: anonKey,
    getAuthToken: options?.getAuthToken,
    fetcher: options?.fetcher,
  });
}

/**
 * Create a typed InsForge fetch client from explicit configuration.
 *
 * Prefer `createBrowserInsforgeClient()` in Client Components and
 * `createServerInsforgeClient()` from `lib/insforge/server` in Server
 * Components, Route Handlers, and Server Actions.
 */
export function createInsforgeFetchClient(config: InsforgeClientConfig): InsforgeClient {
  if (!config.baseUrl) {
    throw new Error("InsForge client requires a baseUrl.");
  }

  const fetcher = config.fetcher ?? fetch;
  const timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  async function request<TData = unknown, TBody = unknown>(
    method: InsforgeHttpMethod,
    path: string,
    options: InsforgeRequestOptions<TBody> = {}
  ): Promise<InsforgeResult<TData>> {
    const url = buildUrl(config.baseUrl, path, options.params);
    const controller = new AbortController();
    const timeout = windowSafeSetTimeout(() => controller.abort(), options.timeoutMs ?? timeoutMs);
    const signal = composeAbortSignals(options.signal, controller.signal);

    try {
      const headers = await buildHeaders(config, options, method);
      const response = await fetcher(url, {
        method,
        headers,
        body: serializeBody(options.body, headers),
        signal,
      });
      const data = await parseResponseBody(response);

      if (!response.ok) {
        return {
          ...createInsforgeErrorFromResponse(response, data, method, url).toResult(),
          headers: response.headers,
        };
      }

      return {
        ok: true,
        data: data as TData,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      return normalizeInsforgeError(error, method, url).toResult();
    } finally {
      clearTimeout(timeout);
    }
  }

  return {
    request,
    get: (path, options) => request("GET", path, options),
    post: (path, body, options) => request("POST", path, { ...options, body }),
    patch: (path, body, options) => request("PATCH", path, { ...options, body }),
    delete: (path, options) => request("DELETE", path, options),
    health: () => checkInsforgeHealth({ request }),
  };
}

/**
 * Checks whether the InsForge backend is reachable.
 *
 * The function tries `/api/health` first. If that endpoint is not available on
 * the deployed backend, it falls back to `/health`, then to the safe public auth
 * config endpoint.
 */
export async function checkInsforgeHealth(client: Pick<InsforgeClient, "request">) {
  const checkedAt = new Date().toISOString();

  for (const endpoint of HEALTH_ENDPOINTS) {
    const result = await client.request<unknown>("GET", endpoint);

    if (result.ok) {
      return {
        ok: true,
        endpoint,
        status: result.status,
        message: "InsForge backend is reachable.",
        checkedAt,
      } satisfies InsforgeHealthCheck;
    }

    if (result.status && result.status !== 404) {
      return {
        ok: false,
        endpoint,
        status: result.status,
        message: result.error.message,
        checkedAt,
      } satisfies InsforgeHealthCheck;
    }
  }

  return {
    ok: false,
    endpoint: HEALTH_ENDPOINTS[HEALTH_ENDPOINTS.length - 1],
    status: 404,
    message: "No InsForge health or safe public test endpoint responded successfully.",
    checkedAt,
  };
}

async function buildHeaders<TBody>(
  config: InsforgeClientConfig,
  options: InsforgeRequestOptions<TBody>,
  method: InsforgeHttpMethod
) {
  const headers = new Headers(config.headers);
  mergeHeaders(headers, options.headers);

  headers.set("Accept", headers.get("Accept") ?? "application/json");

  if (method !== "GET" && options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const authToken = options.authToken ?? (await config.getAuthToken?.()) ?? config.apiKey;

  if (authToken && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  return headers;
}

function mergeHeaders(target: Headers, source?: HeadersInit) {
  if (!source) {
    return;
  }

  new Headers(source).forEach((value, key) => target.set(key, value));
}

function serializeBody(body: unknown, headers: Headers) {
  if (body === undefined || body === null) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof Blob ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof ArrayBuffer
  ) {
    return body;
  }

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return JSON.stringify(body);
}

async function parseResponseBody(response: Response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function buildUrl(baseUrl: string, path: string, params?: InsforgeRequestOptions["params"]) {
  const url = path.startsWith("http")
    ? new URL(path)
    : new URL(`${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, String(item)));
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

function composeAbortSignals(externalSignal: AbortSignal | undefined, timeoutSignal: AbortSignal) {
  if (!externalSignal) {
    return timeoutSignal;
  }

  const controller = new AbortController();
  const abort = () => controller.abort();

  if (externalSignal.aborted || timeoutSignal.aborted) {
    controller.abort();
  } else {
    externalSignal.addEventListener("abort", abort, { once: true });
    timeoutSignal.addEventListener("abort", abort, { once: true });
  }

  return controller.signal;
}

function windowSafeSetTimeout(callback: () => void, ms: number) {
  return setTimeout(callback, ms);
}
