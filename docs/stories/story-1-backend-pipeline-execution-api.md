# Story 1: Backend - Pipeline Execution API

**Status: COMPLETE**

## Story Title
**Pipeline Execution API with WebSocket Progress** - Brownfield Addition

## User Story

**As a** web dashboard user,
**I want** to trigger pipeline execution via the web interface,
**So that** I can run prompt optimizations without using the CLI.

---

## Story Context

### Existing System Integration

| Aspect | Details |
|--------|---------|
| **Integrates with** | `web/index.ts` (Bun.serve), `src/core/executor.ts` (PipelineExecutor) |
| **Technology** | Bun.serve() with WebSocket support, TypeScript |
| **Follows pattern** | Existing REST API pattern in `web/index.ts` (lines 126-152) |
| **Touch points** | Add routes to existing `fetch()` handler, add `websocket` config to Bun.serve |

### Existing Patterns to Follow

```typescript
// Existing API pattern (web/index.ts:126-138)
if (path === "/api/pipelines") {
  const pipelines = await getPipelines();
  return Response.json(pipelines);
}

if (path.startsWith("/api/pipelines/")) {
  const id = path.replace("/api/pipelines/", "");
  const pipeline = await getPipeline(id);
  if (!pipeline) {
    return Response.json({ error: "Pipeline not found" }, { status: 404 });
  }
  return Response.json(pipeline);
}
```

---

## Acceptance Criteria

### Functional Requirements

1. **POST `/api/pipelines/:id/run`** accepts `{ input: string }` and returns `{ executionId: string }`
2. **WebSocket `/ws`** accepts connections and handles execution subscriptions
3. **Real-time events** streamed via WebSocket:
   - `execution:started` - Pipeline started with metadata
   - `stage:started` - Stage beginning with name/index
   - `stage:completed` - Stage finished with result/cost/duration
   - `stage:skipped` - Stage skipped with reason
   - `stage:failed` - Stage failed with error
   - `execution:completed` - Pipeline finished with full result
4. **Result saved** to outputs directory (reuse existing `savePipelineResult`)

### Integration Requirements

5. Existing `GET /api/pipelines` continues to work unchanged
6. Existing `GET /api/outputs` continues to work unchanged
7. New execution results appear in existing outputs list
8. Uses existing `PipelineExecutor` callbacks for progress

### Quality Requirements

9. Validates pipeline exists before execution
10. Validates input is non-empty string
11. Returns appropriate error responses (400, 404, 500)
12. Handles WebSocket disconnection gracefully

---

## Technical Implementation

### API Specification

#### POST `/api/pipelines/:id/run`

**Request:**
```json
{
  "input": "Your prompt to optimize..."
}
```

**Response (200):**
```json
{
  "executionId": "exec_1703187600000",
  "pipelineId": "prompt-optimizer-v1",
  "status": "started"
}
```

**Errors:**
- `400` - Missing or empty input
- `404` - Pipeline not found
- `500` - Execution failed to start

#### WebSocket Protocol

**Client Subscribe:**
```json
{
  "type": "subscribe",
  "executionId": "exec_1703187600000"
}
```

**Server Events:**
```json
// Stage started
{
  "type": "stage:started",
  "executionId": "exec_...",
  "stage": { "id": "stage-1", "name": "Analyze Prompt" },
  "index": 0,
  "total": 6
}

// Stage completed
{
  "type": "stage:completed",
  "executionId": "exec_...",
  "stage": { "id": "stage-1", "name": "Analyze Prompt" },
  "result": { "status": "success", "cost": 0.0012, "duration": 1523 }
}

// Execution completed
{
  "type": "execution:completed",
  "executionId": "exec_...",
  "result": { /* full PipelineResult */ }
}
```

### Code Structure

```
web/
├── index.ts           # Add POST route + websocket config
├── execution.ts       # NEW: Execution manager
└── ws-handler.ts      # NEW: WebSocket message handler
```

### Key Implementation Notes

1. **Execution Manager** - Track active executions by ID
2. **WebSocket per execution** - Clients subscribe to specific execution IDs
3. **Callback integration** - Wire `PipelineExecutor` callbacks to WebSocket broadcasts
4. **Cleanup** - Remove execution from manager after completion + timeout

---

## Definition of Done

- [x] POST endpoint accepts input and starts execution
- [x] WebSocket streams all stage events in real-time
- [x] Execution results saved to outputs directory
- [x] Existing GET APIs verified working
- [x] Error cases return appropriate HTTP status codes
- [x] WebSocket handles client disconnect gracefully
- [x] Manual testing with browser WebSocket client

## Implementation Notes

**Files Created:**
- `web/execution.ts` - ExecutionManager class with:
  - `generateExecutionId()` - Creates unique execution IDs
  - `start()` - Starts pipeline execution with callbacks
  - `cancel()` - Cancels running execution
  - `subscribe()/unsubscribe()` - WebSocket subscription management
  - `broadcast()` - Sends events to all subscribers

**Files Modified:**
- `web/index.ts`:
  - Added `POST /api/pipelines/:id/run` endpoint
  - Added `POST /api/executions/:id/cancel` endpoint
  - Added `GET /api/executions/:id` endpoint
  - Added WebSocket handler at `/ws`

**Test Coverage:** 17 tests in `tests/story-1-backend-api.test.ts`

---

## Risk & Compatibility

### Risk Assessment

| Risk | Mitigation |
|------|------------|
| Long execution blocks other requests | Async execution, non-blocking |
| WebSocket memory leak | Cleanup on disconnect + timeout |
| Concurrent execution conflicts | Use execution ID isolation |

### Compatibility Checklist

- [x] No changes to existing GET endpoints
- [x] No database changes (file-based outputs)
- [x] Follows existing Bun.serve patterns
- [x] Uses existing PipelineExecutor unchanged

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `web/index.ts` | Modify | Add POST route, websocket config |
| `web/execution.ts` | Create | Execution manager class |
| `web/ws-handler.ts` | Create | WebSocket message handling |

---

## Estimated Effort

**Complexity:** Medium
**Estimated Time:** 2-3 hours

---

## Dependencies

- Story must be completed before Story 2 (Frontend UI)
- No external dependencies
