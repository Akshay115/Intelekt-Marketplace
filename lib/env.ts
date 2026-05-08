import "server-only";

import { z } from "zod";

import {
  DEFAULT_POSTHOG_HOST,
  INSFORGE_DEFAULT_URL,
  OPENROUTER_FREE_AUTO_MODEL,
} from "@/lib/constants";

const appEnvSchema = z.enum(["development", "preview", "production", "test"]);

const requiredUrl = (name: string) =>
  z
    .string({ error: `${name} is required.` })
    .trim()
    .min(1, `${name} is required.`)
    .url(`${name} must be a valid URL.`);

const requiredSecret = (name: string) =>
  z
    .string({ error: `${name} is required.` })
    .trim()
    .min(1, `${name} is required.`);

const optionalUrl = (name: string) =>
  z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine((value) => !value || z.url().safeParse(value).success, {
      message: `${name} must be a valid URL when provided.`,
    });

const optionalEmailFrom = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .refine(
    (value) => {
      if (!value) {
        return true;
      }

      return value.includes("@");
    },
    { message: "EMAIL_FROM must include an email address." }
  );

export const serverEnvSchema = z.object({
  APP_ENV: appEnvSchema.default("development"),
  NEXT_PUBLIC_APP_URL: requiredUrl("NEXT_PUBLIC_APP_URL").default("http://localhost:3000"),
  NEXT_PUBLIC_INSFORGE_URL: requiredUrl("NEXT_PUBLIC_INSFORGE_URL").default(
    INSFORGE_DEFAULT_URL
  ),
  NEXT_PUBLIC_INSFORGE_ANON_KEY: requiredSecret("NEXT_PUBLIC_INSFORGE_ANON_KEY"),
  INSFORGE_SERVICE_ROLE_KEY: requiredSecret("INSFORGE_SERVICE_ROLE_KEY"),
  OPENROUTER_API_KEY: requiredSecret("OPENROUTER_API_KEY"),
  OPENROUTER_DEFAULT_MODEL: z
    .string()
    .trim()
    .min(1, "OPENROUTER_DEFAULT_MODEL is required.")
    .default(OPENROUTER_FREE_AUTO_MODEL),
  RESEND_API_KEY: requiredSecret("RESEND_API_KEY"),
  EMAIL_FROM: optionalEmailFrom,
  NEXT_PUBLIC_POSTHOG_KEY: z.string().trim().optional().or(z.literal("")),
  NEXT_PUBLIC_POSTHOG_HOST: optionalUrl("NEXT_PUBLIC_POSTHOG_HOST").default(
    DEFAULT_POSTHOG_HOST
  ),
  SENTRY_DSN: optionalUrl("SENTRY_DSN"),
});

export const publicEnvSchema = serverEnvSchema.pick({
  APP_ENV: true,
  NEXT_PUBLIC_APP_URL: true,
  NEXT_PUBLIC_INSFORGE_URL: true,
  NEXT_PUBLIC_INSFORGE_ANON_KEY: true,
  NEXT_PUBLIC_POSTHOG_KEY: true,
  NEXT_PUBLIC_POSTHOG_HOST: true,
  SENTRY_DSN: true,
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type PublicEnv = z.infer<typeof publicEnvSchema>;

function formatEnvError(error: z.ZodError) {
  const issues = error.issues
    .map((issue) => `- ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  return `Invalid environment configuration:\n${issues}\n\nCopy .env.example to .env.local and fill in the missing values.`;
}

export function parseServerEnv(source: NodeJS.ProcessEnv = process.env): ServerEnv {
  const parsed = serverEnvSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(formatEnvError(parsed.error));
  }

  return parsed.data;
}

export function parsePublicEnv(source: NodeJS.ProcessEnv = process.env): PublicEnv {
  const parsed = publicEnvSchema.safeParse(source);

  if (!parsed.success) {
    throw new Error(formatEnvError(parsed.error));
  }

  return parsed.data;
}

let cachedServerEnv: ServerEnv | null = null;
let cachedPublicEnv: PublicEnv | null = null;

export function getServerEnv() {
  cachedServerEnv ??= parseServerEnv();
  return cachedServerEnv;
}

export function getPublicEnv() {
  cachedPublicEnv ??= parsePublicEnv();
  return cachedPublicEnv;
}
