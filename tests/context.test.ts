import { describe, it, expect, beforeEach } from "bun:test";
import { PipelineContext } from "../src/core/context.ts";
import type { PipelineConfig } from "../src/typings/pipeline.ts";
import type { StageResult } from "../src/typings/result.ts";

const createMockConfig = (): PipelineConfig => ({
  pipeline: {
    id: "test-pipeline",
    name: "Test Pipeline",
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
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test template 1", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
    },
    {
      id: "stage-2",
      name: "Stage 2",
      type: "enhance",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test template 2", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
    },
    {
      id: "stage-3",
      name: "Stage 3",
      type: "validate",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test template 3", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
    },
  ],
});

const createMockStageResult = (
  stageId: string,
  stageName: string,
  status: "completed" | "failed" | "skipped" = "completed",
  parsedOutput?: Record<string, unknown>
): StageResult => ({
  stageId,
  stageName,
  status,
  duration: 100,
  model: "claude-sonnet-4-5-20250929",
  cost: 0.01,
  inputTokens: 100,
  outputTokens: 50,
  output: "raw output",
  parsedOutput,
});

describe("PipelineContext", () => {
  let context: PipelineContext;

  beforeEach(() => {
    context = new PipelineContext(createMockConfig(), "test prompt");
  });

  describe("constructor", () => {
    it("should initialize with input prompt", () => {
      expect(context.input.prompt).toBe("test prompt");
    });

    it("should initialize with additional context", () => {
      const additionalContext = { userId: "123", sessionId: "abc" };
      const ctx = new PipelineContext(
        createMockConfig(),
        "test",
        additionalContext
      );

      expect(ctx.input.prompt).toBe("test");
      expect(ctx.input.userId).toBe("123");
      expect(ctx.input.sessionId).toBe("abc");
      expect(ctx.context.userId).toBe("123");
      expect(ctx.context.sessionId).toBe("abc");
    });

    it("should initialize empty stages map", () => {
      expect(context.stages.size).toBe(0);
    });
  });

  describe("currentStageIndex", () => {
    it("should start at 0", () => {
      expect(context.currentStageIndex).toBe(0);
    });

    it("should increment with advanceStage", () => {
      context.advanceStage();
      expect(context.currentStageIndex).toBe(1);
    });
  });

  describe("totalStages", () => {
    it("should return the total number of stages", () => {
      expect(context.totalStages).toBe(3);
    });
  });

  describe("currentStage", () => {
    it("should return the first stage initially", () => {
      expect(context.currentStage?.id).toBe("stage-1");
      expect(context.currentStage?.name).toBe("Stage 1");
    });

    it("should return the correct stage after advancing", () => {
      context.advanceStage();
      expect(context.currentStage?.id).toBe("stage-2");

      context.advanceStage();
      expect(context.currentStage?.id).toBe("stage-3");
    });
  });

  describe("isPaused", () => {
    it("should start as false", () => {
      expect(context.isPaused).toBe(false);
    });

    it("should be true after pause", () => {
      context.pause();
      expect(context.isPaused).toBe(true);
    });

    it("should be false after resume", () => {
      context.pause();
      context.resume();
      expect(context.isPaused).toBe(false);
    });
  });

  describe("isCancelled", () => {
    it("should start as false", () => {
      expect(context.isCancelled).toBe(false);
    });

    it("should be true after cancel", () => {
      context.cancel();
      expect(context.isCancelled).toBe(true);
    });
  });

  describe("advanceStage", () => {
    it("should increment stage index", () => {
      expect(context.currentStageIndex).toBe(0);
      context.advanceStage();
      expect(context.currentStageIndex).toBe(1);
      context.advanceStage();
      expect(context.currentStageIndex).toBe(2);
    });
  });

  describe("setStageResult", () => {
    it("should store stage result", () => {
      const result = createMockStageResult("stage-1", "Stage 1");
      context.setStageResult("stage-1", result);

      expect(context.stages.has("stage-1")).toBe(true);
      expect(context.stages.get("stage-1")).toBe(result);
    });

    it("should update context with parsed output", () => {
      const result = createMockStageResult("stage-1", "Stage 1", "completed", {
        analysis: "completed",
        score: 85,
      });
      context.setStageResult("stage-1", result);

      expect(context.context["stage-1"]).toEqual({
        analysis: "completed",
        score: 85,
      });
    });

    it("should not update context if no parsed output", () => {
      const result = createMockStageResult("stage-1", "Stage 1");
      result.parsedOutput = undefined;
      context.setStageResult("stage-1", result);

      expect(context.context["stage-1"]).toBeUndefined();
    });
  });

  describe("getStageResult", () => {
    it("should return undefined for non-existent stage", () => {
      expect(context.getStageResult("stage-1")).toBeUndefined();
    });

    it("should return stored result", () => {
      const result = createMockStageResult("stage-1", "Stage 1");
      context.setStageResult("stage-1", result);

      expect(context.getStageResult("stage-1")).toBe(result);
    });
  });

  describe("pause and resume", () => {
    it("should toggle pause state", () => {
      expect(context.isPaused).toBe(false);

      context.pause();
      expect(context.isPaused).toBe(true);

      context.resume();
      expect(context.isPaused).toBe(false);
    });
  });

  describe("cancel", () => {
    it("should set cancelled state", () => {
      expect(context.isCancelled).toBe(false);

      context.cancel();
      expect(context.isCancelled).toBe(true);
    });
  });

  describe("getTemplateContext", () => {
    it("should return input, stages, and context", () => {
      const result = createMockStageResult("stage-1", "Stage 1");
      context.setStageResult("stage-1", result);

      const templateContext = context.getTemplateContext();

      expect(templateContext.input).toBe(context.input);
      expect(templateContext.stages).toBe(context.stages);
      expect(templateContext.context).toBe(context.context);
    });
  });

  describe("getCompletedStageIds", () => {
    it("should return empty array initially", () => {
      expect(context.getCompletedStageIds()).toEqual([]);
    });

    it("should return all stage IDs with results", () => {
      context.setStageResult("stage-1", createMockStageResult("stage-1", "Stage 1"));
      context.setStageResult("stage-2", createMockStageResult("stage-2", "Stage 2"));

      const ids = context.getCompletedStageIds();
      expect(ids).toContain("stage-1");
      expect(ids).toContain("stage-2");
      expect(ids.length).toBe(2);
    });
  });

  describe("getAllResults", () => {
    it("should return empty array initially", () => {
      expect(context.getAllResults()).toEqual([]);
    });

    it("should return all stage results", () => {
      const result1 = createMockStageResult("stage-1", "Stage 1");
      const result2 = createMockStageResult("stage-2", "Stage 2");

      context.setStageResult("stage-1", result1);
      context.setStageResult("stage-2", result2);

      const results = context.getAllResults();
      expect(results).toContain(result1);
      expect(results).toContain(result2);
      expect(results.length).toBe(2);
    });
  });

  describe("getSummary", () => {
    it("should return zero summary for no results", () => {
      const summary = context.getSummary();

      expect(summary.stagesRun).toBe(0);
      expect(summary.stagesSkipped).toBe(0);
      expect(summary.stagesFailed).toBe(0);
      expect(summary.totalDuration).toBe(0);
      expect(summary.totalCost).toBe(0);
      expect(summary.totalInputTokens).toBe(0);
      expect(summary.totalOutputTokens).toBe(0);
    });

    it("should calculate summary correctly", () => {
      context.setStageResult(
        "stage-1",
        createMockStageResult("stage-1", "Stage 1", "completed")
      );
      context.setStageResult(
        "stage-2",
        createMockStageResult("stage-2", "Stage 2", "skipped")
      );
      context.setStageResult(
        "stage-3",
        createMockStageResult("stage-3", "Stage 3", "failed")
      );

      const summary = context.getSummary();

      expect(summary.stagesRun).toBe(1);
      expect(summary.stagesSkipped).toBe(1);
      expect(summary.stagesFailed).toBe(1);
      expect(summary.totalDuration).toBe(300); // 3 stages * 100ms
      expect(summary.totalCost).toBeCloseTo(0.03); // 3 stages * 0.01
      expect(summary.totalInputTokens).toBe(300); // 3 stages * 100
      expect(summary.totalOutputTokens).toBe(150); // 3 stages * 50
    });
  });

  describe("getOutput", () => {
    it("should return empty object if no stages completed", () => {
      expect(context.getOutput()).toEqual({});
    });

    it("should return last completed stage output", () => {
      context.setStageResult(
        "stage-1",
        createMockStageResult("stage-1", "Stage 1", "completed", {
          optimizedPrompt: "Optimized prompt from stage 1",
        })
      );

      const output = context.getOutput();
      expect(output.optimizedPrompt).toBe("Optimized prompt from stage 1");
    });

    it("should skip failed stages when finding last completed", () => {
      context.setStageResult(
        "stage-1",
        createMockStageResult("stage-1", "Stage 1", "completed", {
          optimizedPrompt: "Optimized from stage 1",
        })
      );
      context.setStageResult(
        "stage-2",
        createMockStageResult("stage-2", "Stage 2", "failed")
      );

      const output = context.getOutput();
      expect(output.optimizedPrompt).toBe("Optimized from stage 1");
    });

    it("should use raw output if no parsedOutput.optimizedPrompt", () => {
      const result = createMockStageResult("stage-1", "Stage 1", "completed", {
        analysis: "some analysis",
      });
      result.output = "raw output text";
      context.setStageResult("stage-1", result);

      const output = context.getOutput();
      expect(output.optimizedPrompt).toBe("raw output text");
    });

    it("should include context in output", () => {
      context.setStageResult(
        "stage-1",
        createMockStageResult("stage-1", "Stage 1", "completed", {
          optimizedPrompt: "test",
          extraData: "value",
        })
      );

      const output = context.getOutput();
      expect(output.optimizedPrompt).toBe("test");
      expect(output["stage-1"]).toEqual({
        optimizedPrompt: "test",
        extraData: "value",
      });
    });

    it("should return last completed stage in reverse order", () => {
      // Add stages in order
      context.setStageResult(
        "stage-1",
        createMockStageResult("stage-1", "Stage 1", "completed", {
          optimizedPrompt: "stage 1 output",
        })
      );
      context.setStageResult(
        "stage-2",
        createMockStageResult("stage-2", "Stage 2", "skipped")
      );
      context.setStageResult(
        "stage-3",
        createMockStageResult("stage-3", "Stage 3", "completed", {
          optimizedPrompt: "stage 3 output",
        })
      );

      const output = context.getOutput();
      // Should return the last completed stage (stage-3)
      expect(output.optimizedPrompt).toBe("stage 3 output");
    });
  });
});
