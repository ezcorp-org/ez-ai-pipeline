# Story 2: Running Executions API & Persistence

## User Story

**As a** user who refreshes the page,
**I want** to see any currently running pipelines,
**So that** I can continue monitoring executions I started earlier.

## Story Context

**Existing System Integration:**

- Integrates with: `ExecutionManager`, `web/index.ts` API routes
- Technology: Bun.serve(), TypeScript, REST API
- Follows pattern: Existing `/api/pipelines`, `/api/outputs` endpoints
- Touch points:
  - `web/execution.ts` - ExecutionManager class
  - `web/index.ts` - API route definitions
  - `ActiveExecution` interface

## Acceptance Criteria

### Functional Requirements

1. `GET /api/executions` returns list of all active executions (running + recently completed)
2. `GET /api/executions/running` returns only currently running executions
3. Each execution includes: id, pipelineId, pipelineName, status, startTime, currentStage, totalStages
4. Response includes input preview (first 100 chars) for context
5. Executions remain queryable for 5 minutes after completion (existing cleanup timeout)

### Integration Requirements

6. Existing `GET /api/executions/:id` endpoint continues working unchanged
7. Existing `POST /api/executions/:id/cancel` endpoint continues working unchanged
8. ExecutionManager stores additional metadata without breaking current functionality
9. API response format follows existing patterns (camelCase, consistent structure)

### Quality Requirements

10. API response time < 50ms for typical execution list
11. No memory leaks from metadata storage
12. Proper error handling for edge cases (no executions, invalid filters)

## Technical Notes

### Integration Approach

1. **Extend ActiveExecution interface** to include `pipelineName` and `inputPreview`
2. **Add `listExecutions()` method** to ExecutionManager with optional status filter
3. **Add API routes** in web/index.ts for new endpoints
4. **Ensure data is captured** at execution start time

### API Response Format

```typescript
// GET /api/executions
{
  "executions": [
    {
      "id": "exec_1234567890_abc123",
      "pipelineId": "prompt-optimizer",
      "pipelineName": "Prompt Optimizer",
      "status": "running",
      "startTime": 1703123456789,
      "currentStage": 2,
      "totalStages": 6,
      "inputPreview": "Write a blog post about productivity tips for remote..."
    }
  ]
}

// GET /api/executions/running
// Same format, filtered to status === "running"
```

### Existing Pattern Reference

```typescript
// Current API pattern in web/index.ts
if (path === "/api/pipelines") {
  const pipelines = await getPipelines();
  return Response.json(pipelines);
}

// New endpoints follow same pattern
if (path === "/api/executions") {
  const executions = executionManager.listExecutions();
  return Response.json({ executions });
}
```

### Key Constraints

- Must not break existing execution flow
- Metadata should be minimal to avoid memory bloat
- Input preview truncated to 100 characters max

### Files to Modify

| File | Change |
|------|--------|
| `web/execution.ts` | Extend ActiveExecution interface, add listExecutions() method |
| `web/index.ts` | Add GET /api/executions and /api/executions/running routes |

### Interface Extension

```typescript
interface ActiveExecution {
  id: string;
  pipelineId: string;
  pipelineName: string;        // NEW
  inputPreview: string;        // NEW (first 100 chars)
  executor: PipelineExecutor;
  subscribers: Set<ServerWebSocket<WebSocketData>>;
  status: "running" | "completed" | "failed" | "cancelled";
  startTime: number;
  currentStage: number;        // NEW
  totalStages: number;         // NEW
  result?: PipelineResult;
}
```

## Definition of Done

- [x] `GET /api/executions` returns all active executions with metadata
- [x] `GET /api/executions/running` filters to running only
- [x] Response includes pipelineName, inputPreview, currentStage, totalStages
- [x] Existing execution endpoints unchanged
- [x] API responds within 50ms
- [x] Edge cases handled (empty list, completed executions)

## Risk and Compatibility Check

### Minimal Risk Assessment

- **Primary Risk:** Breaking existing execution creation flow
- **Mitigation:** Extend interface with optional fields, add data at start()
- **Rollback:** Remove new API routes; ExecutionManager changes are additive

### Compatibility Verification

- [x] No breaking changes to existing APIs (new routes only)
- [x] No database changes (in-memory storage)
- [x] Interface extension is backward compatible
- [x] Performance impact is negligible

## Validation Checklist

### Scope Validation

- [x] Story can be completed in one development session (~2 hours)
- [x] Integration approach is straightforward
- [x] Follows existing API patterns
- [x] No architecture work required

### Clarity Check

- [x] Requirements are unambiguous
- [x] Integration points clearly specified
- [x] Success criteria are testable
- [x] Rollback approach is simple
