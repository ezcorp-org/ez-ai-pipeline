# Live Pipeline Monitoring - Brownfield Epic

## Epic Goal

Enable users to monitor pipeline executions in real-time with live output streaming and a persistent running executions view that survives page refreshes, improving visibility and validation of AI pipeline processes.

## Epic Description

### Existing System Context

- **Current relevant functionality**: Web dashboard with WebSocket-based execution progress tracking. Shows stage status (running/completed/failed) with cost/duration, but NOT the actual stage output content. Executions are stored in-memory only.
- **Technology stack**: Bun.serve(), Svelte 5 (runes), WebSocket API, TypeScript
- **Integration points**:
  - `ExecutionManager` (web/execution.ts) - server-side execution tracking
  - `ExecutionProgress.svelte` - frontend progress display
  - `Sidebar.svelte` - navigation structure
  - `PipelineExecutor` callbacks for stage events

### Enhancement Details

**What's being added/changed:**

1. **Live Output Streaming**: Stream stage output text in real-time as stages execute, showing partial/complete output in the ExecutionProgress section
2. **Running Executions Tab**: New sidebar navigation item under Pipelines showing all currently running executions
3. **Execution Persistence**: Server-side execution state that can be queried on page load to restore view of running pipelines

**How it integrates:**
- Extends existing WebSocket events to include output content
- Adds new API endpoint `GET /api/executions` to list active executions
- Adds new Svelte component for running executions view
- Modifies Sidebar to include new nav item with live count badge

**Success criteria:**
- Users can see stage output text streaming live during execution
- Page refresh shows any currently running pipelines in sidebar
- Users can click running execution to view its live progress
- No regression in existing execution functionality

---

## Stories

### Story 1: Live Output Streaming in Execution Progress

**As a** user running a pipeline,
**I want** to see the actual output text from each stage as it executes,
**So that** I can monitor and validate the AI responses in real-time.

**Scope:**
- Add `onStageOutput` callback to PipelineExecutor for streaming text
- Extend WebSocket events to broadcast `stage:output` with partial content
- Update ExecutionProgress.svelte to display streaming output per stage
- Add expandable output viewer within each StageStatus component

---

### Story 2: Running Executions API & Persistence

**As a** user who refreshes the page,
**I want** to see any currently running pipelines,
**So that** I can continue monitoring executions I started earlier.

**Scope:**
- Add `GET /api/executions` endpoint listing all active executions
- Add `GET /api/executions/running` for running-only filter
- Extend ExecutionManager to track additional metadata (pipelineName, input preview)
- Ensure WebSocket reconnection can re-subscribe to active executions

---

### Story 3: Running Executions Sidebar Tab

**As a** user with active pipeline executions,
**I want** to see a "Running" tab in the sidebar with a live count,
**So that** I can quickly navigate to and monitor my active pipelines.

**Scope:**
- Add new sidebar nav item "Running" with execution count badge
- Create RunningExecutions.svelte page component
- List running executions with pipeline name, duration, progress indicator
- Click to navigate and view live progress
- Auto-refresh list when new executions start/complete

---

## Compatibility Requirements

- [x] Existing APIs remain unchanged (new endpoints only)
- [x] No database/schema changes (in-memory state)
- [x] UI changes follow existing Svelte/Tailwind patterns
- [x] Performance impact is minimal (WebSocket-based, no polling)

## Risk Mitigation

- **Primary Risk:** Memory usage increase from storing output text server-side
- **Mitigation:** Limit stored output per stage (e.g., last 10KB), clean up on execution completion
- **Rollback Plan:** Feature is additive; disable new WebSocket events and hide sidebar tab

## Definition of Done

- [x] All 3 stories completed with acceptance criteria met
- [x] Existing pipeline execution functionality verified
- [x] Live output displays correctly for multi-stage pipelines
- [x] Page refresh correctly shows running executions
- [x] Sidebar updates in real-time with execution count
- [ ] Documentation updated with new features

---

## Validation Checklist

**Scope Validation:**
- [x] Epic can be completed in 3 stories
- [x] No architectural documentation required
- [x] Enhancement follows existing WebSocket/Svelte patterns
- [x] Integration complexity is manageable

**Risk Assessment:**
- [x] Risk to existing system is low (additive changes)
- [x] Rollback plan is feasible
- [x] Testing approach covers existing functionality
- [x] Team has knowledge of integration points
