import type { ArgumentsCamelCase } from "yargs";
import { TerminalUI } from "@cli/ui/terminal.ts";
import { listPipelines } from "@utils/file.ts";

export interface ListOptions {
  json?: boolean;
}

export async function listCommand(args: ArgumentsCamelCase<ListOptions>): Promise<void> {
  const ui = new TerminalUI({
    json: args.json,
  });

  try {
    const pipelines = await listPipelines();
    ui.showPipelineList(pipelines);
  } catch (error) {
    ui.showError(error as Error);
    process.exit(1);
  }
}

export const listCommandConfig = {
  command: "list",
  aliases: ["ls"],
  describe: "List all available pipelines",
  builder: {
    json: {
      type: "boolean" as const,
      describe: "Output as JSON",
      default: false,
    },
  },
  handler: listCommand,
};
