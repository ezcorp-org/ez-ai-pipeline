<script lang="ts">
  let { navigate }: { navigate: (path: string) => void } = $props();

  interface PipelineSummary {
    filename: string;
    id: string;
    name: string;
    stageCount: number;
  }

  interface OutputSummary {
    filename: string;
    pipelineId: string;
    status: string;
    timestamp: string;
    cost: number;
  }

  let pipelines = $state<PipelineSummary[]>([]);
  let outputs = $state<OutputSummary[]>([]);
  let loading = $state(true);

  $effect(() => {
    Promise.all([
      fetch("/api/pipelines").then((r) => r.json()),
      fetch("/api/outputs").then((r) => r.json()),
    ]).then(([p, o]) => {
      pipelines = p;
      outputs = o;
      loading = false;
    });
  });

  function formatCost(cost: number): string {
    return `$${cost?.toFixed(4) ?? "0.0000"}`;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  let totalCost = $derived(outputs.reduce((sum, o) => sum + (o.cost || 0), 0));
  let successCount = $derived(outputs.filter((o) => o.status === "success").length);
</script>

<div>
  <h1 class="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading...</div>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-blue-600">{pipelines.length}</div>
        <div class="text-sm text-slate-500 mt-1">Pipelines</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-green-600">{outputs.length}</div>
        <div class="text-sm text-slate-500 mt-1">Total Runs</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-emerald-600">{successCount}</div>
        <div class="text-sm text-slate-500 mt-1">Successful</div>
      </div>
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div class="text-3xl font-bold text-purple-600">{formatCost(totalCost)}</div>
        <div class="text-sm text-slate-500 mt-1">Total Cost</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 class="font-semibold text-slate-700">Pipelines</h2>
          <button onclick={() => navigate("/pipelines")} class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            View all →
          </button>
        </div>
        <div class="divide-y divide-slate-100">
          {#each pipelines as pipeline}
            <button
              onclick={() => navigate(`/pipelines/${pipeline.id}`)}
              class="w-full p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div class="font-medium text-slate-800">{pipeline.name}</div>
              <div class="text-sm text-slate-500">{pipeline.stageCount} stages</div>
            </button>
          {:else}
            <div class="p-4 text-slate-500 text-sm">No pipelines found</div>
          {/each}
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-slate-200">
        <div class="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 class="font-semibold text-slate-700">Recent Runs</h2>
          <button onclick={() => navigate("/outputs")} class="text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
            View all →
          </button>
        </div>
        <div class="divide-y divide-slate-100">
          {#each outputs.slice(0, 5) as output}
            <button
              onclick={() => navigate(`/outputs/${output.filename}`)}
              class="w-full p-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <div class="flex items-center justify-between">
                <div class="font-medium text-slate-800">{output.pipelineId}</div>
                <span class="text-xs px-2 py-1 rounded-full {output.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
                  {output.status}
                </span>
              </div>
              <div class="text-sm text-slate-500 mt-1">
                {formatDate(output.timestamp)} · {formatCost(output.cost)}
              </div>
            </button>
          {:else}
            <div class="p-4 text-slate-500 text-sm">No outputs found</div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>
