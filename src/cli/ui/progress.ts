import ora, { type Ora } from "ora";
import cliProgress from "cli-progress";
import chalk from "chalk";

export class ProgressManager {
  private spinner: Ora | null = null;
  private progressBar: cliProgress.SingleBar | null = null;
  private isQuiet: boolean = false;

  constructor(quiet: boolean = false) {
    this.isQuiet = quiet;
  }

  startSpinner(text: string): void {
    if (this.isQuiet) return;

    this.stopSpinner();
    this.spinner = ora({
      text,
      spinner: "dots",
      color: "cyan",
    }).start();
  }

  updateSpinner(text: string): void {
    if (this.spinner && !this.isQuiet) {
      this.spinner.text = text;
    }
  }

  succeedSpinner(text?: string): void {
    if (this.spinner && !this.isQuiet) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }

  failSpinner(text?: string): void {
    if (this.spinner && !this.isQuiet) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }

  warnSpinner(text?: string): void {
    if (this.spinner && !this.isQuiet) {
      this.spinner.warn(text);
      this.spinner = null;
    }
  }

  stopSpinner(): void {
    if (this.spinner && !this.isQuiet) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  startProgressBar(total: number): void {
    if (this.isQuiet) return;

    this.progressBar = new cliProgress.SingleBar(
      {
        format:
          "  " +
          chalk.cyan("[{bar}]") +
          " {percentage}% | {value}/{total} stages | ETA: {eta}s",
        barCompleteChar: "█",
        barIncompleteChar: "░",
        hideCursor: true,
      },
      cliProgress.Presets.shades_classic
    );

    this.progressBar.start(total, 0);
  }

  updateProgressBar(current: number): void {
    if (this.progressBar && !this.isQuiet) {
      this.progressBar.update(current);
    }
  }

  stopProgressBar(): void {
    if (this.progressBar && !this.isQuiet) {
      this.progressBar.stop();
      this.progressBar = null;
    }
  }

  cleanup(): void {
    this.stopSpinner();
    this.stopProgressBar();
  }
}

export function createSpinner(text: string): Ora {
  return ora({
    text,
    spinner: "dots",
    color: "cyan",
  });
}

export function createProgressBar(total: number): cliProgress.SingleBar {
  const bar = new cliProgress.SingleBar(
    {
      format:
        "  " +
        chalk.cyan("[{bar}]") +
        " {percentage}% | {value}/{total} stages | ETA: {eta}s",
      barCompleteChar: "█",
      barIncompleteChar: "░",
      hideCursor: true,
    },
    cliProgress.Presets.shades_classic
  );

  bar.start(total, 0);
  return bar;
}
