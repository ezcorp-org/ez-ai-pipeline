<script lang="ts">
  interface StageProgress {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'running' | 'completed' | 'skipped' | 'failed';
    duration?: number;
    cost?: number;
    error?: string;
  }

  let { stage, index }: { stage: StageProgress; index: number } = $props();

  const statusIcons: Record<string, string> = {
    pending: '',
    running: '',
    completed: '',
    skipped: '',
    failed: '',
  };

  const statusColors: Record<string, string> = {
    pending: 'text-slate-400 bg-slate-50',
    running: 'text-blue-600 bg-blue-50',
    completed: 'text-green-600 bg-green-50',
    skipped: 'text-yellow-600 bg-yellow-50',
    failed: 'text-red-600 bg-red-50',
  };

  function formatDuration(ms: number | undefined): string {
    if (!ms) return '—';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  function formatCost(cost: number | undefined): string {
    if (!cost) return '—';
    return `$${cost.toFixed(4)}`;
  }
</script>

<div class="flex items-center gap-3 p-3 rounded-lg border {statusColors[stage.status]} transition-all duration-300">
  <!-- Status Icon -->
  <div class="w-8 h-8 rounded-full flex items-center justify-center text-lg shrink-0
    {stage.status === 'pending' ? 'bg-slate-200 text-slate-500' : ''}
    {stage.status === 'running' ? 'bg-blue-200 text-blue-700 animate-pulse' : ''}
    {stage.status === 'completed' ? 'bg-green-200 text-green-700' : ''}
    {stage.status === 'skipped' ? 'bg-yellow-200 text-yellow-700' : ''}
    {stage.status === 'failed' ? 'bg-red-200 text-red-700' : ''}
  ">
    {#if stage.status === 'pending'}
      <span class="text-sm font-medium">{index + 1}</span>
    {:else if stage.status === 'running'}
      <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    {:else if stage.status === 'completed'}
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
    {:else if stage.status === 'skipped'}
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
      </svg>
    {:else if stage.status === 'failed'}
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    {/if}
  </div>

  <!-- Stage Info -->
  <div class="flex-1 min-w-0">
    <div class="font-medium text-slate-800 truncate">
      {index + 1}. {stage.name}
    </div>
    {#if stage.error}
      <div class="text-xs text-red-600 mt-1 truncate">{stage.error}</div>
    {:else if stage.status === 'running'}
      <div class="text-xs text-blue-600 mt-1">Running...</div>
    {/if}
  </div>

  <!-- Duration -->
  <div class="text-sm text-slate-600 w-16 text-right shrink-0">
    {#if stage.status === 'running'}
      <span class="text-blue-600">...</span>
    {:else}
      {formatDuration(stage.duration)}
    {/if}
  </div>

  <!-- Cost -->
  <div class="text-sm text-slate-600 w-20 text-right shrink-0">
    {formatCost(stage.cost)}
  </div>
</div>
