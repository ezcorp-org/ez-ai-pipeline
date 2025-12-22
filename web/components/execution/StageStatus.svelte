<script lang="ts">
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

  let {
    stage,
    index,
    expanded = false,
    onToggle
  }: {
    stage: StageProgress;
    index: number;
    expanded?: boolean;
    onToggle?: () => void;
  } = $props();

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

  function handleCardClick() {
    if (stage.output && onToggle) {
      onToggle();
    }
  }

  // Simple syntax highlighting for markdown/code output
  function highlightOutput(text: string): string {
    if (!text) return '';

    // Escape HTML first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Highlight code blocks ```code```
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<div class="bg-slate-800 text-slate-100 rounded-md p-3 my-2 overflow-x-auto"><div class="text-xs text-slate-400 mb-1">${lang || 'code'}</div><code class="text-sm">${highlightCode(code, lang)}</code></div>`;
    });

    // Highlight inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded text-sm">$1</code>');

    // Highlight headers
    html = html.replace(/^(#{1,6})\s+(.+)$/gm, (_, hashes, content) => {
      const level = hashes.length;
      const sizes = ['text-xl font-bold', 'text-lg font-bold', 'text-base font-semibold', 'text-sm font-semibold', 'text-sm font-medium', 'text-xs font-medium'];
      return `<div class="${sizes[level - 1] || sizes[5]} text-slate-800 mt-3 mb-1">${content}</div>`;
    });

    // Highlight bold **text**
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');

    // Highlight italic *text*
    html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');

    // Highlight bullet points
    html = html.replace(/^[-*]\s+(.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-slate-400">•</span><span>$1</span></div>');

    // Highlight numbered lists
    html = html.replace(/^(\d+)\.\s+(.+)$/gm, '<div class="flex gap-2 ml-2"><span class="text-slate-500 font-medium">$1.</span><span>$2</span></div>');

    return html;
  }

  function highlightCode(code: string, lang: string): string {
    // Simple keyword highlighting for common languages
    const keywords = {
      js: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this)\b/g,
      ts: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this|interface|type|extends|implements)\b/g,
      python: /\b(def|class|import|from|return|if|elif|else|for|while|try|except|raise|with|as|lambda|yield|async|await)\b/g,
      json: /("(?:[^"\\]|\\.)*")\s*:/g,
    };

    let highlighted = code;

    // Highlight strings
    highlighted = highlighted.replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="text-green-400">$&</span>');

    // Highlight numbers
    highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="text-orange-400">$1</span>');

    // Highlight keywords based on language
    const langKey = lang?.toLowerCase() as keyof typeof keywords;
    if (keywords[langKey]) {
      highlighted = highlighted.replace(keywords[langKey], '<span class="text-purple-400">$&</span>');
    }

    // Highlight comments
    highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, '<span class="text-slate-500 italic">$1</span>');

    return highlighted;
  }
</script>

<div class="rounded-lg border {statusColors[stage.status]} transition-all duration-300 {stage.output ? 'cursor-pointer hover:shadow-md' : ''}">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="flex items-center gap-3 p-3"
    onclick={handleCardClick}
  >
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

    <!-- Output Toggle Indicator -->
    {#if stage.output}
      <div class="p-1.5 shrink-0">
        <svg class="w-4 h-4 text-slate-500 transition-transform duration-200 {expanded ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </div>
    {/if}
  </div>

  <!-- Expandable Output Section with Syntax Highlighting -->
  {#if stage.output && expanded}
    <div class="border-t border-current/10 p-4 bg-white/80">
      <div class="flex items-center justify-between mb-3">
        <div class="text-xs font-medium text-slate-500">Stage Output</div>
        <div class="text-xs text-slate-400">{stage.output.length.toLocaleString()} chars</div>
      </div>
      <div class="text-sm text-slate-700 max-h-96 overflow-y-auto bg-slate-50 rounded-lg p-4 prose prose-sm prose-slate max-w-none">
        {@html highlightOutput(stage.output)}
      </div>
    </div>
  {/if}
</div>
