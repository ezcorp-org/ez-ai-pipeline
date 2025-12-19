import type { PipelineConfig } from "@typings/pipeline.ts";
import type { PipelineResult, PipelineResultStatus, StageResult } from "@typings/result.ts";
import type { Stage } from "@typings/stage.ts";
import { PipelineContext } from "@core/context.ts";
import { SessionManager } from "@core/session.ts";
import { StageRunner } from "@core/stage-runner.ts";

export interface ExecutorCallbacks {
  onPipelineStart?: (config: PipelineConfig, input: string) => void;
  onPipelineComplete?: (result: PipelineResult) => void;
  onPipelinePaused?: (context: PipelineContext) => void;
  onPipelineCancelled?: (context: PipelineContext) => void;
  onStageStart?: (stage: Stage, index: number, total: number) => void;
  onStageComplete?: (stage: Stage, result: StageResult) => void;
  onStageSkipped?: (stage: Stage, reason: string) => void;
  onStageFailed?: (stage: Stage, error: Error) => void;
  onProgress?: (current: number, total: number, stageName: string) => void;
}

export class PipelineExecutor {
  private session: SessionManager;
  private stageRunner: StageRunner;
  private callbacks: ExecutorCallbacks;
  private context: PipelineContext | null = null;

  constructor(callbacks: ExecutorCallbacks = {}) {
    this.session = new SessionManager();
    this.callbacks = callbacks;
    this.stageRunner = new StageRunner(this.session, {
      enableEarlyExit: true,
      onStageStart: callbacks.onStageStart,
      onStageComplete: callbacks.onStageComplete,
      onStageSkipped: callbacks.onStageSkipped,
      onStageFailed: callbacks.onStageFailed,
    });
  }

  async run(
    config: PipelineConfig,
    inputPrompt: string,
    additionalContext: Record<string, unknown> = {}
  ): Promise<PipelineResult> {
    const startTime = Date.now();
    this.context = new PipelineContext(config, inputPrompt, additionalContext);

    this.callbacks.onPipelineStart?.(config, inputPrompt);

    let status: PipelineResultStatus = "success";
    let earlyExitStage: string | undefined;
    let error: string | undefined;

    try {
      for (let i = 0; i < config.stages.length; i++) {
        // Check for pause or cancel
        if (this.context.isCancelled) {
          status = "cancelled";
          break;
        }

        while (this.context.isPaused) {
          await this.sleep(100);
          if (this.context.isCancelled) {
            status = "cancelled";
            break;
          }
        }

        if (status === "cancelled") break;

        const stage = config.stages[i];
        if (!stage) continue;

        this.callbacks.onProgress?.(i + 1, config.stages.length, stage.name);

        try {
          const runResult = await this.stageRunner.execute(stage, this.context, i);

          // Check for early exit
          if (runResult.earlyExit?.shouldEarlyExit) {
            status = "early_exit";
            earlyExitStage = runResult.earlyExit.earlyExitStage;
            break;
          }
        } catch (stageError) {
          // Decide whether to continue or fail based on settings
          if (!config.pipeline.settings.enableCaching) {
            status = "failed";
            error = stageError instanceof Error ? stageError.message : String(stageError);
            break;
          }
          // With caching enabled, we continue but the stage is marked as failed
        }

        this.context.advanceStage();
      }
    } catch (pipelineError) {
      status = "failed";
      error = pipelineError instanceof Error ? pipelineError.message : String(pipelineError);
    }

    const result = this.buildResult(config, inputPrompt, startTime, status, earlyExitStage, error);
    this.callbacks.onPipelineComplete?.(result);

    return result;
  }

  pause(): void {
    if (this.context) {
      this.context.pause();
      this.callbacks.onPipelinePaused?.(this.context);
    }
  }

  resume(): void {
    if (this.context) {
      this.context.resume();
    }
  }

  cancel(): void {
    if (this.context) {
      this.context.cancel();
      this.callbacks.onPipelineCancelled?.(this.context);
    }
  }

  getStatus(): {
    isRunning: boolean;
    isPaused: boolean;
    isCancelled: boolean;
    currentStage: number;
    totalStages: number;
  } {
    if (!this.context) {
      return {
        isRunning: false,
        isPaused: false,
        isCancelled: false,
        currentStage: 0,
        totalStages: 0,
      };
    }

    return {
      isRunning: !this.context.isPaused && !this.context.isCancelled,
      isPaused: this.context.isPaused,
      isCancelled: this.context.isCancelled,
      currentStage: this.context.currentStageIndex,
      totalStages: this.context.totalStages,
    };
  }

  private buildResult(
    config: PipelineConfig,
    inputPrompt: string,
    startTime: number,
    status: PipelineResultStatus,
    earlyExitStage?: string,
    error?: string
  ): PipelineResult {
    const summary = this.context!.getSummary();

    return {
      pipelineId: config.pipeline.id,
      status,
      timestamp: new Date(),
      input: { prompt: inputPrompt },
      output: this.context!.getOutput(),
      stages: this.context!.getAllResults(),
      summary: {
        ...summary,
        totalDuration: Date.now() - startTime,
      },
      earlyExitStage,
      error,
    };
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Factory function for creating executors with specific configurations
export function createExecutor(callbacks: ExecutorCallbacks = {}): PipelineExecutor {
  return new PipelineExecutor(callbacks);
}
