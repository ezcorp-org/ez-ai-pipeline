import { describe, it, expect } from "bun:test";
import {
  PipelineConfigSchema,
  ModelConfigSchema,
  StageSchema,
} from "../src/schema/pipeline.schema.ts";
import { validatePipelineConfig, validateStageReferences } from "../src/schema/validator.ts";

describe("ModelConfigSchema", () => {
  it("should validate a valid model config", () => {
    const config = {
      providerID: "anthropic",
      modelID: "claude-haiku-4-5-20251001",
      tier: "small",
      maxTokens: 1024,
      temperature: 0.7,
    };

    const result = ModelConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("should reject invalid provider", () => {
    const config = {
      providerID: "invalid",
      modelID: "test-model",
    };

    const result = ModelConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it("should apply defaults for optional fields", () => {
    const config = {
      providerID: "anthropic",
      modelID: "claude-haiku-4-5-20251001",
    };

    const result = ModelConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.maxTokens).toBe(4096);
      expect(result.data.temperature).toBe(0.7);
    }
  });

  it("should reject temperature out of range", () => {
    const config = {
      providerID: "anthropic",
      modelID: "test-model",
      temperature: 3,
    };

    const result = ModelConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });
});

describe("StageSchema", () => {
  it("should validate a complete stage definition", () => {
    const stage = {
      id: "stage-1",
      name: "Test Stage",
      type: "analyze",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
      },
      prompt: {
        template: "Analyze: {{input_prompt}}",
        variables: [],
      },
    };

    const result = StageSchema.safeParse(stage);
    expect(result.success).toBe(true);
  });

  it("should reject invalid stage type", () => {
    const stage = {
      id: "stage-1",
      name: "Test Stage",
      type: "invalid-type",
      model: {
        providerID: "anthropic",
        modelID: "test-model",
      },
      prompt: {
        template: "Test",
      },
    };

    const result = StageSchema.safeParse(stage);
    expect(result.success).toBe(false);
  });
});

describe("PipelineConfigSchema", () => {
  it("should validate a complete pipeline configuration", () => {
    const config = {
      pipeline: {
        id: "test-pipeline",
        name: "Test Pipeline",
        version: "1.0.0",
      },
      stages: [
        {
          id: "stage-1",
          name: "Test Stage",
          type: "analyze",
          model: {
            providerID: "anthropic",
            modelID: "claude-haiku-4-5-20251001",
          },
          prompt: {
            template: "Test: {{input}}",
          },
        },
      ],
    };

    const result = PipelineConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it("should reject pipeline with no stages", () => {
    const config = {
      pipeline: {
        id: "test-pipeline",
        name: "Test Pipeline",
        version: "1.0.0",
      },
      stages: [],
    };

    const result = PipelineConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });
});

describe("validatePipelineConfig", () => {
  it("should return valid result for correct config", () => {
    const config = {
      pipeline: {
        id: "test-pipeline",
        name: "Test Pipeline",
        version: "1.0.0",
      },
      stages: [
        {
          id: "stage-1",
          name: "Test Stage",
          type: "analyze",
          model: {
            providerID: "anthropic",
            modelID: "claude-haiku-4-5-20251001",
          },
          prompt: {
            template: "Test",
          },
        },
      ],
    };

    const result = validatePipelineConfig(config);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBeDefined();
  });

  it("should return errors for invalid config", () => {
    const config = {
      pipeline: {},
      stages: [],
    };

    const result = validatePipelineConfig(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

describe("validateStageReferences", () => {
  it("should pass when all stage references are valid", () => {
    const config = {
      pipeline: {
        id: "test",
        name: "Test",
        version: "1.0.0",
        defaultProvider: "anthropic" as const,
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
          type: "analyze" as const,
          model: { providerID: "anthropic" as const, modelID: "test", maxTokens: 1024, temperature: 0.7 },
          prompt: { template: "Test", variables: [] },
          retryCount: 0,
          timeoutMs: 60000,
        },
        {
          id: "stage-2",
          name: "Stage 2",
          type: "enhance" as const,
          model: { providerID: "anthropic" as const, modelID: "test", maxTokens: 1024, temperature: 0.7 },
          prompt: {
            template: "Test",
            variables: [
              {
                name: "prev",
                source: "previousStage" as const,
                stageId: "stage-1",
                required: true,
              },
            ],
          },
          retryCount: 0,
          timeoutMs: 60000,
        },
      ],
    };

    const result = validateStageReferences(config);
    expect(result.valid).toBe(true);
  });

  it("should fail when stage reference does not exist", () => {
    const config = {
      pipeline: {
        id: "test",
        name: "Test",
        version: "1.0.0",
        defaultProvider: "anthropic" as const,
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
          type: "analyze" as const,
          model: { providerID: "anthropic" as const, modelID: "test", maxTokens: 1024, temperature: 0.7 },
          prompt: {
            template: "Test",
            variables: [
              {
                name: "prev",
                source: "previousStage" as const,
                stageId: "non-existent",
                required: true,
              },
            ],
          },
          retryCount: 0,
          timeoutMs: 60000,
        },
      ],
    };

    const result = validateStageReferences(config);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
