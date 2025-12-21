# Story 3: Error Handling & Polish

**Status: COMPLETE**

## Story Title
**Execution Error Handling, Cancel & UX Polish** - Brownfield Addition

## User Story

**As a** web dashboard user,
**I want** clear error messages, ability to cancel executions, and polished interactions,
**So that** I have a reliable and professional experience when running pipelines.

---

## Story Context

### Existing System Integration

| Aspect | Details |
|--------|---------|
| **Integrates with** | Story 1 Backend API, Story 2 Frontend UI |
| **Technology** | Svelte 5, Tailwind CSS, WebSocket |
| **Follows pattern** | Error display pattern from `PipelineDetail.svelte` line 116 |
| **Touch points** | Enhance all execution components with error states |

### Existing Error Pattern

```svelte
<!-- From PipelineDetail.svelte -->
{#if error}
  <div class="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
{/if}
```

---

## Acceptance Criteria

### Error Handling Requirements

1. **API Key Validation** - Check for `ANTHROPIC_API_KEY` before execution, show setup instructions if missing
2. **Network Errors** - Handle fetch/WebSocket failures with retry option
3. **Stage Failures** - Display stage error message inline with option to view details
4. **Pipeline Errors** - Show overall failure state with error summary
5. **Timeout Handling** - Show message if execution exceeds expected time

### Cancel Functionality

6. **Cancel Button** - Visible during execution, triggers cancellation
7. **Backend Cancel** - POST `/api/executions/:id/cancel` endpoint
8. **Graceful Stop** - Current stage completes, remaining stages skipped
9. **Cancel Confirmation** - Brief "are you sure?" for long-running executions

### UX Polish

10. **Loading States** - Skeleton/spinner while connecting
11. **Transitions** - Smooth animations for stage status changes
12. **Success Celebration** - Brief success indicator on completion
13. **Keyboard Support** - Ctrl+Enter to run, Escape to cancel
14. **Execution History** - Show last 3 executions in session (localStorage)

### Quality Requirements

15. All error states have actionable guidance
16. No console errors during normal operation
17. Graceful degradation if WebSocket unavailable

---

## Error States Specification

### API Key Missing

```
┌─────────────────────────────────────────────────────────────┐
│ ⚠️ API Key Required                                         │
│                                                             │
│ To run pipelines, you need to set the ANTHROPIC_API_KEY    │
│ environment variable.                                       │
│                                                             │
│ Run the server with:                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ANTHROPIC_API_KEY=sk-... bun run web                    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ [ View Documentation ]                                      │
└─────────────────────────────────────────────────────────────┘
```

### Stage Failed

```
┌───┬──────────────────────────────┬────────────┬─────────────┐
│ ❌│ 3. Enhance Clarity           │   failed   │    $0.00    │
└───┴──────────────────────────────┴────────────┴─────────────┘
  │
  └─ Error: Rate limit exceeded. Please wait 60 seconds.
     [ Retry Stage ] [ Skip & Continue ]
```

### WebSocket Disconnected

```
┌─────────────────────────────────────────────────────────────┐
│ 🔌 Connection Lost                                          │
│                                                             │
│ Lost connection to server. Execution may still be running.  │
│                                                             │
│ [ Reconnect ] [ View Outputs ]                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### Backend Additions

```typescript
// New endpoint in web/index.ts
if (req.method === "POST" && path.match(/^\/api\/executions\/[\w-]+\/cancel$/)) {
  const executionId = path.split("/")[3];
  const cancelled = executionManager.cancel(executionId);
  return Response.json({ cancelled });
}

// API key check endpoint
if (path === "/api/config/status") {
  return Response.json({
    hasApiKey: !!process.env.ANTHROPIC_API_KEY,
    // Never expose the actual key
  });
}
```

### Frontend Additions

```svelte
<!-- ExecutionForm.svelte - API key check -->
<script>
  let apiKeyStatus = $state<'checking' | 'missing' | 'present'>('checking');

  $effect(() => {
    fetch('/api/config/status')
      .then(r => r.json())
      .then(data => {
        apiKeyStatus = data.hasApiKey ? 'present' : 'missing';
      });
  });
</script>

{#if apiKeyStatus === 'missing'}
  <ApiKeyWarning />
{:else}
  <!-- Show execution form -->
{/if}
```

### Cancel Flow

```typescript
// ExecutionProgress.svelte
async function cancelExecution() {
  if (stages.some(s => s.status === 'running')) {
    const confirmed = confirm('Cancel running execution?');
    if (!confirmed) return;
  }

  await fetch(`/api/executions/${executionId}/cancel`, { method: 'POST' });
  // WebSocket will receive cancellation event
}
```

### Session History (localStorage)

```typescript
// Store last 3 executions
interface ExecutionHistoryEntry {
  executionId: string;
  pipelineId: string;
  pipelineName: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'cancelled';
  inputPreview: string; // First 100 chars
}

function saveToHistory(entry: ExecutionHistoryEntry) {
  const history = JSON.parse(localStorage.getItem('executionHistory') || '[]');
  history.unshift(entry);
  localStorage.setItem('executionHistory', JSON.stringify(history.slice(0, 3)));
}
```

---

## Definition of Done

- [x] API key check shows clear setup instructions
- [x] Network errors display with retry option
- [x] Stage failures show inline with details
- [x] Cancel button works during execution
- [x] Cancel confirmation for running stages
- [x] Loading states and transitions are smooth
- [x] Keyboard shortcuts work (Ctrl+Enter, Escape)
- [x] Session history persists across page reloads
- [x] All error states tested manually
- [x] No console errors in normal flow

## Implementation Notes

**Files Created:**
- `web/components/execution/ApiKeyWarning.svelte`:
  - Warning banner when API key is missing
  - Instructions for setting the key
  - Link to Anthropic Console
- `web/components/execution/ConnectionError.svelte`:
  - WebSocket disconnection handling
  - Reconnect and View Outputs buttons
- `web/components/execution/ExecutionHistory.svelte`:
  - Last 3 executions stored in localStorage
  - Status indicators and timestamps
  - Click to view execution details

**Files Modified:**
- `web/index.ts`:
  - Added `GET /api/config/status` endpoint (returns hasApiKey boolean)
- `web/components/execution/ExecutionForm.svelte`:
  - API key check on mount with loading state
  - Cancel button during execution
  - Keyboard shortcuts (Ctrl+Enter to run, Escape to cancel)
  - Session history integration
  - Retry button on errors

**Test Coverage:** 18 tests in `tests/story-3-error-handling.test.ts`

---

## Risk & Compatibility

### Risk Assessment

| Risk | Mitigation |
|------|------------|
| Cancel during API call causes issues | Backend handles gracefully, returns partial result |
| localStorage unavailable | Graceful degradation, history just doesn't persist |
| Animation performance on slow devices | Use CSS transitions, not JS animations |

### Compatibility Checklist

- [x] No changes to existing GET APIs
- [x] Cancel endpoint is additive
- [x] Error styles match existing patterns
- [x] Works without localStorage (degraded)

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `web/index.ts` | Modify | Add cancel endpoint, config status |
| `web/execution.ts` | Modify | Add cancel method |
| `web/components/execution/ExecutionForm.svelte` | Modify | Add API key check |
| `web/components/execution/ExecutionProgress.svelte` | Modify | Add cancel, error states |
| `web/components/execution/ApiKeyWarning.svelte` | Create | API key missing UI |
| `web/components/execution/ConnectionError.svelte` | Create | WebSocket error UI |
| `web/components/execution/ExecutionHistory.svelte` | Create | Session history |

---

## Estimated Effort

**Complexity:** Medium
**Estimated Time:** 2-3 hours

---

## Dependencies

- **Requires:** Story 1 (Backend) and Story 2 (Frontend) completed
- **Blocks:** None (final story in epic)
