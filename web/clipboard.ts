// Clipboard utility with fallback support and enhanced UX

export interface CopyResult {
  success: boolean;
  error?: string;
}

/**
 * Fallback copy method for older browsers or non-secure contexts
 */
function fallbackCopyText(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch {
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * Copy text to clipboard with fallback support
 */
export async function copyToClipboard(text: string): Promise<CopyResult> {
  try {
    // Try modern clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } else {
      // Fallback for non-secure contexts
      const success = fallbackCopyText(text);
      if (success) {
        return { success: true };
      }
      return { success: false, error: 'Copy failed - please try again' };
    }
  } catch (err) {
    // If clipboard API fails, try fallback
    const success = fallbackCopyText(text);
    if (success) {
      return { success: true };
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Copy failed',
    };
  }
}

export type ToastType = 'success' | 'error';

interface ToastOptions {
  message: string;
  type: ToastType;
  duration?: number;
}

/**
 * Show a toast notification near an element
 */
export function showCopyToast(element: HTMLElement, options: ToastOptions): void {
  const { message, type, duration = 1500 } = options;

  // Remove any existing toast
  const existingToast = document.querySelector('.copy-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `copy-toast copy-toast-${type}`;
  toast.textContent = message;

  // Position toast near the element
  const rect = element.getBoundingClientRect();
  toast.style.cssText = `
    position: fixed;
    left: ${rect.left + rect.width / 2}px;
    top: ${rect.top - 40}px;
    transform: translateX(-50%);
    z-index: 9999;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 500;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.2s ease-out;
    background: ${type === 'success' ? '#10b981' : '#ef4444'};
    color: white;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  `;

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
  });

  // Remove toast after animation
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 200);
  }, duration);
}

/**
 * Copy text and show toast notification
 */
export async function copyWithFeedback(
  text: string,
  element: HTMLElement
): Promise<CopyResult> {
  const result = await copyToClipboard(text);

  showCopyToast(element, {
    message: result.success ? 'Copied to clipboard!' : (result.error || 'Copy failed'),
    type: result.success ? 'success' : 'error',
  });

  return result;
}
