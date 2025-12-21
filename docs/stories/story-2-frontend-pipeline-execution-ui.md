# Story 2: Frontend - Pipeline Execution UI

**Status: COMPLETE**

## Story Title
**Pipeline Execution Form & Progress Display** - Brownfield Addition

## User Story

**As a** web dashboard user,
**I want** to enter a prompt and run a pipeline with real-time progress feedback,
**So that** I can optimize prompts and see results directly in my browser.

---

## Story Context

### Existing System Integration

| Aspect | Details |
|--------|---------|
| **Integrates with** | `PipelineDetail.svelte`, Backend WebSocket API (Story 1) |
| **Technology** | Svelte 5 with runes (`$state`, `$effect`, `$props`), Tailwind CSS |
| **Follows pattern** | Existing component patterns in `web/components/pipelines/PipelineDetail.svelte` |
| **Touch points** | Add execution section to PipelineDetail, create new execution components |

### Existing Patterns to Follow

```svelte
<!-- State management pattern (PipelineDetail.svelte) -->
<script lang="ts">
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    fetch(`/api/...`)
      .then(r => r.json())
      .then(data => { ... })
      .catch(e => { error = e.message; });
  });
</script>

<!-- UI Pattern - Cards with sections -->
<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
  <h2 class="font-semibold text-slate-700 mb-4">Section Title</h2>
  ...
</div>
```

---

## Acceptance Criteria

### Functional Requirements

1. **Input Form** - Textarea for prompt input with character count
2. **Run Button** - Triggers execution, disabled during execution
3. **Progress Display** - Shows each stage with status indicator:
   - ⏳ Pending (gray)
   - 🔄 Running (blue, animated)
   - ✅ Completed (green, with cost/duration)
   - ⏭️ Skipped (yellow)
   - ❌ Failed (red, with error message)
4. **Live Updates** - WebSocket receives and displays progress in real-time
5. **Result Display** - Shows final optimized prompt and summary stats
6. **Cost Tracking** - Running total of cost as stages complete

### Integration Requirements

7. Existing pipeline detail view continues to work
8. Uses same Tailwind styling patterns as existing components
9. WebSocket connects to backend API from Story 1
10. Execution results navigable from outputs list

### Quality Requirements

11. Form validates non-empty input before submission
12. Shows loading state while connecting to WebSocket
13. Handles WebSocket disconnect gracefully with retry option
14. Mobile-responsive layout

---

## UI Mockup (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Pipelines                                         │
├─────────────────────────────────────────────────────────────┤
│ 🔧 Prompt Processing Pipeline                               │
│ v1.0.0 · anthropic · 6 stages                              │
│ 6-stage pipeline to analyze and optimize prompts...         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ▶ Run Pipeline                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Enter your prompt to optimize...                        │ │
│ │                                                         │ │
│ │                                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
│ 234 characters                        [ Run Pipeline ▶ ]   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Execution Progress                          Cost: $0.0234   │
│ ┌───┬──────────────────────────────┬────────────┬─────────┐ │
│ │ ✅│ 1. Analyze Prompt            │    1.2s    │ $0.0012 │ │
│ ├───┼──────────────────────────────┼────────────┼─────────┤ │
│ │ ✅│ 2. Structure Analysis        │    0.8s    │ $0.0008 │ │
│ ├───┼──────────────────────────────┼────────────┼─────────┤ │
│ │ 🔄│ 3. Enhance Clarity           │ running... │    —    │ │
│ ├───┼──────────────────────────────┼────────────┼─────────┤ │
│ │ ⏳│ 4. Validate Output           │     —      │    —    │ │
│ ├───┼──────────────────────────────┼────────────┼─────────┤ │
│ │ ⏳│ 5. Iterate Improvements      │     —      │    —    │ │
│ ├───┼──────────────────────────────┼────────────┼─────────┤ │
│ │ ⏳│ 6. Final Polish              │     —      │    —    │ │
│ └───┴──────────────────────────────┴────────────┴─────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Component Structure

```
web/components/
├── pipelines/
│   └── PipelineDetail.svelte    # MODIFY: Add execution section
└── execution/                    # NEW FOLDER
    ├── ExecutionForm.svelte      # Input form + run button
    ├── ExecutionProgress.svelte  # Stage progress display
    ├── StageStatus.svelte        # Individual stage row
    └── ExecutionResult.svelte    # Final result display
```

### State Management

```typescript
// Execution state
interface ExecutionState {
  status: 'idle' | 'connecting' | 'running' | 'completed' | 'failed';
  executionId: string | null;
  stages: StageProgress[];
  result: PipelineResult | null;
  error: string | null;
}

interface StageProgress {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
  duration?: number;
  cost?: number;
  error?: string;
}
```

### WebSocket Integration

```typescript
// In ExecutionProgress.svelte
$effect(() => {
  if (!executionId) return;

  const ws = new WebSocket(`ws://${location.host}/ws`);

  ws.onopen = () => {
    ws.send(JSON.stringify({ type: 'subscribe', executionId }));
  };

  ws.onmessage = (event) => {
    const msg = JSON.parse(event.data);
    // Update stages state based on message type
  };

  return () => ws.close();
});
```

---

## Definition of Done

- [x] Input form accepts and validates prompt text
- [x] Run button triggers execution via POST API
- [x] WebSocket connects and receives real-time updates
- [x] Progress display shows all stage states correctly
- [x] Completed execution shows result and summary
- [x] Existing pipeline detail view unchanged
- [x] Responsive on mobile devices
- [x] Manual testing with actual pipeline execution

## Implementation Notes

**Files Created:**
- `web/components/execution/ExecutionForm.svelte` - Main form with:
  - Textarea input with character count
  - Run button with loading state
  - Integration with ExecutionProgress component
- `web/components/execution/ExecutionProgress.svelte` - Progress display:
  - WebSocket connection and subscription
  - Real-time stage status updates
  - Cost tracking as stages complete
- `web/components/execution/StageStatus.svelte` - Individual stage row:
  - Status icons (pending, running, completed, skipped, failed)
  - Duration and cost display
  - Animated running state
- `web/components/execution/ExecutionResult.svelte` - Final result:
  - Formatted output display
  - Summary statistics (duration, cost, stages)
  - Copy to clipboard functionality

**Files Modified:**
- `web/components/pipelines/PipelineDetail.svelte`:
  - Added import for ExecutionForm
  - Added ExecutionForm component with pipelineId and stageCount props

**Test Coverage:** 14 tests in `tests/story-2-frontend-ui.test.ts`

---

## Risk & Compatibility

### Risk Assessment

| Risk | Mitigation |
|------|------------|
| WebSocket connection fails | Show retry button, fallback message |
| Long prompts cause layout issues | Scrollable textarea, max height |
| Rapid state updates cause flicker | Batch updates, transition animations |

### Compatibility Checklist

- [x] No changes to existing pipeline viewing functionality
- [x] Uses existing Tailwind classes and color palette
- [x] Follows Svelte 5 runes pattern
- [x] Works alongside existing stage expansion UI

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `web/components/pipelines/PipelineDetail.svelte` | Modify | Add execution section |
| `web/components/execution/ExecutionForm.svelte` | Create | Input form component |
| `web/components/execution/ExecutionProgress.svelte` | Create | Progress display |
| `web/components/execution/StageStatus.svelte` | Create | Stage row component |
| `web/components/execution/ExecutionResult.svelte` | Create | Result display |

---

## Estimated Effort

**Complexity:** Medium
**Estimated Time:** 3-4 hours

---

## Dependencies

- **Requires:** Story 1 (Backend API) must be completed first
- **Blocks:** Story 3 (Error Handling & Polish)
