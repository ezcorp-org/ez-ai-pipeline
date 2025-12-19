import chalk from "chalk";
import Table from "cli-table3";
import type { Stage } from "@typings/stage.ts";
import type { StageResult, PipelineResult } from "@typings/result.ts";
import type { PipelineConfig } from "@typings/pipeline.ts";
import { ProgressManager } from "@cli/ui/progress.ts";
import { logger } from "@cli/ui/logger.ts";
import { showBanner, showCompactBanner } from "@cli/ui/banner.ts";
import { formatCost, getModelTier } from "@utils/cost.ts";

export interface UIOptions {
  quiet?: boolean;
  verbose?: boolean;
  json?: boolean;
  compact?: boolean;
}

export class TerminalUI {
  private progress: ProgressManager;
  private options: UIOptions;

  constructor(options: UIOptions = {}) {
    this.options = options;
    this.progress = new ProgressManager(options.quiet);
    logger.setOptions({
      quiet: options.quiet || false,
      verbose: options.verbose || false,
      json: options.json || false,
    });
  }

  showBanner(): void {
    if (this.options.quiet || this.options.json) return;
    if (this.options.compact) {
      showCompactBanner();
    } else {
      showBanner(true);
    }
  }

  showPipelineInfo(config: PipelineConfig, input: string): void {
    if (this.options.quiet || this.options.json) return;

    logger.blank();
    logger.pipeline(config.pipeline.id);
    logger.input(input);
    logger.blank();
  }

  stageStart(stage: Stage, index: number, total: number): void {
    if (this.options.json) return;

    logger.header(`STAGE ${index + 1}/${total}`);
    logger.stage(stage.name, index, total);
    logger.model(stage.model.modelID, stage.model.tier || getModelTier(stage.model.modelID));

    this.progress.startSpinner("  Running...");
  }

  stageComplete(stage: Stage, result: StageResult): void {
    if (this.options.json) {
      console.log(JSON.stringify({ event: "stageComplete", stage: stage.id, result }));
      return;
    }

    const durationSec = (result.duration / 1000).toFixed(1);
    this.progress.succeedSpinner(chalk.green(`  Completed in ${durationSec}s`));
    logger.cost(result.cost);

    if (result.parsedOutput && this.options.verbose) {
      this.showResultPreview(result.parsedOutput);
    }

    logger.blank();
  }

  stageSkipped(stage: Stage, reason: string): void {
    if (this.options.json) {
      console.log(JSON.stringify({ event: "stageSkipped", stage: stage.id, reason }));
      return;
    }

    this.progress.warnSpinner(chalk.yellow(`  Skipped`));
    logger.skipped(reason);
    logger.blank();
  }

  stageFailed(stage: Stage, error: Error): void {
    if (this.options.json) {
      console.log(JSON.stringify({ event: "stageFailed", stage: stage.id, error: error.message }));
      return;
    }

    this.progress.failSpinner(chalk.red(`  Failed: ${error.message}`));
    logger.blank();
  }

  showProgress(_current: number, _total: number): void {
    if (this.options.quiet || this.options.json) return;
    // Progress is shown via spinner, could add a progress bar for longer pipelines
  }

  showSummary(result: PipelineResult): void {
    if (this.options.json) {
      console.log(JSON.stringify(result, null, 2));
      return;
    }

    if (this.options.quiet) {
      console.log(`${result.status}: ${result.summary.stagesRun} stages, $${result.summary.totalCost.toFixed(4)}`);
      return;
    }

    logger.header("SUMMARY");

    const statusIcon =
      result.status === "success"
        ? chalk.green("✅ Pipeline Complete")
        : result.status === "early_exit"
          ? chalk.yellow("🏁 Early Exit")
          : result.status === "cancelled"
            ? chalk.yellow("⏹️ Cancelled")
            : chalk.red("❌ Pipeline Failed");

    console.log("  ", statusIcon);
    logger.blank();

    const summary = result.summary;
    console.log(
      "  ",
      chalk.dim("📊 Stages:"),
      `${summary.stagesRun} run,`,
      `${summary.stagesSkipped} skipped,`,
      `${summary.stagesFailed} failed`
    );
    console.log("  ", chalk.dim("⏱️  Duration:"), `${(summary.totalDuration / 1000).toFixed(1)}s`);
    console.log("  ", chalk.dim("💰 Total Cost:"), formatCost(summary.totalCost));
    console.log(
      "  ",
      chalk.dim("🔤 Tokens:"),
      `${summary.totalInputTokens} in / ${summary.totalOutputTokens} out`
    );

    if (result.earlyExitStage) {
      console.log("  ", chalk.dim("🏁 Early Exit at:"), result.earlyExitStage);
    }

    if (result.error) {
      console.log("  ", chalk.red("❌ Error:"), result.error);
    }

    logger.blank();
    logger.divider();
  }

  showOutputPaths(resultPath: string, promptPath?: string): void {
    if (this.options.quiet || this.options.json) return;

    console.log();
    console.log(chalk.dim("  📁 Output saved to:"), chalk.cyan(resultPath));
    if (promptPath) {
      console.log(chalk.dim("  📝 Prompt saved to:"), chalk.cyan(promptPath));
    }
    console.log();
  }

  showPipelineList(
    pipelines: { id: string; name: string; version: string; description?: string; stages: number }[]
  ): void {
    if (this.options.json) {
      console.log(JSON.stringify(pipelines, null, 2));
      return;
    }

    if (pipelines.length === 0) {
      console.log(chalk.yellow("No pipelines found in ./pipelines directory"));
      console.log(chalk.dim("Run"), chalk.cyan("ez-ai-pipeline init <name>"), chalk.dim("to create one."));
      return;
    }

    const table = new Table({
      head: [
        chalk.cyan("Pipeline"),
        chalk.cyan("Version"),
        chalk.cyan("Stages"),
        chalk.cyan("Description"),
      ],
      style: { head: [], border: ["dim"] },
    });

    for (const pipeline of pipelines) {
      table.push([
        pipeline.id,
        pipeline.version,
        String(pipeline.stages),
        (pipeline.description || "").slice(0, 40) + (pipeline.description && pipeline.description.length > 40 ? "..." : ""),
      ]);
    }

    console.log(table.toString());
  }

  showValidationResult(pipelineId: string, valid: boolean, errors: { path: string[]; message: string }[]): void {
    if (this.options.json) {
      console.log(JSON.stringify({ pipelineId, valid, errors }));
      return;
    }

    if (valid) {
      console.log(chalk.green(`✅ Pipeline '${pipelineId}' is valid`));
    } else {
      console.log(chalk.red(`❌ Pipeline '${pipelineId}' has validation errors:`));
      for (const error of errors) {
        console.log(chalk.red(`   - ${error.path.join(".")}: ${error.message}`));
      }
    }
  }

  showError(error: Error): void {
    if (this.options.json) {
      console.log(JSON.stringify({ error: error.message, stack: error.stack }));
      return;
    }

    console.log();
    console.log(chalk.red("❌ Error:"), error.message);
    if (this.options.verbose && error.stack) {
      console.log(chalk.dim(error.stack));
    }
    console.log();
  }

  private showResultPreview(data: Record<string, unknown>): void {
    const preview = JSON.stringify(data, null, 2).slice(0, 500);
    const lines = preview.split("\n").slice(0, 10);
    console.log();
    console.log(chalk.dim("  Preview:"));
    for (const line of lines) {
      console.log(chalk.dim("    " + line));
    }
    if (preview.length >= 500) {
      console.log(chalk.dim("    ..."));
    }
  }

  cleanup(): void {
    this.progress.cleanup();
  }
}
