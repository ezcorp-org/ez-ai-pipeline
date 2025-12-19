import type { ZodIssue } from "zod";
import { PipelineConfigSchema, PipelineInputSchema } from "@schema/pipeline.schema.ts";
import type { PipelineConfig } from "@typings/pipeline.ts";
import { ValidationError } from "@utils/errors.ts";

export interface ValidationResult {
  valid: boolean;
  errors: ZodIssue[];
  data?: PipelineConfig;
}

export function validatePipelineConfig(config: unknown): ValidationResult {
  const result = PipelineConfigSchema.safeParse(config);

  if (result.success) {
    return {
      valid: true,
      errors: [],
      data: result.data,
    };
  }

  return {
    valid: false,
    errors: result.error.errors,
  };
}

export function validateInput(input: unknown): { prompt: string; context?: Record<string, unknown> } {
  const result = PipelineInputSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError("Invalid pipeline input", result.error.errors);
  }

  return result.data;
}

export function validateStageReferences(config: PipelineConfig): ValidationResult {
  const stageIds = new Set(config.stages.map((s) => s.id));
  const errors: ZodIssue[] = [];

  for (const stage of config.stages) {
    // Check variable references
    for (const variable of stage.prompt.variables) {
      if (variable.source === "previousStage" && variable.stageId) {
        if (!stageIds.has(variable.stageId)) {
          errors.push({
            code: "custom",
            path: ["stages", stage.id, "prompt", "variables", variable.name],
            message: `Stage reference "${variable.stageId}" not found`,
          });
        }
      }
    }

    // Check condition references
    if (stage.conditions?.skipIf?.sourceStage) {
      if (!stageIds.has(stage.conditions.skipIf.sourceStage)) {
        errors.push({
          code: "custom",
          path: ["stages", stage.id, "conditions", "skipIf", "sourceStage"],
          message: `Stage reference "${stage.conditions.skipIf.sourceStage}" not found`,
        });
      }
    }

    if (stage.conditions?.runIf?.sourceStage) {
      if (!stageIds.has(stage.conditions.runIf.sourceStage)) {
        errors.push({
          code: "custom",
          path: ["stages", stage.id, "conditions", "runIf", "sourceStage"],
          message: `Stage reference "${stage.conditions.runIf.sourceStage}" not found`,
        });
      }
    }

    if (stage.conditions?.earlyExit?.returnStage) {
      if (!stageIds.has(stage.conditions.earlyExit.returnStage)) {
        errors.push({
          code: "custom",
          path: ["stages", stage.id, "conditions", "earlyExit", "returnStage"],
          message: `Stage reference "${stage.conditions.earlyExit.returnStage}" not found`,
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? config : undefined,
  };
}

export function validateFull(config: unknown): PipelineConfig {
  const schemaResult = validatePipelineConfig(config);

  if (!schemaResult.valid || !schemaResult.data) {
    throw new ValidationError("Invalid pipeline configuration", schemaResult.errors);
  }

  const refResult = validateStageReferences(schemaResult.data);

  if (!refResult.valid) {
    throw new ValidationError("Invalid stage references", refResult.errors);
  }

  return schemaResult.data;
}
