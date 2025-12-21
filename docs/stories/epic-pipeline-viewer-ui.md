# Pipeline Viewer Web UI - Brownfield Epic

## Epic Goal

Add a web-based dashboard to visualize ezAiPipeline configurations and execution results, enabling users to easily understand pipeline structure and review what happened at each stage of execution.

---

## Epic Description

### Existing System Context:

- **Current functionality**: CLI tool that runs AI pipelines defined in TypeScript configs, outputs results to JSON/markdown files
- **Technology stack**: Bun, TypeScript, file-based pipeline configs
- **Integration points**: `pipelines/` folder (TypeScript configs), `outputs/` folder (execution results)

### Enhancement Details:

- **What's being added**: Svelte + Tailwind web UI served via `Bun.serve()` with HTML imports
- **How it integrates**: Reads existing pipeline configs and output files, serves via local HTTP server
- **Success criteria**:
  - Users can browse all pipelines and see stages visually
  - Users can view execution history with stage-by-stage results
  - No changes to existing CLI or pipeline execution logic

---

## Stories

### Story 1: Pipeline Viewer Component

**Display pipeline definitions with step-by-step stage visualization**

- List all pipelines from `pipelines/` folder
- Show pipeline metadata (name, version, description)
- Display stages as connected steps with: name, type, model, prompts
- Visual flow showing data dependencies between stages

### Story 2: Execution Results Viewer

**Display pipeline execution outputs from `outputs/` folder**

- List all execution results grouped by pipeline
- Show execution summary (status, duration, cost, tokens)
- Expandable stage details showing:
  - Input/output for each stage
  - Duration and model used
  - Skipped stages with reason
- Link to raw prompt markdown files

### Story 3: Web Server & Navigation

**Bun.serve() setup with routing and base layout**

- Serve Svelte app via HTML imports
- Routes: `/` (dashboard), `/pipelines`, `/outputs`, `/outputs/:id`
- Responsive Tailwind layout with sidebar navigation
- API endpoints to fetch pipeline/output data as JSON

---

## Compatibility Requirements

- [x] Existing CLI commands remain unchanged
- [x] No modifications to pipeline config format
- [x] Output file format remains unchanged
- [x] Performance impact is minimal (read-only filesystem access)

---

## Risk Mitigation

- **Primary Risk**: Adding dependencies (Svelte, Tailwind) could complicate existing project
- **Mitigation**: Use Bun's built-in bundling with HTML imports - no complex build setup
- **Rollback Plan**: Web UI is entirely additive; delete `web/` folder to remove

---

## Definition of Done

- [ ] All stories completed with acceptance criteria met
- [ ] Existing CLI functionality verified working
- [ ] UI tested with existing pipeline configs and outputs
- [ ] No regression in pipeline execution
