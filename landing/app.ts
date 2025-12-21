// EZ AI Pipeline Landing Page - Interactive Elements

// Copy to clipboard functionality
document.querySelectorAll('.copy-btn').forEach((btn) => {
  btn.addEventListener('click', async () => {
    const textToCopy = btn.getAttribute('data-copy');
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);

      // Visual feedback
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');

      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
});

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
      const scrollY = window.scrollY;
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
