# Story 1: Web Server & Navigation

**Epic:** Pipeline Viewer Web UI
**Type:** Brownfield Addition
**Priority:** High (Foundation for other stories)

---

## User Story

As a **pipeline developer**,
I want **a local web server that serves a dashboard UI**,
So that **I can visually explore pipelines and execution results in my browser**.

---

## Story Context

### Existing System Integration:

- **Integrates with:** Existing Bun runtime and project structure
- **Technology:** Bun.serve() with HTML imports, Svelte, Tailwind CSS
- **Follows pattern:** CLAUDE.md conventions for Bun.serve() with HTML imports
- **Touch points:** New `web/` folder, new server entry point

### File Structure to Create:

```
web/
  index.html          # Main HTML entry with Svelte app
  index.ts            # Bun.serve() server
  app.svelte          # Root Svelte component
  components/
    Layout.svelte     # Sidebar + main content layout
    Sidebar.svelte    # Navigation sidebar
  styles/
    main.css          # Tailwind imports
```

---

## Acceptance Criteria

### Functional Requirements:

1. **Server starts** with `bun run web/index.ts` on port 3000 (configurable)
2. **Routes work:**
   - `/` - Dashboard home (placeholder content)
   - `/pipelines` - Pipeline list (placeholder)
   - `/outputs` - Execution outputs list (placeholder)
   - `/outputs/:id` - Single output detail (placeholder)
3. **API endpoints return JSON:**
   - `GET /api/pipelines` - List pipeline files
   - `GET /api/outputs` - List output files
   - `GET /api/outputs/:filename` - Get single output JSON
4. **Hot reload works** in development with `--hot` flag

### Integration Requirements:

5. Existing CLI commands (`bun run src/index.ts`) continue to work unchanged
6. No modifications to existing `src/` folder structure
7. Web server reads from existing `pipelines/` and `outputs/` folders (read-only)

### Quality Requirements:

8. Tailwind CSS configured and working
9. Svelte components render without errors
10. Responsive layout works on desktop and tablet widths

---

## Technical Notes

### Server Implementation (web/index.ts):

```typescript
import index from "./index.html";

const server = Bun.serve({
  port: 3000,
  routes: {
    "/": index,
    "/pipelines": index,
    "/outputs": index,
    "/outputs/*": index,
    "/api/pipelines": {
      GET: async () => {
        // Read pipelines/ folder, return list
      },
    },
    "/api/outputs": {
      GET: async () => {
        // Read outputs/ folder, return list
      },
    },
    "/api/outputs/:filename": {
      GET: async (req) => {
        // Read specific output file
      },
    },
  },
  development: {
    hmr: true,
    console: true,
  },
});
```

### Layout Pattern:

- Fixed sidebar (240px) with navigation links
- Main content area with route-based content
- Tailwind utility classes for styling

### Key Constraints:

- Must use Bun's HTML imports (no Vite/webpack)
- Svelte 5 with runes syntax
- Client-side routing (SPA pattern)

---

## Definition of Done

- [ ] `bun run web/index.ts` starts server successfully
- [ ] All routes render without 404 errors
- [ ] API endpoints return valid JSON
- [ ] Sidebar navigation switches between views
- [ ] Tailwind styles apply correctly
- [ ] Hot reload works for development
- [ ] Existing CLI functionality verified working
- [ ] No console errors in browser

---

## Risk Assessment

- **Primary Risk:** Bun HTML imports with Svelte may have edge cases
- **Mitigation:** Start with minimal setup, verify each step
- **Rollback:** Delete `web/` folder entirely - no impact on existing code

---

## Dependencies

- Svelte 5
- Tailwind CSS
- (No other external dependencies needed - Bun handles bundling)

---

## Estimated Scope

**Complexity:** Medium
**Files to create:** ~8 files
**New dependencies:** 2 (svelte, tailwindcss)
