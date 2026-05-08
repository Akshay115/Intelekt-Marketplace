import {
  INSFORGE_DEFAULT_URL,
  INSFORGE_PROJECT_ID,
  INSFORGE_PROJECT_NAME,
} from "@/lib/constants";

export * from "./client";
export * from "./errors";
export * from "./types";

export const insforgeProject = {
  id: INSFORGE_PROJECT_ID,
  name: INSFORGE_PROJECT_NAME,
  host: INSFORGE_DEFAULT_URL,
} as const;
