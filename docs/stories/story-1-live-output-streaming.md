# Story 1: Live Output Streaming in Execution Progress

## User Story

**As a** user running a pipeline,
**I want** to see the actual output text from each stage as it executes,
**So that** I can monitor and validate the AI responses in real-time.

## Story Context

**Existing System Integration:**

- Integrates with: `ExecutionManager`, `PipelineExecutor`, `ExecutionProgress.svelte`, `StageStatus.svelte`
- Technology: Bun WebSocket, Svelte 5 runes, TypeScript
- Follows pattern: Existing WebSocket event broadcasting (`stage:started`, `stage:completed`)
- Touch points:
  - `src/core/executor.ts` - ExecutorCallbacks interface
  - `web/execution.ts` - broadcast() method
  - `web/components/execution/ExecutionProgress.svelte` - WebSocket message handler
  - `web/components/execution/StageStatus.svelte` - stage display component

## Acceptance Criteria

### Functional Requirements

1. Stage output text streams to the frontend as each stage executes
2. Output is displayed in an expandable section within each stage's status card
3. Long output is scrollable and doesn't break the layout
4. Output updates in real-time without requiring page refresh
5. Completed stage output remains visible for review

### Integration Requirements

6. Existing `stage:started`, `stage:completed`, `stage:skipped`, `stage:failed` events continue working unchanged
7. New `stage:output` event follows existing WebSocket event pattern
8. ExecutionProgress component maintains current behavior for users who don't expand output
9. StageStatus component styling matches existing design system

### Quality Requirements

10. Output streaming adds minimal latency to pipeline execution
11. Large outputs (>50KB) are handled gracefully (truncation or virtualization)
12. WebSocket connection stability is maintained
13. No regression in existing execution progress display

## Technical Notes

### Integration Approach

1. **Backend**: Add `onStageOutput` callback to `ExecutorCallbacks` interface in `executor.ts`
2. **Backend**: Modify `StageRunner` to emit output chunks during model response streaming
3. **Backend**: Broadcast `stage:output` events via ExecutionManager WebSocket
4. **Frontend**: Handle `stage:output` in ExecutionProgress.svelte
5. **Frontend**: Add expandable output viewer to StageStatus.svelte

### Existing Pattern Reference

```typescript
// Current pattern in web/execution.ts
this.broadcast(executionId, {
  type: "stage:completed",
  executionId,
  stage: { id: stage.id, name: stage.name, type: stage.type },
  result: { status, cost, duration },
});

// New event follows same pattern
this.broadcast(executionId, {
  type: "stage:output",
  executionId,
  stageId: stage.id,
  output: outputChunk,      // partial or full output text
  isFinal: boolean,         // true when stage completes
});
```

### Key Constraints

- Output chunks should be reasonably sized (1-4KB) to avoid WebSocket message size issues
- Must handle both API mode (streaming capable) and CLI mode (single response)
- Memory usage: Don't store more than 100KB of output per execution server-side

### Files to Modify

| File | Change |
|------|--------|
| `src/core/executor.ts` | Add `onStageOutput` to ExecutorCallbacks |
| `src/core/stage-runner.ts` | Emit output during/after model call |
| `web/execution.ts` | Add stage:output broadcast, store output per stage |
| `web/components/execution/ExecutionProgress.svelte` | Handle stage:output event |
| `web/components/execution/StageStatus.svelte` | Add expandable output viewer |

## Definition of Done

- [x] `stage:output` WebSocket events broadcast during execution
- [x] Output displays in expandable section per stage
- [x] Real-time updates work without flickering/layout shift
- [x] Existing stage progress indicators unchanged
- [x] Works in both API and CLI execution modes
- [x] Large outputs handled gracefully (50KB truncation)
- [x] No regression in pipeline execution functionality

## Risk and Compatibility Check

### Minimal Risk Assessment

- **Primary Risk:** Increased WebSocket traffic from output streaming
- **Mitigation:** Chunk output appropriately, throttle if needed
- **Rollback:** Remove `stage:output` event handler; backend changes are additive

### Compatibility Verification

- [x] No breaking changes to existing WebSocket events
- [x] No database changes
- [x] UI changes are additive (expandable section)
- [x] Performance impact is acceptable (async streaming)

## Validation Checklist

### Scope Validation

- [x] Story can be completed in one development session (~3-4 hours)
- [x] Integration approach is straightforward
- [x] Follows existing WebSocket event pattern
- [x] No architecture work required

### Clarity Check

- [x] Requirements are unambiguous
- [x] Integration points clearly specified
- [x] Success criteria are testable
- [x] Rollback approach is simple
