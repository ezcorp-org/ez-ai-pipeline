import chalk from "chalk";
import boxen from "boxen";
import { APP_NAME, APP_VERSION, APP_DESCRIPTION } from "@config/constants.ts";

const BANNER_ART = `
 ███████╗███████╗    █████╗ ██╗    ██████╗ ██╗██████╗ ███████╗
 ██╔════╝╚══███╔╝   ██╔══██╗██║    ██╔══██╗██║██╔══██╗██╔════╝
 █████╗    ███╔╝    ███████║██║    ██████╔╝██║██████╔╝█████╗
 ██╔══╝   ███╔╝     ██╔══██║██║    ██╔═══╝ ██║██╔═══╝ ██╔══╝
 ███████╗███████╗   ██║  ██║██║    ██║     ██║██║     ███████╗
 ╚══════╝╚══════╝   ╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝╚═╝     ╚══════╝
`.trim();

const SMALL_BANNER = `
╔═══════════════════════════════════════════════════════════════╗
║                     EZ AI PIPELINE                            ║
╚═══════════════════════════════════════════════════════════════╝
`.trim();

export function showBanner(compact: boolean = false): void {
  const art = compact ? SMALL_BANNER : BANNER_ART;
  const coloredArt = chalk.cyan(art);

  const content = `${coloredArt}

  ${chalk.bold(APP_NAME)} ${chalk.dim(`v${APP_VERSION}`)}
  ${chalk.dim(APP_DESCRIPTION)}`;

  console.log(
    boxen(content, {
      padding: 1,
      margin: { top: 1, bottom: 1, left: 0, right: 0 },
      borderStyle: "double",
      borderColor: "cyan",
    })
  );
}

export function showCompactBanner(): void {
  console.log(
    chalk.cyan.bold("EZ AI Pipeline") +
      chalk.dim(` v${APP_VERSION}`) +
      chalk.dim(" | ") +
      chalk.dim(APP_DESCRIPTION)
  );
  console.log();
}

export function showWelcome(): void {
  showBanner(false);
  console.log();
  console.log(chalk.dim("  Type"), chalk.cyan("ez-ai-pipeline --help"), chalk.dim("for usage information."));
  console.log();
}
