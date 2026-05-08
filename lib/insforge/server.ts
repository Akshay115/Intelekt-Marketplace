import "server-only";

import { getServerConfig } from "@/lib/config";
import { createInsforgeFetchClient, checkInsforgeHealth } from "@/lib/insforge/client";

/**
 * Create a privileged server-side InsForge client.
 *
 * Use this only in Server Components, Route Handlers, Server Actions, or other
 * backend-only modules. It uses `INSFORGE_SERVICE_ROLE_KEY`, so importing this
 * file from a Client Component is intentionally blocked by `server-only`.
 *
 * @example
 * ```ts
 * const insforge = createServerInsforgeClient()
 * const health = await insforge.health()
 * ```
 */
export function createServerInsforgeClient() {
  const config = getServerConfig();

  return createInsforgeFetchClient({
    baseUrl: config.insforge.url,
    apiKey: config.insforge.serviceRoleKey,
  });
}

/**
 * Server helper for checking whether the linked InsForge backend is reachable.
 */
export async function checkServerInsforgeHealth() {
  return checkInsforgeHealth(createServerInsforgeClient());
}
