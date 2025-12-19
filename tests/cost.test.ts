import { describe, it, expect } from "bun:test";
import { calculateCost, formatCost, getModelTier } from "../src/utils/cost.ts";

describe("calculateCost", () => {
  it("should calculate cost for Claude Haiku", () => {
    const result = calculateCost("claude-haiku-4-5-20251001", 1000, 500);

    expect(result.model).toBe("claude-haiku-4-5-20251001");
    expect(result.inputTokens).toBe(1000);
    expect(result.outputTokens).toBe(500);
    expect(result.inputCost).toBeCloseTo(0.0008, 5);
    expect(result.outputCost).toBeCloseTo(0.002, 5);
    expect(result.totalCost).toBeCloseTo(0.0028, 5);
  });

  it("should calculate cost for Claude Sonnet", () => {
    const result = calculateCost("claude-sonnet-4-5-20250929", 1000, 500);

    expect(result.inputCost).toBeCloseTo(0.003, 5);
    expect(result.outputCost).toBeCloseTo(0.0075, 5);
  });

  it("should calculate cost for GPT-4o", () => {
    const result = calculateCost("gpt-4o", 1000, 500);

    expect(result.inputCost).toBeCloseTo(0.0025, 5);
    expect(result.outputCost).toBeCloseTo(0.005, 5);
  });

  it("should use default pricing for unknown models", () => {
    const result = calculateCost("unknown-model", 1000, 500);

    // Default: input $1/1M, output $3/1M
    expect(result.inputCost).toBeCloseTo(0.001, 5);
    expect(result.outputCost).toBeCloseTo(0.0015, 5);
  });
});

describe("formatCost", () => {
  it("should format very small costs", () => {
    expect(formatCost(0.00001)).toBe("<$0.0001");
  });

  it("should format small costs with 4 decimals", () => {
    expect(formatCost(0.0012)).toBe("$0.0012");
  });

  it("should format medium costs with 3 decimals", () => {
    expect(formatCost(0.123)).toBe("$0.123");
  });

  it("should format large costs with 2 decimals", () => {
    expect(formatCost(12.345)).toBe("$12.35");
  });
});

describe("getModelTier", () => {
  it("should identify small models", () => {
    expect(getModelTier("claude-haiku-4-5-20251001")).toBe("small");
    expect(getModelTier("gpt-4o-mini")).toBe("small");
    expect(getModelTier("gemini-1.5-flash")).toBe("small");
    expect(getModelTier("gemini-2.0-flash")).toBe("small");
    expect(getModelTier("gpt-3.5-turbo")).toBe("small");
  });

  it("should identify large models", () => {
    expect(getModelTier("claude-opus-4-5-20250929")).toBe("large");
    expect(getModelTier("gpt-4-turbo")).toBe("large");
    expect(getModelTier("o1-preview")).toBe("large");
    expect(getModelTier("gemini-1.5-pro")).toBe("large");
  });

  it("should default to medium for other models", () => {
    expect(getModelTier("claude-sonnet-4-5-20250929")).toBe("medium");
    expect(getModelTier("gpt-4o")).toBe("medium");
    expect(getModelTier("unknown-model")).toBe("medium");
  });
});
