import {
  getOpenRouterClient,
  getOpenRouterModel,
} from "@/lib/openrouter";
import { OPENROUTER_FREE_AUTO_MODEL } from "@/lib/constants";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function createFreeAutoRoutedCompletion(messages: ChatMessage[]) {
  const completion = await getOpenRouterClient().chat.completions.create({
    model: getOpenRouterModel(),
    messages,
  });

  return {
    content: completion.choices[0]?.message.content ?? "",
    routedModel: completion.model,
  };
}

export const defaultFreeAutoRouterModel = OPENROUTER_FREE_AUTO_MODEL;
