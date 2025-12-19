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
});
