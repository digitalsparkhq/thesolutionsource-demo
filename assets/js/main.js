// assets/js/main.js
document.addEventListener('DOMContentLoaded', function () {
  // elements
  const topbar = document.getElementById('topbar');
  const mainNav = document.getElementById('mainNav');
  const hero = document.getElementById('hero');
  const navLinks = document.querySelectorAll('#navbarMenu .nav-link');
  const callBox = document.querySelector('.call-box');
  let lastScroll = 0;

  // topbar hide on scroll, navbar sticky behavior
  function onScroll() {
    const st = window.scrollY || window.pageYOffset;
    if (st > 80) {
      topbar.classList.add('hidden');
      mainNav.classList.add('scrolled');
    } else {
      topbar.classList.remove('hidden');
      mainNav.classList.remove('scrolled');
    }
    lastScroll = st;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // nav active link highlight (simple)
  function updateActiveLink() {
    const scrollPos = window.scrollY + 140;
    document.querySelectorAll('section[id]').forEach(section => {
      if (section.offsetTop <= scrollPos && (section.offsetTop + section.offsetHeight) > scrollPos) {
        const id = '#' + section.id;
        navLinks.forEach(a => {
          if (a.getAttribute('href') === id || a.getAttribute('href') === id + '/') {
            a.classList.add('current');
          } else {
            a.classList.remove('current');
          }
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // reveal on scroll for elements with .reveal-on-scroll
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

  // reflection flip card - also support touch toggle
  document.querySelectorAll('.reflection-card').forEach(card => {
    card.addEventListener('click', function () {
      this.classList.toggle('flip');
    });
  });

  // Reviews carousel (simple)
  let reviewIndex = 0;
  const slides = document.querySelectorAll('.review-slide');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');

  function showReview(idx) {
    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
  }
  if (slides.length) {
    showReview(0);
    if (prevBtn) prevBtn.addEventListener('click', () => { reviewIndex = (reviewIndex - 1 + slides.length) % slides.length; showReview(reviewIndex); });
    if (nextBtn) nextBtn.addEventListener('click', () => { reviewIndex = (reviewIndex + 1) % slides.length; showReview(reviewIndex); });
  }

  // Open contact modal from hero button
  const contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
  document.getElementById('openContactModal')?.addEventListener('click', () => contactModal.show());

  // AJAX contact form submission (Formspree)
  const ajaxForm = document.getElementById('ajaxContactForm');
  if (ajaxForm) {
    ajaxForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const formData = new FormData(ajaxForm);
      const resultEl = document.getElementById('cf-result');
      resultEl.textContent = 'Sending...';

      fetch(ajaxForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      }).then(response => response.json()).then(data => {
        if (data.ok || data.success || response?.status === 200) {
          resultEl.innerHTML = '<div class="alert alert-success">Thank you — your message has been sent.</div>';
          ajaxForm.reset();
        } else {
          resultEl.innerHTML = '<div class="alert alert-danger">Sorry, an error occurred. Please try again later.</div>';
        }
      }).catch(() => {
        resultEl.innerHTML = '<div class="alert alert-danger">Network error. Please try again later.</div>';
      });
    });
  }

  // collapse mobile navbar on link click
  document.querySelectorAll('#navbarMenu .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      const bsCollapse = bootstrap.Collapse.getInstance(document.getElementById('navbarMenu'));
      if (bsCollapse) bsCollapse.hide();
    });
  });


  window.addEventListener('scroll', () => {
  const topBar = document.querySelector('.top-bar');
  const navBar = document.querySelector('.navbar');
  if (window.scrollY > 100) {
    topBar.style.top = '-60px';
    navBar.classList.add('scrolled');
  } else {
    topBar.style.top = '0';
    navBar.classList.remove('scrolled');
  }
});
});


