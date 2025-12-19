import chalk from "chalk";
import figures from "figures";

export type LogLevel = "debug" | "info" | "success" | "warning" | "error";

export interface LoggerOptions {
  quiet: boolean;
  verbose: boolean;
  json: boolean;
}

const ICONS = {
  debug: figures.pointer,
  info: figures.info,
  success: figures.tick,
  warning: figures.warning,
  error: figures.cross,
  pipeline: "📋",
  stage: "📍",
  model: "🤖",
  cost: "💰",
  time: "⏱️",
  file: "📁",
  prompt: "📝",
  progress: "▶",
  skip: "⏭️",
};

class Logger {
  private options: LoggerOptions = {
    quiet: false,
    verbose: false,
    json: false,
  };

  setOptions(options: Partial<LoggerOptions>): void {
    this.options = { ...this.options, ...options };
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.options.verbose || this.options.quiet) return;
    this.log("debug", chalk.dim(message), ...args);
  }

  info(message: string, ...args: unknown[]): void {
    if (this.options.quiet) return;
    this.log("info", chalk.blue(message), ...args);
  }

  success(message: string, ...args: unknown[]): void {
    if (this.options.quiet) return;
    this.log("success", chalk.green(message), ...args);
  }

  warning(message: string, ...args: unknown[]): void {
    this.log("warning", chalk.yellow(message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log("error", chalk.red(message), ...args);
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (this.options.json) {
      // Strip ANSI color codes for JSON output
      const cleanMessage = message.replace(/\x1B\[[0-9;]*[mK]/g, "");
      console.log(JSON.stringify({ level, message: cleanMessage, args }));
      return;
    }

    const icon = ICONS[level];
    const prefix = this.getPrefix(level, icon);
    console.log(prefix, message, ...args);
  }

  private getPrefix(level: LogLevel, icon: string): string {
    const colors: Record<LogLevel, typeof chalk.blue> = {
      debug: chalk.dim,
      info: chalk.blue,
      success: chalk.green,
      warning: chalk.yellow,
      error: chalk.red,
    };
    return colors[level](icon);
  }

  divider(): void {
    if (this.options.quiet) return;
    console.log(chalk.dim("━".repeat(65)));
  }

  header(text: string): void {
    if (this.options.quiet) return;
    this.divider();
    console.log(chalk.bold(text), chalk.dim("─".repeat(Math.max(0, 55 - text.length))));
    console.log();
  }

  subheader(text: string): void {
    if (this.options.quiet) return;
    console.log(chalk.bold.cyan(text));
  }

  blank(): void {
    if (this.options.quiet) return;
    console.log();
  }

  pipeline(id: string): void {
    if (this.options.quiet) return;
    console.log(ICONS.pipeline, chalk.dim("Pipeline:"), chalk.bold(id));
  }

  input(prompt: string): void {
    if (this.options.quiet) return;
    const truncated = prompt.length > 50 ? prompt.slice(0, 47) + "..." : prompt;
    console.log(ICONS.prompt, chalk.dim("Input:"), `"${truncated}"`, chalk.dim(`(${prompt.length} chars)`));
  }

  stage(name: string, _index: number, _total: number): void {
    if (this.options.quiet) return;
    console.log("  ", ICONS.stage, chalk.cyan(name));
  }

  model(modelId: string, tier?: string): void {
    if (this.options.quiet) return;
    const tierStr = tier ? chalk.dim(`[${tier}]`) : "";
    console.log("  ", ICONS.model, `Model: ${modelId}`, tierStr);
  }

  cost(amount: number): void {
    if (this.options.quiet) return;
    console.log("  ", ICONS.cost, `Cost: $${amount.toFixed(4)}`);
  }

  duration(ms: number): void {
    if (this.options.quiet) return;
    const seconds = (ms / 1000).toFixed(1);
    console.log("  ", ICONS.time, `Duration: ${seconds}s`);
  }

  file(path: string): void {
    if (this.options.quiet) return;
    console.log("  ", ICONS.file, `Saved to: ${path}`);
  }

  skipped(reason: string): void {
    if (this.options.quiet) return;
    console.log("  ", ICONS.skip, chalk.yellow(`Skipped: ${reason}`));
  }

  json(data: unknown): void {
    console.log(JSON.stringify(data, null, 2));
  }
}

export const logger = new Logger();
