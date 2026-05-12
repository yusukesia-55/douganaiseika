// ============================================================
// 動画内製化支援プログラム LP - Interactions
// ============================================================
(() => {
  'use strict';

  // -----------------------------------------------------------
  // 1. Scroll reveal (IntersectionObserver)
  // -----------------------------------------------------------
  // Auto-tag section headings + key blocks
  document.querySelectorAll('.section .eyebrow, .section .section-title, .section .section-lede').forEach((el) => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
  });
  document.querySelectorAll('.problem-message, .concept__visual, .concept > div:last-child, .compare, .price, .aside-note, .final-cta__inner > div, .final-cta__image, .hero__copy, .hero__visual').forEach((el) => {
    if (!el.hasAttribute('data-reveal')) el.setAttribute('data-reveal', 'up');
  });

  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  // -----------------------------------------------------------
  // 2. Stagger children inside [data-reveal-stagger]
  // -----------------------------------------------------------
  document.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${i * 70}ms`);
      child.setAttribute('data-reveal', 'up');
    });
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          [...parent.children].forEach((child) => child.classList.add('is-revealed'));
          io2.disconnect();
        }
      });
    }, { threshold: 0.1 });
    io2.observe(parent);
  });

  // -----------------------------------------------------------
  // 3. Topbar shrink + scroll progress
  // -----------------------------------------------------------
  const topbar = document.querySelector('.topbar');
  const progress = document.querySelector('.scroll-progress');
  const onScroll = () => {
    const y = window.scrollY;
    if (topbar) topbar.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${Math.min(1, y / Math.max(1, max))})`;
    }
    // Floating CTA
    if (floatingCta) {
      floatingCta.classList.toggle('is-visible', y > window.innerHeight * 0.9);
    }
    // Hero parallax disabled per request
  };
  // Hero parallax disabled per request
  const heroVisual = null;
  const floatingCta = document.querySelector('.floating-cta');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // -----------------------------------------------------------
  // 4. Count-up (period & target only — NOT the price)
  // -----------------------------------------------------------
  const counters = document.querySelectorAll('[data-count]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const dur = 1100;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased).toString();
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target.toString();
      };
      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => {
    el.textContent = '0';
    countObserver.observe(el);
  });

  // -----------------------------------------------------------
  // 5. Steps timeline progressive line draw
  // -----------------------------------------------------------
  const steps = document.querySelectorAll('.steps .step');
  if (steps.length) {
    const stepIo = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-active');
        }
      });
    }, { threshold: 0.35 });
    steps.forEach((s) => stepIo.observe(s));
  }

  // -----------------------------------------------------------
  // 6. Smooth focus on hash links (offset for sticky topbar)
  // -----------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      ev.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
