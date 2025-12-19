import type { StageResult } from "@typings/result.ts";
import type { PipelineConfig } from "@typings/pipeline.ts";

export class PipelineContext {
  public readonly input: Record<string, unknown>;
  public readonly stages: Map<string, StageResult>;
  public readonly context: Record<string, unknown>;
  private _currentStageIndex: number = 0;
  private _isPaused: boolean = false;
  private _isCancelled: boolean = false;

  constructor(
    public readonly config: PipelineConfig,
    inputPrompt: string,
    additionalContext: Record<string, unknown> = {}
  ) {
    this.input = {
      prompt: inputPrompt,
      ...additionalContext,
    };
    this.stages = new Map();
    this.context = { ...additionalContext };
  }

  get currentStageIndex(): number {
    return this._currentStageIndex;
  }

  get totalStages(): number {
    return this.config.stages.length;
  }

  get currentStage() {
    return this.config.stages[this._currentStageIndex];
  }

  get isPaused(): boolean {
    return this._isPaused;
  }

  get isCancelled(): boolean {
    return this._isCancelled;
  }

  advanceStage(): void {
    this._currentStageIndex++;
  }

  setStageResult(stageId: string, result: StageResult): void {
    this.stages.set(stageId, result);

    // Also update context with extracted values
    if (result.parsedOutput) {
      this.context[stageId] = result.parsedOutput;
    }
  }

  getStageResult(stageId: string): StageResult | undefined {
    return this.stages.get(stageId);
  }

  pause(): void {
    this._isPaused = true;
  }

  resume(): void {
    this._isPaused = false;
  }

  cancel(): void {
    this._isCancelled = true;
  }

  getTemplateContext() {
    return {
      input: this.input,
      stages: this.stages,
      context: this.context,
    };
  }

  getCompletedStageIds(): string[] {
    return Array.from(this.stages.keys());
  }

  getAllResults(): StageResult[] {
    return Array.from(this.stages.values());
  }

  getSummary() {
    const results = this.getAllResults();

    return {
      stagesRun: results.filter((r) => r.status === "completed").length,
      stagesSkipped: results.filter((r) => r.status === "skipped").length,
      stagesFailed: results.filter((r) => r.status === "failed").length,
      totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
      totalCost: results.reduce((sum, r) => sum + r.cost, 0),
      totalInputTokens: results.reduce((sum, r) => sum + r.inputTokens, 0),
      totalOutputTokens: results.reduce((sum, r) => sum + r.outputTokens, 0),
    };
  }

  getOutput(): Record<string, unknown> {
    const lastCompletedStage = this.config.stages
      .slice()
      .reverse()
      .find((s) => this.stages.has(s.id) && this.stages.get(s.id)?.status === "completed");

    if (!lastCompletedStage) {
      return {};
    }

    const lastResult = this.stages.get(lastCompletedStage.id);
    return {
      optimizedPrompt: lastResult?.parsedOutput?.optimizedPrompt || lastResult?.output,
      ...this.context,
    };
  }
}
