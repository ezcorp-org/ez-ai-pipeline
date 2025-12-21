# EZ AI Pipeline

[![npm version](https://img.shields.io/npm/v/@ez-corp/ez-ai-pipeline.svg)](https://www.npmjs.com/package/@ez-corp/ez-ai-pipeline)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A production-ready CLI tool for executing prompt optimization pipelines using AI models. Features a beautiful terminal interface, multi-stage pipeline execution, cost-efficient model selection, and a built-in web dashboard.

## Features

- **Multi-Stage Pipelines**: Define complex workflows with multiple AI processing stages
- **Conditional Execution**: Skip stages, run conditionally, or exit early based on results
- **Cost Tracking**: Automatic token counting and cost calculation for all API calls
- **Beautiful Terminal UI**: Progress indicators, spinners, and formatted output
- **Variable Interpolation**: Pass data between stages using template variables
- **Multiple Output Formats**: JSON, Markdown, and text parsing support
- **Pause/Resume/Cancel**: Control pipeline execution in real-time
- **Web Dashboard**: Built-in web viewer to browse pipeline outputs
- **Included Pipelines**: Ships with ready-to-use pipelines (prompt-optimizer, pipeline-generator)

## Installation

```bash
# Install globally from npm
npm install -g @ez-corp/ez-ai-pipeline

# Or use with npx
npx @ez-corp/ez-ai-pipeline --help
```

## Quick Start

### 1. Set up your API key

```bash
export ANTHROPIC_API_KEY="your-api-key"
```

### 2. Run an included pipeline

```bash
ez-ai-pipeline run -p prompt-optimizer -i "Write a blog post about productivity"
```

### 3. View results in the web dashboard

```bash
ez-ai-pipeline web
```

### 4. Create your own pipeline

```bash
ez-ai-pipeline init my-pipeline
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

### `web` - Start the web dashboard

```bash
ez-ai-pipeline web              # Start on default port 3000
ez-ai-pipeline web -p 8080      # Start on custom port
```

Opens a local web interface to browse pipelines and execute them directly in your browser.

**Features:**
- **Run Pipelines**: Execute any pipeline with real-time progress tracking
- **Live Progress**: Watch stages complete with WebSocket-powered updates
- **Cost Tracking**: See costs accumulate as each stage finishes
- **View Outputs**: Browse all pipeline execution results
- **Stage Details**: Explore stage-by-stage outputs and configurations

**Running Pipelines from the Web:**

1. Start the web dashboard: `ez-ai-pipeline web`
2. Navigate to a pipeline from the sidebar
3. Enter your prompt in the textarea
4. Click "Run Pipeline" or press `Ctrl+Enter`
5. Watch real-time progress as each stage executes
6. View the final optimized output

**Keyboard Shortcuts:**
- `Ctrl+Enter` - Run the pipeline
- `Escape` - Cancel a running execution

## Included Pipelines

The package ships with ready-to-use pipelines:

### `prompt-optimizer`
Optimizes prompts for better AI responses. Analyzes input, identifies improvements, and generates an enhanced version.

```bash
ez-ai-pipeline run -p prompt-optimizer -i "Your prompt to optimize"
```

### `pipeline-generator`
Generates new pipeline configurations from natural language descriptions.

```bash
ez-ai-pipeline run -p pipeline-generator -i "Create a pipeline that summarizes articles"
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

## Web API

The web dashboard exposes a REST API and WebSocket endpoint for programmatic access:

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pipelines` | List all available pipelines |
| GET | `/api/pipelines/:id` | Get pipeline configuration |
| POST | `/api/pipelines/:id/run` | Start pipeline execution |
| GET | `/api/executions/:id` | Get execution status |
| POST | `/api/executions/:id/cancel` | Cancel running execution |
| GET | `/api/outputs` | List all execution outputs |
| GET | `/api/outputs/:filename` | Get specific output file |
| GET | `/api/config/status` | Check if API key is configured |

### Running a Pipeline via API

```bash
# Start execution
curl -X POST http://localhost:3000/api/pipelines/prompt-optimizer/run \
  -H "Content-Type: application/json" \
  -d '{"input": "Your prompt to optimize"}'

# Response: { "executionId": "exec_123...", "pipelineId": "prompt-optimizer", "status": "started" }

# Check status
curl http://localhost:3000/api/executions/exec_123...

# Cancel execution
curl -X POST http://localhost:3000/api/executions/exec_123.../cancel
```

### WebSocket for Real-Time Updates

Connect to `ws://localhost:3000/ws` for real-time execution progress:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

// Subscribe to an execution
ws.send(JSON.stringify({ type: 'subscribe', executionId: 'exec_123...' }));

// Receive events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Event types: stage:started, stage:completed, stage:failed,
  //              stage:skipped, execution:completed, execution:cancelled
  console.log(data);
};
```

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
│   │   └── commands/         # Command implementations (run, list, validate, init, web)
│   ├── core/                 # Pipeline execution engine
│   ├── schema/               # Zod schemas and validation
│   ├── typings/              # TypeScript type definitions
│   ├── utils/                # Utilities (cost, templates, etc.)
│   └── config/               # Configuration and constants
├── pipelines/                # Included pipeline definitions
├── web/                      # Web dashboard source
├── web-dist/                 # Built web assets (included in npm package)
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
