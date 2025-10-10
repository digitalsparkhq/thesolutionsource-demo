document.addEventListener('DOMContentLoaded', function () {
  const topbar = document.getElementById('topbar');
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('#navbarMenu .nav-link');
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

  // ---------- reflection flip on Read More button (click) ----------
  document.querySelectorAll('.flip-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const card = this.closest('.reflection-card');
      if (!card) return;
      // toggle 'flipped' class (CSS handles 3d)
      card.classList.toggle('flipped');
      // on small devices we avoid 3d transform (CSS handles that)
    });
  });

// ------- Robust Reviews Slider (updated) -------
(function () {
  const slides = Array.from(document.querySelectorAll(".review-slide"));
  const nextBtn = document.getElementById("reviewNext");
  const prevBtn = document.getElementById("reviewPrev");
  const container = document.querySelector(".review-container") || document.querySelector(".flex-grow-1.px-3");
  if (!slides.length || (!nextBtn && !prevBtn)) return;

  let index = 0;
  let autoSlide = null;
  let isAnimating = false;
  const DURATION = 600; // ms (match CSS .6s)

  // init - place slides offscreen (only current visible)
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

    // Prepare next offscreen on the correct side
    next.style.transition = "none";
    if (direction === "right") {
      next.style.transform = "translateX(-100%)"; // enters from left
    } else {
      next.style.transform = "translateX(100%)";  // enters from right
    }
    next.style.opacity = "1";

    // Force reflow
    void next.offsetWidth;

    // Enable transitions
    next.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;
    current.style.transition = `transform ${DURATION}ms ease, opacity ${DURATION}ms ease`;

    // Animate: current exits, next enters
    if (direction === "right") {
      current.style.transform = "translateX(100%)"; // exit right
    } else {
      current.style.transform = "translateX(-100%)"; // exit left
    }
    current.style.opacity = "0";

    next.style.transform = "translateX(0)";
    next.style.opacity = "1";

    // mark classes
    current.classList.remove("active");
    next.classList.add("active");

    // cleanup after transitionend
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

  function nextSlide() {
    const newIndex = (index + 1) % slides.length;
    showSlide(newIndex, "right");
  }
  function prevSlide() {
    const newIndex = (index - 1 + slides.length) % slides.length;
    showSlide(newIndex, "left");
  }

  // arrows
  nextBtn?.addEventListener("click", () => {
    stopAuto();
    nextSlide();
    startAuto();
  });
  prevBtn?.addEventListener("click", () => {
    stopAuto();
    prevSlide();
    startAuto();
  });

  // auto rotate
  function startAuto() {
    stopAuto();
    autoSlide = setInterval(nextSlide, 5000);
  }
  function stopAuto() {
    if (autoSlide) { clearInterval(autoSlide); autoSlide = null; }
  }

  // pause on hover (desktop)
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

  // ---------- collapse mobile nav on link click ----------
  document.querySelectorAll('#navbarMenu .nav-link').forEach(a => {
    a.addEventListener('click', () => {
      const collapseEl = document.getElementById('navbarMenu');
      const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
      if (bsCollapse) bsCollapse.hide();
    });
  });
});
