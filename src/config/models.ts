import type { ModelConfig } from "@typings/stage.ts";

export interface ModelDefinition {
  id: string;
  provider: "anthropic" | "openai" | "google";
  tier: "small" | "medium" | "large";
  maxTokens: number;
  contextWindow: number;
}

export const MODELS: Record<string, ModelDefinition> = {
  // Anthropic Claude models
  "claude-opus-4-5-20250929": {
    id: "claude-opus-4-5-20250929",
    provider: "anthropic",
    tier: "large",
    maxTokens: 8192,
    contextWindow: 200000,
  },
  "claude-sonnet-4-5-20250929": {
    id: "claude-sonnet-4-5-20250929",
    provider: "anthropic",
    tier: "medium",
    maxTokens: 8192,
    contextWindow: 200000,
  },
  "claude-haiku-4-5-20251001": {
    id: "claude-haiku-4-5-20251001",
    provider: "anthropic",
    tier: "small",
    maxTokens: 8192,
    contextWindow: 200000,
  },
  "claude-3-5-sonnet-20241022": {
    id: "claude-3-5-sonnet-20241022",
    provider: "anthropic",
    tier: "medium",
    maxTokens: 8192,
    contextWindow: 200000,
  },
  "claude-3-5-haiku-20241022": {
    id: "claude-3-5-haiku-20241022",
    provider: "anthropic",
    tier: "small",
    maxTokens: 8192,
    contextWindow: 200000,
  },

  // OpenAI models
  "gpt-4o": {
    id: "gpt-4o",
    provider: "openai",
    tier: "medium",
    maxTokens: 16384,
    contextWindow: 128000,
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    provider: "openai",
    tier: "small",
    maxTokens: 16384,
    contextWindow: 128000,
  },
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    provider: "openai",
    tier: "large",
    maxTokens: 4096,
    contextWindow: 128000,
  },

  // Google models
  "gemini-1.5-pro": {
    id: "gemini-1.5-pro",
    provider: "google",
    tier: "large",
    maxTokens: 8192,
    contextWindow: 2000000,
  },
  "gemini-1.5-flash": {
    id: "gemini-1.5-flash",
    provider: "google",
    tier: "small",
    maxTokens: 8192,
    contextWindow: 1000000,
  },
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    provider: "google",
    tier: "small",
    maxTokens: 8192,
    contextWindow: 1000000,
  },
};

export function getDefaultModelForTier(
  tier: "small" | "medium" | "large",
  provider: "anthropic" | "openai" | "google" = "anthropic"
): ModelConfig {
  const tierModels: Record<string, Record<"small" | "medium" | "large", string>> = {
    anthropic: {
      small: "claude-haiku-4-5-20251001",
      medium: "claude-sonnet-4-5-20250929",
      large: "claude-opus-4-5-20250929",
    },
    openai: {
      small: "gpt-4o-mini",
      medium: "gpt-4o",
      large: "gpt-4-turbo",
    },
    google: {
      small: "gemini-2.0-flash",
      medium: "gemini-1.5-flash",
      large: "gemini-1.5-pro",
    },
  };

  const providerModels = tierModels[provider];
  const modelId = providerModels?.[tier] ?? "claude-haiku-4-5-20251001";
  const model = MODELS[modelId];

  return {
    providerID: provider,
    modelID: modelId,
    tier: tier,
    maxTokens: model?.maxTokens || 4096,
    temperature: 0.7,
  };
}
