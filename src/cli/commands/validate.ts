import type { ArgumentsCamelCase } from "yargs";
import { TerminalUI } from "@cli/ui/terminal.ts";
import { validatePipelineConfig, validateStageReferences } from "@schema/validator.ts";

export interface ValidateOptions {
  pipeline: string;
  json?: boolean;
}

export async function validateCommand(args: ArgumentsCamelCase<ValidateOptions>): Promise<void> {
  const ui = new TerminalUI({
    json: args.json,
  });

  try {
    // Determine the file path
    let filePath = args.pipeline;
    if (!filePath.includes("/") && !filePath.endsWith(".ts")) {
      filePath = `./pipelines/${args.pipeline}.ts`;
    }

    // Load and parse the module
    const module = await import(Bun.resolveSync(filePath, process.cwd()));
    const config = module.default || module;

    // Validate schema
    const schemaResult = validatePipelineConfig(config);

    if (!schemaResult.valid) {
      ui.showValidationResult(
        args.pipeline,
        false,
        schemaResult.errors.map((e) => ({ path: e.path.map(String), message: e.message }))
      );
      process.exit(1);
    }

    // Validate references
    const refResult = validateStageReferences(schemaResult.data!);

    if (!refResult.valid) {
      ui.showValidationResult(
        args.pipeline,
        false,
        refResult.errors.map((e) => ({ path: e.path.map(String), message: e.message }))
      );
      process.exit(1);
    }

    // All valid
    ui.showValidationResult(args.pipeline, true, []);

    if (!args.json) {
      const pipelineInfo = schemaResult.data!;
      console.log(`   - ${pipelineInfo.stages.length} stages defined`);
      console.log(`   - All model references valid`);
      console.log(`   - All variable references resolved`);
    }
  } catch (error) {
    ui.showError(error as Error);
    process.exit(1);
  }
}

export const validateCommandConfig = {
  command: "validate",
  describe: "Validate a pipeline configuration",
  builder: {
    pipeline: {
      alias: "p",
      type: "string" as const,
      demandOption: true,
      describe: "Pipeline ID or path to validate",
    },
    json: {
      type: "boolean" as const,
      describe: "Output as JSON",
      default: false,
    },
  },
  handler: validateCommand,
};
