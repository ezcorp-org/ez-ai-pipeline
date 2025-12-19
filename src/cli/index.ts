import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { APP_NAME, APP_VERSION } from "@config/constants.ts";
import { runCommandConfig } from "@cli/commands/run.ts";
import { listCommandConfig } from "@cli/commands/list.ts";
import { validateCommandConfig } from "@cli/commands/validate.ts";
import { initCommandConfig } from "@cli/commands/init.ts";
import { showWelcome } from "@cli/ui/banner.ts";

export function createCLI() {
  return yargs(hideBin(process.argv))
    .scriptName("ez-ai-pipeline")
    .version(APP_VERSION)
    .usage(`${APP_NAME} v${APP_VERSION}\n\nUsage: $0 <command> [options]`)
    .command(runCommandConfig)
    .command(listCommandConfig)
    .command(validateCommandConfig)
    .command(initCommandConfig)
    .demandCommand(1, "Please specify a command")
    .strict()
    .help("help")
    .alias("h", "help")
    .alias("v", "version")
    .wrap(Math.min(100, process.stdout.columns || 80))
    .example("$0 run -p prompt-optimizer -i 'Write a blog post'", "Run the prompt-optimizer pipeline")
    .example("$0 run -p my-pipeline -f ./input.txt", "Run pipeline with input from file")
    .example("$0 list", "List all available pipelines")
    .example("$0 validate -p my-pipeline", "Validate a pipeline configuration")
    .example("$0 init my-new-pipeline", "Create a new pipeline from template")
    .epilogue("For more information, visit https://github.com/your-repo/ez-ai-pipeline");
}

export async function runCLI(): Promise<void> {
  try {
    // If no arguments, show welcome message
    if (process.argv.length <= 2) {
      showWelcome();
      process.exit(0);
    }

    await createCLI().parseAsync();
  } catch (error) {
    console.error("CLI Error:", (error as Error).message);
    process.exit(1);
  }
}
