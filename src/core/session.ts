import { query } from "@anthropic-ai/claude-agent-sdk";
import type { ModelConfig } from "@typings/stage.ts";
import { ModelError, TimeoutError, isRetryableError } from "@utils/errors.ts";
import { calculateCost } from "@utils/cost.ts";
import type { CostBreakdown } from "@typings/result.ts";
import { RETRY_DELAYS } from "@config/constants.ts";

export interface PromptResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  cost: CostBreakdown;
  model: string;
  stopReason: string;
}

export interface SessionOptions {
  maxRetries?: number;
  timeoutMs?: number;
}

export class SessionManager {
  private conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];
  private sessionId: string | undefined;

  constructor(private readonly options: SessionOptions = {}) {}

  async prompt(
    model: ModelConfig,
    userMessage: string,
    systemPrompt?: string
  ): Promise<PromptResult> {
    const maxRetries = this.options.maxRetries ?? 2;
    const timeoutMs = this.options.timeoutMs ?? 60000;

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const result = await this.callWithTimeout(
          () => this.makeRequest(model, userMessage, systemPrompt),
          timeoutMs
        );
        return result;
      } catch (error) {
        lastError = error as Error;

        if (attempt < maxRetries && isRetryableError(lastError)) {
          const delay = RETRY_DELAYS[attempt] || 4000;
          await this.sleep(delay);
          continue;
        }

        throw new ModelError(
          `Model call failed: ${lastError.message}`,
          model.modelID,
          model.providerID,
          lastError
        );
      }
    }

    throw new ModelError(
      `Model call failed after ${maxRetries} retries: ${lastError?.message}`,
      model.modelID,
      model.providerID,
      lastError
    );
  }

  private async makeRequest(
    model: ModelConfig,
    userMessage: string,
    systemPrompt?: string
  ): Promise<PromptResult> {
    // Build the full prompt with system context
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${userMessage}`
      : userMessage;

    // Add user message to history
    this.conversationHistory.push({ role: "user", content: userMessage });

    let responseText = "";
    let inputTokens = 0;
    let outputTokens = 0;

    // Use Claude Agent SDK query function
    for await (const message of query({
      prompt: fullPrompt,
      options: {
        model: model.modelID,
        maxTurns: 1,
        allowedTools: [], // No tools needed for prompt optimization
        ...(this.sessionId && { resume: this.sessionId }),
      },
    })) {
      // Capture session ID for potential resume
      if (message.type === "system" && message.subtype === "init") {
        this.sessionId = message.session_id;
      }

      // Capture the result - check subtype for success
      if (message.type === "result" && message.subtype === "success") {
        responseText = message.result || "";
        inputTokens = message.usage?.input_tokens || 0;
        outputTokens = message.usage?.output_tokens || 0;
      }

      // Handle assistant messages
      if (message.type === "assistant" && message.message) {
        const content = message.message.content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block.type === "text") {
              responseText = block.text;
            }
          }
        }
        // Extract usage from message if available
        if (message.message.usage) {
          inputTokens = message.message.usage.input_tokens || inputTokens;
          outputTokens = message.message.usage.output_tokens || outputTokens;
        }
      }
    }

    // Add assistant response to history
    this.conversationHistory.push({ role: "assistant", content: responseText });

    const cost = calculateCost(model.modelID, inputTokens, outputTokens);

    return {
      text: responseText,
      inputTokens,
      outputTokens,
      cost,
      model: model.modelID,
      stopReason: "end_turn",
    };
  }

  async injectContext(text: string): Promise<void> {
    // Add context as a user message without expecting a response
    this.conversationHistory.push({
      role: "user",
      content: `[Context] ${text}`,
    });
    this.conversationHistory.push({
      role: "assistant",
      content: "I understand. I'll keep this context in mind.",
    });
  }

  clearHistory(): void {
    this.conversationHistory = [];
    this.sessionId = undefined;
  }

  getHistory(): Array<{ role: "user" | "assistant"; content: string }> {
    return [...this.conversationHistory];
  }

  private async callWithTimeout<T>(fn: () => Promise<T>, timeoutMs: number): Promise<T> {
    return Promise.race([
      fn(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new TimeoutError("Request timed out", timeoutMs)), timeoutMs);
      }),
    ]);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
