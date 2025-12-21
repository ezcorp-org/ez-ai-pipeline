import type { ArgumentsCamelCase } from "yargs";
import chalk from "chalk";
import { fileExists, writeFile } from "@utils/file.ts";

export interface InitOptions {
  name: string;
}

const PIPELINE_TEMPLATE = `import type { PipelineConfig } from "../src/types/pipeline.ts";

const config: PipelineConfig = {
  pipeline: {
    id: "{{name}}",
    name: "{{name}} Pipeline",
    version: "1.0.0",
    description: "A custom pipeline for processing prompts",
    defaultProvider: "anthropic",
    targetModel: {
      providerID: "anthropic",
      modelID: "claude-sonnet-4-5-20250929",
      tier: "medium",
      maxTokens: 4096,
      temperature: 0.7,
    },
    settings: {
      enableCaching: true,
      enableEarlyExit: true,
      maxRetries: 2,
      timeoutMs: 300000,
      parallelExecution: false,
    },
  },
  stages: [
    {
      id: "stage-1-analyze",
      name: "Analyze Input",
      type: "analyze",
      description: "Analyze the input prompt for structure and clarity",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 1024,
        temperature: 0.1,
      },
      prompt: {
        systemPrompt: "You are an expert prompt analyst. Analyze prompts for clarity, structure, and effectiveness.",
        template: \`Analyze the following prompt and identify its strengths and areas for improvement.

Prompt to analyze:
"""
{{input_prompt}}
"""

Provide your analysis as a JSON object with the following structure:
{
  "clarity": "clear|unclear|partial",
  "hasContext": boolean,
  "hasConstraints": boolean,
  "hasExamples": boolean,
  "suggestions": ["suggestion1", "suggestion2", ...]
}\`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "clarity", path: "clarity", required: true },
          { name: "suggestions", path: "suggestions", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 30000,
    },
    {
      id: "stage-2-enhance",
      name: "Enhance Prompt",
      type: "enhance",
      description: "Enhance the prompt based on analysis",
      model: {
        providerID: "anthropic",
        modelID: "claude-sonnet-4-5-20250929",
        tier: "medium",
        maxTokens: 2048,
        temperature: 0.7,
      },
      prompt: {
        systemPrompt: "You are an expert prompt engineer. Your task is to enhance prompts to be more effective.",
        template: \`Based on the following analysis, enhance the original prompt.

Original prompt:
"""
{{input_prompt}}
"""

Analysis results:
{{stage-1-analyze}}

Create an enhanced version of the prompt that addresses the identified issues.
Return your response as a JSON object:
{
  "optimizedPrompt": "your enhanced prompt here",
  "changes": ["change1", "change2", ...]
}\`,
        variables: [
          {
            name: "input_prompt",
            source: "input",
            path: "prompt",
            required: true,
          },
          {
            name: "stage-1-analyze",
            source: "previousStage",
            stageId: "stage-1-analyze",
            required: true,
          },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "optimizedPrompt", path: "optimizedPrompt", required: true },
          { name: "changes", path: "changes", required: true },
        ],
      },
      retryCount: 2,
      timeoutMs: 60000,
    },
  ],
};

export default config;
`;

export async function initCommand(args: ArgumentsCamelCase<InitOptions>): Promise<void> {
  const name = args.name;
  const filePath = `./pipelines/${name}.ts`;

  try {
    // Check if file already exists
    if (await fileExists(filePath)) {
      console.log(chalk.red(`Error: Pipeline '${name}' already exists at ${filePath}`));
      process.exit(1);
    }

    // Create the file
    const content = PIPELINE_TEMPLATE.replace(/\{\{name\}\}/g, name);
    await writeFile(filePath, content);

    console.log(chalk.green(`✅ Created new pipeline: ${filePath}`));
    console.log();
    console.log(chalk.dim("Next steps:"));
    console.log(chalk.dim("  1. Edit the pipeline configuration in"), chalk.cyan(filePath));
    console.log(chalk.dim("  2. Validate with:"), chalk.cyan(`ez-ai-pipeline validate --pipeline ${name}`));
    console.log(chalk.dim("  3. Run with:"), chalk.cyan(`ez-ai-pipeline run --pipeline ${name} --input "your prompt"`));
    console.log();
  } catch (error) {
    console.log(chalk.red(`Error creating pipeline: ${(error as Error).message}`));
    process.exit(1);
  }
}

export const initCommandConfig = {
  command: "init <name>",
  describe: "Initialize a new pipeline from template",
  builder: {
    name: {
      type: "string" as const,
      describe: "Name for the new pipeline",
      demandOption: true,
    },
  },
  handler: initCommand,
};
