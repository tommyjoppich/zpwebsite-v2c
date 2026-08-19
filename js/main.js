document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.querySelector('.theme-switch');
  const stored = localStorage.getItem('zp-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  root.setAttribute('data-theme', stored || (prefersDark ? 'dark' : 'light'));

  function updateThemeLabel() {
    if (!themeBtn) return;
    const label = themeBtn.querySelector('.label');
    if (label) label.textContent = root.getAttribute('data-theme') === 'dark' ? 'Switch to Light' : 'Switch to Dark';
  }
  updateThemeLabel();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('zp-theme', next);
      updateThemeLabel();
    });
  }

  /* ---------- Mobile nav overlay ---------- */
  const toggle = document.querySelector('.nav-toggle-mobile');
  const sideNav = document.querySelector('.side-nav');
  if (toggle && sideNav) {
    toggle.addEventListener('click', () => {
      const open = sideNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    sideNav.querySelectorAll('.side-list a').forEach((link) => {
      link.addEventListener('click', () => {
        sideNav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Vertical scroll rail ---------- */
  const rail = document.querySelector('.scroll-rail span');
  function updateRail() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (rail) rail.style.height = pct + '%';
  }
  document.addEventListener('scroll', updateRail, { passive: true });
  updateRail();

  /* ---------- Live Chicago clock ---------- */
  const clockTime = document.querySelector('.clock .time');
  function updateClock() {
    if (!clockTime) return;
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit', hour12: true,
    }).format(now);
    clockTime.textContent = formatted;
  }
  updateClock();
  setInterval(updateClock, 15000);

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const reveal = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => reveal.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }
});
