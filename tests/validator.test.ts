import { describe, it, expect } from "bun:test";
import {
  validatePipelineConfig,
  validateInput,
  validateStageReferences,
  validateFull,
} from "../src/schema/validator.ts";
import { ValidationError } from "../src/utils/errors.ts";
import type { PipelineConfig } from "../src/typings/pipeline.ts";

const createValidConfig = (): PipelineConfig => ({
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
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test", variables: [] },
      retryCount: 0,
      timeoutMs: 60000,
    },
  ],
});

describe("validatePipelineConfig", () => {
  it("should validate a valid config", () => {
    const config = createValidConfig();
    const result = validatePipelineConfig(config);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBeDefined();
  });

  it("should return errors for invalid config", () => {
    const invalidConfig = {
      pipeline: {},
      stages: [],
    };

    const result = validatePipelineConfig(invalidConfig);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.data).toBeUndefined();
  });
});

describe("validateInput", () => {
  it("should validate input with just prompt", () => {
    const input = { prompt: "test prompt" };
    const result = validateInput(input);

    expect(result.prompt).toBe("test prompt");
  });

  it("should validate input with prompt and context", () => {
    const input = {
      prompt: "test prompt",
      context: { userId: "123", sessionId: "abc" },
    };

    const result = validateInput(input);

    expect(result.prompt).toBe("test prompt");
    expect(result.context).toEqual({ userId: "123", sessionId: "abc" });
  });

  it("should throw ValidationError for invalid input", () => {
    const invalidInput = { notPrompt: "value" };

    expect(() => validateInput(invalidInput)).toThrow(ValidationError);
  });

  it("should throw ValidationError with issues for missing prompt", () => {
    const invalidInput = {};

    try {
      validateInput(invalidInput);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.issues.length).toBeGreaterThan(0);
      }
    }
  });
});

describe("validateStageReferences", () => {
  it("should pass for config with no stage references", () => {
    const config = createValidConfig();
    const result = validateStageReferences(config);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBe(config);
  });

  it("should pass for valid previousStage variable reference", () => {
    const config = createValidConfig();
    config.stages.push({
      id: "stage-2",
      name: "Stage 2",
      type: "enhance",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: {
        template: "Test {{prev}}",
        variables: [
          {
            name: "prev",
            source: "previousStage",
            stageId: "stage-1",
            required: true,
          },
        ],
      },
      retryCount: 0,
      timeoutMs: 60000,
    });

    const result = validateStageReferences(config);

    expect(result.valid).toBe(true);
  });

  it("should fail for invalid previousStage variable reference", () => {
    const config = createValidConfig();
    config.stages[0].prompt.variables = [
      {
        name: "invalid",
        source: "previousStage",
        stageId: "non-existent-stage",
        required: true,
      },
    ];

    const result = validateStageReferences(config);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.data).toBeUndefined();
    expect(result.errors[0].message).toContain("non-existent-stage");
  });

  it("should pass for valid skipIf condition reference", () => {
    const config = createValidConfig();
    config.stages.push({
      id: "stage-2",
      name: "Stage 2",
      type: "enhance",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test", variables: [] },
      conditions: {
        skipIf: {
          condition: { path: "status", equals: "complete" },
          sourceStage: "stage-1",
        },
      },
      retryCount: 0,
      timeoutMs: 60000,
    });

    const result = validateStageReferences(config);

    expect(result.valid).toBe(true);
  });

  it("should fail for invalid skipIf condition reference", () => {
    const config = createValidConfig();
    config.stages[0].conditions = {
      skipIf: {
        condition: { path: "status", equals: "complete" },
        sourceStage: "non-existent-stage",
      },
    };

    const result = validateStageReferences(config);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain("non-existent-stage");
  });

  it("should pass for valid runIf condition reference", () => {
    const config = createValidConfig();
    config.stages.push({
      id: "stage-2",
      name: "Stage 2",
      type: "enhance",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test", variables: [] },
      conditions: {
        runIf: {
          condition: { path: "needsWork", equals: true },
          sourceStage: "stage-1",
        },
      },
      retryCount: 0,
      timeoutMs: 60000,
    });

    const result = validateStageReferences(config);

    expect(result.valid).toBe(true);
  });

  it("should fail for invalid runIf condition reference", () => {
    const config = createValidConfig();
    config.stages[0].conditions = {
      runIf: {
        condition: { path: "needsWork", equals: true },
        sourceStage: "non-existent-stage",
      },
    };

    const result = validateStageReferences(config);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain("non-existent-stage");
  });

  it("should pass for valid earlyExit condition reference", () => {
    const config = createValidConfig();
    config.stages.push({
      id: "stage-2",
      name: "Stage 2",
      type: "enhance",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        maxTokens: 1024,
        temperature: 0.7,
      },
      prompt: { template: "Test", variables: [] },
      conditions: {
        earlyExit: {
          condition: { path: "complete", equals: true },
          returnStage: "stage-1",
        },
      },
      retryCount: 0,
      timeoutMs: 60000,
    });

    const result = validateStageReferences(config);

    expect(result.valid).toBe(true);
  });

  it("should fail for invalid earlyExit condition reference", () => {
    const config = createValidConfig();
    config.stages[0].conditions = {
      earlyExit: {
        condition: { path: "complete", equals: true },
        returnStage: "non-existent-stage",
      },
    };

    const result = validateStageReferences(config);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0].message).toContain("non-existent-stage");
  });

  it("should detect multiple invalid references", () => {
    const config = createValidConfig();
    config.stages[0].prompt.variables = [
      {
        name: "var1",
        source: "previousStage",
        stageId: "invalid-1",
        required: true,
      },
    ];
    config.stages[0].conditions = {
      skipIf: {
        condition: { path: "status", equals: "complete" },
        sourceStage: "invalid-2",
      },
      runIf: {
        condition: { path: "needsWork", equals: true },
        sourceStage: "invalid-3",
      },
      earlyExit: {
        condition: { path: "complete", equals: true },
        returnStage: "invalid-4",
      },
    };

    const result = validateStageReferences(config);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBe(4);
  });
});

describe("validateFull", () => {
  it("should validate a fully valid config", () => {
    const config = createValidConfig();
    const result = validateFull(config);

    expect(result).toBeDefined();
    expect(result.pipeline.id).toBe("test");
  });

  it("should throw ValidationError for invalid schema", () => {
    const invalidConfig = {
      pipeline: {},
      stages: [],
    };

    expect(() => validateFull(invalidConfig)).toThrow(ValidationError);
  });

  it("should throw ValidationError for invalid stage references", () => {
    const config = createValidConfig();
    config.stages[0].prompt.variables = [
      {
        name: "invalid",
        source: "previousStage",
        stageId: "non-existent",
        required: true,
      },
    ];

    expect(() => validateFull(config)).toThrow(ValidationError);
  });

  it("should throw ValidationError with message for schema errors", () => {
    const invalidConfig = { pipeline: {}, stages: [] };

    try {
      validateFull(invalidConfig);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.message).toBe("Invalid pipeline configuration");
        expect(error.issues.length).toBeGreaterThan(0);
      }
    }
  });

  it("should throw ValidationError with message for reference errors", () => {
    const config = createValidConfig();
    config.stages[0].conditions = {
      skipIf: {
        condition: { path: "status", equals: "complete" },
        sourceStage: "invalid-stage",
      },
    };

    try {
      validateFull(config);
      expect(true).toBe(false); // Should not reach here
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      if (error instanceof ValidationError) {
        expect(error.message).toBe("Invalid stage references");
        expect(error.issues.length).toBeGreaterThan(0);
      }
    }
  });
});
