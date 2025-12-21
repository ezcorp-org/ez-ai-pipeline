<script lang="ts">
  let { navigate }: { navigate: (path: string) => void } = $props();

  interface Output {
    filename: string;
    pipelineId: string;
    status: string;
    timestamp: string;
    duration: number;
    cost: number;
    stagesRun: number;
    stagesSkipped: number;
    stagesFailed: number;
  }

  let outputs = $state<Output[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let filter = $state<string>("all");

  $effect(() => {
    fetch("/api/outputs")
      .then((r) => r.json())
      .then((data) => {
        outputs = data;
        loading = false;
      })
      .catch((e) => {
        error = e.message;
        loading = false;
      });
  });

  function formatDuration(ms: number): string {
    if (!ms) return "-";
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const mins = Math.floor(ms / 60000);
    const secs = Math.round((ms % 60000) / 1000);
    return `${mins}m ${secs}s`;
  }

  function formatCost(cost: number): string {
    if (!cost) return "-";
    return `$${cost.toFixed(4)}`;
  }

  let pipelineIds = $derived([...new Set(outputs.map((o) => o.pipelineId))]);

  let filteredOutputs = $derived(
    filter === "all" ? outputs : outputs.filter((o) => o.pipelineId === filter)
  );

  function getGroupedOutputs(outputList: Output[]) {
    const groups: Record<string, Output[]> = {};
    for (const output of outputList) {
      const date = new Date(output.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) groups[date] = [];
      groups[date].push(output);
    }
    return groups;
  }

  let groupedOutputs = $derived(getGroupedOutputs(filteredOutputs));
</script>

<div>
  <div class="mb-6 flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Execution Outputs</h1>
      <p class="text-slate-500 mt-1">View pipeline execution results and stage details</p>
    </div>

    <select bind:value={filter} class="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
      <option value="all">All Pipelines</option>
      {#each pipelineIds as pid}
        <option value={pid}>{pid}</option>
      {/each}
    </select>
  </div>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading outputs...</div>
    </div>
  {:else if error}
    <div class="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  {:else if filteredOutputs.length === 0}
    <div class="text-center py-12 text-slate-500">
      <p class="text-4xl mb-4">📭</p>
      <p>No outputs found</p>
      <p class="text-sm mt-2">Run a pipeline to see results here</p>
    </div>
  {:else}
    {#each Object.entries(groupedOutputs) as [date, dateOutputs]}
      <div class="mb-6">
        <h2 class="text-sm font-semibold text-slate-500 mb-3">{date}</h2>

        <div class="space-y-2">
          {#each dateOutputs as output}
            <button
              onclick={() => navigate(`/outputs/${output.filename}`)}
              class="w-full bg-white rounded-xl p-4 shadow-sm border border-slate-200 text-left hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-3">
                  <span class="text-xl">
                    {#if output.status === "success"}
                      ✅
                    {:else if output.status === "failed"}
                      ❌
                    {:else}
                      ⚠️
                    {/if}
                  </span>

                  <div>
                    <div class="font-medium text-slate-800">{output.pipelineId}</div>
                    <div class="text-xs text-slate-500">
                      {new Date(output.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <span class="text-xs px-2 py-1 rounded-full {output.status === 'success' ? 'bg-green-100 text-green-700' : output.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}">
                  {output.status}
                </span>
              </div>

              <div class="flex items-center gap-4 text-sm text-slate-500">
                <span>⏱ {formatDuration(output.duration)}</span>
                <span>💰 {formatCost(output.cost)}</span>
                <span>
                  📊 {output.stagesRun} run
                  {#if output.stagesSkipped}
                    · {output.stagesSkipped} skipped
                  {/if}
                  {#if output.stagesFailed}
                    · {output.stagesFailed} failed
                  {/if}
                </span>
              </div>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  {/if}
</div>
