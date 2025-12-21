# Web Pipeline Execution - Brownfield Epic

**Status: COMPLETE**

## Epic Title
**Web Pipeline Execution** - Brownfield Enhancement

## Epic Goal
Enable users to trigger and monitor pipeline execution directly from the web dashboard, providing a browser-based alternative to the CLI for running prompt optimization pipelines.

---

## Epic Description

### Existing System Context

| Aspect | Current State |
|--------|---------------|
| **Current functionality** | Web dashboard displays pipelines and views past execution outputs |
| **Technology stack** | Bun.serve() backend, Svelte frontend, REST API |
| **Existing APIs** | `GET /api/pipelines`, `GET /api/pipelines/:id`, `GET /api/outputs`, `GET /api/outputs/:filename` |
| **Executor** | `PipelineExecutor` class with callback hooks for progress tracking |

### Enhancement Details

| Aspect | Details |
|--------|---------|
| **What's being added** | POST endpoint to trigger pipelines, WebSocket for real-time progress, UI form for input and live execution monitoring |
| **Integration approach** | Reuse existing `PipelineExecutor` with WebSocket callbacks for progress streaming |
| **Success criteria** | User can select pipeline, enter prompt, execute, and see real-time stage progress in browser |

---

## Stories

> **Detailed story files:** `docs/stories/`

### Story 1: Backend - Pipeline Execution API
📄 **[story-1-backend-pipeline-execution-api.md](stories/story-1-backend-pipeline-execution-api.md)** - **COMPLETE**

- [x] `POST /api/pipelines/:id/run` - Accepts `{ input: string }`, returns execution ID
- [x] WebSocket at `/ws` - Streams stage progress events
- [x] Integrate with `PipelineExecutor` callbacks
- [x] Return final result when complete

**Files Created:**
- `web/execution.ts` - ExecutionManager class

**Files Modified:**
- `web/index.ts` - Added POST route, WebSocket config, cancel endpoint

### Story 2: Frontend - Pipeline Execution UI
📄 **[story-2-frontend-pipeline-execution-ui.md](stories/story-2-frontend-pipeline-execution-ui.md)** - **COMPLETE**

- [x] Input textarea for prompt with character count
- [x] "Run Pipeline" button with loading states
- [x] Real-time stage progress indicators (spinner, checkmarks, errors)
- [x] Cost and duration display as stages complete
- [x] Final output display with formatted results

**Files Created:**
- `web/components/execution/ExecutionForm.svelte`
- `web/components/execution/ExecutionProgress.svelte`
- `web/components/execution/StageStatus.svelte`
- `web/components/execution/ExecutionResult.svelte`

**Files Modified:**
- `web/components/pipelines/PipelineDetail.svelte` - Added ExecutionForm

### Story 3: Error Handling & Polish
📄 **[story-3-error-handling-polish.md](stories/story-3-error-handling-polish.md)** - **COMPLETE**

- [x] API key validation before execution
- [x] Graceful error display for failed stages
- [x] Cancel execution capability
- [x] Keyboard shortcuts (Ctrl+Enter, Escape)
- [x] Execution history in session (localStorage)

**Files Created:**
- `web/components/execution/ApiKeyWarning.svelte`
- `web/components/execution/ConnectionError.svelte`
- `web/components/execution/ExecutionHistory.svelte`

**Files Modified:**
- `web/index.ts` - Added `/api/config/status` endpoint
- `web/components/execution/ExecutionForm.svelte` - Added API key check, cancel, keyboard shortcuts

---

## Compatibility Requirements

- [x] Existing APIs remain unchanged (`GET` endpoints untouched)
- [x] Database schema changes are backward compatible (N/A - no database)
- [x] UI changes follow existing patterns (Svelte components, Tailwind styling)
- [x] Performance impact is minimal (execution happens on-demand)

---

## Risk Mitigation

| Risk | Mitigation | Rollback |
|------|------------|----------|
| **API keys exposed in browser** | Keys stay server-side only; never sent to frontend | N/A - keys never leave server |
| **Long-running executions block server** | Async execution with WebSocket streaming | Cancel endpoint available |
| **Concurrent execution conflicts** | Single execution per session initially | Queue system in future if needed |

---

## Definition of Done

- [x] All stories completed with acceptance criteria met
- [x] Existing GET APIs verified still working
- [x] Pipeline execution works end-to-end via web UI
- [x] Real-time progress displays correctly
- [x] Error states handled gracefully
- [x] Works with both local and built-in pipelines

---

## Test Coverage

| Test File | Tests | Description |
|-----------|-------|-------------|
| `tests/story-1-backend-api.test.ts` | 17 | Backend API endpoints and WebSocket |
| `tests/story-2-frontend-ui.test.ts` | 14 | Frontend integration and SPA routing |
| `tests/story-3-error-handling.test.ts` | 18 | Error handling and edge cases |
| **Total** | **49** | All passing |

---

## Technical Notes

### Integration Points
- `src/core/executor.ts` - PipelineExecutor with callbacks
- `web/index.ts` - Bun.serve() server with existing API routes
- `web/components/` - Svelte components for UI

### Files Created/Modified

**New Files:**
```
web/
├── execution.ts                              # ExecutionManager class
└── components/execution/
    ├── ExecutionForm.svelte                  # Input form + run button
    ├── ExecutionProgress.svelte              # Stage progress display
    ├── StageStatus.svelte                    # Individual stage row
    ├── ExecutionResult.svelte                # Final result display
    ├── ApiKeyWarning.svelte                  # API key missing UI
    ├── ConnectionError.svelte                # WebSocket error UI
    └── ExecutionHistory.svelte               # Session history

tests/
├── story-1-backend-api.test.ts               # Backend API tests
├── story-2-frontend-ui.test.ts               # Frontend integration tests
└── story-3-error-handling.test.ts            # Error handling tests
```

**Modified Files:**
- `web/index.ts` - Added execution routes and WebSocket
- `web/components/pipelines/PipelineDetail.svelte` - Added ExecutionForm
