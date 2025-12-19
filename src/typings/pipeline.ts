import type { z } from "zod";
import type {
  PipelineConfigSchema,
  PipelineSchema,
  PipelineSettingsSchema,
} from "@schema/pipeline.schema.ts";

export type Pipeline = z.infer<typeof PipelineSchema>;
export type PipelineSettings = z.infer<typeof PipelineSettingsSchema>;
export type PipelineConfig = z.infer<typeof PipelineConfigSchema>;

export type PipelineStatus = "pending" | "running" | "paused" | "completed" | "failed" | "cancelled";

export interface PipelineState {
  pipelineId: string;
  status: PipelineStatus;
  currentStageIndex: number;
  startedAt: Date;
  pausedAt?: Date;
  completedAt?: Date;
}
