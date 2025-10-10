document.addEventListener('DOMContentLoaded', function () {
  const topbar = document.getElementById('topbar');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('#navbarMenu .nav-link');
  let lastScroll = 0;

  // Topbar hide on scroll
  window.addEventListener('scroll', () => {
    const st = window.scrollY || window.pageYOffset;
    if (topbar) {
      if (st > 80) topbar.classList.add('hidden');
      else topbar.classList.remove('hidden');
    }
    if (mainNav) mainNav.classList.toggle('scrolled', st > 80);
    lastScroll = st;
  }, { passive: true });

  // Active nav link highlight
  function updateActiveLink() {
    const scrollPos = window.scrollY + 140;
    document.querySelectorAll('section[id]').forEach(section => {
      if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
        const id = '#' + section.id;
        navLinks.forEach(a => {
          a.classList.toggle('current', a.getAttribute('href') === id || a.getAttribute('href') === id + '/');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // Reveal on scroll
  const revealItems = document.querySelectorAll('.reveal-on-scroll, .service-card');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  revealItems.forEach(it => observer.observe(it));

  // Reflection flip
  document.querySelectorAll('.reflection-card').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flip'));
  });

  // Simple reviews carousel
  let reviewIndex = 0;
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');

  function showReview(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  }
  if (slides.length) {
    showReview(0);
    prevBtn?.addEventListener('click', () => {
      reviewIndex = (reviewIndex - 1 + slides.length) % slides.length;
      showReview(reviewIndex);
    });
    nextBtn?.addEventListener('click', () => {
      reviewIndex = (reviewIndex + 1) % slides.length;
      showReview(reviewIndex);
    });
  }

  // Contact modal trigger
  const contactModalEl = document.getElementById('contactModal');
  if (contactModalEl) {
    const contactModal = new bootstrap.Modal(contactModalEl);
    document.getElementById('openContactModal')?.addEventListener('click', () => contactModal.show());
  }

  // AJAX contact form (Formspree)
  const ajaxForm = document.getElementById('ajaxContactForm');
  if (ajaxForm) {
    ajaxForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const resultEl = document.getElementById('cf-result');
      resultEl.textContent = 'Sending...';

      fetch(ajaxForm.action, {
        method: 'POST',
        body: new FormData(ajaxForm),
        headers: { 'Accept': 'application/json' },
      }).then(res => {
        if (res.ok) {
          resultEl.innerHTML = '<div class="alert alert-success">Thank you — your message has been sent.</div>';
          ajaxForm.reset();
        } else {
          resultEl.innerHTML = '<div class="alert alert-danger">An error occurred. Please try again later.</div>';
        }
      }).catch(() => {
        resultEl.innerHTML = '<div class="alert alert-danger">Network error. Please try again later.</div>';
      });
    });
  }

  // Collapse mobile navbar on link click
  document.querySelectorAll('#navbarMenu .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navbarMenu'));
      if (bsCollapse) bsCollapse.hide();
    });
  });
});
