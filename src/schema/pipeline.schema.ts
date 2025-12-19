import { z } from "zod";

// Model Configuration
export const ModelConfigSchema = z.object({
  providerID: z.enum(["anthropic", "openai", "google"]),
  modelID: z.string().min(1),
  tier: z.enum(["small", "medium", "large"]).optional(),
  maxTokens: z.number().int().positive().default(4096),
  temperature: z.number().min(0).max(2).default(0.7),
});

// Variable Configuration
export const VariableSchema = z.object({
  name: z.string().min(1),
  source: z.enum(["input", "previousStage", "context", "static"]),
  path: z.string().optional(),
  stageId: z.string().optional(),
  value: z.unknown().optional(),
  required: z.boolean().default(true),
});

// Prompt Configuration
export const PromptConfigSchema = z.object({
  systemPrompt: z.string().optional(),
  template: z.string().min(1),
  variables: z.array(VariableSchema).default([]),
});

// Output Extract Configuration
export const ExtractConfigSchema = z.object({
  name: z.string().min(1),
  path: z.string().min(1),
  required: z.boolean().default(true),
  default: z.unknown().optional(),
});

// Output Configuration
export const OutputConfigSchema = z.object({
  format: z.enum(["json", "text", "markdown"]).default("text"),
  schema: z.record(z.unknown()).optional(),
  extract: z.array(ExtractConfigSchema).default([]),
});

// Condition Configuration
export const ConditionConfigSchema = z.object({
  path: z.string().min(1),
  equals: z.unknown().optional(),
  notEquals: z.unknown().optional(),
  contains: z.string().optional(),
  greaterThan: z.number().optional(),
  lessThan: z.number().optional(),
  exists: z.boolean().optional(),
});

// Skip/Run Condition
export const SkipRunConditionSchema = z.object({
  condition: ConditionConfigSchema,
  sourceStage: z.string().optional(),
});

// Early Exit Condition
export const EarlyExitConditionSchema = z.object({
  condition: ConditionConfigSchema,
  returnStage: z.string().min(1),
});

// Stage Conditions
export const ConditionsSchema = z.object({
  skipIf: SkipRunConditionSchema.optional(),
  runIf: SkipRunConditionSchema.optional(),
  earlyExit: EarlyExitConditionSchema.optional(),
});

// Stage Definition
export const StageSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  type: z.enum(["analyze", "structure", "enhance", "validate", "test", "iterate", "custom"]),
  description: z.string().optional(),
  model: ModelConfigSchema,
  prompt: PromptConfigSchema,
  output: OutputConfigSchema.optional(),
  conditions: ConditionsSchema.optional(),
  retryCount: z.number().int().min(0).max(5).default(0),
  timeoutMs: z.number().int().positive().default(60000),
});

// Pipeline Settings
export const PipelineSettingsSchema = z.object({
  enableCaching: z.boolean().default(true),
  enableEarlyExit: z.boolean().default(true),
  maxRetries: z.number().int().min(0).max(5).default(2),
  timeoutMs: z.number().int().positive().default(300000),
  parallelExecution: z.boolean().default(false),
});

// Pipeline Definition
export const PipelineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().optional(),
  defaultProvider: z.enum(["anthropic", "openai", "google"]).default("anthropic"),
  targetModel: ModelConfigSchema.optional(),
  settings: PipelineSettingsSchema.default({}),
});

// Full Pipeline Configuration
export const PipelineConfigSchema = z.object({
  pipeline: PipelineSchema,
  stages: z.array(StageSchema).min(1),
});

// Input Schema for pipeline execution
export const PipelineInputSchema = z.object({
  prompt: z.string().min(1),
  context: z.record(z.unknown()).optional(),
});

export type PipelineInput = z.infer<typeof PipelineInputSchema>;
