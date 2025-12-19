import type { z } from "zod";
import type {
  StageSchema,
  ModelConfigSchema,
  PromptConfigSchema,
  OutputConfigSchema,
  ConditionsSchema,
  VariableSchema,
} from "@schema/pipeline.schema.ts";

export type Stage = z.infer<typeof StageSchema>;
export type ModelConfig = z.infer<typeof ModelConfigSchema>;
export type PromptConfig = z.infer<typeof PromptConfigSchema>;
export type OutputConfig = z.infer<typeof OutputConfigSchema>;
export type Conditions = z.infer<typeof ConditionsSchema>;
export type Variable = z.infer<typeof VariableSchema>;

export type StageType =
  | "analyze"
  | "structure"
  | "enhance"
  | "validate"
  | "test"
  | "iterate"
  | "custom";

export type StageStatus = "pending" | "running" | "completed" | "skipped" | "failed";

export type VariableSource = "input" | "previousStage" | "context" | "static";
export type OutputFormat = "json" | "text" | "markdown";
