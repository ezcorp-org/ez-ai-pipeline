import type { PipelineConfig } from "../src/typings/pipeline.ts";
import type { PipelineResult, StageResult } from "../src/typings/result.ts";
import type { Stage } from "../src/typings/stage.ts";
import type { ServerWebSocket } from "bun";
import { PipelineExecutor } from "../src/core/executor.ts";
import { savePipelineResult } from "../src/utils/file.ts";

export interface ExecutionEvent {
  type: string;
  executionId: string;
  [key: string]: unknown;
}

interface ActiveExecution {
  id: string;
  pipelineId: string;
  executor: PipelineExecutor;
  subscribers: Set<ServerWebSocket<WebSocketData>>;
  status: "running" | "completed" | "failed" | "cancelled";
  startTime: number;
  result?: PipelineResult;
}

export interface WebSocketData {
  subscribedExecutions: Set<string>;
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
    input: string
  ): Promise<void> {
    const execution: ActiveExecution = {
      id: executionId,
      pipelineId: config.pipeline.id,
      executor: new PipelineExecutor({
        onStageStart: (stage, index, total) => {
          this.broadcast(executionId, {
            type: "stage:started",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            index,
            total,
          });
        },
        onStageComplete: (stage, result) => {
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
          this.broadcast(executionId, {
            type: "stage:skipped",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            reason,
          });
        },
        onStageFailed: (stage, error) => {
          this.broadcast(executionId, {
            type: "stage:failed",
            executionId,
            stage: { id: stage.id, name: stage.name, type: stage.type },
            error: error.message,
          });
        },
      }),
      subscribers: new Set(),
      status: "running",
      startTime: Date.now(),
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
}

// Singleton instance
export const executionManager = new ExecutionManager();
