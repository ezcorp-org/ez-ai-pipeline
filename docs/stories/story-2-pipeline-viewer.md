# Story 2: Pipeline Viewer Component

**Epic:** Pipeline Viewer Web UI
**Type:** Brownfield Addition
**Depends on:** Story 1 (Web Server & Navigation)

---

## User Story

As a **pipeline developer**,
I want **to see my pipeline configurations displayed as visual step-by-step flows**,
So that **I can understand pipeline structure, stage dependencies, and configuration at a glance**.

---

## Story Context

### Existing System Integration:

- **Integrates with:** Story 1 web server, `pipelines/*.ts` config files
- **Technology:** Svelte 5 components, Tailwind CSS
- **Follows pattern:** Existing PipelineConfig TypeScript interface
- **Touch points:** API endpoint `/api/pipelines`, new Svelte components

### Data Source:

Pipeline configs from `pipelines/*.ts` have this structure:
```typescript
{
  pipeline: {
    id: "prompt-optimizer-v1",
    name: "Prompt Processing Pipeline",
    version: "1.0.0",
    description: "...",
    defaultProvider: "anthropic",
    settings: { enableCaching, enableEarlyExit, ... }
  },
  stages: [
    {
      id: "stage-1-analyze",
      name: "Analyze Prompt",
      type: "analyze",
      model: { providerID, modelID, tier, maxTokens, temperature },
      prompt: { systemPrompt, template, variables },
      output: { format, extract },
      conditions: { skipIf, runIf, earlyExit }
    },
    // ... more stages
  ]
}
```

---

## Acceptance Criteria

### Functional Requirements:

1. **Pipeline List View** (`/pipelines`):
   - Display all pipelines as cards with: name, version, description, stage count
   - Click card to view pipeline details

2. **Pipeline Detail View** (`/pipelines/:id`):
   - Show pipeline metadata header (name, version, provider, description)
   - Display stages as connected vertical flow
   - Each stage shows: name, type badge, model tier, brief description

3. **Stage Detail Expansion**:
   - Click stage to expand and show:
     - Full system prompt (collapsible)
     - Template with variable placeholders highlighted
     - Output extraction fields
     - Conditions (skip/run/earlyExit) if present
   - Model details: provider, model ID, temperature, maxTokens

4. **Visual Flow Indicators**:
   - Arrows/lines connecting stages top-to-bottom
   - Stage type indicated by color/icon (analyze, structure, enhance, validate, etc.)
   - Variable dependencies shown (which stages feed into others)

### Integration Requirements:

5. Uses `/api/pipelines` endpoint from Story 1
6. Pipeline parsing handles existing `PipelineConfig` format
7. No modifications to pipeline config files

### Quality Requirements:

8. Responsive layout (stages stack nicely on smaller screens)
9. Syntax highlighting for prompt templates (optional nice-to-have)
10. Loading state while fetching pipeline data

---

## Technical Notes

### Components to Create:

```
web/components/
  pipelines/
    PipelineList.svelte      # Grid of pipeline cards
    PipelineCard.svelte      # Single pipeline summary card
    PipelineDetail.svelte    # Full pipeline view with stages
    StageFlow.svelte         # Visual stage flow container
    StageCard.svelte         # Individual stage display
    StageDetails.svelte      # Expanded stage information
```

### API Enhancement:

```typescript
// GET /api/pipelines/:id
// Returns parsed pipeline config (need to import and serialize .ts files)
```

**Challenge:** Pipeline configs are TypeScript files with `export default`. Options:
1. Use `Bun.build` to compile, then import dynamically
2. Use `import()` directly (Bun supports this)
3. Parse with regex (not recommended)

**Recommended:** Dynamic import with JSON serialization:
```typescript
const pipeline = await import(`../../pipelines/${id}.ts`);
return Response.json(pipeline.default);
```

### Stage Type Colors:

| Type | Color | Icon |
|------|-------|------|
| analyze | blue | magnifying glass |
| structure | purple | layout |
| enhance | green | sparkles |
| validate | orange | checkmark |
| iterate | yellow | refresh |
| custom | gray | cog |

---

## Definition of Done

- [ ] Pipeline list displays all pipelines from `pipelines/` folder
- [ ] Clicking pipeline opens detail view
- [ ] All stages render in visual flow
- [ ] Stage expansion shows full details
- [ ] Variable dependencies are visible
- [ ] Conditions are displayed when present
- [ ] Responsive on desktop and tablet
- [ ] No console errors

---

## Risk Assessment

- **Primary Risk:** Dynamic TypeScript import might have edge cases
- **Mitigation:** Test with both existing pipelines, handle import errors gracefully
- **Rollback:** Disable pipeline detail view, keep list only

---

## UI Mockup (ASCII)

```
┌─────────────────────────────────────────────────────┐
│  Pipeline: Prompt Processing Pipeline               │
│  Version: 1.0.0 | Provider: anthropic               │
│  6-stage pipeline to analyze and optimize prompts   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────┐                │
│  │ 1. Analyze Prompt      [analyze]│                │
│  │    claude-haiku | temp: 0.1     │                │
│  └───────────────┬─────────────────┘                │
│                  │                                  │
│                  ▼                                  │
│  ┌─────────────────────────────────┐                │
│  │ 2. Structure Prompt  [structure]│                │
│  │    claude-haiku | temp: 0.3     │                │
│  │    skipIf: overall = COMPLETE   │                │
│  └───────────────┬─────────────────┘                │
│                  │                                  │
│                  ▼                                  │
│  ┌─────────────────────────────────┐                │
│  │ 3. Enhance Context    [enhance] │                │
│  │    claude-sonnet | temp: 0.5    │                │
│  └───────────────┬─────────────────┘                │
│                  ▼                                  │
│               ...                                   │
└─────────────────────────────────────────────────────┘
```

---

## Estimated Scope

**Complexity:** Medium-High
**Files to create:** ~6 components
**API changes:** Add `/api/pipelines/:id` endpoint
