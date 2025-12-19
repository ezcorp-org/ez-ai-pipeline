import Anthropic from "@anthropic-ai/sdk";
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
  private client: Anthropic;
  private conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];

  constructor(private readonly options: SessionOptions = {}) {
    this.client = new Anthropic();
  }

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
    // Add user message to history
    this.conversationHistory.push({ role: "user", content: userMessage });

    const response = await this.client.messages.create({
      model: model.modelID,
      max_tokens: model.maxTokens || 4096,
      temperature: model.temperature,
      system: systemPrompt,
      messages: this.conversationHistory,
    });

    // Extract text from response
    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    // Add assistant response to history
    this.conversationHistory.push({ role: "assistant", content: text });

    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    const cost = calculateCost(model.modelID, inputTokens, outputTokens);

    return {
      text,
      inputTokens,
      outputTokens,
      cost,
      model: model.modelID,
      stopReason: response.stop_reason || "end_turn",
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
