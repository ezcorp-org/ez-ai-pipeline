<script lang="ts">
  import CopyButton from '../CopyButton.svelte';

  let { filename, navigate }: { filename: string; navigate: (path: string) => void } = $props();

  interface Stage {
    stageId: string;
    stageName: string;
    status: string;
    duration: number;
    model: string;
    cost: number;
    inputTokens: number;
    outputTokens: number;
    output: string | null;
    parsedOutput: any;
    error?: string;
  }

  interface Output {
    pipelineId: string;
    status: string;
    timestamp: string;
    input: Record<string, any>;
    output: Record<string, any>;
    stages: Stage[];
    summary: {
      stagesRun: number;
      stagesSkipped: number;
      stagesFailed: number;
      totalDuration: number;
      totalCost: number;
      totalInputTokens: number;
      totalOutputTokens: number;
    };
  }

  let output = $state<Output | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let expandedStages = $state<Set<string>>(new Set());
  let showRaw = $state<Record<string, boolean>>({});

  $effect(() => {
    loading = true;
    fetch(`/api/outputs/${filename}`)
      .then((r) => {
        if (!r.ok) throw new Error("Output not found");
        return r.json();
      })
      .then((data) => {
        output = data;
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
    if (!cost && cost !== 0) return "-";
    return `$${cost.toFixed(4)}`;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatNumber(n: number): string {
    return n?.toLocaleString() ?? "-";
  }

  function toggleStage(stageId: string) {
    const newSet = new Set(expandedStages);
    if (newSet.has(stageId)) {
      newSet.delete(stageId);
    } else {
      newSet.add(stageId);
    }
    expandedStages = newSet;
  }

  function toggleRaw(stageId: string) {
    showRaw = { ...showRaw, [stageId]: !showRaw[stageId] };
  }

  function getModelShortName(modelId: string): string {
    if (!modelId) return "-";
    if (modelId.includes("haiku")) return "Haiku";
    if (modelId.includes("sonnet")) return "Sonnet";
    if (modelId.includes("opus")) return "Opus";
    if (modelId.includes("gpt-4o-mini")) return "GPT-4o Mini";
    if (modelId.includes("gpt-4o")) return "GPT-4o";
    if (modelId.includes("gemini")) return "Gemini";
    return modelId;
  }

  function formatAnyOutput(val: unknown): string {
    if (!val) return "";
    if (typeof val === "object") {
      return JSON.stringify(val, null, 2);
    }
    if (typeof val === "string") {
      try {
        const parsed = JSON.parse(val);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return val;
      }
    }
    return String(val);
  }

  function getFinalOutput(): string {
    if (!output) return "";
    const out = output.output;
    if (out.optimizedPrompt) return String(out.optimizedPrompt);
    if (out.refinedPrompt) return String(out.refinedPrompt);
    if (out.enhancedPrompt) return String(out.enhancedPrompt);
    if (out["stage-3-generate"]?.pipelineConfig) {
      return JSON.stringify(out["stage-3-generate"].pipelineConfig, null, 2);
    }
    return JSON.stringify(out, null, 2);
  }
</script>

<div>
  <button onclick={() => navigate("/outputs")} class="text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1 cursor-pointer">
    ← Back to Outputs
  </button>

  {#if loading}
    <div class="flex items-center justify-center h-64">
      <div class="text-slate-500">Loading output...</div>
    </div>
  {:else if error}
    <div class="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
  {:else if output}
    <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <div class="flex items-center gap-3">
            <span class="text-2xl">
              {#if output.status === "success"}
                ✅
              {:else}
                ❌
              {/if}
            </span>
            <h1 class="text-2xl font-bold text-slate-800">{output.pipelineId}</h1>
            <span class="text-sm px-3 py-1 rounded-full {output.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">
              {output.status}
            </span>
          </div>
          <p class="text-sm text-slate-500 mt-2">{formatDate(output.timestamp)}</p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-800">{formatDuration(output.summary.totalDuration)}</div>
          <div class="text-xs text-slate-500">Duration</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-800">{formatCost(output.summary.totalCost)}</div>
          <div class="text-xs text-slate-500">Cost</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-800">{formatNumber(output.summary.totalInputTokens + output.summary.totalOutputTokens)}</div>
          <div class="text-xs text-slate-500">Tokens</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-green-600">{output.summary.stagesRun}</div>
          <div class="text-xs text-slate-500">Stages Run</div>
        </div>
        <div class="bg-slate-50 rounded-lg p-3">
          <div class="text-lg font-semibold text-slate-500">{output.summary.stagesSkipped}</div>
          <div class="text-xs text-slate-500">Skipped</div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
      <div class="p-4 border-b border-slate-200">
        <h2 class="font-semibold text-slate-700">Input</h2>
      </div>
      <div class="p-4">
        <pre class="text-sm whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto">{JSON.stringify(output.input, null, 2)}</pre>
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
      <div class="p-4 border-b border-slate-200">
        <h2 class="font-semibold text-slate-700">Stages</h2>
      </div>

      <div class="divide-y divide-slate-100">
        {#each output.stages as stage, index}
          <div>
            <button
              onclick={() => toggleStage(stage.stageId)}
              class="w-full p-4 flex items-center gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <span class="text-xl">
                {#if stage.status === "completed"}
                  ✅
                {:else if stage.status === "skipped"}
                  ⏭️
                {:else if stage.status === "failed"}
                  ❌
                {:else}
                  ⏳
                {/if}
              </span>

              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium {stage.status === 'completed' ? 'bg-green-100 text-green-700' : stage.status === 'skipped' ? 'bg-slate-100 text-slate-500' : 'bg-red-100 text-red-700'}">
                {index + 1}
              </div>

              <div class="flex-1">
                <div class="font-medium text-slate-800">{stage.stageName}</div>
                {#if stage.status === "skipped" && stage.error}
                  <div class="text-xs text-slate-500 mt-0.5">{stage.error}</div>
                {:else if stage.status === "completed"}
                  <div class="text-sm text-slate-500">
                    {getModelShortName(stage.model)} · {formatDuration(stage.duration)} · {formatCost(stage.cost)}
                  </div>
                {/if}
              </div>

              {#if stage.status === "completed"}
                <div class="text-xs text-slate-500">{formatNumber(stage.inputTokens + stage.outputTokens)} tokens</div>
              {/if}

              <span class="text-slate-400">{expandedStages.has(stage.stageId) ? "−" : "+"}</span>
            </button>

            {#if expandedStages.has(stage.stageId) && stage.status === "completed"}
              <div class="px-4 pb-4 bg-slate-50">
                <div class="flex gap-2 mb-3">
                  <button
                    onclick={() => toggleRaw(stage.stageId)}
                    class="text-xs px-3 py-1 rounded-lg border cursor-pointer {showRaw[stage.stageId] ? 'bg-white border-slate-300' : 'bg-blue-50 border-blue-200 text-blue-700'}"
                  >
                    Parsed
                  </button>
                  <button
                    onclick={() => toggleRaw(stage.stageId)}
                    class="text-xs px-3 py-1 rounded-lg border cursor-pointer {showRaw[stage.stageId] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-300'}"
                  >
                    Raw
                  </button>
                </div>

                {#if showRaw[stage.stageId]}
                  <pre class="text-xs whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">{formatAnyOutput(stage.output)}</pre>
                {:else if stage.parsedOutput}
                  <pre class="text-xs whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-96">{JSON.stringify(stage.parsedOutput, null, 2)}</pre>
                {:else}
                  <p class="text-sm text-slate-500">No parsed output available</p>
                {/if}

                <div class="mt-3 flex gap-4 text-xs text-slate-500">
                  <span>Input: {formatNumber(stage.inputTokens)} tokens</span>
                  <span>Output: {formatNumber(stage.outputTokens)} tokens</span>
                </div>
              </div>
            {/if}

            {#if expandedStages.has(stage.stageId) && stage.status === "failed" && stage.error}
              <div class="px-4 pb-4 bg-red-50">
                <pre class="text-xs whitespace-pre-wrap text-red-700">{stage.error}</pre>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-slate-200">
      <div class="p-4 border-b border-slate-200 flex items-center justify-between">
        <h2 class="font-semibold text-slate-700">Final Output</h2>
        <CopyButton text={getFinalOutput()} class="text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100" />
      </div>
      <div class="p-4">
        <pre class="text-sm whitespace-pre-wrap bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto max-h-[32rem]">{getFinalOutput()}</pre>
      </div>
    </div>
  {/if}
</div>
