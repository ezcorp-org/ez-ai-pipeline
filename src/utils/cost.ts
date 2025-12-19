import type { CostBreakdown } from "@typings/result.ts";

// Cost per 1M tokens (in USD)
const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  // Anthropic Claude models
  "claude-opus-4-5-20250929": { input: 15.0, output: 75.0 },
  "claude-sonnet-4-5-20250929": { input: 3.0, output: 15.0 },
  "claude-haiku-4-5-20251001": { input: 0.8, output: 4.0 },
  "claude-3-5-sonnet-20241022": { input: 3.0, output: 15.0 },
  "claude-3-5-haiku-20241022": { input: 0.8, output: 4.0 },
  "claude-3-opus-20240229": { input: 15.0, output: 75.0 },
  "claude-3-sonnet-20240229": { input: 3.0, output: 15.0 },
  "claude-3-haiku-20240307": { input: 0.25, output: 1.25 },

  // OpenAI models
  "gpt-4o": { input: 2.5, output: 10.0 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4-turbo": { input: 10.0, output: 30.0 },
  "gpt-4": { input: 30.0, output: 60.0 },
  "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  "o1-preview": { input: 15.0, output: 60.0 },
  "o1-mini": { input: 3.0, output: 12.0 },

  // Google models
  "gemini-1.5-pro": { input: 1.25, output: 5.0 },
  "gemini-1.5-flash": { input: 0.075, output: 0.3 },
  "gemini-2.0-flash": { input: 0.1, output: 0.4 },
};

const DEFAULT_PRICING = { input: 1.0, output: 3.0 };

export function calculateCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): CostBreakdown {
  const pricing = MODEL_PRICING[modelId] || DEFAULT_PRICING;

  const inputCost = (inputTokens / 1_000_000) * pricing.input;
  const outputCost = (outputTokens / 1_000_000) * pricing.output;

  return {
    inputCost,
    outputCost,
    totalCost: inputCost + outputCost,
    model: modelId,
    inputTokens,
    outputTokens,
  };
}

export function formatCost(cost: number): string {
  if (cost < 0.0001) {
    return "<$0.0001";
  }
  if (cost < 0.01) {
    return `$${cost.toFixed(4)}`;
  }
  if (cost < 1) {
    return `$${cost.toFixed(3)}`;
  }
  return `$${cost.toFixed(2)}`;
}

export function getModelTier(modelId: string): "small" | "medium" | "large" {
  const lowerModelId = modelId.toLowerCase();

  // Check large models first (more specific patterns)
  const largePatterns = ["opus", "gpt-4-turbo", "gpt-4-", "o1-preview", "-pro", "1.5-pro"];
  if (largePatterns.some((p) => lowerModelId.includes(p))) {
    return "large";
  }

  // Check small models (being careful with patterns that might match unintended models)
  const smallPatterns = ["haiku", "4o-mini", "flash", "3.5-turbo"];
  if (smallPatterns.some((p) => lowerModelId.includes(p))) {
    return "small";
  }

  return "medium";
}

export function estimateTotalCost(
  stages: { modelId: string; estimatedInputTokens: number; estimatedOutputTokens: number }[]
): number {
  return stages.reduce((total, stage) => {
    const cost = calculateCost(stage.modelId, stage.estimatedInputTokens, stage.estimatedOutputTokens);
    return total + cost.totalCost;
  }, 0);
}
