# Web Dashboard Guide

The EZ AI Pipeline web dashboard provides a browser-based interface for viewing, running, and monitoring pipeline executions.

## Starting the Dashboard

```bash
# Start on default port (3000)
ez-ai-pipeline web

# Start on custom port
ez-ai-pipeline web -p 8080

# Or run directly with bun (development)
bun run web
```

Then open `http://localhost:3000` in your browser.

## Features

### Viewing Pipelines

The sidebar shows all available pipelines. Click any pipeline to view its details:

- **Pipeline Info**: Name, version, description, and settings
- **Stage List**: Expandable view of each stage with:
  - Model configuration
  - System prompt
  - Template
  - Variables
  - Output extraction
  - Conditions (skip/run/early exit)

### Running Pipelines

From any pipeline detail page, you can execute the pipeline directly in your browser:

1. **Enter your prompt** in the textarea
2. **Click "Run Pipeline"** or press `Ctrl+Enter`
3. **Watch real-time progress** as each stage executes
4. **View the final output** when complete

#### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Enter` | Run the pipeline |
| `Escape` | Cancel running execution |

#### Progress Indicators

During execution, each stage shows its status:

| Icon | Status | Description |
|------|--------|-------------|
| Number | Pending | Stage not yet started |
| Spinner | Running | Stage currently executing |
| Checkmark | Completed | Stage finished successfully |
| Arrow | Skipped | Stage skipped due to condition |
| X | Failed | Stage encountered an error |

Cost and duration are displayed for each completed stage.

### Viewing Outputs

The Outputs section shows all past execution results:

- **Summary**: Status, duration, cost, stages run/skipped/failed
- **Stage Results**: Expand any stage to see its output
- **Final Output**: The optimized prompt or result

### Execution History

The dashboard remembers your last 3 executions (stored in browser localStorage). This history persists across page reloads.

## Execution Modes

The dashboard supports two execution modes:

### API Mode (Default)

Uses your Anthropic API key to call Claude directly. This is the recommended mode for production use.

**Setup:**
```bash
# Set environment variable
ANTHROPIC_API_KEY=sk-... bun run web

# Or use the CLI to save the key
ez-ai-pipeline set-key
```

The API key is never sent to the browser - all API calls happen server-side.

### CLI Mode

Uses installed AI CLI tools (Claude Code, OpenCode, or Aider) instead of API keys. This is great for local development when you already have CLI tools authenticated.

**Supported CLI Tools:**

| Tool | Command | Description |
|------|---------|-------------|
| Claude Code | `claude` | Anthropic's official CLI |
| OpenCode | `opencode` | Alternative AI coding assistant |
| Aider | `aider` | AI pair programming tool |

**How it works:**
1. The dashboard auto-detects which CLI tools are installed
2. Select "CLI Tool" mode in the execution form
3. Choose your preferred tool from the dropdown
4. Pipeline stages will shell out to the CLI instead of calling APIs

**Benefits:**
- No API key required if CLI tool is already authenticated
- Uses your existing CLI configuration and credits
- Great for testing without burning API credits

## REST API

The web server exposes a REST API for programmatic access:

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pipelines` | List all pipelines |
| GET | `/api/pipelines/:id` | Get pipeline details |
| POST | `/api/pipelines/:id/run` | Start execution |
| GET | `/api/executions/:id` | Get execution status |
| POST | `/api/executions/:id/cancel` | Cancel execution |
| GET | `/api/outputs` | List all outputs |
| GET | `/api/outputs/:filename` | Get specific output |
| GET | `/api/config/status` | Check API key and CLI tools status |

### Example: Running a Pipeline via curl

```bash
# Start execution with API mode (default)
curl -X POST http://localhost:3000/api/pipelines/prompt-optimizer/run \
  -H "Content-Type: application/json" \
  -d '{"input": "Your prompt to optimize"}'

# Start execution with CLI mode
curl -X POST http://localhost:3000/api/pipelines/prompt-optimizer/run \
  -H "Content-Type: application/json" \
  -d '{"input": "Your prompt to optimize", "executionMode": "cli", "cliTool": "claude"}'

# Response
{
  "executionId": "exec_1234567890_abc123",
  "pipelineId": "prompt-optimizer",
  "status": "started",
  "executionMode": "api"
}

# Check config status (API key and CLI tools)
curl http://localhost:3000/api/config/status
# Response: {"hasApiKey": true, "cliTools": {"claude": {"available": true, "version": "2.0.73"}, ...}}

# Check execution status
curl http://localhost:3000/api/executions/exec_1234567890_abc123

# Cancel if needed
curl -X POST http://localhost:3000/api/executions/exec_1234567890_abc123/cancel
```

## WebSocket API

For real-time execution updates, connect to the WebSocket endpoint:

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

// Subscribe to an execution
ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'subscribe',
    executionId: 'exec_1234567890_abc123'
  }));
};

// Receive events
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data);
};
```

### Event Types

| Event | Description |
|-------|-------------|
| `subscribed` | Subscription confirmed |
| `execution:started` | Pipeline execution began |
| `stage:started` | Stage execution began |
| `stage:completed` | Stage finished successfully |
| `stage:skipped` | Stage was skipped |
| `stage:failed` | Stage encountered error |
| `execution:completed` | Pipeline finished |
| `execution:cancelled` | Pipeline was cancelled |
| `error` | WebSocket error (e.g., invalid message) |

### Example Event Payloads

```json
// Stage started
{
  "type": "stage:started",
  "executionId": "exec_...",
  "stage": { "id": "stage-1", "name": "Analyze Prompt", "type": "analyze" },
  "index": 0,
  "total": 6
}

// Stage completed
{
  "type": "stage:completed",
  "executionId": "exec_...",
  "stage": { "id": "stage-1", "name": "Analyze Prompt", "type": "analyze" },
  "result": { "status": "success", "cost": 0.0012, "duration": 1523 }
}

// Execution completed
{
  "type": "execution:completed",
  "executionId": "exec_...",
  "result": {
    "status": "success",
    "pipelineId": "prompt-optimizer",
    "summary": { "totalDuration": 8234, "totalCost": 0.0156, "stagesRun": 6, "stagesSkipped": 0 },
    "output": "Your optimized prompt..."
  }
}
```

## Error Handling

### API Key Missing

If the API key is not configured, the execution form shows a warning with:
- Clear explanation of the issue
- Command to set the key
- Link to get an API key from Anthropic

### Network Errors

If the WebSocket connection is lost:
- A reconnect button appears
- You can also view outputs to check if execution completed

### Stage Failures

If a stage fails:
- The stage shows a red X icon
- Error message is displayed inline
- You can retry the execution

### Cancellation

Click the Cancel button (or press Escape) to stop a running execution:
- The current stage completes
- Remaining stages are skipped
- Status shows as "cancelled"

## Architecture

```
Browser                          Server (Bun.serve)
┌─────────────────┐              ┌─────────────────────────┐
│                 │   REST API   │                         │
│ Svelte Frontend │◄────────────►│ web/index.ts            │
│                 │              │                         │
│ ExecutionForm   │   WebSocket  │ ExecutionManager        │
│ ExecutionProgress◄────────────►│ (web/execution.ts)      │
│ StageStatus     │              │                         │
│ ExecutionResult │              │ PipelineExecutor        │
└─────────────────┘              │ (src/core/executor.ts)  │
                                 └─────────────────────────┘
```

The frontend uses:
- **Svelte 5** with runes (`$state`, `$effect`, `$props`)
- **Tailwind CSS** for styling
- **Native WebSocket API** for real-time updates

The backend uses:
- **Bun.serve()** with WebSocket support
- **ExecutionManager** to track active executions
- **PipelineExecutor** with callbacks for progress events
