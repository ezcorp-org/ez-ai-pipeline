<script lang="ts">
  import StageStatus from './StageStatus.svelte';

  interface StageProgress {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
    duration?: number;
    cost?: number;
    error?: string;
    output?: string;
  }

  interface ExecutionDetail {
    id: string;
    pipelineId: string;
    pipelineName: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    startTime: number;
    currentStage: number;
    totalStages: number;
    input: string;
    stages: StageProgress[];
    isHistorical?: boolean;
    result?: {
      status: string;
      output?: string;
      error?: string;
      summary?: {
        totalDuration: number;
        totalCost: number;
        stagesRun: number;
        stagesSkipped: number;
        stagesFailed: number;
      };
    };
  }

  let { executionId, navigate }: { executionId: string; navigate: (path: string) => void } = $props();

  let execution = $state<ExecutionDetail | null>(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let wsStatus = $state<'connecting' | 'connected' | 'disconnected'>('disconnected');
  let expandedStages = $state<Set<string>>(new Set());

  function toggleStage(stageId: string) {
    const newSet = new Set(expandedStages);
    if (newSet.has(stageId)) {
      newSet.delete(stageId);
    } else {
      newSet.add(stageId);
    }
    expandedStages = newSet;
  }

  function autoExpandStage(stageId: string) {
    if (!expandedStages.has(stageId)) {
      const newSet = new Set(expandedStages);
      newSet.add(stageId);
      expandedStages = newSet;
    }
  }

  async function fetchExecution() {
    try {
      const res = await fetch(`/api/executions/${executionId}`);
      if (!res.ok) {
        if (res.status === 404) {
          error = 'Execution not found. It may have expired or been cleaned up.';
        } else {
          throw new Error('Failed to fetch execution');
        }
        return;
      }
      const data = await res.json() as ExecutionDetail;
      execution = data;
      error = null;

      // Auto-expand any running stage or stages with output on initial load
      if (data.stages) {
        const toExpand = new Set<string>();
        for (const stage of data.stages) {
          if (stage.status === 'running' || stage.output) {
            toExpand.add(stage.id);
          }
        }
        if (toExpand.size > 0) {
          expandedStages = toExpand;
        }
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Unknown error';
    } finally {
      loading = false;
    }
  }

  $effect(() => {
    fetchExecution();
  });

  // WebSocket connection for live updates when execution is running
  $effect(() => {
    if (!execution || execution.status !== 'running' || execution.isHistorical) return;

    wsStatus = 'connecting';
    const ws = new WebSocket(`ws://${location.host}/ws`);

    ws.onopen = () => {
      wsStatus = 'connected';
      ws.send(JSON.stringify({ type: 'subscribe', executionId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'stage:started' && execution) {
        const stageIndex = execution.stages.findIndex(s => s.id === data.stage.id);
        if (stageIndex >= 0) {
          execution.stages[stageIndex] = {
            ...execution.stages[stageIndex],
            status: 'running',
          };
          execution.currentStage = data.index + 1;
          // Auto-expand the running stage
          autoExpandStage(data.stage.id);
        }
      }

      if (data.type === 'stage:completed' && execution) {
        const stageIndex = execution.stages.findIndex(s => s.id === data.stage.id);
        if (stageIndex >= 0) {
          execution.stages[stageIndex] = {
            ...execution.stages[stageIndex],
            status: 'completed',
            duration: data.result?.duration,
            cost: data.result?.cost,
          };
        }
      }

      if (data.type === 'stage:skipped' && execution) {
        const stageIndex = execution.stages.findIndex(s => s.id === data.stage.id);
        if (stageIndex >= 0) {
          execution.stages[stageIndex] = {
            ...execution.stages[stageIndex],
            status: 'skipped',
          };
        }
      }

      if (data.type === 'stage:failed' && execution) {
        const stageIndex = execution.stages.findIndex(s => s.id === data.stage.id);
        if (stageIndex >= 0) {
          execution.stages[stageIndex] = {
            ...execution.stages[stageIndex],
            status: 'failed',
            error: data.error,
          };
        }
      }

      if (data.type === 'stage:output' && execution) {
        const stageIndex = execution.stages.findIndex(s => s.id === data.stageId);
        if (stageIndex >= 0) {
          execution.stages[stageIndex] = {
            ...execution.stages[stageIndex],
            output: data.output,
          };
          // Auto-expand when we receive output
          autoExpandStage(data.stageId);
        }
      }

      if ((data.type === 'execution:completed' || data.type === 'execution:failed') && execution) {
        execution.status = data.result?.status === 'success' ? 'completed' :
                          data.result?.status === 'cancelled' ? 'cancelled' :
                          data.result?.status === 'failed' ? 'failed' : 'completed';
        execution.result = data.result;
        ws.close();
        wsStatus = 'disconnected';
      }

      if (data.type === 'execution:cancelled' && execution) {
        execution.status = 'cancelled';
        ws.close();
        wsStatus = 'disconnected';
      }
    };

    ws.onerror = () => {
      wsStatus = 'disconnected';
    };

    ws.onclose = () => {
      wsStatus = 'disconnected';
    };

    return () => {
      ws.close();
    };
  });

  function formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  }

  function formatCost(cost: number): string {
    return `$${cost.toFixed(4)}`;
  }

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

  function formatElapsed(startTime: number): string {
    const elapsed = Date.now() - startTime;
    return formatDuration(elapsed);
  }

  function getStatusColor(): string {
    if (!execution) return '';
    switch (execution.status) {
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  }

  let totalCost = $derived(
    execution?.result?.summary?.totalCost ||
    execution?.stages.reduce((sum, s) => sum + (s.cost || 0), 0) || 0
  );

  let elapsed = $state('');

  $effect(() => {
    if (!execution) return;

    // For historical records, use the summary duration
    if (execution.isHistorical && execution.result?.summary?.totalDuration) {
      elapsed = formatDuration(execution.result.summary.totalDuration);
      return;
    }

    elapsed = formatElapsed(execution.startTime);

    if (execution.status !== 'running') return;

    const interval = setInterval(() => {
      elapsed = formatElapsed(execution!.startTime);
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<div class="max-w-4xl">
  <!-- Header -->
  <div class="flex items-center gap-4 mb-6">
    <button
      onclick={() => navigate('/running')}
      class="p-2 rounded-lg hover:bg-slate-100 transition-colors"
      title="Back to Running Executions"
    >
      <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    <div class="flex-1">
      <h1 class="text-2xl font-bold text-slate-800">
        {execution?.pipelineName || 'Execution Details'}
      </h1>
      <p class="text-slate-500 text-sm mt-1">
        {executionId}
      </p>
    </div>
    {#if execution}
      <span class="px-3 py-1 rounded-full text-sm font-medium border {getStatusColor()}">
        {execution.status}
      </span>
    {/if}
  </div>

  {#if loading}
    <div class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3 text-slate-500">
        <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading execution...</span>
      </div>
    </div>
  {:else if error}
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div class="text-4xl mb-4">😕</div>
      <p class="font-medium text-red-700 mb-2">Execution Not Found</p>
      <p class="text-red-600 text-sm mb-4">{error}</p>
      <button
        onclick={() => navigate('/running')}
        class="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
      >
        <span>Back to Running Executions</span>
      </button>
    </div>
  {:else if execution}
    <!-- Summary Cards -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Elapsed Time</div>
        <div class="text-lg font-semibold text-slate-800">{elapsed}</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Progress</div>
        <div class="text-lg font-semibold text-slate-800">
          {execution.currentStage}/{execution.totalStages} stages
        </div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Total Cost</div>
        <div class="text-lg font-semibold text-slate-800">{formatCost(totalCost)}</div>
      </div>
      <div class="bg-white rounded-xl border border-slate-200 p-4">
        <div class="text-xs text-slate-500 mb-1">Status</div>
        <div class="flex items-center gap-2">
          {#if execution.status === 'running'}
            <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span class="text-blue-600 font-medium">Live</span>
          {:else if execution.status === 'completed'}
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            <span class="text-green-600 font-medium">Complete</span>
          {:else if execution.status === 'failed'}
            <span class="w-2 h-2 bg-red-500 rounded-full"></span>
            <span class="text-red-600 font-medium">Failed</span>
          {:else}
            <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
            <span class="text-yellow-600 font-medium">Cancelled</span>
          {/if}
        </div>
      </div>
    </div>

    <!-- Input Section -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <h3 class="text-sm font-medium text-slate-700 mb-2">Input</h3>
      <pre class="text-sm text-slate-600 whitespace-pre-wrap break-words bg-slate-50 rounded-lg p-3 max-h-32 overflow-y-auto">{execution.input}</pre>
    </div>

    <!-- WebSocket Status -->
    {#if execution.status === 'running'}
      <div class="flex items-center justify-end gap-2 mb-2">
        {#if wsStatus === 'connecting'}
          <span class="text-xs text-blue-600 flex items-center gap-1">
            <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Connecting...
          </span>
        {:else if wsStatus === 'connected'}
          <span class="text-xs text-green-600 flex items-center gap-1">
            <span class="w-2 h-2 bg-green-500 rounded-full"></span>
            Live Updates
          </span>
        {:else}
          <span class="text-xs text-slate-400 flex items-center gap-1">
            <span class="w-2 h-2 bg-slate-300 rounded-full"></span>
            Disconnected
          </span>
        {/if}
      </div>
    {/if}

    <!-- Stages -->
    <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-medium text-slate-700">Stages</h3>
        {#if !execution.isHistorical && execution.stages.length > 0}
          <span class="text-xs text-slate-400">Click a stage to view output</span>
        {/if}
      </div>
      {#if execution.isHistorical}
        <div class="bg-slate-50 rounded-lg p-6 text-center">
          <div class="text-slate-400 text-3xl mb-2">📜</div>
          <p class="text-sm text-slate-600 mb-1">Historical Record</p>
          <p class="text-xs text-slate-500">
            Stage details are not available for historical executions.
            Only the summary is preserved.
          </p>
        </div>
      {:else if execution.stages.length === 0}
        <div class="bg-slate-50 rounded-lg p-6 text-center">
          <div class="text-slate-400">Waiting for stages...</div>
        </div>
      {:else}
        <div class="space-y-2">
          {#each execution.stages as stage, index}
            <StageStatus
              {stage}
              {index}
              expanded={expandedStages.has(stage.id)}
              onToggle={() => toggleStage(stage.id)}
            />
          {/each}
        </div>
      {/if}
    </div>

    <!-- Final Result -->
    {#if execution.result}
      <div class="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <h3 class="text-sm font-medium text-slate-700 mb-3">Result</h3>

        {#if execution.result.summary}
          <div class="grid grid-cols-3 gap-4 mb-4">
            <div class="bg-slate-50 rounded-lg p-3">
              <div class="text-xs text-slate-500">Duration</div>
              <div class="font-medium">{formatDuration(execution.result.summary.totalDuration)}</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-3">
              <div class="text-xs text-slate-500">Total Cost</div>
              <div class="font-medium">{formatCost(execution.result.summary.totalCost)}</div>
            </div>
            <div class="bg-slate-50 rounded-lg p-3">
              <div class="text-xs text-slate-500">Stages</div>
              <div class="font-medium">
                {execution.result.summary.stagesRun} run,
                {execution.result.summary.stagesSkipped} skipped,
                {execution.result.summary.stagesFailed} failed
              </div>
            </div>
          </div>
        {/if}

        {#if execution.result.output}
          <div>
            <div class="text-xs font-medium text-slate-500 mb-2">Final Output</div>
            <pre class="text-sm text-slate-700 whitespace-pre-wrap break-words bg-slate-50 rounded-lg p-3 max-h-96 overflow-y-auto font-mono">{formatOutput(execution.result.output)}</pre>
          </div>
        {/if}

        {#if execution.result.error}
          <div class="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <div class="text-xs font-medium text-red-500 mb-1">Error</div>
            <div class="text-sm text-red-700">{execution.result.error}</div>
          </div>
        {/if}
      </div>
    {/if}

    <!-- Actions -->
    <div class="flex gap-3">
      <button
        onclick={() => navigate(`/pipelines/${execution!.pipelineId}`)}
        class="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
      >
        View Pipeline
      </button>
      {#if execution.status === 'running'}
        <button
          onclick={async () => {
            await fetch(`/api/executions/${executionId}/cancel`, { method: 'POST' });
          }}
          class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Cancel Execution
        </button>
      {/if}
    </div>
  {/if}
</div>
