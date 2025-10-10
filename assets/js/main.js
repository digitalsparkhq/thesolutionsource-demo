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

// ------- Robust Reviews Slider (replace older slider block) -------
let isAnimating = false;

function showSlide(newIndex, direction = "right") {
  if (isAnimating || newIndex === index) return;
  isAnimating = true;

  const current = slides[index];
  const next = slides[newIndex];

  // Prepare next slide offscreen opposite of arrow click
  next.style.transition = "none";
  if (direction === "right") {
    next.style.transform = "translateX(-100%)"; // Right arrow → comes from left
  } else {
    next.style.transform = "translateX(100%)";  // Left arrow → comes from right
  }
  next.style.opacity = "1";

  // Force reflow
  void next.offsetWidth;

  // Animate
  next.style.transition = "transform .6s ease, opacity .6s ease";
  current.style.transition = "transform .6s ease, opacity .6s ease";

  // Animate current out
  if (direction === "right") {
    current.style.transform = "translateX(100%)"; // exit to right
  } else {
    current.style.transform = "translateX(-100%)"; // exit to left
  }
  current.style.opacity = "0";

  // Animate next in
  next.style.transform = "translateX(0)";

  // update classes
  current.classList.remove("active");
  next.classList.add("active");

  // cleanup after transition
  const cleanup = (ev) => {
    if (ev.propertyName !== "transform") return;
    current.style.transition = "none";
    current.style.transform = "translateX(100%)"; // reset offscreen
    current.style.opacity = "0";
    isAnimating = false;
    current.removeEventListener("transitionend", cleanup);
  };
  current.addEventListener("transitionend", cleanup);

  index = newIndex;
}

function nextSlide() {
  const newIndex = (index + 1) % slides.length;
  showSlide(newIndex, "right"); // right arrow
}

function prevSlide() {
  const newIndex = (index - 1 + slides.length) % slides.length;
  showSlide(newIndex, "left"); // left arrow
}

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
