import type { PipelineSettings } from "@typings/pipeline.ts";
import type { ModelConfig } from "@typings/stage.ts";

export const DEFAULT_PIPELINE_SETTINGS: PipelineSettings = {
  enableCaching: true,
  enableEarlyExit: true,
  maxRetries: 2,
  timeoutMs: 300000,
  parallelExecution: false,
};

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  providerID: "anthropic",
  modelID: "claude-haiku-4-5-20251001",
  tier: "small",
  maxTokens: 4096,
  temperature: 0.7,
};

export const DEFAULT_LARGE_MODEL_CONFIG: ModelConfig = {
  providerID: "anthropic",
  modelID: "claude-sonnet-4-5-20250929",
  tier: "medium",
  maxTokens: 8192,
  temperature: 0.7,
};

export const CLI_DEFAULTS = {
  outputDir: "./outputs",
  pipelineDir: "./pipelines",
  quiet: false,
  json: false,
  verbose: false,
};
