// Campaign page: WhatsApp links, hero slideshow, newsletter sign-up and campaign tracking.

const CAMPAIGN_WHATSAPP_NUMBER = '234XXXXXXXXXX';
const CAMPAIGN_WHATSAPP_TEXT = "Hello Green Link, I'd like to know more about sourcing shoes or bags.";
const SLIDE_INTERVAL_MS = 5000;

function whatsappLink(text) {
  return `https://wa.me/${CAMPAIGN_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

function sourceFromVisit() {
  const params = new URLSearchParams(window.location.search);
  let referrerHost = '';
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : '';
  } catch {
    referrerHost = '';
  }
  return {
    source: params.get('utm_source') || referrerHost || 'direct',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || ''
  };
}

function setupWhatsAppLinks() {
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link => {
    link.setAttribute('href', whatsappLink(CAMPAIGN_WHATSAPP_TEXT));
  });
}

function setupSlideshow() {
  const root = document.querySelector('[data-slideshow]');
  if (!root) return;

  const slides = Array.from(root.querySelectorAll('.slide'));
  const dotsEl = root.querySelector('.slide-dots');
  const prevBtn = root.querySelector('[data-prev]');
  const nextBtn = root.querySelector('[data-next]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;
  let timer = null;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'slide-dot';
    dot.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => { show(i); restart(); });
    dotsEl.appendChild(dot);
    return dot;
  });

  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === current;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
  }

  function play() {
    if (!reduceMotion && !timer) {
      timer = setInterval(() => show(current + 1), SLIDE_INTERVAL_MS);
    }
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    play();
  }

  prevBtn.addEventListener('click', () => { show(current - 1); restart(); });
  nextBtn.addEventListener('click', () => { show(current + 1); restart(); });
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);

  show(0);
  play();
}

function setupNewsletter() {
  const form = document.getElementById('signup-form');
  if (!form) return;

  // Record where the sign-up came from
  const visit = sourceFromVisit();
  ['source', 'medium', 'campaign'].forEach(name => {
    const field = form.elements.namedItem(name);
    if (field) field.value = visit[name];
  });

  // "Register interest" buttons record which event the sign-up is about
  document.querySelectorAll('[data-event]').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = form.elements.namedItem('interest');
      if (field) field.value = btn.dataset.event;
    });
  });

  const status = form.querySelector('.form-status');
  const confirmation = document.getElementById('signup-confirmation');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.textContent = '';
    status.classList.remove('error');

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Signing you up...';

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data).toString()
      });
      if (!response.ok) throw new Error('Submission failed');

      form.hidden = true;
      confirmation.hidden = false;
      confirmation.scrollIntoView({ behavior: 'smooth', block: 'center' });
      status.textContent = '';
    } catch (err) {
      status.textContent = 'Sorry, we could not sign you up. Please try again or message us on WhatsApp.';
      status.classList.add('error');
      submitBtn.disabled = false;
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupWhatsAppLinks();
  setupSlideshow();
  setupNewsletter();
});
