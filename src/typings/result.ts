import type { StageStatus } from "@typings/stage.ts";

export interface StageResult {
  stageId: string;
  stageName: string;
  status: StageStatus;
  duration: number;
  model: string;
  cost: number;
  inputTokens: number;
  outputTokens: number;
  output: unknown;
  parsedOutput?: Record<string, unknown>;
  error?: string;
}

export interface PipelineSummary {
  stagesRun: number;
  stagesSkipped: number;
  stagesFailed: number;
  totalDuration: number;
  totalCost: number;
  totalInputTokens: number;
  totalOutputTokens: number;
}

export type PipelineResultStatus = "success" | "early_exit" | "failed" | "cancelled";

export interface PipelineResult {
  pipelineId: string;
  status: PipelineResultStatus;
  timestamp: Date;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  stages: StageResult[];
  summary: PipelineSummary;
  earlyExitStage?: string;
  error?: string;
}

export interface CostBreakdown {
  inputCost: number;
  outputCost: number;
  totalCost: number;
  model: string;
  inputTokens: number;
  outputTokens: number;
}
