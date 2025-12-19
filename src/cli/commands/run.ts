import type { ArgumentsCamelCase } from "yargs";
import * as readline from "readline";
import { PipelineExecutor } from "@core/executor.ts";
import { TerminalUI } from "@cli/ui/terminal.ts";
import { loadPipeline, savePipelineResult, saveOptimizedPrompt, readInputFile } from "@utils/file.ts";
import chalk from "chalk";

async function promptForInput(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log(chalk.cyan.bold("\n📝 Enter your prompt to optimize"));
  console.log(chalk.dim("   (Enter an empty line to finish, or Ctrl+C to cancel)\n"));

  return new Promise((resolve) => {
    const lines: string[] = [];
    let isFirstLine = true;

    const prompt = () => {
      rl.question(isFirstLine ? chalk.green("→ ") : chalk.dim("  "), (line) => {
        isFirstLine = false;

        if (line === "" && lines.length > 0) {
          rl.close();
          const input = lines.join("\n").trim();
          console.log(chalk.dim(`\n   (${input.length} characters entered)\n`));
          resolve(input);
        } else if (line !== "") {
          lines.push(line);
          prompt();
        } else {
          prompt();
        }
      });
    };

    rl.on("close", () => {
      if (lines.length === 0) {
        console.log(chalk.yellow("\n⚠️  No input provided, exiting."));
        process.exit(0);
      }
    });

    prompt();
  });
}

export interface RunOptions {
  pipeline: string;
  input?: string;
  inputFile?: string;
  output?: string;
  quiet?: boolean;
  json?: boolean;
  verbose?: boolean;
}

export async function runCommand(args: ArgumentsCamelCase<RunOptions>): Promise<void> {
  const ui = new TerminalUI({
    quiet: args.quiet,
    json: args.json,
    verbose: args.verbose,
  });

  try {
    // Get input
    let inputPrompt: string;
    if (args.inputFile) {
      inputPrompt = await readInputFile(args.inputFile);
    } else if (args.input) {
      inputPrompt = args.input;
    } else {
      // Interactive mode - prompt for input
      inputPrompt = await promptForInput();
    }

    // Load pipeline
    const config = await loadPipeline(args.pipeline);

    // Show banner and info
    ui.showBanner();
    ui.showPipelineInfo(config, inputPrompt);

    // Create executor with UI callbacks
    const executor = new PipelineExecutor({
      onStageStart: (stage, index, total) => ui.stageStart(stage, index, total),
      onStageComplete: (stage, result) => ui.stageComplete(stage, result),
      onStageSkipped: (stage, reason) => ui.stageSkipped(stage, reason),
      onStageFailed: (stage, error) => ui.stageFailed(stage, error),
      onProgress: (current, total, _stageName) => ui.showProgress(current, total),
    });

    // Handle SIGINT for graceful cancellation
    const handleSignal = () => {
      console.log("\n\nReceived interrupt signal, cancelling...");
      executor.cancel();
    };
    process.on("SIGINT", handleSignal);
    process.on("SIGTERM", handleSignal);

    // Run pipeline
    const result = await executor.run(config, inputPrompt);

    // Show summary
    ui.showSummary(result);

    // Save outputs
    const outputDir = args.output || "./outputs";
    const resultPath = await savePipelineResult(result, outputDir);

    let promptPath: string | undefined;
    if (result.status === "success" || result.status === "early_exit") {
      const optimizedPrompt =
        typeof result.output.optimizedPrompt === "string"
          ? result.output.optimizedPrompt
          : JSON.stringify(result.output, null, 2);

      promptPath = await saveOptimizedPrompt(result, inputPrompt, optimizedPrompt, outputDir);
    }

    ui.showOutputPaths(resultPath, promptPath);

    // Exit with appropriate code
    if (result.status === "failed") {
      process.exit(1);
    }
  } catch (error) {
    ui.cleanup();
    ui.showError(error as Error);
    process.exit(1);
  } finally {
    ui.cleanup();
  }
}

export const runCommandConfig = {
  command: "run",
  describe: "Run a pipeline with the given input",
  builder: {
    pipeline: {
      alias: "p",
      type: "string" as const,
      demandOption: true,
      describe: "Pipeline ID or path to pipeline file",
    },
    input: {
      alias: "i",
      type: "string" as const,
      describe: "Input prompt text (interactive prompt if not provided)",
    },
    "input-file": {
      alias: "f",
      type: "string" as const,
      describe: "Path to file containing input prompt",
    },
    output: {
      alias: "o",
      type: "string" as const,
      describe: "Output directory for results",
      default: "./outputs",
    },
    quiet: {
      alias: "q",
      type: "boolean" as const,
      describe: "Minimal output",
      default: false,
    },
    json: {
      type: "boolean" as const,
      describe: "Output results as JSON",
      default: false,
    },
    verbose: {
      alias: "v",
      type: "boolean" as const,
      describe: "Verbose output with debug info",
      default: false,
    },
  },
  handler: runCommand,
};
