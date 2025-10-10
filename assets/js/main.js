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

// ----- Reviews Slider -----
const slides = document.querySelectorAll(".review-slide");
const next = document.getElementById("reviewNext");
const prev = document.getElementById("reviewPrev");
let index = 0;
let autoSlide;

function showSlide(newIndex, direction = "right") {
  if (newIndex === index) return;

  slides[index].style.transform = direction === "right" ? "translateX(-100%)" : "translateX(100%)";
  slides[index].style.opacity = "0";
  slides[newIndex].style.transform = "translateX(0)";
  slides[newIndex].style.opacity = "1";

  slides[index].classList.remove("active");
  slides[newIndex].classList.add("active");

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

function startAutoSlide() {
  autoSlide = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(autoSlide);
}

if (next && prev && slides.length > 1) {
  next.addEventListener("click", () => {
    stopAutoSlide();
    nextSlide();
    startAutoSlide();
  });

  prev.addEventListener("click", () => {
    stopAutoSlide();
    prevSlide();
    startAutoSlide();
  });

  startAutoSlide();
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
