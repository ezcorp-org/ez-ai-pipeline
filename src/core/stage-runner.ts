import type { Stage } from "@typings/stage.ts";
import type { StageResult } from "@typings/result.ts";
import type { PipelineContext } from "@core/context.ts";
import { SessionManager, type PromptResult } from "@core/session.ts";
import { parseOutput } from "@core/output-parser.ts";
import { evaluateConditions, evaluateEarlyExit, type ConditionResult } from "@core/condition-evaluator.ts";
import { buildPromptFromConfig } from "@utils/template.ts";
import { StageExecutionError } from "@utils/errors.ts";

export interface StageRunnerOptions {
  enableEarlyExit?: boolean;
  maxRetries?: number;
  timeoutMs?: number;
  onStageStart?: (stage: Stage, index: number, total: number) => void;
  onStageComplete?: (stage: Stage, result: StageResult) => void;
  onStageSkipped?: (stage: Stage, reason: string) => void;
  onStageFailed?: (stage: Stage, error: Error) => void;
}

export interface StageRunResult {
  result: StageResult;
  earlyExit?: ConditionResult;
}

export class StageRunner {
  private options: StageRunnerOptions;

  constructor(_session: SessionManager, options: StageRunnerOptions = {}) {
    this.options = options;
  }

  async execute(
    stage: Stage,
    context: PipelineContext,
    stageIndex: number
  ): Promise<StageRunResult> {
    const totalStages = context.config.stages.length;
    this.options.onStageStart?.(stage, stageIndex, totalStages);

    // Check pre-conditions
    const conditionResult = evaluateConditions(
      stage,
      context,
      this.options.enableEarlyExit ?? true
    );

    if (conditionResult.shouldSkip) {
      const result = this.createSkippedResult(stage, conditionResult.reason || "Condition not met");
      context.setStageResult(stage.id, result);
      this.options.onStageSkipped?.(stage, conditionResult.reason || "Condition not met");
      return { result };
    }

    const startTime = Date.now();

    try {
      // Build the prompt with variable interpolation
      const prompt = buildPromptFromConfig(
        stage.prompt.template,
        stage.prompt.variables,
        context.getTemplateContext()
      );

      // Call the model
      const modelResult = await this.callModel(stage, prompt);

      // Parse the output
      const parsedOutput = parseOutput(modelResult.text, stage.output);

      const result: StageResult = {
        stageId: stage.id,
        stageName: stage.name,
        status: "completed",
        duration: Date.now() - startTime,
        model: modelResult.model,
        cost: modelResult.cost.totalCost,
        inputTokens: modelResult.inputTokens,
        outputTokens: modelResult.outputTokens,
        output: modelResult.text,
        parsedOutput: parsedOutput.parsed,
      };

      context.setStageResult(stage.id, result);
      this.options.onStageComplete?.(stage, result);

      // Check for early exit after stage completion
      const earlyExitResult = evaluateEarlyExit(
        stage,
        context,
        this.options.enableEarlyExit ?? true
      );

      return { result, earlyExit: earlyExitResult.shouldEarlyExit ? earlyExitResult : undefined };
    } catch (error) {
      const result = this.createFailedResult(stage, error as Error, Date.now() - startTime);
      context.setStageResult(stage.id, result);
      this.options.onStageFailed?.(stage, error as Error);

      throw new StageExecutionError(
        (error as Error).message,
        stage.id,
        stage.name,
        error as Error
      );
    }
  }

  private async callModel(stage: Stage, prompt: string): Promise<PromptResult> {
    const timeoutMs = stage.timeoutMs || this.options.timeoutMs || 60000;
    const maxRetries = stage.retryCount || this.options.maxRetries || 2;

    // Create a new session with stage-specific options
    const stageSession = new SessionManager({
      maxRetries,
      timeoutMs,
    });

    return await stageSession.prompt(stage.model, prompt, stage.prompt.systemPrompt);
  }

  private createSkippedResult(stage: Stage, reason: string): StageResult {
    return {
      stageId: stage.id,
      stageName: stage.name,
      status: "skipped",
      duration: 0,
      model: stage.model.modelID,
      cost: 0,
      inputTokens: 0,
      outputTokens: 0,
      output: null,
      error: reason,
    };
  }

  private createFailedResult(stage: Stage, error: Error, duration: number): StageResult {
    return {
      stageId: stage.id,
      stageName: stage.name,
      status: "failed",
      duration,
      model: stage.model.modelID,
      cost: 0,
      inputTokens: 0,
      outputTokens: 0,
      output: null,
      error: error.message,
    };
  }
}
