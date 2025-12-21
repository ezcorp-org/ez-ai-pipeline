# Story 3: Execution Results Viewer

**Epic:** Pipeline Viewer Web UI
**Type:** Brownfield Addition
**Depends on:** Story 1 (Web Server & Navigation)

---

## User Story

As a **pipeline developer**,
I want **to view execution results showing what happened at each stage**,
So that **I can debug issues, understand costs, and review AI outputs**.

---

## Story Context

### Existing System Integration:

- **Integrates with:** Story 1 web server, `outputs/*.json` result files
- **Technology:** Svelte 5 components, Tailwind CSS
- **Follows pattern:** Existing output JSON structure
- **Touch points:** API endpoints `/api/outputs`, new Svelte components

### Data Source:

Output files from `outputs/result-*.json` have this structure:
```json
{
  "pipelineId": "prompt-optimizer-v1",
  "status": "success",
  "timestamp": "2025-12-21T17:23:44.095Z",
  "input": { "prompt": "..." },
  "output": {
    "optimizedPrompt": "...",
    "stage-1-analyze": { ... },
    "stage-2-structure": { ... }
  },
  "stages": [
    {
      "stageId": "stage-1-analyze",
      "stageName": "Analyze Prompt",
      "status": "completed|skipped|failed",
      "duration": 5283,
      "model": "claude-haiku-4-5-20251001",
      "cost": 0.0013784,
      "inputTokens": 3,
      "outputTokens": 344,
      "output": "raw response...",
      "parsedOutput": { ... },
      "error": null
    }
  ],
  "summary": {
    "stagesRun": 5,
    "stagesSkipped": 1,
    "stagesFailed": 0,
    "totalDuration": 66497,
    "totalCost": 0.0346686,
    "totalInputTokens": 15,
    "totalOutputTokens": 3531
  }
}
```

Also `outputs/prompt-*.md` files contain the prompts sent to the AI.

---

## Acceptance Criteria

### Functional Requirements:

1. **Execution List View** (`/outputs`):
   - Display all executions grouped by pipeline
   - Each entry shows: pipeline name, timestamp, status badge, duration, cost
   - Sort by most recent first
   - Filter by pipeline (optional nice-to-have)

2. **Execution Detail View** (`/outputs/:filename`):
   - Header with: pipeline name, status, timestamp, total duration, total cost
   - Summary stats: stages run/skipped/failed, total tokens
   - Input section showing original input prompt

3. **Stage-by-Stage Timeline**:
   - Each stage as expandable accordion
   - Stage header shows: name, status badge, duration, model, cost
   - Collapsed view: one-line summary
   - Expanded view:
     - Parsed output (formatted JSON)
     - Raw output (collapsible)
     - Token counts (input/output)

4. **Status Indicators**:
   - Completed: green checkmark
   - Skipped: gray skip icon with reason
   - Failed: red X with error message

5. **Final Output Display**:
   - Prominent display of the final pipeline output
   - Copy button to clipboard

### Integration Requirements:

6. Uses `/api/outputs` and `/api/outputs/:filename` endpoints
7. Links to raw prompt files (`prompt-*.md`) when available
8. No modifications to output file format

### Quality Requirements:

9. Large JSON outputs are syntax highlighted
10. Long text content is scrollable, not overflowing
11. Loading states for data fetching
12. Graceful handling of malformed output files

---

## Technical Notes

### Components to Create:

```
web/components/
  outputs/
    OutputList.svelte        # List of all executions
    OutputCard.svelte        # Summary card for one execution
    OutputDetail.svelte      # Full execution view
    StageSummary.svelte      # Collapsed stage row
    StageDetail.svelte       # Expanded stage content
    StatusBadge.svelte       # Reusable status indicator
    JsonViewer.svelte        # Formatted JSON display
    CostDisplay.svelte       # Format cost with $ and precision
```

### API Implementation:

```typescript
// GET /api/outputs
// Returns list of output files with metadata extracted
[
  {
    filename: "result-prompt-optimizer-v1-2025-12-21T17-23-44.json",
    pipelineId: "prompt-optimizer-v1",
    timestamp: "2025-12-21T17:23:44.095Z",
    status: "success",
    duration: 66497,
    cost: 0.0346686
  }
]

// GET /api/outputs/:filename
// Returns full JSON content of the file
```

### Formatting Helpers:

```typescript
// Duration: 66497ms -> "1m 6s"
function formatDuration(ms: number): string

// Cost: 0.0346686 -> "$0.035"
function formatCost(cost: number): string

// Timestamp: ISO -> "Dec 21, 2025 5:23 PM"
function formatTimestamp(iso: string): string
```

### Status Colors:

| Status | Color | Icon |
|--------|-------|------|
| success | green | checkmark-circle |
| completed | green | checkmark |
| skipped | gray | skip-forward |
| failed | red | x-circle |

---

## Definition of Done

- [ ] Output list displays all executions from `outputs/` folder
- [ ] Clicking output opens detail view
- [ ] All stages render with correct status
- [ ] Stage expansion shows parsed and raw output
- [ ] Skipped stages show reason
- [ ] Failed stages show error message
- [ ] Summary stats are accurate
- [ ] Final output is displayed prominently
- [ ] Copy to clipboard works
- [ ] Responsive layout
- [ ] No console errors

---

## Risk Assessment

- **Primary Risk:** Large output files could cause performance issues
- **Mitigation:** Lazy load stage details, paginate raw output
- **Rollback:** Show simplified view without raw output expansion

---

## UI Mockup (ASCII)

```
┌─────────────────────────────────────────────────────────────┐
│  Execution: prompt-optimizer-v1                             │
│  Status: ✓ Success | Dec 21, 2025 5:23 PM                  │
│  Duration: 1m 6s | Cost: $0.035 | Tokens: 3,546            │
├─────────────────────────────────────────────────────────────┤
│  Input Prompt:                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ <role>You are a conversion optimization expert...</role>││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Stages:                                                    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ ✓ 1. Analyze Prompt          5.3s  $0.001  haiku    [+] ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ✓ 2. Structure Prompt        7.2s  $0.002  haiku    [+] ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ✓ 3. Enhance Context        41.0s  $0.028  sonnet   [-] ││
│  │   ┌───────────────────────────────────────────────────┐ ││
│  │   │ Parsed Output:                                    │ ││
│  │   │ {                                                 │ ││
│  │   │   "enhancedPrompt": "...",                       │ ││
│  │   │   "contextAdded": "Added statistical rigor..."   │ ││
│  │   │ }                                                 │ ││
│  │   └───────────────────────────────────────────────────┘ ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ✓ 4. Validate Enhancement    6.0s  $0.001  haiku    [+] ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ⊘ 5. Iterate Improvements   skipped                 [+] ││
│  │     Reason: skipIf condition met (overallValid=true)    ││
│  ├─────────────────────────────────────────────────────────┤│
│  │ ✓ 6. Finalize Output         7.0s  $0.002  haiku    [+] ││
│  └─────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────┤
│  Final Output:                                    [Copy]    │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ <role>                                                  ││
│  │ You are a conversion optimization expert...             ││
│  │ </role>                                                 ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## Estimated Scope

**Complexity:** Medium-High
**Files to create:** ~8 components
**API changes:** Enhance `/api/outputs` to include metadata summary
