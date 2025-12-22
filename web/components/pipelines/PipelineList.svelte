<script lang="ts">
  let { navigate }: { navigate: (path: string) => void } = $props();

  interface Pipeline {
    filename: string;
    id: string;
    name: string;
    version: string;
    description: string;
    stageCount: number;
    defaultProvider: string;
  }

  let pipelines = $state<Pipeline[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  $effect(() => {
    fetch("/api/pipelines")
      .then((r) => r.json())
      .then((data) => {
        pipelines = data;
        loading = false;
      })
      .catch((e) => {
        error = e.message;
        loading = false;
      });
  });

  const providerColors: Record<string, string> = {
    anthropic: "bg-orange-100 text-orange-700",
    openai: "bg-green-100 text-green-700",
    google: "bg-blue-100 text-blue-700",
  };
</script>

<div>
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-slate-800">Pipelines</h1>
    <p class="text-slate-500 mt-1">View and explore your pipeline configurations</p>
  </div>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading pipelines...</div>
    </div>
  {:else if error}
    <div class="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each pipelines as pipeline}
        <button
          onclick={() => navigate(`/pipelines/${pipeline.id}`)}
          class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-left hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="text-2xl">🔧</div>
            <span class="text-xs px-2 py-1 rounded-full {providerColors[pipeline.defaultProvider] || 'bg-gray-100 text-gray-700'}">
              {pipeline.defaultProvider}
            </span>
          </div>

          <h3 class="font-semibold text-slate-800 mb-1">{pipeline.name}</h3>
          <p class="text-xs text-slate-400 mb-2">v{pipeline.version}</p>

          <p class="text-sm text-slate-600 line-clamp-2 mb-4">
            {pipeline.description || "No description"}
          </p>

          <div class="flex items-center justify-between text-sm">
            <span class="text-slate-500">{pipeline.stageCount} stages</span>
            <span class="text-blue-600">View →</span>
          </div>
        </button>
      {:else}
        <div class="col-span-full text-center py-12 text-slate-500">
          <p class="text-4xl mb-4">📭</p>
          <p>No pipelines found</p>
          <p class="text-sm mt-2">Add pipeline files to the <code class="bg-slate-100 px-2 py-1 rounded">pipelines/</code> folder</p>
        </div>
      {/each}
    </div>
  {/if}
</div>
