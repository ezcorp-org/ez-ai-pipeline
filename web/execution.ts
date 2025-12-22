import type { PipelineConfig } from "../src/typings/pipeline.ts";
import type { PipelineResult, StageResult } from "../src/typings/result.ts";
import type { Stage } from "../src/typings/stage.ts";
import type { ServerWebSocket } from "bun";
import { PipelineExecutor, type ExecutorOptions } from "../src/core/executor.ts";
import type { ExecutionMode } from "../src/core/stage-runner.ts";
import type { CLISessionOptions } from "../src/core/cli-session.ts";
import { savePipelineResult } from "../src/utils/file.ts";
import { join } from "path";

const HISTORY_FILE = join(import.meta.dir, "../outputs/execution-history.json");

// Extract the meaningful final output from pipeline result
function extractFinalOutput(output: Record<string, unknown>): { type: "text" | "code" | "json"; content: string; label: string } | null {
  if (!output || typeof output !== "object") return null;

  // Check for prompt optimizer output (stage-6-finalize)
  const finalizeStage = output["stage-6-finalize"] as Record<string, unknown> | undefined;
  if (finalizeStage?.optimizedPrompt) {
    return {
      type: "text",
      content: String(finalizeStage.optimizedPrompt),
      label: "Optimized Prompt",
    };
  }

  // Check for common output patterns
  if (output.optimizedPrompt) {
    return { type: "text", content: String(output.optimizedPrompt), label: "Optimized Prompt" };
  }
  if (output.refinedPrompt) {
    return { type: "text", content: String(output.refinedPrompt), label: "Refined Prompt" };
  }
  if (output.enhancedPrompt) {
    return { type: "text", content: String(output.enhancedPrompt), label: "Enhanced Prompt" };
  }
  if (output.generatedCode) {
    return { type: "code", content: String(output.generatedCode), label: "Generated Code" };
  }

  // Check for pipeline generator output
  const generateStage = output["stage-3-generate"] as Record<string, unknown> | undefined;
  if (generateStage?.pipelineConfig) {
    return {
      type: "code",
      content: JSON.stringify(generateStage.pipelineConfig, null, 2),
      label: "Generated Pipeline",
    };
  }

  // Fallback: return the full output as JSON (truncated if too large)
  const jsonStr = JSON.stringify(output, null, 2);
  return {
    type: "json",
    content: jsonStr.length > 50000 ? jsonStr.slice(0, 50000) + "\n...[truncated]" : jsonStr,
    label: "Output",
  };
}

interface ExecutionHistoryRecord {
  id: string;
  pipelineId: string;
  pipelineName: string;
  status: "completed" | "failed" | "cancelled";
  startTime: number;
  endTime: number;
  duration: number;
  totalStages: number;
  stagesRun: number;
  stagesSkipped: number;
  stagesFailed: number;
  inputPreview: string;
  input: string;
  totalCost: number;
  error?: string;
  finalOutput?: string;
  finalOutputType?: "text" | "code" | "json";
  finalOutputLabel?: string;
}

export interface ExecutionEvent {
  type: string;
  executionId: string;
  [key: string]: unknown;
}

interface StageProgress {
  id: string;
  name: string;
  type: string;
  status: "pending" | "running" | "completed" | "skipped" | "failed";
  duration?: number;
  cost?: number;
  error?: string;
  output?: string;
}

interface ActiveExecution {
  id: string;
  pipelineId: string;
  pipelineName: string;
  inputPreview: string;
  input: string;
  executor: PipelineExecutor;
  subscribers: Set<ServerWebSocket<WebSocketData>>;
  status: "running" | "completed" | "failed" | "cancelled";
  startTime: number;
  currentStage: number;
  totalStages: number;
  stages: StageProgress[];
  result?: PipelineResult;
}

export interface ExecutionListItem {
  id: string;
  pipelineId: string;
  pipelineName: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startTime: number;
  currentStage: number;
  totalStages: number;
  inputPreview: string;
}

export interface ExecutionDetail {
  id: string;
  pipelineId: string;
  pipelineName: string;
  status: "running" | "completed" | "failed" | "cancelled";
  startTime: number;
  currentStage: number;
  totalStages: number;
  input: string;
  stages: StageProgress[];
  result?: {
    status: string;
    output?: string;
    error?: string;
    summary?: {
      totalDuration: number;
      totalCost: number;
      stagesRun: number;
      stagesSkipped: number;
      stagesFailed: number;
    };
  };
}

export interface WebSocketData {
  subscribedExecutions: Set<string>;
}

export interface ExecutionHistoryPage {
  executions: ExecutionHistoryRecord[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

class ExecutionManager {
  private executions: Map<string, ActiveExecution> = new Map();
  private cleanupTimeoutMs = 5 * 60 * 1000; // 5 minutes

  generateExecutionId(): string {
    return `exec_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  async start(
    executionId: string,
    config: PipelineConfig,
    input: string,
    options: { executionMode?: ExecutionMode; cliOptions?: CLISessionOptions } = {}
  ): Promise<void> {
    const executorOptions: ExecutorOptions = {
      executionMode: options.executionMode,
      cliOptions: options.cliOptions,
    };

    // Initialize stages array from config
    const initialStages: StageProgress[] = config.stages.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      status: "pending" as const,
    }));

    const execution: ActiveExecution = {
      id: executionId,
      pipelineId: config.pipeline.id,
      pipelineName: config.pipeline.name,
      inputPreview: input.slice(0, 100) + (input.length > 100 ? "..." : ""),
      input: input,
      executor: new PipelineExecutor({
        onStageStart: (stage, index, total) => {
          // Update current stage tracking and stage status
          const exec = this.executions.get(executionId);
          if (exec) {
            exec.currentStage = index + 1;
            const stageProgress = exec.stages.find(s => s.id === stage.id);
            if (stageProgress) {
              stageProgress.status = "running";
            }
          }
          this.broadcast(executionId, {
            type: "stage:started",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            index,
            total,
          });
        },
        onStageComplete: (stage, result) => {
          // Update stage result
          const exec = this.executions.get(executionId);
          if (exec) {
            const stageProgress = exec.stages.find(s => s.id === stage.id);
            if (stageProgress) {
              stageProgress.status = "completed";
              stageProgress.duration = result.duration;
              stageProgress.cost = result.cost;
            }
          }
          this.broadcast(executionId, {
            type: "stage:completed",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            result: {
              status: result.status,
              cost: result.cost,
              duration: result.duration,
            },
          });
        },
        onStageSkipped: (stage, reason) => {
          // Update stage as skipped
          const exec = this.executions.get(executionId);
          if (exec) {
            const stageProgress = exec.stages.find(s => s.id === stage.id);
            if (stageProgress) {
              stageProgress.status = "skipped";
            }
          }
          this.broadcast(executionId, {
            type: "stage:skipped",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            reason,
          });
        },
        onStageFailed: (stage, error) => {
          // Update stage as failed
          const exec = this.executions.get(executionId);
          if (exec) {
            const stageProgress = exec.stages.find(s => s.id === stage.id);
            if (stageProgress) {
              stageProgress.status = "failed";
              stageProgress.error = error.message;
            }
          }
          this.broadcast(executionId, {
            type: "stage:failed",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            error: error.message,
          });
        },
        onStageOutput: (stage, output, isFinal) => {
          // Truncate output if too large (max 50KB per stage)
          const maxOutputSize = 50 * 1024;
          const truncatedOutput = output.length > maxOutputSize
            ? output.slice(0, maxOutputSize) + "\n...[output truncated]..."
            : output;

          // Store output in stage progress
          const exec = this.executions.get(executionId);
          if (exec) {
            const stageProgress = exec.stages.find(s => s.id === stage.id);
            if (stageProgress) {
              stageProgress.output = truncatedOutput;
            }
          }

          this.broadcast(executionId, {
            type: "stage:output",
            executionId,
            stageId: stage.id,
            output: truncatedOutput,
            isFinal,
          });
        },
      }, executorOptions),
      subscribers: new Set(),
      status: "running",
      startTime: Date.now(),
      currentStage: 0,
      totalStages: config.stages.length,
      stages: initialStages,
    };

    this.executions.set(executionId, execution);

    // Broadcast execution started
    this.broadcast(executionId, {
      type: "execution:started",
      executionId,
      pipelineId: config.pipeline.id,
      pipelineName: config.pipeline.name,
      stageCount: config.stages.length,
    });

    // Run execution asynchronously
    try {
      const result = await execution.executor.run(config, input);
      execution.result = result;
      execution.status = result.status === "cancelled" ? "cancelled" :
                         result.status === "failed" ? "failed" : "completed";

      // Save result to outputs
      await savePipelineResult(result);

      // Save to history
      await this.saveToHistory(execution);

      // Broadcast completion
      this.broadcast(executionId, {
        type: "execution:completed",
        executionId,
        result: {
          status: result.status,
          pipelineId: result.pipelineId,
          summary: result.summary,
          output: result.output,
          error: result.error,
        },
      });
    } catch (error) {
      execution.status = "failed";

      // Save failed execution to history
      await this.saveToHistory(execution);

      this.broadcast(executionId, {
        type: "execution:failed",
        executionId,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    // Schedule cleanup
    setTimeout(() => this.cleanup(executionId), this.cleanupTimeoutMs);
  }

  cancel(executionId: string): boolean {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== "running") {
      return false;
    }

    execution.executor.cancel();
    execution.status = "cancelled";

    this.broadcast(executionId, {
      type: "execution:cancelled",
      executionId,
    });

    return true;
  }

  subscribe(executionId: string, ws: ServerWebSocket<WebSocketData>): boolean {
    const execution = this.executions.get(executionId);
    if (!execution) {
      return false;
    }

    execution.subscribers.add(ws);
    ws.data.subscribedExecutions.add(executionId);

    // Send current status if execution already completed
    if (execution.status !== "running" && execution.result) {
      ws.send(JSON.stringify({
        type: "execution:completed",
        executionId,
        result: {
          status: execution.result.status,
          pipelineId: execution.result.pipelineId,
          summary: execution.result.summary,
          output: execution.result.output,
          error: execution.result.error,
        },
      }));
    }

    return true;
  }

  unsubscribe(executionId: string, ws: ServerWebSocket<WebSocketData>): void {
    const execution = this.executions.get(executionId);
    if (execution) {
      execution.subscribers.delete(ws);
    }
    ws.data.subscribedExecutions.delete(executionId);
  }

  unsubscribeAll(ws: ServerWebSocket<WebSocketData>): void {
    for (const executionId of ws.data.subscribedExecutions) {
      this.unsubscribe(executionId, ws);
    }
  }

  getExecution(executionId: string): ActiveExecution | undefined {
    return this.executions.get(executionId);
  }

  getExecutionDetail(executionId: string): ExecutionDetail | undefined {
    const exec = this.executions.get(executionId);
    if (!exec) return undefined;

    return {
      id: exec.id,
      pipelineId: exec.pipelineId,
      pipelineName: exec.pipelineName,
      status: exec.status,
      startTime: exec.startTime,
      currentStage: exec.currentStage,
      totalStages: exec.totalStages,
      input: exec.input,
      stages: exec.stages,
      result: exec.result ? {
        status: exec.result.status,
        output: exec.result.output,
        error: exec.result.error,
        summary: exec.result.summary,
      } : undefined,
    };
  }

  listExecutions(statusFilter?: "running" | "completed" | "failed" | "cancelled"): ExecutionListItem[] {
    const executions: ExecutionListItem[] = [];

    for (const exec of this.executions.values()) {
      if (statusFilter && exec.status !== statusFilter) {
        continue;
      }

      executions.push({
        id: exec.id,
        pipelineId: exec.pipelineId,
        pipelineName: exec.pipelineName,
        status: exec.status,
        startTime: exec.startTime,
        currentStage: exec.currentStage,
        totalStages: exec.totalStages,
        inputPreview: exec.inputPreview,
      });
    }

    // Sort by startTime descending (most recent first)
    return executions.sort((a, b) => b.startTime - a.startTime);
  }

  getRunningCount(): number {
    let count = 0;
    for (const exec of this.executions.values()) {
      if (exec.status === "running") {
        count++;
      }
    }
    return count;
  }

  private broadcast(executionId: string, event: ExecutionEvent): void {
    const execution = this.executions.get(executionId);
    if (!execution) return;

    const message = JSON.stringify(event);
    for (const ws of execution.subscribers) {
      try {
        ws.send(message);
      } catch {
        // Client disconnected, will be cleaned up
        execution.subscribers.delete(ws);
      }
    }
  }

  private cleanup(executionId: string): void {
    const execution = this.executions.get(executionId);
    if (execution && execution.status !== "running") {
      this.executions.delete(executionId);
    }
  }

  private async loadHistory(): Promise<ExecutionHistoryRecord[]> {
    try {
      const file = Bun.file(HISTORY_FILE);
      if (await file.exists()) {
        const content = await file.text();
        return JSON.parse(content);
      }
    } catch (error) {
      console.error("Failed to load execution history:", error);
    }
    return [];
  }

  private async saveToHistory(exec: ActiveExecution): Promise<void> {
    try {
      const history = await this.loadHistory();

      // Extract the final output if available
      const finalOutput = exec.result?.output
        ? extractFinalOutput(exec.result.output as Record<string, unknown>)
        : null;

      const record: ExecutionHistoryRecord = {
        id: exec.id,
        pipelineId: exec.pipelineId,
        pipelineName: exec.pipelineName,
        status: exec.status as "completed" | "failed" | "cancelled",
        startTime: exec.startTime,
        endTime: Date.now(),
        duration: exec.result?.summary?.totalDuration || (Date.now() - exec.startTime),
        totalStages: exec.totalStages,
        stagesRun: exec.result?.summary?.stagesRun || 0,
        stagesSkipped: exec.result?.summary?.stagesSkipped || 0,
        stagesFailed: exec.result?.summary?.stagesFailed || 0,
        inputPreview: exec.inputPreview,
        input: exec.input,
        totalCost: exec.result?.summary?.totalCost || 0,
        error: exec.result?.error,
        finalOutput: finalOutput?.content,
        finalOutputType: finalOutput?.type,
        finalOutputLabel: finalOutput?.label,
      };

      // Add to beginning of array (most recent first)
      history.unshift(record);

      // Keep only last 1000 records
      const trimmedHistory = history.slice(0, 1000);

      await Bun.write(HISTORY_FILE, JSON.stringify(trimmedHistory, null, 2));
    } catch (error) {
      console.error("Failed to save execution to history:", error);
    }
  }

  async getHistoryPage(page: number = 1, pageSize: number = 20): Promise<ExecutionHistoryPage> {
    const history = await this.loadHistory();
    const total = history.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const executions = history.slice(start, start + pageSize);

    return {
      executions,
      total,
      page,
      pageSize,
      totalPages,
    };
  }

  async getHistoryRecord(executionId: string): Promise<ExecutionHistoryRecord | undefined> {
    const history = await this.loadHistory();
    return history.find(h => h.id === executionId);
  }
}

// Singleton instance
export const executionManager = new ExecutionManager();
