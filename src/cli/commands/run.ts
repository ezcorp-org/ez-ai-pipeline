import type { ArgumentsCamelCase } from "yargs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { select, input } from "@inquirer/prompts";
import { glob } from "tinyglobby";
import { PipelineExecutor } from "@core/executor.ts";
import { TerminalUI } from "@cli/ui/terminal.ts";
import { loadPipeline, savePipelineResult, saveOptimizedPrompt, readInputFile } from "@utils/file.ts";
import chalk from "chalk";

interface PipelineInfo {
  path: string;
  name: string;
  description?: string;
  source: "local" | "package";
}

// Get the package root directory (where compiled pipelines are installed)
function getPackagePipelinesDir(): string {
  // Use import.meta.url which gives the actual file location at runtime
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  // After bundling, code is in dist/, so go up one level to package root, then into dist-pipelines
  // (dist-pipelines contains compiled .js versions of the pipelines)
  return path.resolve(currentDir, "../dist-pipelines");
}

// Get local pipelines directory (in current working directory)
function getLocalPipelinesDir(): string {
  return path.resolve(process.cwd(), "pipelines");
}

async function discoverPipelines(): Promise<PipelineInfo[]> {
  const pipelines: PipelineInfo[] = [];
  const seenNames = new Set<string>();

  // Helper to load pipelines from a directory
  async function loadFromDir(dir: string, source: "local" | "package") {
    try {
      // Local pipelines are .ts files, package pipelines are compiled .js files
      const pattern = source === "package" ? "**/*.js" : "**/*.ts";
      const files = await glob(pattern, { cwd: dir });
      for (const file of files) {
        const fullPath = path.join(dir, file);
        try {
          const module = await import(fullPath);
          const config = module.default;
          if (config?.pipeline?.name && !seenNames.has(config.pipeline.name)) {
            seenNames.add(config.pipeline.name);
            pipelines.push({
              path: fullPath,
              name: config.pipeline.name,
              description: config.pipeline.description,
              source,
            });
          }
        } catch {
          // Skip files that don't export a valid pipeline
        }
      }
    } catch {
      // Directory might not exist
    }
  }

  // Check local pipelines first (they take priority)
  await loadFromDir(getLocalPipelinesDir(), "local");

  // Then check package pipelines
  await loadFromDir(getPackagePipelinesDir(), "package");

  return pipelines;
}

async function selectPipeline(pipelines: PipelineInfo[]): Promise<string> {
  console.log();

  const selected = await select({
    message: chalk.cyan.bold("Select a pipeline to run"),
    choices: pipelines.map((p) => ({
      name: `${p.name} ${p.source === "package" ? chalk.dim("(built-in)") : chalk.green("(local)")}`,
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
        console.log(chalk.yellow("\n⚠️  No pipelines found"));
        console.log(chalk.dim("   Checked: ./pipelines and package built-in pipelines"));
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
