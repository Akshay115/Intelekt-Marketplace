import "server-only";

import OpenAI from "openai";

import { OPENROUTER_FREE_AUTO_MODEL } from "@/lib/constants";
import { getServerConfig } from "@/lib/config";

let openRouterClient: OpenAI | null = null;

export function getOpenRouterClient() {
  const config = getServerConfig();

  openRouterClient ??= new OpenAI({
    apiKey: config.openrouter.apiKey,
    baseURL: config.openrouter.baseUrl,
    defaultHeaders: {
      "HTTP-Referer": config.app.url,
      "X-Title": config.app.name,
    },
  });

  return openRouterClient;
}

export function getOpenRouterModel(
  model = getServerConfig().openrouter.defaultModel || OPENROUTER_FREE_AUTO_MODEL
) {
  return model;
}
