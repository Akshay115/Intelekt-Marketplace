export type UUID = string;
export type ISODateTime = string;
export type ISODate = string;
export type CurrencyCode = string;

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type TimestampFields = {
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
};

export type SoftDeleteFields = {
  deletedAt: ISODateTime | null;
};

export type DatabaseRecord = TimestampFields & {
  id: UUID;
};

export type Visibility = "private" | "unlisted" | "public";
export type SharedVisibility = "private" | "shared" | "public_summary";

export type PaginationParams = {
  limit?: number;
  offset?: number;
};

export type SortDirection = "asc" | "desc";

export type ListResult<T> = {
  items: T[];
  total: number;
};
