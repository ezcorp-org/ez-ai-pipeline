<script lang="ts">
  import CopyButton from '../CopyButton.svelte';

  interface ExecutionResultData {
    status: string;
    pipelineId: string;
    summary?: {
      totalDuration: number;
      totalCost: number;
      stagesRun: number;
      stagesSkipped: number;
      stagesFailed: number;
    };
    output?: string;
    error?: string;
  }

  let { result }: { result: ExecutionResultData } = $props();

  let showFullOutput = $state(false);

  function formatOutput(output: unknown): string {
    if (!output) return '';
    // If it's already an object, stringify it
    if (typeof output === 'object') {
      return JSON.stringify(output, null, 2);
    }
    // If it's a string, try to parse as JSON for pretty printing
    if (typeof output === 'string') {
      try {
        const parsed = JSON.parse(output);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return output;
      }
    }
    return String(output);
  }
</script>

{#if result.output}
  <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
    <div class="flex items-center justify-between mb-4">
      <h2 class="font-semibold text-slate-700">Output</h2>
      <div class="flex gap-2">
        <CopyButton
          text={formatOutput(result.output)}
          class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600"
        />
        <button
          onclick={() => showFullOutput = !showFullOutput}
          class="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          {showFullOutput ? 'Collapse' : 'Expand'}
        </button>
      </div>
    </div>

    <div class="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
      <pre class="p-4 text-sm text-slate-700 whitespace-pre-wrap overflow-x-auto {showFullOutput ? '' : 'max-h-64 overflow-y-auto'}">{formatOutput(result.output)}</pre>
    </div>

    {#if result.summary}
      <div class="mt-4 pt-4 border-t border-slate-100">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Duration</div>
            <div class="font-medium text-slate-800">
              {(result.summary.totalDuration / 1000).toFixed(2)}s
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Total Cost</div>
            <div class="font-medium text-slate-800">
              ${result.summary.totalCost.toFixed(4)}
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Stages Run</div>
            <div class="font-medium text-slate-800">
              {result.summary.stagesRun}
            </div>
          </div>
          <div class="bg-slate-50 rounded-lg p-3">
            <div class="text-slate-500 text-xs uppercase mb-1">Skipped</div>
            <div class="font-medium text-slate-800">
              {result.summary.stagesSkipped}
            </div>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
