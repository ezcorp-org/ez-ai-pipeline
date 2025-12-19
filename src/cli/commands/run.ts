import type { ArgumentsCamelCase } from "yargs";
import * as path from "path";
import { select, input } from "@inquirer/prompts";
import { PipelineExecutor } from "@core/executor.ts";
import { TerminalUI } from "@cli/ui/terminal.ts";
import { loadPipeline, savePipelineResult, saveOptimizedPrompt, readInputFile } from "@utils/file.ts";
import chalk from "chalk";
import { Glob } from "bun";

interface PipelineInfo {
  path: string;
  name: string;
  description?: string;
}

async function discoverPipelines(): Promise<PipelineInfo[]> {
  const pipelines: PipelineInfo[] = [];
  const pipelinesDir = path.join(process.cwd(), "pipelines");

  try {
    const glob = new Glob("**/*.ts");
    for await (const file of glob.scan(pipelinesDir)) {
      const fullPath = path.join(pipelinesDir, file);
      try {
        const module = await import(fullPath);
        const config = module.default;
        if (config?.pipeline?.name) {
          pipelines.push({
            path: fullPath,
            name: config.pipeline.name,
            description: config.pipeline.description,
          });
        }
      } catch {
        // Skip files that don't export a valid pipeline
      }
    }
  } catch {
    // Pipelines directory might not exist
  }

  return pipelines;
}

async function selectPipeline(pipelines: PipelineInfo[]): Promise<string> {
  console.log();

  const selected = await select({
    message: chalk.cyan.bold("Select a pipeline to run"),
    choices: pipelines.map((p) => ({
      name: p.name,
      value: p.path,
      description: p.description,
    })),
    theme: {
      prefix: "🔧",
      style: {
        highlight: (text: string) => chalk.cyan.bold(text),
        description: (text: string) => chalk.dim(text),
      },
    },
  });

  console.log(chalk.dim(`\n   Selected: ${pipelines.find(p => p.path === selected)?.name}\n`));
  return selected;
}

async function promptForInput(): Promise<string> {
  console.log();

  const userInput = await input({
    message: chalk.cyan.bold("Enter your prompt to optimize"),
    theme: {
      prefix: "📝",
      style: {
        answer: (text: string) => chalk.white(text),
      },
    },
    validate: (text) => {
      if (!text || text.trim().length === 0) {
        return "Please enter a prompt";
      }
      return true;
    },
  });

  const trimmed = userInput.trim();
  console.log(chalk.dim(`   (${trimmed.length} characters entered)\n`));
  return trimmed;
}

export interface RunOptions {
  pipeline?: string;
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
    // Get pipeline - either from args or interactive selection
    let pipelinePath: string;
    if (args.pipeline) {
      pipelinePath = args.pipeline;
    } else {
      // Show banner first in interactive mode
      ui.showBanner();

      // Discover and select pipeline
      const pipelines = await discoverPipelines();
      if (pipelines.length === 0) {
        console.log(chalk.yellow("\n⚠️  No pipelines found in ./pipelines directory"));
        console.log(chalk.dim("   Create a pipeline file or specify one with -p flag\n"));
        process.exit(1);
      }
      pipelinePath = await selectPipeline(pipelines);
    }

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
    const config = await loadPipeline(pipelinePath);

    // Show banner and info (if not already shown)
    if (args.pipeline) {
      ui.showBanner();
    }
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
      describe: "Pipeline ID or path to pipeline file (interactive selection if not provided)",
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
