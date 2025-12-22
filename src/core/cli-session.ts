import type { ModelConfig } from "@typings/stage.ts";
import type { CostBreakdown } from "@typings/result.ts";
import type { PromptResult } from "./session.ts";

export interface CLISessionOptions {
  cliTool?: "claude" | "opencode" | "aider" | "custom";
  customCommand?: string;
  timeoutMs?: number;
}

/**
 * CLI-based session manager that shells out to AI CLI tools
 * instead of using API keys directly.
 */
export class CLISessionManager {
  constructor(private readonly options: CLISessionOptions = {}) {}

  async prompt(
    model: ModelConfig,
    userMessage: string,
    systemPrompt?: string
  ): Promise<PromptResult> {
    const timeoutMs = this.options.timeoutMs ?? 120000; // 2 min default for CLI
    const cliTool = this.options.cliTool ?? "claude";

    // Build the full prompt
    const fullPrompt = systemPrompt
      ? `${systemPrompt}\n\n${userMessage}`
      : userMessage;

    const startTime = Date.now();

    try {
      const result = await this.callCLI(cliTool, fullPrompt, timeoutMs);
      const duration = Date.now() - startTime;

      // Estimate tokens (rough approximation for CLI mode)
      const inputTokens = Math.ceil(fullPrompt.length / 4);
      const outputTokens = Math.ceil(result.length / 4);

      return {
        text: result,
        inputTokens,
        outputTokens,
        cost: this.estimateCost(model.modelID, inputTokens, outputTokens),
        model: `${cliTool}:${model.modelID}`,
        stopReason: "end_turn",
      };
    } catch (error) {
      throw new Error(
        `CLI execution failed: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  private async callCLI(
    tool: string,
    prompt: string,
    timeoutMs: number
  ): Promise<string> {
    const command = this.buildCommand(tool, prompt);

    // Use Bun.spawn for CLI execution
    const proc = Bun.spawn(command, {
      stdin: "pipe",
      stdout: "pipe",
      stderr: "pipe",
    });

    // Write prompt to stdin and close
    if (proc.stdin) {
      proc.stdin.write(prompt);
      proc.stdin.end();
    }

    // Set up timeout
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        proc.kill();
        reject(new Error(`CLI command timed out after ${timeoutMs}ms`));
      }, timeoutMs);
    });

    // Wait for process to complete
    const resultPromise = (async () => {
      const exitCode = await proc.exited;

      const stdout = await new Response(proc.stdout).text();
      const stderr = await new Response(proc.stderr).text();

      if (exitCode !== 0) {
        throw new Error(`CLI exited with code ${exitCode}: ${stderr || stdout}`);
      }

      return stdout.trim();
    })();

    return Promise.race([resultPromise, timeoutPromise]);
  }

  private buildCommand(tool: string, _prompt: string): string[] {
    switch (tool) {
      case "claude":
        // Claude Code CLI: claude -p "prompt" --print
        return ["claude", "-p", "-", "--print"];

      case "opencode":
        // OpenCode CLI
        return ["opencode", "ask", "-"];

      case "aider":
        // Aider CLI (message mode)
        return ["aider", "--message", "-", "--no-git"];

      case "custom":
        if (this.options.customCommand) {
          return this.options.customCommand.split(" ");
        }
        throw new Error("Custom CLI tool requires customCommand option");

      default:
        throw new Error(`Unknown CLI tool: ${tool}`);
    }
  }

  private estimateCost(
    modelId: string,
    inputTokens: number,
    outputTokens: number
  ): CostBreakdown {
    // For CLI mode, we don't have accurate cost data
    // Return zero or estimated costs
    return {
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      currency: "USD",
    };
  }

  clearHistory(): void {
    // CLI mode is stateless, nothing to clear
  }

  getHistory(): Array<{ role: "user" | "assistant"; content: string }> {
    // CLI mode doesn't maintain history
    return [];
  }
}

/**
 * Check if a CLI tool is available on the system
 */
export async function checkCLIAvailability(
  tool: string = "claude"
): Promise<{ available: boolean; version?: string; error?: string }> {
  try {
    const command = tool === "claude" ? ["claude", "--version"] :
                    tool === "opencode" ? ["opencode", "--version"] :
                    tool === "aider" ? ["aider", "--version"] :
                    [tool, "--version"];

    const proc = Bun.spawn(command, {
      stdout: "pipe",
      stderr: "pipe",
    });

    const exitCode = await proc.exited;
    const stdout = await new Response(proc.stdout).text();

    if (exitCode === 0) {
      return {
        available: true,
        version: stdout.trim().split("\n")[0],
      };
    }

    return {
      available: false,
      error: `${tool} exited with code ${exitCode}`,
    };
  } catch (error) {
    return {
      available: false,
      error: `${tool} not found or not executable`,
    };
  }
}
