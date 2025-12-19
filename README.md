# EZ AI Pipeline

A production-ready CLI tool for executing prompt optimization pipelines using AI models. Features a beautiful terminal interface, multi-stage pipeline execution, and cost-efficient model selection.

## Features

- **Multi-Stage Pipelines**: Define complex workflows with multiple AI processing stages
- **Conditional Execution**: Skip stages, run conditionally, or exit early based on results
- **Cost Tracking**: Automatic token counting and cost calculation for all API calls
- **Beautiful Terminal UI**: Progress indicators, spinners, and formatted output
- **Variable Interpolation**: Pass data between stages using template variables
- **Multiple Output Formats**: JSON, Markdown, and text parsing support
- **Pause/Resume/Cancel**: Control pipeline execution in real-time

## Installation

```bash
# Clone the repository
git clone https://github.com/your-repo/ez-ai-pipeline.git
cd ez-ai-pipeline

# Install dependencies
bun install

# Run the CLI
bun run src/index.ts --help
```

## Quick Start

### 1. Set up your API key

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

### 2. List available pipelines

```bash
bun run src/index.ts list
```

### 3. Run a pipeline

```bash
bun run src/index.ts run --pipeline prompt-optimizer --input "Write a blog post about productivity"
```

### 4. Create your own pipeline

```bash
bun run src/index.ts init my-pipeline
```

## Commands

### `run` - Execute a pipeline

```bash
ez-ai-pipeline run --pipeline <id> --input <text>
ez-ai-pipeline run --pipeline <id> --input-file <path>
ez-ai-pipeline run --pipeline <id> --input <text> --output ./results/
ez-ai-pipeline run --pipeline <id> --input <text> --json  # JSON output only
ez-ai-pipeline run --pipeline <id> --input <text> --quiet # Minimal output
```

### `list` - Show available pipelines

```bash
ez-ai-pipeline list
ez-ai-pipeline list --json
```

### `validate` - Validate a pipeline configuration

```bash
ez-ai-pipeline validate --pipeline <id>
```

### `init` - Create a new pipeline from template

```bash
ez-ai-pipeline init <name>
```

## Pipeline Configuration

Pipelines are TypeScript files in the `pipelines/` directory:

```typescript
import type { PipelineConfig } from "../src/typings/pipeline.ts";

const config: PipelineConfig = {
  pipeline: {
    id: "my-pipeline",
    name: "My Pipeline",
    version: "1.0.0",
    description: "Description of what this pipeline does",
    settings: {
      enableCaching: true,
      enableEarlyExit: true,
      maxRetries: 2,
      timeoutMs: 300000,
    },
  },
  stages: [
    {
      id: "stage-1",
      name: "Analyze Input",
      type: "analyze",
      model: {
        providerID: "anthropic",
        modelID: "claude-haiku-4-5-20251001",
        tier: "small",
        maxTokens: 1024,
        temperature: 0.1,
      },
      prompt: {
        systemPrompt: "You are an expert analyst.",
        template: `Analyze this: {{input_prompt}}`,
        variables: [
          { name: "input_prompt", source: "input", path: "prompt", required: true },
        ],
      },
      output: {
        format: "json",
        extract: [
          { name: "result", path: "result", required: true },
        ],
      },
    },
  ],
};

export default config;
```

## Stage Types

- `analyze` - Analyze and extract information
- `structure` - Restructure or organize content
- `enhance` - Improve or enrich content
- `validate` - Validate results against criteria
- `test` - Test outputs or run checks
- `iterate` - Make iterative improvements
- `custom` - Custom processing stage

## Variable Sources

Variables can be sourced from:

- `input` - The original input to the pipeline
- `previousStage` - Output from a previous stage
- `context` - Accumulated context throughout the pipeline
- `static` - Static values defined in the configuration

## Conditions

### Skip If

Skip a stage if a condition is met:

```typescript
conditions: {
  skipIf: {
    condition: { path: "status", equals: "complete" },
    sourceStage: "stage-1",
  },
}
```

### Run If

Only run a stage if a condition is met:

```typescript
conditions: {
  runIf: {
    condition: { path: "needsWork", equals: true },
    sourceStage: "stage-1",
  },
}
```

### Early Exit

Exit the pipeline early if a condition is met:

```typescript
conditions: {
  earlyExit: {
    condition: { path: "overall", equals: "COMPLETE" },
    returnStage: "stage-1",
  },
}
```

## Output

Results are saved to the `outputs/` directory:

- `result-{pipeline}-{timestamp}.json` - Full pipeline results
- `prompt-{pipeline}-{timestamp}.md` - Optimized prompt (for prompt pipelines)

## Development

```bash
# Run tests
bun test

# Type check
bun run typecheck

# Format code
bun run format
```

## Project Structure

```
ez-ai-pipeline/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── cli/                  # CLI commands and UI
│   ├── core/                 # Pipeline execution engine
│   ├── schema/               # Zod schemas and validation
│   ├── typings/              # TypeScript type definitions
│   ├── utils/                # Utilities (cost, templates, etc.)
│   └── config/               # Configuration and constants
├── pipelines/                # User pipeline definitions
├── outputs/                  # Generated outputs
├── tests/                    # Test files
└── package.json
```

## Supported Models

### Anthropic
- claude-opus-4-5-20250929 (large)
- claude-sonnet-4-5-20250929 (medium)
- claude-haiku-4-5-20251001 (small)

### OpenAI
- gpt-4o (medium)
- gpt-4o-mini (small)
- gpt-4-turbo (large)

### Google
- gemini-1.5-pro (large)
- gemini-1.5-flash (small)
- gemini-2.0-flash (small)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
