import logger from "@/utils/logger";
import {
  LANGFUSE_PROMPT_CACHE_TTL_MS,
  LANGFUSE_PUBLIC_KEY,
  LANGFUSE_SECRET_KEY,
} from "@/utils/constants";
import { getLangfuseClient, isLangfuseConfigured } from "@/utils/langfuse";

export interface LangfusePrompt {
  name: string;
  version?: number;
  prompt: string;
  metadata?: Record<string, unknown>;
  description?: string | null;
}

type CachedPrompt = {
  fetchedAt: number;
  data: LangfusePrompt;
};

const promptCache = new Map<string, CachedPrompt>();

const cacheKeyFor = (name: string, version?: number) =>
  version ? `${name}@${version}` : name;

const isCacheValid = (cached?: CachedPrompt): boolean => {
  if (!cached) {
    return false;
  }
  return Date.now() - cached.fetchedAt < LANGFUSE_PROMPT_CACHE_TTL_MS;
};

export const getLangfusePrompt = async (
  name: string,
  version?: number,
): Promise<LangfusePrompt | null> => {
  if (!isLangfuseConfigured()) {
    return null;
  }

  const cacheKey = cacheKeyFor(name, version);
  const cached = promptCache.get(cacheKey);
  if (isCacheValid(cached)) {
    return cached?.data ?? null;
  }

  const client = getLangfuseClient();
  if (!client) {
    return null;
  }

  try {
    const promptResponse = await client.api.promptsGet({
      promptName: name,
      version,
    });

    if (!promptResponse?.prompt) {
      return null;
    }

    const prompt: LangfusePrompt = {
      name: promptResponse.name ?? name,
      version: promptResponse.version ?? undefined,
      prompt: promptResponse.prompt,
      metadata: promptResponse.metadata ?? undefined,
      description: promptResponse.description ?? undefined,
    };

    promptCache.set(cacheKey, { fetchedAt: Date.now(), data: prompt });
    return prompt;
  } catch (error) {
    logger.warn(`[Langfuse] Failed to fetch prompt "${name}"`, {
      error,
      hasPublicKey: Boolean(LANGFUSE_PUBLIC_KEY),
      hasSecretKey: Boolean(LANGFUSE_SECRET_KEY),
    });
    return null;
  }
};

export const clearPromptCache = () => promptCache.clear();


