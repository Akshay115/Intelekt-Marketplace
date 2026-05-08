import {
  INSFORGE_DEFAULT_URL,
  INSFORGE_PROJECT_ID,
  INSFORGE_PROJECT_NAME,
} from "@/lib/constants";

export const insforgeProject = {
  id: INSFORGE_PROJECT_ID,
  name: INSFORGE_PROJECT_NAME,
  host: INSFORGE_DEFAULT_URL,
} as const;
