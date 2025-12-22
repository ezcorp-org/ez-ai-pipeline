<script lang="ts">
  interface Execution {
    id: string;
    pipelineId: string;
    pipelineName: string;
    status: 'running' | 'completed' | 'failed' | 'cancelled';
    startTime: number;
    currentStage: number;
    totalStages: number;
    inputPreview: string;
  }

  let { execution, onselect }: { execution: Execution; onselect: () => void } = $props();

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    console.log('ExecutionCard clicked, execution:', execution.id);
    if (onselect) {
      onselect();
    } else {
      console.error('onselect is not defined!');
    }
  }

  function formatElapsed(startTime: number): string {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor(elapsed / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  function getProgressPercent(): number {
    if (execution.totalStages === 0) return 0;
    return Math.round((execution.currentStage / execution.totalStages) * 100);
  }

  function getStatusColor(): string {
    switch (execution.status) {
      case 'running': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  }

  function getStatusIcon(): string {
    switch (execution.status) {
      case 'running': return '▶';
      case 'completed': return '✓';
      case 'failed': return '✕';
      case 'cancelled': return '⏸';
      default: return '•';
    }
  }

  let elapsed = $state(formatElapsed(execution.startTime));

  $effect(() => {
    if (execution.status !== 'running') return;

    const interval = setInterval(() => {
      elapsed = formatElapsed(execution.startTime);
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<button
  onclick={handleClick}
  class="w-full text-left p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group cursor-pointer"
>
  <div class="flex items-start justify-between mb-2">
    <div class="flex items-center gap-2">
      <span class="text-lg">🔧</span>
      <h3 class="font-medium text-slate-800">{execution.pipelineName}</h3>
    </div>
    <span class="text-xs px-2 py-1 rounded-full font-medium {getStatusColor()}">
      {getStatusIcon()} {execution.status}
    </span>
  </div>

  <p class="text-sm text-slate-500 mb-3 line-clamp-1">
    "{execution.inputPreview}"
  </p>

  <div class="flex items-center gap-4">
    <!-- Progress Bar -->
    <div class="flex-1">
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full bg-blue-500 transition-all duration-300 {execution.status === 'running' ? 'animate-pulse' : ''}"
          style="width: {getProgressPercent()}%"
        ></div>
      </div>
    </div>

    <!-- Stage Progress -->
    <span class="text-xs text-slate-500 shrink-0">
      Stage {execution.currentStage}/{execution.totalStages}
    </span>

    <!-- Elapsed Time -->
    <span class="text-xs text-slate-500 shrink-0 w-16 text-right">
      {elapsed}
    </span>

    <!-- View Arrow -->
    <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </div>
</button>
