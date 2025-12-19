import { describe, it, expect, beforeEach } from "bun:test";
import { evaluateConditions, evaluateEarlyExit } from "../src/core/condition-evaluator.ts";
import { PipelineContext } from "../src/core/context.ts";
import type { PipelineConfig } from "../src/typings/pipeline.ts";
import type { Stage } from "../src/typings/stage.ts";

const createMockConfig = (): PipelineConfig => ({
  pipeline: {
    id: "test",
    name: "Test",
    version: "1.0.0",
    defaultProvider: "anthropic",
    settings: {
      enableCaching: true,
      enableEarlyExit: true,
      maxRetries: 2,
      timeoutMs: 60000,
      parallelExecution: false,
    },
  },
  stages: [
    {
      id: "stage-1",
      name: "Stage 1",
      type: "analyze",
      model: { providerID: "anthropic", modelID: "test", maxTokens: 1024, temperature: 0.7 },
      prompt: { template: "Test", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
    },
    {
      id: "stage-2",
      name: "Stage 2",
      type: "enhance",
      model: { providerID: "anthropic", modelID: "test", maxTokens: 1024, temperature: 0.7 },
      prompt: { template: "Test", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
    },
  ],
});

const createMockStage = (conditions?: Stage["conditions"]): Stage => ({
  id: "test-stage",
  name: "Test Stage",
  type: "analyze",
  model: { providerID: "anthropic", modelID: "test", maxTokens: 1024, temperature: 0.7 },
  prompt: { template: "Test", variables: [] },
  retryCount: 0,
  timeoutMs: 60000,
  conditions,
});

describe("evaluateConditions", () => {
  let context: PipelineContext;

  beforeEach(() => {
    context = new PipelineContext(createMockConfig(), "test prompt");
  });

  it("should return no skip when no conditions", () => {
    const stage = createMockStage();
    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(false);
    expect(result.shouldEarlyExit).toBe(false);
  });

  it("should skip when skipIf equals condition matches", () => {
    // First add a result for stage-1
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { status: "complete" },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "status", equals: "complete" },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
    expect(result.reason).toContain("skipIf");
  });

  it("should not skip when skipIf condition does not match", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { status: "incomplete" },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "status", equals: "complete" },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(false);
  });

  it("should skip when runIf condition does not match", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { needsEnhancement: false },
    });

    const stage = createMockStage({
      runIf: {
        condition: { path: "needsEnhancement", equals: true },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
    expect(result.reason).toContain("runIf");
  });

  it("should not skip when runIf condition matches", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { needsEnhancement: true },
    });

    const stage = createMockStage({
      runIf: {
        condition: { path: "needsEnhancement", equals: true },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(false);
  });
});

describe("evaluateEarlyExit", () => {
  let context: PipelineContext;

  beforeEach(() => {
    context = new PipelineContext(createMockConfig(), "test prompt");
  });

  it("should not trigger early exit when disabled", () => {
    const stage = createMockStage({
      earlyExit: {
        condition: { path: "complete", equals: true },
        returnStage: "stage-1",
      },
    });

    context.setStageResult("test-stage", {
      stageId: "test-stage",
      stageName: "Test Stage",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { complete: true },
    });

    const result = evaluateEarlyExit(stage, context, false);

    expect(result.shouldEarlyExit).toBe(false);
  });

  it("should trigger early exit when condition matches", () => {
    const stage = createMockStage({
      earlyExit: {
        condition: { path: "status", equals: "COMPLETE" },
        returnStage: "test-stage",
      },
    });

    context.setStageResult("test-stage", {
      stageId: "test-stage",
      stageName: "Test Stage",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { status: "COMPLETE" },
    });

    const result = evaluateEarlyExit(stage, context, true);

    expect(result.shouldEarlyExit).toBe(true);
    expect(result.earlyExitStage).toBe("test-stage");
  });

  it("should not trigger early exit when condition does not match", () => {
    const stage = createMockStage({
      earlyExit: {
        condition: { path: "status", equals: "COMPLETE" },
        returnStage: "test-stage",
      },
    });

    context.setStageResult("test-stage", {
      stageId: "test-stage",
      stageName: "Test Stage",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { status: "NEEDS_WORK" },
    });

    const result = evaluateEarlyExit(stage, context, true);

    expect(result.shouldEarlyExit).toBe(false);
  });

  it("should not trigger early exit when no earlyExit conditions", () => {
    const stage = createMockStage();

    const result = evaluateEarlyExit(stage, context, true);

    expect(result.shouldEarlyExit).toBe(false);
  });

  it("should not trigger early exit when stage result does not exist", () => {
    const stage = createMockStage({
      earlyExit: {
        condition: { path: "status", equals: "COMPLETE" },
        returnStage: "test-stage",
      },
    });

    const result = evaluateEarlyExit(stage, context, true);

    expect(result.shouldEarlyExit).toBe(false);
  });

  it("should not trigger early exit when stage has no parsedOutput", () => {
    const stage = createMockStage({
      earlyExit: {
        condition: { path: "status", equals: "COMPLETE" },
        returnStage: "test-stage",
      },
    });

    context.setStageResult("test-stage", {
      stageId: "test-stage",
      stageName: "Test Stage",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
    });

    const result = evaluateEarlyExit(stage, context, true);

    expect(result.shouldEarlyExit).toBe(false);
  });
});

describe("condition evaluation operators", () => {
  let context: PipelineContext;

  beforeEach(() => {
    context = new PipelineContext(createMockConfig(), "test prompt");
  });

  it("should evaluate notEquals condition", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { status: "incomplete" },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "status", notEquals: "complete" },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should evaluate contains condition for strings", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { message: "This contains important text" },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "message", contains: "important" },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should evaluate greaterThan condition for numbers", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { score: 85 },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "score", greaterThan: 80 },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should evaluate lessThan condition for numbers", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { score: 45 },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "score", lessThan: 50 },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should evaluate exists condition when value exists", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { hasData: true },
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "hasData", exists: true },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should evaluate exists condition when value does not exist", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: {},
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "missingField", exists: false },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should use previous stage when sourceStage is undefined", () => {
    // Set up stage-1 result
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { status: "ready" },
    });

    // Create stage-2 with condition without explicit sourceStage
    const stage = {
      id: "stage-2",
      name: "Stage 2",
      type: "enhance" as const,
      model: { providerID: "anthropic" as const, modelID: "test", maxTokens: 1024, temperature: 0.7 },
      prompt: { template: "Test", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
      conditions: {
        skipIf: {
          condition: { path: "status", equals: "ready" },
        },
      },
    };

    // Advance to stage-2 position
    context.advanceStage();

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should use input when no previous stage exists", () => {
    // Stage-1 checking input with no sourceStage specified
    const stage = {
      id: "stage-1",
      name: "Stage 1",
      type: "analyze" as const,
      model: { providerID: "anthropic" as const, modelID: "test", maxTokens: 1024, temperature: 0.7 },
      prompt: { template: "Test", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
      conditions: {
        skipIf: {
          condition: { path: "prompt", equals: "test prompt" },
        },
      },
    };

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(true);
  });

  it("should use raw output when parsedOutput is not available", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "simple text output",
    });

    const stage = createMockStage({
      skipIf: {
        condition: { path: "prompt", equals: "test prompt" },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    // Should not skip since raw output doesn't have a "prompt" path
    expect(result.shouldSkip).toBe(false);
  });

  it("should return false for condition with no matching operator", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { value: "test" },
    });

    // Create a condition that will reach the default return false
    const stage = createMockStage({
      skipIf: {
        condition: { path: "value" } as any, // No operator specified
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    expect(result.shouldSkip).toBe(false);
  });

  it("should handle deeply nested path that becomes non-object", () => {
    context.setStageResult("stage-1", {
      stageId: "stage-1",
      stageName: "Stage 1",
      status: "completed",
      duration: 100,
      model: "test",
      cost: 0.01,
      inputTokens: 100,
      outputTokens: 50,
      output: "raw",
      parsedOutput: { data: { level1: "string value" } },
    });

    const stage = createMockStage({
      skipIf: {
        // Trying to access level1.level2 where level1 is a string
        condition: { path: "data.level1.level2", equals: "something" },
        sourceStage: "stage-1",
      },
    });

    const result = evaluateConditions(stage, context, true);

    // Should not skip because path returns undefined
    expect(result.shouldSkip).toBe(false);
  });
});
