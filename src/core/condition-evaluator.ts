import type { Conditions, Stage } from "@typings/stage.ts";
import type { PipelineContext } from "@core/context.ts";

export interface ConditionResult {
  shouldSkip: boolean;
  shouldEarlyExit: boolean;
  earlyExitStage?: string;
  reason?: string;
}

export function evaluateConditions(
  stage: Stage,
  context: PipelineContext,
  _enableEarlyExit: boolean
): ConditionResult {
  const conditions = stage.conditions;

  if (!conditions) {
    return { shouldSkip: false, shouldEarlyExit: false };
  }

  // Check skipIf condition
  if (conditions.skipIf) {
    const sourceData = getSourceData(conditions.skipIf.sourceStage, stage.id, context);
    if (evaluateCondition(conditions.skipIf.condition, sourceData)) {
      return {
        shouldSkip: true,
        shouldEarlyExit: false,
        reason: `skipIf condition met (path: ${conditions.skipIf.condition.path})`,
      };
    }
  }

  // Check runIf condition (inverse - skip if condition is NOT met)
  if (conditions.runIf) {
    const sourceData = getSourceData(conditions.runIf.sourceStage, stage.id, context);
    if (!evaluateCondition(conditions.runIf.condition, sourceData)) {
      return {
        shouldSkip: true,
        shouldEarlyExit: false,
        reason: `runIf condition not met (path: ${conditions.runIf.condition.path})`,
      };
    }
  }

  return { shouldSkip: false, shouldEarlyExit: false };
}

export function evaluateEarlyExit(
  stage: Stage,
  context: PipelineContext,
  enableEarlyExit: boolean
): ConditionResult {
  if (!enableEarlyExit) {
    return { shouldSkip: false, shouldEarlyExit: false };
  }

  const conditions = stage.conditions;

  if (!conditions?.earlyExit) {
    return { shouldSkip: false, shouldEarlyExit: false };
  }

  // Get the result of the current stage
  const stageResult = context.getStageResult(stage.id);
  if (!stageResult?.parsedOutput) {
    return { shouldSkip: false, shouldEarlyExit: false };
  }

  if (evaluateCondition(conditions.earlyExit.condition, stageResult.parsedOutput)) {
    return {
      shouldSkip: false,
      shouldEarlyExit: true,
      earlyExitStage: conditions.earlyExit.returnStage,
      reason: `earlyExit condition met (path: ${conditions.earlyExit.condition.path})`,
    };
  }

  return { shouldSkip: false, shouldEarlyExit: false };
}

function getSourceData(
  sourceStageId: string | undefined,
  currentStageId: string,
  context: PipelineContext
): unknown {
  if (!sourceStageId) {
    // Use the most recent stage result
    const allStages = context.config.stages;
    const currentIndex = allStages.findIndex((s) => s.id === currentStageId);

    if (currentIndex > 0) {
      const prevStage = allStages[currentIndex - 1];
      if (prevStage) {
        const result = context.getStageResult(prevStage.id);
        return result?.parsedOutput || result?.output;
      }
    }

    return context.input;
  }

  const result = context.getStageResult(sourceStageId);
  return result?.parsedOutput || result?.output;
}

function evaluateCondition(
  condition: NonNullable<Conditions["skipIf"]>["condition"],
  data: unknown
): boolean {
  const value = getValueByPath(data, condition.path);

  if (condition.equals !== undefined) {
    return value === condition.equals;
  }

  if (condition.notEquals !== undefined) {
    return value !== condition.notEquals;
  }

  if (condition.contains !== undefined && typeof value === "string") {
    return value.includes(condition.contains);
  }

  if (condition.greaterThan !== undefined && typeof value === "number") {
    return value > condition.greaterThan;
  }

  if (condition.lessThan !== undefined && typeof value === "number") {
    return value < condition.lessThan;
  }

  if (condition.exists !== undefined) {
    return condition.exists ? value !== undefined : value === undefined;
  }

  return false;
}

function getValueByPath(data: unknown, path: string): unknown {
  if (typeof data !== "object" || data === null) {
    return undefined;
  }

  const parts = path.split(".");
  let current: unknown = data;

  for (const part of parts) {
    if (typeof current !== "object" || current === null) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}
