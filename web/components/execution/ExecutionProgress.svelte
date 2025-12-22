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

  interface ExecutionResult {
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

  let { executionId, stageCount, onComplete }: {
    executionId: string;
    stageCount: number;
    onComplete?: (result: ExecutionResult) => void;
  } = $props();

  let stages = $state<StageProgress[]>([]);
  let result = $state<ExecutionResult | null>(null);
  let wsStatus = $state<'connecting' | 'connected' | 'disconnected'>('connecting');
  let totalCost = $state(0);
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

  $effect(() => {
    if (!executionId) return;

    const ws = new WebSocket(`ws://${location.host}/ws`);

    ws.onopen = () => {
      wsStatus = 'connected';
      ws.send(JSON.stringify({ type: 'subscribe', executionId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'subscribed' && !data.success) {
        // Execution not found, might have already completed
        wsStatus = 'disconnected';
        return;
      }

      if (data.type === 'execution:started') {
        // Initialize stages as pending
        stages = [];
      }

      if (data.type === 'stage:started') {
        const existingIndex = stages.findIndex(s => s.id === data.stage.id);
        if (existingIndex >= 0) {
          stages[existingIndex] = {
            ...stages[existingIndex],
            status: 'running',
          };
        } else {
          stages = [...stages, {
            id: data.stage.id,
            name: data.stage.name,
            type: data.stage.type,
            status: 'running',
          }];
        }
        autoExpandStage(data.stage.id);
      }

      if (data.type === 'stage:completed') {
        const index = stages.findIndex(s => s.id === data.stage.id);
        if (index >= 0) {
          stages[index] = {
            ...stages[index],
            status: 'completed',
            duration: data.result?.duration,
            cost: data.result?.cost,
          };
          totalCost = stages.reduce((sum, s) => sum + (s.cost || 0), 0);
        }
      }

      if (data.type === 'stage:skipped') {
        const existingIndex = stages.findIndex(s => s.id === data.stage.id);
        if (existingIndex >= 0) {
          stages[existingIndex] = {
            ...stages[existingIndex],
            status: 'skipped',
          };
        } else {
          stages = [...stages, {
            id: data.stage.id,
            name: data.stage.name,
            type: data.stage.type,
            status: 'skipped',
          }];
        }
      }

      if (data.type === 'stage:failed') {
        const index = stages.findIndex(s => s.id === data.stage.id);
        if (index >= 0) {
          stages[index] = {
            ...stages[index],
            status: 'failed',
            error: data.error,
          };
        }
      }

      if (data.type === 'stage:output') {
        const index = stages.findIndex(s => s.id === data.stageId);
        if (index >= 0) {
          stages[index] = {
            ...stages[index],
            output: data.output,
          };
          autoExpandStage(data.stageId);
        }
      }

      if (data.type === 'execution:completed' || data.type === 'execution:failed') {
        result = data.result || { status: 'failed', pipelineId: '', error: data.error };
        totalCost = result?.summary?.totalCost || totalCost;
        ws.close();
        wsStatus = 'disconnected';
        if (onComplete) {
          onComplete(result);
        }
      }

      if (data.type === 'execution:cancelled') {
        result = { status: 'cancelled', pipelineId: '' };
        ws.close();
        wsStatus = 'disconnected';
        if (onComplete) {
          onComplete(result);
        }
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

  function formatCost(cost: number): string {
    return `$${cost.toFixed(4)}`;
  }
</script>

<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
  <div class="flex items-center justify-between mb-4">
    <h2 class="font-semibold text-slate-700">Execution Progress</h2>
    <div class="flex items-center gap-4">
      {#if wsStatus === 'connecting'}
        <span class="text-xs text-blue-600 flex items-center gap-1">
          <span class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Connecting...
        </span>
      {:else if wsStatus === 'connected'}
        <span class="text-xs text-green-600 flex items-center gap-1">
          <span class="w-2 h-2 bg-green-500 rounded-full"></span>
          Live
        </span>
      {/if}
      <span class="text-sm font-medium text-slate-700">
        Cost: {formatCost(totalCost)}
      </span>
    </div>
  </div>

  <div class="space-y-2">
    {#each stages as stage, index}
      <StageStatus {stage} {index} expanded={expandedStages.has(stage.id)} onToggle={() => toggleStage(stage.id)} />
    {:else}
      <div class="text-center text-slate-500 py-8">
        Waiting for stages to start...
      </div>
    {/each}
  </div>

  {#if result}
    <div class="mt-6 pt-4 border-t border-slate-200">
      {#if result.status === 'success' || result.status === 'completed'}
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <div class="flex items-center gap-2 text-green-700 font-medium mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Execution Complete
          </div>
          {#if result.summary}
            <div class="text-sm text-green-600 grid grid-cols-2 gap-2">
              <div>Duration: {(result.summary.totalDuration / 1000).toFixed(1)}s</div>
              <div>Cost: ${result.summary.totalCost.toFixed(4)}</div>
              <div>Stages run: {result.summary.stagesRun}</div>
              <div>Stages skipped: {result.summary.stagesSkipped}</div>
            </div>
          {/if}
        </div>
      {:else if result.status === 'cancelled'}
        <div class="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div class="flex items-center gap-2 text-yellow-700 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            Execution Cancelled
          </div>
        </div>
      {:else}
        <div class="bg-red-50 rounded-lg p-4 border border-red-200">
          <div class="flex items-center gap-2 text-red-700 font-medium mb-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Execution Failed
          </div>
          {#if result.error}
            <div class="text-sm text-red-600">{result.error}</div>
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</div>
