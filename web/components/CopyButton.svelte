<script lang="ts">
  import { copyToClipboard, showCopyToast, type CopyResult } from '../clipboard';

  interface Props {
    text: string;
    label?: string;
    successLabel?: string;
    errorLabel?: string;
    class?: string;
    showToast?: boolean;
  }

  let {
    text,
    label = 'Copy',
    successLabel = 'Copied!',
    errorLabel = 'Failed',
    class: className = '',
    showToast = true,
  }: Props = $props();

  let status = $state<'idle' | 'copied' | 'error'>('idle');
  let buttonRef = $state<HTMLButtonElement | null>(null);

  const copyIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
  const checkIcon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
  const errorIconSvg = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

  async function handleCopy(e: Event) {
    e.preventDefault();

    // Prevent double-clicks during animation
    if (status !== 'idle') return;

    const result = await copyToClipboard(text);

    if (result.success) {
      status = 'copied';
      if (showToast && buttonRef) {
        showCopyToast(buttonRef, {
          message: 'Copied to clipboard!',
          type: 'success',
        });
      }
    } else {
      status = 'error';
      if (showToast && buttonRef) {
        showCopyToast(buttonRef, {
          message: result.error || 'Copy failed',
          type: 'error',
        });
      }
    }

    setTimeout(() => {
      status = 'idle';
    }, 2000);
  }

  const currentIcon = $derived(
    status === 'copied' ? checkIcon : status === 'error' ? errorIconSvg : copyIcon
  );
  const currentLabel = $derived(
    status === 'copied' ? successLabel : status === 'error' ? errorLabel : label
  );
</script>

<button
  bind:this={buttonRef}
  onclick={handleCopy}
  class="copy-button {status} {className}"
  disabled={status !== 'idle'}
  aria-label={currentLabel}
>
  {@html currentIcon}
  <span>{currentLabel}</span>
</button>

<style>
  .copy-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #f8fafc;
    color: #475569;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .copy-button:hover:not(:disabled) {
    background: #f1f5f9;
    border-color: #cbd5e1;
  }

  .copy-button:active:not(:disabled) {
    transform: scale(0.97);
  }

  .copy-button.copied {
    background: #dcfce7;
    border-color: #86efac;
    color: #16a34a;
  }

  .copy-button.error {
    background: #fee2e2;
    border-color: #fca5a5;
    color: #dc2626;
  }

  .copy-button:disabled {
    cursor: default;
  }

  .copy-button :global(svg) {
    flex-shrink: 0;
  }

  .copy-button.copied :global(svg) {
    animation: checkmark-pop 0.3s ease-out;
  }

  @keyframes checkmark-pop {
    0% { transform: scale(0.8); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
</style>
