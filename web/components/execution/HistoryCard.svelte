<script lang="ts">
  interface HistoryRecord {
    id: string;
    pipelineId: string;
    pipelineName: string;
    status: 'completed' | 'failed' | 'cancelled';
    startTime: number;
    endTime: number;
    duration: number;
    totalStages: number;
    stagesRun: number;
    stagesSkipped: number;
    stagesFailed: number;
    inputPreview: string;
    totalCost: number;
    error?: string;
  }

  let {
    record,
    formatDuration,
    formatCost,
    formatTime,
    onclick
  }: {
    record: HistoryRecord;
    formatDuration: (ms: number) => string;
    formatCost: (cost: number) => string;
    formatTime: (timestamp: number) => string;
    onclick: () => void;
  } = $props();

  function getStatusColor(): string {
    switch (record.status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      case 'cancelled': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  }

  function getStatusIcon(): string {
    switch (record.status) {
      case 'completed': return '✓';
      case 'failed': return '✕';
      case 'cancelled': return '⏸';
      default: return '•';
    }
  }
</script>

<button
  {onclick}
  class="w-full text-left p-3 bg-white rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group cursor-pointer"
>
  <div class="flex items-center gap-4">
    <!-- Status Icon -->
    <div class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 {getStatusColor()}">
      <span class="text-sm">{getStatusIcon()}</span>
    </div>

    <!-- Pipeline Info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2">
        <h3 class="font-medium text-slate-800 truncate">{record.pipelineName}</h3>
        <span class="text-xs px-2 py-0.5 rounded-full font-medium {getStatusColor()} shrink-0">
          {record.status}
        </span>
      </div>
      <p class="text-xs text-slate-500 truncate mt-0.5">
        "{record.inputPreview}"
      </p>
    </div>

    <!-- Stats -->
    <div class="flex items-center gap-4 shrink-0 text-xs text-slate-500">
      <div class="text-right">
        <div class="font-medium text-slate-700">{formatDuration(record.duration)}</div>
        <div>duration</div>
      </div>
      <div class="text-right">
        <div class="font-medium text-slate-700">{formatCost(record.totalCost)}</div>
        <div>cost</div>
      </div>
      <div class="text-right">
        <div class="font-medium text-slate-700">{record.stagesRun}/{record.totalStages}</div>
        <div>stages</div>
      </div>
      <div class="text-right w-16">
        <div class="font-medium text-slate-700">{formatTime(record.startTime)}</div>
      </div>
    </div>

    <!-- Arrow -->
    <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
    </svg>
  </div>

  {#if record.error}
    <div class="mt-2 text-xs text-red-600 truncate pl-12">
      Error: {record.error}
    </div>
  {/if}
</button>
