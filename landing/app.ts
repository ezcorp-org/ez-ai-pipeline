// EZ AI Pipeline Landing Page - Interactive Elements

// Copy to clipboard functionality with enhanced UX
const copyIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const errorIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

// Fallback copy method for older browsers or non-secure contexts
function fallbackCopyText(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '-9999px';
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

// Initialize copy buttons with icons
document.querySelectorAll('.copy-btn').forEach((btn) => {
  const button = btn as HTMLButtonElement;
  button.innerHTML = `${copyIcon}<span>Copy</span>`;

  button.addEventListener('click', async (e) => {
    e.preventDefault();
    const textToCopy = button.getAttribute('data-copy');
    if (!textToCopy) return;

    // Prevent double-clicks during animation
    if (button.classList.contains('copied') || button.classList.contains('copy-error')) return;

    let success = false;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
        success = true;
      } else {
        // Fallback for non-secure contexts
        success = fallbackCopyText(textToCopy);
      }
    } catch {
      // If clipboard API fails, try fallback
      success = fallbackCopyText(textToCopy);
    }

    if (success) {
      // Success feedback
      button.innerHTML = `${checkIcon}<span>Copied!</span>`;
      button.classList.add('copied');

      // Create and show tooltip
      showCopyToast(button, 'Copied to clipboard!', 'success');

      setTimeout(() => {
        button.innerHTML = `${copyIcon}<span>Copy</span>`;
        button.classList.remove('copied');
      }, 2000);
    } else {
      // Error feedback
      button.innerHTML = `${errorIcon}<span>Failed</span>`;
      button.classList.add('copy-error');

      showCopyToast(button, 'Failed to copy', 'error');

      setTimeout(() => {
        button.innerHTML = `${copyIcon}<span>Copy</span>`;
        button.classList.remove('copy-error');
      }, 2000);
    }
  });
});

// Toast notification for copy feedback
function showCopyToast(button: HTMLElement, message: string, type: 'success' | 'error') {
  // Remove any existing toast
  const existingToast = document.querySelector('.copy-toast');
  if (existingToast) existingToast.remove();

  const toast = document.createElement('div');
  toast.className = `copy-toast copy-toast-${type}`;
  toast.textContent = message;

  // Position toast near the button
  const rect = button.getBoundingClientRect();
  toast.style.position = 'fixed';
  toast.style.left = `${rect.left + rect.width / 2}px`;
  toast.style.top = `${rect.top - 40}px`;
  toast.style.transform = 'translateX(-50%)';

  document.body.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('copy-toast-visible');
  });

  // Remove toast after animation
  setTimeout(() => {
    toast.classList.remove('copy-toast-visible');
    setTimeout(() => toast.remove(), 200);
  }, 1500);
}

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
  mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    mobileMenuBtn.classList.toggle('active');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      // Close mobile menu if open
      navLinks?.classList.remove('mobile-open');
      mobileMenuBtn?.classList.remove('active');
    }
  });
});

// Add subtle parallax to terminal on scroll (desktop only)
if (window.matchMedia('(min-width: 768px)').matches) {
  const terminal = document.querySelector('.terminal');

  if (terminal) {
    window.addEventListener('scroll', () => {
      const terminalRect = terminal.getBoundingClientRect();

      if (terminalRect.top < window.innerHeight && terminalRect.bottom > 0) {
        const offset = (window.innerHeight - terminalRect.top) * 0.02;
        (terminal as HTMLElement).style.transform = `translateY(${Math.min(offset, 20)}px)`;
      }
    }, { passive: true });
  }
}

// Animate elements on scroll
const observerOptions: IntersectionObserverInit = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
};

const animateOnScroll = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      animateOnScroll.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step, .provider').forEach((el) => {
  el.classList.add('animate-target');
  animateOnScroll.observe(el);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  .animate-target {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  .animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  .feature-card:nth-child(2) { transition-delay: 0.1s; }
  .feature-card:nth-child(3) { transition-delay: 0.2s; }
  .feature-card:nth-child(4) { transition-delay: 0.1s; }
  .feature-card:nth-child(5) { transition-delay: 0.2s; }
  .feature-card:nth-child(6) { transition-delay: 0.3s; }

  .step:nth-child(2) { transition-delay: 0.15s; }
  .step:nth-child(3) { transition-delay: 0.3s; }

  .provider:nth-child(2) { transition-delay: 0.1s; }
  .provider:nth-child(3) { transition-delay: 0.2s; }

  /* Mobile menu styles */
  @media (max-width: 767px) {
    .nav-links {
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      padding: var(--space-md);
      flex-direction: column;
      gap: var(--space-md);
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: transform 0.3s ease-out, opacity 0.3s ease-out;
    }

    .nav-links.mobile-open {
      display: flex;
      transform: translateY(0);
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-menu-btn.active span:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-btn.active span:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-btn.active span:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
`;
document.head.appendChild(style);

console.log('EZ AI Pipeline landing page loaded');
