# Story 3: Running Executions Sidebar Tab

## User Story

**As a** user with active pipeline executions,
**I want** to see a "Running" tab in the sidebar with a live count,
**So that** I can quickly navigate to and monitor my active pipelines.

## Story Context

**Existing System Integration:**

- Integrates with: `Sidebar.svelte`, `App.svelte` router, API from Story 2
- Technology: Svelte 5 runes, Tailwind CSS, WebSocket
- Follows pattern: Existing sidebar navigation items (Dashboard, Pipelines, Outputs)
- Touch points:
  - `web/components/Sidebar.svelte` - navigation structure
  - `web/components/App.svelte` - routing logic
  - New `web/components/RunningExecutions.svelte` page

## Acceptance Criteria

### Functional Requirements

1. "Running" nav item appears in sidebar between "Pipelines" and "Outputs"
2. Badge shows count of currently running executions (e.g., "Running (2)")
3. Badge updates in real-time when executions start/complete
4. Clicking navigates to running executions list page
5. Running executions page shows list with: pipeline name, elapsed time, progress bar
6. Clicking an execution navigates to its live progress view

### Integration Requirements

7. Sidebar styling matches existing nav items exactly
8. Route `/running` follows existing SPA routing pattern
9. Uses `/api/executions/running` endpoint from Story 2
10. WebSocket connection for real-time count updates

### Quality Requirements

11. Count badge updates within 1 second of execution state change
12. Page loads quickly even with multiple running executions
13. Empty state handled gracefully ("No running executions")
14. No layout shift when count changes

## Technical Notes

### Integration Approach

1. **Modify Sidebar.svelte** to add "Running" nav item with dynamic count
2. **Create RunningExecutions.svelte** page component
3. **Add route** in App.svelte for `/running`
4. **Use WebSocket** for real-time count updates or poll `/api/executions/running`

### Sidebar Modification

```svelte
<!-- Add to navItems array -->
const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/pipelines", label: "Pipelines", icon: "🔧" },
  { path: "/running", label: "Running", icon: "▶️", showCount: true },  // NEW
  { path: "/outputs", label: "Outputs", icon: "📄" },
];

<!-- Badge rendering -->
{#if item.showCount && runningCount > 0}
  <span class="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
    {runningCount}
  </span>
{/if}
```

### RunningExecutions Page Structure

```svelte
<!-- web/components/RunningExecutions.svelte -->
<script lang="ts">
  let executions = $state([]);
  let loading = $state(true);

  $effect(() => {
    fetchRunningExecutions();
    const interval = setInterval(fetchRunningExecutions, 2000);
    return () => clearInterval(interval);
  });

  async function fetchRunningExecutions() {
    const res = await fetch('/api/executions/running');
    const data = await res.json();
    executions = data.executions;
    loading = false;
  }
</script>

<!-- List of execution cards -->
{#each executions as exec}
  <ExecutionCard {exec} onclick={() => navigate(`/executions/${exec.id}`)} />
{/each}
```

### Existing Pattern Reference

```svelte
<!-- Current Sidebar.svelte nav item pattern -->
<a
  href={item.path}
  onclick={(e) => handleClick(e, item.path)}
  class="flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-colors ..."
>
  <span class="text-lg">{item.icon}</span>
  <span>{item.label}</span>
</a>
```

### Key Constraints

- Badge must not cause layout shift when appearing/disappearing
- Polling interval should be reasonable (2-5 seconds) to balance responsiveness and load
- Must handle WebSocket disconnection gracefully

### Files to Create/Modify

| File | Change |
|------|--------|
| `web/components/Sidebar.svelte` | Add "Running" nav item with count badge |
| `web/components/RunningExecutions.svelte` | NEW - running executions list page |
| `web/components/ExecutionCard.svelte` | NEW - card component for execution list |
| `web/components/App.svelte` | Add route for `/running` |

### Execution Card Design

```
┌─────────────────────────────────────────────────┐
│ 🔧 Prompt Optimizer                    Running  │
│ "Write a blog post about productivity..."       │
│ ████████░░░░░░░░░░░░  Stage 3/6    2m 34s      │
│                                    [View →]     │
└─────────────────────────────────────────────────┘
```

## Definition of Done

- [x] "Running" nav item visible in sidebar with correct icon
- [x] Badge shows accurate count of running executions
- [x] Count updates in real-time (within 2 seconds)
- [x] `/running` route displays list of running executions
- [x] Each execution shows: name, input preview, progress, elapsed time
- [x] Clicking execution navigates to its progress view
- [x] Empty state displays "No running executions" message
- [x] Styling matches existing sidebar and page patterns

## Risk and Compatibility Check

### Minimal Risk Assessment

- **Primary Risk:** Sidebar layout change causing visual issues
- **Mitigation:** Follow existing nav item pattern exactly
- **Rollback:** Remove nav item and route; changes are additive

### Compatibility Verification

- [x] No breaking changes to existing navigation
- [x] No database changes
- [x] UI changes follow existing Tailwind patterns
- [x] Performance impact is minimal (polling vs WebSocket)

## Validation Checklist

### Scope Validation

- [x] Story can be completed in one development session (~3-4 hours)
- [x] Integration approach is straightforward
- [x] Follows existing Svelte/Tailwind patterns
- [x] No architecture work required

### Clarity Check

- [x] Requirements are unambiguous
- [x] Integration points clearly specified
- [x] Success criteria are testable
- [x] Rollback approach is simple
