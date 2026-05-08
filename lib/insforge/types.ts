export type InsforgeHttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type InsforgeQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>;

export type InsforgeQueryParams = Record<string, InsforgeQueryValue>;

export type InsforgeJsonPrimitive = string | number | boolean | null;
export type InsforgeJsonValue =
  | InsforgeJsonPrimitive
  | InsforgeJsonValue[]
  | { [key: string]: InsforgeJsonValue };

export type InsforgeAuthTokenProvider = () => string | null | undefined | Promise<string | null | undefined>;

export type InsforgeClientConfig = {
  baseUrl: string;
  /**
   * Browser clients should receive the anon key. Server clients may receive
   * the service role key for privileged backend-only work.
   */
  apiKey?: string;
  headers?: HeadersInit;
  fetcher?: typeof fetch;
  getAuthToken?: InsforgeAuthTokenProvider;
  timeoutMs?: number;
};

export type InsforgeRequestOptions<TBody = unknown> = {
  body?: TBody;
  headers?: HeadersInit;
  params?: InsforgeQueryParams;
  authToken?: string | null;
  signal?: AbortSignal;
  timeoutMs?: number;
};

export type InsforgeSuccess<TData> = {
  ok: true;
  data: TData;
  status: number;
  headers: Headers;
};

export type InsforgeFailure = {
  ok: false;
  error: {
    message: string;
    status?: number;
    code?: string;
    details?: unknown;
    nextActions?: string;
  };
  status?: number;
  headers?: Headers;
};

export type InsforgeResult<TData> = InsforgeSuccess<TData> | InsforgeFailure;

export type InsforgeHealthCheck = {
  ok: boolean;
  endpoint: string;
  status?: number;
  message: string;
  checkedAt: string;
};

export type InsforgeClient = {
  request: <TData = unknown, TBody = unknown>(
    method: InsforgeHttpMethod,
    path: string,
    options?: InsforgeRequestOptions<TBody>
  ) => Promise<InsforgeResult<TData>>;
  get: <TData = unknown>(
    path: string,
    options?: Omit<InsforgeRequestOptions, "body">
  ) => Promise<InsforgeResult<TData>>;
  post: <TData = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: Omit<InsforgeRequestOptions<TBody>, "body">
  ) => Promise<InsforgeResult<TData>>;
  patch: <TData = unknown, TBody = unknown>(
    path: string,
    body?: TBody,
    options?: Omit<InsforgeRequestOptions<TBody>, "body">
  ) => Promise<InsforgeResult<TData>>;
  delete: <TData = unknown>(
    path: string,
    options?: Omit<InsforgeRequestOptions, "body">
  ) => Promise<InsforgeResult<TData>>;
  health: () => Promise<InsforgeHealthCheck>;
};
