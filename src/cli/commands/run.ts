import type { ArgumentsCamelCase } from "yargs";
import { PipelineExecutor } from "@core/executor.ts";
import { TerminalUI } from "@cli/ui/terminal.ts";
import { loadPipeline, savePipelineResult, saveOptimizedPrompt, readInputFile } from "@utils/file.ts";
import { ConfigurationError } from "@utils/errors.ts";

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
      throw new ConfigurationError("Either --input or --input-file is required");
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
      describe: "Input prompt text",
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
