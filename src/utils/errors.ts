import type { ZodIssue } from "zod";

export class PipelineError extends Error {
  public readonly stage?: string;
  public readonly errorCause?: Error;

  constructor(message: string, stage?: string, errorCause?: Error) {
    super(message);
    this.name = "PipelineError";
    this.stage = stage;
    this.errorCause = errorCause;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

export class ValidationError extends PipelineError {
  constructor(
    message: string,
    public readonly issues: ZodIssue[]
  ) {
    super(message);
    this.name = "ValidationError";
  }

  formatIssues(): string {
    return this.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
  }
}

export class StageExecutionError extends PipelineError {
  constructor(
    message: string,
    public readonly stageId: string,
    public readonly stageName: string,
    cause?: Error
  ) {
    super(message, stageId, cause);
    this.name = "StageExecutionError";
  }
}

export class ModelError extends PipelineError {
  constructor(
    message: string,
    public readonly model: string,
    public readonly provider: string,
    cause?: Error
  ) {
    super(message, undefined, cause);
    this.name = "ModelError";
  }
}

export class TimeoutError extends PipelineError {
  constructor(
    message: string,
    public readonly timeoutMs: number,
    stage?: string
  ) {
    super(message, stage);
    this.name = "TimeoutError";
  }
}

export class ConfigurationError extends PipelineError {
  constructor(message: string) {
    super(message);
    this.name = "ConfigurationError";
  }
}

export function isRetryableError(error: Error): boolean {
  const retryableMessages = [
    "rate limit",
    "timeout",
    "network",
    "connection",
    "ECONNRESET",
    "ETIMEDOUT",
    "503",
    "502",
    "overloaded",
  ];

  const errorMessage = error.message.toLowerCase();
  return retryableMessages.some((msg) => errorMessage.includes(msg));
}
