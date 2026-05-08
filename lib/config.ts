import "server-only";

import {
  APP_DESCRIPTION,
  APP_NAME,
  INSFORGE_APP_KEY,
  INSFORGE_PROJECT_ID,
  INSFORGE_PROJECT_NAME,
  INSFORGE_REGION,
  OPENROUTER_BASE_URL,
} from "@/lib/constants";
import { getPublicEnv, getServerEnv } from "@/lib/env";

export function getServerConfig() {
  const env = getServerEnv();

  return {
    app: {
      name: APP_NAME,
      description: APP_DESCRIPTION,
      env: env.APP_ENV,
      url: env.NEXT_PUBLIC_APP_URL,
      sentryDsn: env.SENTRY_DSN || undefined,
    },
    insforge: {
      projectId: INSFORGE_PROJECT_ID,
      projectName: INSFORGE_PROJECT_NAME,
      appKey: INSFORGE_APP_KEY,
      region: INSFORGE_REGION,
      url: env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
      serviceRoleKey: env.INSFORGE_SERVICE_ROLE_KEY,
    },
    openrouter: {
      apiKey: env.OPENROUTER_API_KEY,
      baseUrl: OPENROUTER_BASE_URL,
      defaultModel: env.OPENROUTER_DEFAULT_MODEL,
    },
    email: {
      resendApiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM || undefined,
    },
    analytics: {
      posthogKey: env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
      posthogHost: env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
    },
  } as const;
}

export function getPublicConfig() {
  const env = getPublicEnv();

  return {
    app: {
      name: APP_NAME,
      description: APP_DESCRIPTION,
      env: env.APP_ENV,
      url: env.NEXT_PUBLIC_APP_URL,
      sentryDsn: env.SENTRY_DSN || undefined,
    },
    insforge: {
      projectId: INSFORGE_PROJECT_ID,
      appKey: INSFORGE_APP_KEY,
      region: INSFORGE_REGION,
      url: env.NEXT_PUBLIC_INSFORGE_URL,
      anonKey: env.NEXT_PUBLIC_INSFORGE_ANON_KEY,
    },
    analytics: {
      posthogKey: env.NEXT_PUBLIC_POSTHOG_KEY || undefined,
      posthogHost: env.NEXT_PUBLIC_POSTHOG_HOST || undefined,
    },
  } as const;
}
