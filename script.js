// ═══════════════════════════════════════════
// ARCHITETTO CRIPPA — script.js
// ═══════════════════════════════════════════

// ── NAV scroll shadow ──
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── MOBILE DRAWER (slide-in da destra) ──
const burger = document.getElementById('burger');
const drawer = document.getElementById('mobileDrawer');
const backdrop = document.getElementById('drawerBackdrop');
const drawerClose = document.getElementById('drawerClose');

function openDrawer() {
  drawer.classList.add('open');
  backdrop.classList.add('open');
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  drawer.classList.remove('open');
  backdrop.classList.remove('open');
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

if (burger && drawer && backdrop) {
  burger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  backdrop.addEventListener('click', closeDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('.drawer-nav a').forEach(a => {
    a.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
  });

  // Evidenzia la pagina corrente nel drawer
  const current = location.pathname.split('/').pop() || 'index.html';
  drawer.querySelectorAll('.drawer-nav a').forEach(a => {
    if (a.getAttribute('href') === current) a.classList.add('active');
  });
}

// ── Fade-up on scroll (IntersectionObserver) ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ═══════════════════════════════════════════
// COOKIE CONSENT + GOOGLE ANALYTICS (GDPR)
// GA si carica SOLO dopo il consenso esplicito
// ═══════════════════════════════════════════
(function () {
  const KEY = 'ac_cookie_consent';   // 'accepted' | 'rejected'
  const GA_ID = 'G-DYSQSN1JF2';

  // ── Carica Google Analytics (solo dopo consenso) ──
  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  // ── Banner ──
  function showBanner() {
    if (document.getElementById('cookieBanner')) return;
    const b = document.createElement('div');
    b.id = 'cookieBanner';
    b.className = 'cookie-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Gestione cookie');
    b.innerHTML =
      '<div class="cb-inner">' +
        '<div class="cb-text">' +
          '<span class="cb-title">Cookie &amp; Privacy</span>' +
          '<p>Questo sito utilizza cookie tecnici e, previo tuo consenso, cookie analitici (Google Analytics) per migliorare l\'esperienza di navigazione. Puoi accettare, rifiutare o saperne di pi\u00f9 nella <a href="privacy.html">Privacy &amp; Cookie Policy</a>.</p>' +
        '</div>' +
        '<div class="cb-actions">' +
          '<button id="cbAccept" class="cb-btn cb-accept">Accetta</button>' +
          '<button id="cbReject" class="cb-btn cb-reject">Rifiuta</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(b);
    requestAnimationFrame(() => b.classList.add('visible'));

    document.getElementById('cbAccept').addEventListener('click', () => {
      localStorage.setItem(KEY, 'accepted');
      hideBanner();
      loadGA();
    });
    document.getElementById('cbReject').addEventListener('click', () => {
      localStorage.setItem(KEY, 'rejected');
      hideBanner();
    });
  }

  function hideBanner() {
    const b = document.getElementById('cookieBanner');
    if (!b) return;
    b.classList.remove('visible');
    setTimeout(() => b.remove(), 400);
  }

  // ── Avvio ──
  const consent = localStorage.getItem(KEY);
  if (consent === 'accepted') {
    loadGA();
  } else if (consent !== 'rejected') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  // ── API pubblica: link "Gestisci cookie" nel footer ──
  window.acManageCookies = function () {
    localStorage.removeItem(KEY);
    showBanner();
    return false;
  };
})();
