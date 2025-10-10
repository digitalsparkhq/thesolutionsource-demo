document.addEventListener('DOMContentLoaded', function () {
  const topbar = document.getElementById('topbar');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('#mainNav .nav-link');
  let lastScroll = 0;

  // ---------- topbar hide on scroll and navbar pull-up ----------
  const SCROLL_TRIGGER = 80;
  function handleScroll() {
    const st = window.scrollY || window.pageYOffset;
    if (topbar) {
      if (st > SCROLL_TRIGGER) topbar.classList.add('hidden');
      else topbar.classList.remove('hidden');
    }
    if (mainNav) mainNav.classList.toggle('scrolled', st > SCROLL_TRIGGER);
    lastScroll = st;
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // ---------- active nav link highlight while scrolling ----------
  function updateActiveLink() {
    const scrollPos = window.scrollY + (window.innerHeight * 0.18) + 80;
    document.querySelectorAll('section[id]').forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = '#' + section.id;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(a => a.classList.toggle('current', a.getAttribute('href') === id || a.getAttribute('href') === id + '/'));
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ---------- reveal on scroll (IntersectionObserver) ----------
  const revealItems = document.querySelectorAll('.reveal-on-scroll, .service-card');
  if (revealItems.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });
    revealItems.forEach(el => observer.observe(el));
  }

  // ---------- reflection flip buttons ----------
  document.querySelectorAll('.flip-btn, .back-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.reflection-card');
      if (!card) return;
      card.classList.toggle('flipped');
    });
  });

// ---------- Mobile overlay nav ----------
const mobileToggler = document.getElementById('mobileMenuToggler');
const mobileOverlay = document.getElementById('mobileNavOverlay');

if (mobileToggler && mobileOverlay) {
  mobileToggler.addEventListener('click', () => {
    mobileOverlay.classList.toggle('open');
    document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
  });

  // Close overlay when clicking a link
  mobileOverlay.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileOverlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

   // Close mobile nav
  const closeBtn = document.querySelector('.mobile-nav-close');
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  });
}

  // ------- Robust Reviews Slider -------
  (function () {
    const slides = Array.from(document.querySelectorAll(".review-slide"));
    const nextBtn = document.getElementById("reviewNext");
    const prevBtn = document.getElementById("reviewPrev");
    const container = document.querySelector(".review-container") || document.querySelector(".flex-grow-1.px-3");
    if (!slides.length || (!nextBtn && !prevBtn)) return;

    let index = 0;
    let autoSlide = null;
    let isAnimating = false;
    const DURATION = 600;

    slides.forEach((s, i) => {
      s.classList.remove("active");
      s.style.transition = "transform .6s ease, opacity .6s ease";
      if (i === index) {
        s.classList.add("active");
        s.style.transform = "translateX(0)";
        s.style.opacity = "1";
      } else {
        s.style.transform = "translateX(100%)";
        s.style.opacity = "0";
      }
    });

    function showSlide(newIndex, direction = "right") {
      if (isAnimating || newIndex === index) return;
      isAnimating = true;

      const current = slides[index];
      const next = slides[newIndex];

      next.style.transition = "none";
      if (direction === "right") next.style.transform = "translateX(-100%)";
      else next.style.transform = "translateX(100%)";
      next.style.opacity = "1";
      void next.offsetWidth;

      next.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;
      current.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;

      if (direction === "right") current.style.transform = "translateX(100%)";
      else current.style.transform = "translateX(-100%)";
      current.style.opacity = "0";

      next.style.transform = "translateX(0)";
      next.style.opacity = "1";

      current.classList.remove("active");
      next.classList.add("active");

      const cleanup = (ev) => {
        if (ev.propertyName !== "transform") return;
        current.style.transition = "none";
        current.style.transform = "translateX(100%)";
        current.style.opacity = "0";
        isAnimating = false;
        current.removeEventListener("transitionend", cleanup);
      };
      current.addEventListener("transitionend", cleanup);

      index = newIndex;
    }

    function nextSlide() { showSlide((index + 1) % slides.length, "right"); }
    function prevSlide() { showSlide((index - 1 + slides.length) % slides.length, "left"); }

    nextBtn?.addEventListener("click", () => { stopAuto(); nextSlide(); startAuto(); });
    prevBtn?.addEventListener("click", () => { stopAuto(); prevSlide(); startAuto(); });

    function startAuto() { stopAuto(); autoSlide = setInterval(nextSlide, 5000); }
    function stopAuto() { if (autoSlide) { clearInterval(autoSlide); autoSlide = null; } }

    if (container) {
      container.addEventListener("mouseenter", stopAuto);
      container.addEventListener("mouseleave", startAuto);
    }

    startAuto();
  })();

  // ---------- contact modal + AJAX form ----------
  const contactModalEl = document.getElementById('contactModal');
  if (contactModalEl) {
    const contactModal = new bootstrap.Modal(contactModalEl);
    document.getElementById('openContactModal')?.addEventListener('click', () => contactModal.show());
  }

  const ajaxForm = document.getElementById('ajaxContactForm');
  if (ajaxForm) {
    ajaxForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const resultEl = document.getElementById('cf-result');
      if (resultEl) { resultEl.textContent = 'Sending...'; }
      fetch(ajaxForm.action, {
        method: 'POST',
        body: new FormData(ajaxForm),
        headers: { 'Accept': 'application/json' }
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
});
